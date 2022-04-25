import { useCallback, useContext } from "react";
import ErrorDialog from "../dialogs/ErrorDialog";
import ProgressDialog from "../dialogs/ProgressDialog";
import LoginDialog from "../../api/LoginDialog";
import { DialogContext } from "../contexts/DialogContext";
import { EditorContext } from "../contexts/EditorContext";
import { AllFileTypes } from "../assets/fileTypes";

export default function useUpload(options = {}) {
  const editor = useContext(EditorContext);
  const { showDialog, hideDialog } = useContext(DialogContext);

  const multiple = options.multiple === undefined ? false : options.multiple;
  const source = options.source || editor.defaultUploadSource;
  const accepts = options.accepts || AllFileTypes;

  const onUpload = useCallback(
    async files => {
      let assets = [];

      try {
        if (!multiple && files.length > 1) {
          throw new Error("L'entrada no accepta diversos fitxers.");
        }

        if (accepts) {
          for (const file of files) {
            let accepted = false;

            for (const pattern of accepts) {
              if (pattern.startsWith(".")) {
                if (file.name.endsWith(pattern)) {
                  accepted = true;
                  break;
                }
              } else if (file.type.startsWith(pattern)) {
                accepted = true;
                break;
              }
            }

            if (!accepted) {
              throw new Error(
                `"${file.name}" no coincideix amb els tipus o extensions següents:: ${accepts.join(", ")}`
              );
            }
          }
        }

        if (!editor.api.isAuthenticated()) {
          // Ensure the user is authenticated before continuing.
          const loggedIn = await new Promise(resolve => {
            showDialog(LoginDialog, {
              onSuccess: () => resolve(true),
              onCancel: () => resolve(false)
            });
          });

          if (!loggedIn) {
            hideDialog();
            return null;
          }
        }

        const abortController = new AbortController();

        showDialog(ProgressDialog, {
          title: "Pujant Fitxers",
          message: `Pujant fitxer 1 de ${files.length}: 0%`,
          cancelable: true,
          onCancel: () => {
            abortController.abort();
            hideDialog();
          }
        });

        assets = await source.upload(
          files,
          (item, total, progress) => {
            showDialog(ProgressDialog, {
              title: "Pujant Fitxers",
              message: `Pujant fitxers: ${item} de ${total}: ${Math.round(progress * 100)}%`,
              cancelable: true,
              onCancel: () => {
                abortController.abort();
                hideDialog();
              }
            });
          },
          abortController.signal
        );

        hideDialog();
      } catch (error) {
        console.error(error);
        showDialog(ErrorDialog, {
          title: "Error de Càrrega",
          message: `Error pujant el fitxer: ${error.message || "Hi ha hagut un error desonegut."}`,
          error
        });

        return null;
      }

      return assets;
    },
    [showDialog, hideDialog, source, multiple, accepts, editor]
  );

  return onUpload;
}
