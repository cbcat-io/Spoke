import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../configs";
import Modal from "react-modal";
import { Helmet } from "react-helmet";
import * as Sentry from "@sentry/browser";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { trackEvent } from "../telemetry";

import ToolBar from "./toolbar/ToolBar";

import HierarchyPanelContainer from "./hierarchy/HierarchyPanelContainer";
import PropertiesPanelContainer from "./properties/PropertiesPanelContainer";
import ViewportPanelContainer from "./viewport/ViewportPanelContainer";

import { defaultSettings, SettingsContextProvider } from "./contexts/SettingsContext";
import { EditorContextProvider } from "./contexts/EditorContext";
import { DialogContextProvider } from "./contexts/DialogContext";
import { OnboardingContextProvider } from "./contexts/OnboardingContext";
import { withApi } from "./contexts/ApiContext";

import { createEditor } from "../config";

import ErrorDialog from "./dialogs/ErrorDialog";
import ProgressDialog from "./dialogs/ProgressDialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import SaveNewProjectDialog from "./dialogs/SaveNewProjectDialog";
import ExportProjectDialog from "./dialogs/ExportProjectDialog";

import Onboarding from "./onboarding/Onboarding";
import SupportDialog from "./dialogs/SupportDialog";
import { cmdOrCtrlString } from "./utils";
import BrowserPrompt from "./router/BrowserPrompt";
import { Resizeable } from "./layout/Resizeable";
import DragLayer from "./dnd/DragLayer";
import Editor from "../editor/Editor";

import defaultTemplateUrl from "./../assets/templates/crater.spoke";
import tutorialTemplateUrl from "./../assets/templates/tutorial.spoke";

const StyledEditorContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: fixed;
`;

const WorkspaceContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  margin: 6px;
`;

class EditorContainer extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    let settings = defaultSettings;
    const storedSettings = localStorage.getItem("spoke-settings");
    if (storedSettings) {
      settings = JSON.parse(storedSettings);
    }

    const editor = createEditor(props.api, settings);
    window.editor = editor;
    editor.init();
    editor.addListener("initialized", this.onEditorInitialized);

    this.state = {
      error: null,
      project: null,
      parentSceneId: null,
      editor,
      settingsContext: {
        settings,
        updateSetting: this.updateSetting
      },
      onboardingContext: {
        enabled: false
      },
      DialogComponent: null,
      dialogProps: {},
      modified: false
    };
  }

  componentDidMount() {
    const { match, location } = this.props;
    const projectId = match.params.projectId;
    const queryParams = new URLSearchParams(location.search);

    if (projectId === "new") {
      if (queryParams.has("template")) {
        this.loadProjectTemplate(queryParams.get("template"));
      } else if (queryParams.has("sceneId")) {
        this.loadScene(queryParams.get("sceneId"));
      } else {
        this.loadProjectTemplate(defaultTemplateUrl);
      }
    } else if (projectId === "tutorial") {
      this.loadProjectTemplate(tutorialTemplateUrl, true);
    } else {
      this.loadProject(projectId);
    }

    if (projectId === "tutorial") {
      trackEvent("Tutorial Start");
      this.setState({ onboardingContext: { enabled: true } });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url && !this.state.creatingProject) {
      const prevProjectId = prevProps.match.params.projectId;
      const { projectId } = this.props.match.params;
      const queryParams = new URLSearchParams(location.search);
      let templateUrl = null;

      if (projectId === "new" && !queryParams.has("sceneId")) {
        templateUrl = queryParams.get("template") || defaultTemplateUrl;
      } else if (projectId === "tutorial") {
        templateUrl = tutorialTemplateUrl;
      }

      if (projectId === "new" || projectId === "tutorial") {
        this.loadProjectTemplate(templateUrl);
      } else if (prevProjectId !== "tutorial" && prevProjectId !== "new") {
        this.loadProject(projectId);
      }

      if (projectId === "tutorial") {
        trackEvent("Tutorial Start");
        this.setState({ onboardingContext: { enabled: true } });
      }
    }
  }

  async loadProjectTemplate(templateUrl) {
    this.setState({
      project: null,
      parentSceneId: null,
      templateUrl
    });

    this.showDialog(ProgressDialog, {
      title: "Carregant Projecte",
      message: "Carregant projecte..."
    });

    const editor = this.state.editor;

    try {
      const templateFile = await this.props.api.fetch(templateUrl).then(response => response.json());

      await editor.init();

      if (templateFile.metadata) {
        delete templateFile.metadata.sceneUrl;
        delete templateFile.metadata.sceneId;
        delete templateFile.metadata.creatorAttribution;
        delete templateFile.metadata.allowRemixing;
        delete templateFile.metadata.allowPromotion;
      }

      await editor.loadProject(templateFile);

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error carregant el projecte.",
        message: error.message || "Hi ha hagut un error carregant el projecte.",
        error
      });
    }
  }

  async loadScene(sceneId) {
    trackEvent("Remix Scene");

    this.setState({
      project: null,
      parentSceneId: sceneId,
      templateUrl: null,
      onboardingContext: { enabled: false }
    });

    this.showDialog(ProgressDialog, {
      title: "Carregant Projecte",
      message: "Carregant projecte..."
    });

    const editor = this.state.editor;

    try {
      const scene = await this.props.api.getScene(sceneId);
      const projectFile = await this.props.api.fetch(scene.scene_project_url).then(response => response.json());

      if (projectFile.metadata) {
        delete projectFile.metadata.sceneUrl;
        delete projectFile.metadata.sceneId;
        delete projectFile.metadata.creatorAttribution;
        delete projectFile.metadata.allowRemixing;
        delete projectFile.metadata.allowPromotion;
      }

      await editor.init();

      await editor.loadProject(projectFile);

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error carregant el projecte.",
        message: error.message || "Hi ha hagut un error carregant el projecte.",
        error
      });
    }
  }

  async importProject(projectFile) {
    const project = this.state.project;

    this.setState({
      project: null,
      parentSceneId: null,
      templateUrl: null,
      onboardingContext: { enabled: false }
    });

    this.showDialog(ProgressDialog, {
      title: "Carregant Projecte",
      message: "Carregant projecte..."
    });

    const editor = this.state.editor;

    try {
      await editor.init();

      await editor.loadProject(projectFile);

      editor.sceneModified = true;
      this.updateModifiedState();

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error carregant el projecte.",
        message: error.message || "Hi ha hagut un error carregant el projecte.",
        error
      });
    } finally {
      if (project) {
        this.setState({
          project
        });
      }
    }
  }

  async loadProject(projectId) {
    this.setState({
      project: null,
      parentSceneId: null,
      templateUrl: null,
      onboardingContext: { enabled: false }
    });

    this.showDialog(ProgressDialog, {
      title: "Carregant Projecte",
      message: "Carregant projecte..."
    });

    const editor = this.state.editor;

    let project;

    try {
      project = await this.props.api.getProject(projectId);

      const projectFile = await this.props.api.fetch(project.project_url).then(response => response.json());

      await editor.init();

      await editor.loadProject(projectFile);

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error carregant el projecte.",
        message: error.message || "Hi ha hagut un error carregant el projecte.",
        error
      });
    } finally {
      if (project) {
        this.setState({
          project
        });
      }
    }
  }

  updateModifiedState = then => {
    const nextModified = this.state.editor.sceneModified && !this.state.creatingProject;

    if (nextModified !== this.state.modified) {
      this.setState({ modified: nextModified }, then);
    } else if (then) {
      then();
    }
  };

  generateToolbarMenu = () => {
    return [
      {
        name: "Tornar als Projectes",
        action: this.onOpenProject
      },
      {
        name: "Fitxer",
        items: [
          {
            name: "Nou Projecte",
            action: this.onNewProject
          },
          {
            name: "Desar Projecte",
            hotkey: `${cmdOrCtrlString} + S`,
            action: this.onSaveProject
          },
          {
            name: "Anomena i Desa",
            action: this.onDuplicateProject
          },
          {
            name: configs.isMoz() ? "Publicar a Hubs..." : "Publicar Escena...",
            action: this.onPublishProject
          },
          {
            name: "Exportar com un glTF binari (.glb) ...",
            action: this.onExportProject
          },
          {
            name: "Importar el projecte .spoke heretat",
            action: this.onImportLegacyProject
          },
          {
            name: "Exportar el projecte .spoke heretat",
            action: this.onExportLegacyProject
          }
        ]
      },
      {
        name: "Ajuda",
        items: [
          {
            name: "Tutorial",
            action: () => {
              const { projectId } = this.props.match.params;

              if (projectId === "tutorial") {
                trackEvent("Tutorial Start");
                this.setState({ onboardingContext: { enabled: true } });
              } else {
                this.props.history.push("/projects/tutorial");
              }
            }
          },
          {
            name: "Controls del Teclat i del Ratolí",
            action: () => window.open("https://hubs.mozilla.com/docs/spoke-controls.html")
          },
          {
            name: "Obtenir Suport",
            action: () => this.showDialog(SupportDialog)
          },
          {
            name: "Enviar Comentaris",
            action: () => window.open("https://forms.gle/2PAFXKwW1SXdfSK17")
          },
          {
            name: "Informar d'un Problema",
            action: () => window.open("https://github.com/mozilla/Spoke/issues/new")
          },
          {
            name: "Uneix-te a nosaltres a Discord",
            action: () => window.open("https://discord.gg/wHmY4nd")
          },
          {
            name: "Condicions d'ús",
            action: () => window.open("https://github.com/mozilla/hubs/blob/master/TERMS.md")
          },
          {
            name: "Avís de Privacitat",
            action: () => window.open("https://github.com/mozilla/hubs/blob/master/PRIVACY.md")
          }
        ]
      },
      {
        name: "Desenvolupador",
        items: [
          {
            name: this.state.settingsContext.settings.enableExperimentalFeatures
              ? "Desactivar les Funcions Experimentals"
              : "Activar les Funcions Experimentals",
            action: () =>
              this.updateSetting(
                "enableExperimentalFeatures",
                !this.state.settingsContext.settings.enableExperimentalFeatures
              )
          }
        ]
      },
      {
        name: "Enviar Comentaris",
        action: () => window.open("https://forms.gle/2PAFXKwW1SXdfSK17")
      }
    ];
  };

  onEditorInitialized = () => {
    const editor = this.state.editor;

    const gl = this.state.editor.renderer.renderer.context;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    let webglVendor = "Desconegut";
    let webglRenderer = "Desconegut";

    if (debugInfo) {
      webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    Sentry.configureScope(scope => {
      scope.setTag("webgl-vendor", webglVendor);
      scope.setTag("webgl-renderer", webglRenderer);
    });

    window.addEventListener("resize", this.onResize);
    this.onResize();
    editor.addListener("projectLoaded", this.onProjectLoaded);
    editor.addListener("error", this.onEditorError);
    editor.addListener("sceneModified", this.onSceneModified);
    editor.addListener("saveProject", this.onSaveProject);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);

    const editor = this.state.editor;
    editor.removeListener("sceneModified", this.onSceneModified);
    editor.removeListener("saveProject", this.onSaveProject);
    editor.removeListener("initialized", this.onEditorInitialized);
    editor.removeListener("error", this.onEditorError);
    editor.removeListener("projectLoaded", this.onProjectLoaded);
    editor.dispose();
  }

  onResize = () => {
    this.state.editor.onResize();
  };

  /**
   *  Dialog Context
   */

  showDialog = (DialogComponent, dialogProps = {}) => {
    this.setState({
      DialogComponent,
      dialogProps
    });
  };

  hideDialog = () => {
    this.setState({
      DialogComponent: null,
      dialogProps: {}
    });
  };

  dialogContext = {
    showDialog: this.showDialog,
    hideDialog: this.hideDialog
  };

  /**
   * Scene Event Handlers
   */

  onEditorError = error => {
    if (error.aborted) {
      this.hideDialog();
      return;
    }

    console.error(error);

    this.showDialog(ErrorDialog, {
      title: error.title || "Error",
      message: error.message || "Hi ha hagut un error desconegut.",
      error
    });
  };

  onSceneModified = () => {
    this.updateModifiedState();
  };

  onProjectLoaded = () => {
    this.updateModifiedState();
  };

  updateSetting(key, value) {
    const settings = Object.assign(this.state.settingsContext.settings, { [key]: value });
    localStorage.setItem("spoke-settings", JSON.stringify(settings));
    const editor = this.state.editor;
    editor.settings = settings;
    editor.emit("settingsChanged");
    this.setState({
      settingsContext: {
        ...this.state.settingsContext,
        settings
      }
    });
  }

  onLogin = () => {
    this.props.api.showLoginDialog(this.showDialog, this.hideDialog);
  };

  /**
   *  Project Actions
   */

  async createProject() {
    const { editor, parentSceneId } = this.state;

    this.showDialog(ProgressDialog, {
      title: "Generant Captura del Projecte",
      message: "Generant captura del projecte..."
    });

    // Wait for 5ms so that the ProgressDialog shows up.
    await new Promise(resolve => setTimeout(resolve, 5));

    const blob = await editor.takeScreenshot(512, 320);

    const result = await new Promise(resolve => {
      this.showDialog(SaveNewProjectDialog, {
        thumbnailUrl: URL.createObjectURL(blob),
        initialName: editor.scene.name,
        onConfirm: resolve,
        onCancel: resolve
      });
    });

    if (!result) {
      this.hideDialog();
      return null;
    }

    const abortController = new AbortController();

    this.showDialog(ProgressDialog, {
      title: "Desant Projecte",
      message: "Desant projecte...",
      cancelable: true,
      onCancel: () => {
        abortController.abort();
        this.hideDialog();
      }
    });

    editor.setProperty(editor.scene, "name", result.name, false);
    editor.scene.setMetadata({ name: result.name });

    const project = await this.props.api.createProject(
      editor.scene,
      parentSceneId,
      blob,
      abortController.signal,
      this.showDialog,
      this.hideDialog
    );

    editor.sceneModified = false;

    this.updateModifiedState(() => {
      this.setState({ creatingProject: true, project }, () => {
        this.props.history.replace(`/projects/${project.project_id}`);
        this.setState({ creatingProject: false });
      });
    });

    return project;
  }

  onNewProject = async () => {
    this.props.history.push("/projects/templates");
  };

  onOpenProject = () => {
    this.props.history.push("/projects");
  };

  onSaveProject = async () => {
    trackEvent("Project Save Start");

    const abortController = new AbortController();

    this.showDialog(ProgressDialog, {
      title: "Desant Projecte",
      message: "Desant projecte...",
      cancelable: true,
      onCancel: () => {
        abortController.abort();
        this.hideDialog();
      }
    });

    // Wait for 5ms so that the ProgressDialog shows up.
    await new Promise(resolve => setTimeout(resolve, 5));

    try {
      const { editor, project } = this.state;

      if (project) {
        const newProject = await this.props.api.saveProject(
          project.project_id,
          editor,
          abortController.signal,
          this.showDialog,
          this.hideDialog
        );

        this.setState({ project: newProject });
      } else {
        await this.createProject();
      }

      editor.sceneModified = false;
      this.updateModifiedState();

      this.hideDialog();

      trackEvent("Project Save Successful");
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error Desant el Projecte",
        message: error.message || "Hi ha hagut un error desant el projecte."
      });

      trackEvent("Project Save Error");
    }
  };

  onDuplicateProject = async () => {
    const abortController = new AbortController();
    this.showDialog(ProgressDialog, {
      title: "Duplicant Projecte",
      message: "Duplicant projecte...",
      cancelable: true,
      onCancel: () => {
        abortController.abort();
        this.hideDialog();
      }
    });
    await new Promise(resolve => setTimeout(resolve, 5));
    try {
      const editor = this.state.editor;
      await this.createProject();
      editor.sceneModified = false;
      this.updateModifiedState();

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error Desant el Projecte",
        message: error.message || "Hi ha hagut un error desant el projecte."
      });
    }
  };

  onExportProject = async () => {
    const options = await new Promise(resolve => {
      this.showDialog(ExportProjectDialog, {
        defaultOptions: Object.assign({}, Editor.DefaultExportOptions),
        onConfirm: resolve,
        onCancel: resolve
      });
    });

    if (!options) {
      this.hideDialog();
      return;
    }

    const abortController = new AbortController();

    this.showDialog(ProgressDialog, {
      title: "Exportant Projecte",
      message: "Exportant projecte...",
      cancelable: true,
      onCancel: () => abortController.abort()
    });

    try {
      const editor = this.state.editor;

      const { glbBlob } = await editor.exportScene(abortController.signal, options);

      this.hideDialog();

      const el = document.createElement("a");
      el.download = editor.scene.name + ".glb";
      el.href = URL.createObjectURL(glbBlob);
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);

      trackEvent("Export Project as glTF");
    } catch (error) {
      if (error.aborted) {
        this.hideDialog();
        return;
      }

      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error Exportant el Projecte",
        message: error.message || "Hi ha hagut un error exportant el projecte.",
        error
      });
    }
  };

  onImportLegacyProject = async () => {
    const confirm = await new Promise(resolve => {
      this.showDialog(ConfirmDialog, {
        title: "Importar Projecte de Spoke Heretat",
        message: "Avís! Això sobreescriurà la teva escena existent! Estàs segur que vols continuar?",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });

    this.hideDialog();

    if (!confirm) return;

    const el = document.createElement("input");
    el.type = "file";
    el.accept = ".spoke";
    el.style.display = "none";
    el.onchange = () => {
      if (el.files.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const json = JSON.parse(fileReader.result);

          if (json.metadata) {
            delete json.metadata.sceneUrl;
            delete json.metadata.sceneId;
          }

          this.importProject(json);
        };
        fileReader.readAsText(el.files[0]);
      }
    };
    el.click();

    trackEvent("Import Legacy Project");
  };

  onExportLegacyProject = async () => {
    const editor = this.state.editor;
    const projectFile = editor.scene.serialize();

    if (projectFile.metadata) {
      delete projectFile.metadata.sceneUrl;
      delete projectFile.metadata.sceneId;
    }

    const projectJson = JSON.stringify(projectFile);
    const projectBlob = new Blob([projectJson]);
    const el = document.createElement("a");
    const fileName = this.state.editor.scene.name.toLowerCase().replace(/\s+/g, "-");
    el.download = fileName + ".spoke";
    el.href = URL.createObjectURL(projectBlob);
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);

    trackEvent("Project Exported");
  };

  onPublishProject = async () => {
    trackEvent("Project Publish Started");

    try {
      const editor = this.state.editor;
      let project = this.state.project;

      if (!project) {
        project = await this.createProject();
      }

      if (!project) {
        return;
      }

      project = await this.props.api.publishProject(project, editor, this.showDialog, this.hideDialog);

      if (!project) {
        return;
      }

      editor.sceneModified = false;
      this.updateModifiedState();

      trackEvent("Project Publish Successful");

      this.setState({ project });
    } catch (error) {
      if (error.aborted) {
        this.hideDialog();
        trackEvent("Project Publish Canceled");
        return;
      }

      console.error(error);
      this.showDialog(ErrorDialog, {
        title: "Error Publicant Projecte",
        message: error.message || "Hi ha hagut un error desconegut.",
        error
      });

      trackEvent("Project Publish Error");
    }
  };

  getSceneId() {
    const { editor, project } = this.state;
    return (
      (project && project.scene && project.scene.scene_id) || (editor.scene.metadata && editor.scene.metadata.sceneId)
    );
  }

  onOpenScene = () => {
    const sceneId = this.getSceneId();

    if (sceneId) {
      const url = this.props.api.getSceneUrl(sceneId);
      window.open(url);
    }
  };

  onFinishTutorial = nextAction => {
    trackEvent("Tutorial Finished", nextAction);
    this.setState({ onboardingContext: { enabled: false } });
  };

  onSkipTutorial = lastCompletedStep => {
    trackEvent("Tutorial Skipped", lastCompletedStep);
    this.setState({ onboardingContext: { enabled: false } });
  };

  render() {
    const { DialogComponent, dialogProps, settingsContext, onboardingContext, editor } = this.state;

    const toolbarMenu = this.generateToolbarMenu();
    const isPublishedScene = !!this.getSceneId();

    return (
      <StyledEditorContainer id="editor-container">
        <SettingsContextProvider value={settingsContext}>
          <EditorContextProvider value={editor}>
            <DialogContextProvider value={this.dialogContext}>
              <OnboardingContextProvider value={onboardingContext}>
                <DndProvider backend={HTML5Backend}>
                  <DragLayer />
                  <ToolBar
                    menu={toolbarMenu}
                    editor={editor}
                    onPublish={this.onPublishProject}
                    isPublishedScene={isPublishedScene}
                    onOpenScene={this.onOpenScene}
                  />
                  <WorkspaceContainer>
                    <Resizeable axis="x" initialSizes={[0.7, 0.3]} onChange={this.onResize}>
                      <ViewportPanelContainer />
                      <Resizeable axis="y" initialSizes={[0.5, 0.5]}>
                        <HierarchyPanelContainer />
                        <PropertiesPanelContainer />
                      </Resizeable>
                    </Resizeable>
                  </WorkspaceContainer>
                  <Modal
                    ariaHideApp={false}
                    isOpen={!!DialogComponent}
                    onRequestClose={this.hideDialog}
                    shouldCloseOnOverlayClick={false}
                    className="Modal"
                    overlayClassName="Overlay"
                  >
                    {DialogComponent && (
                      <DialogComponent onConfirm={this.hideDialog} onCancel={this.hideDialog} {...dialogProps} />
                    )}
                  </Modal>
                  <Helmet>
                    <title>{`${this.state.modified ? "*" : ""}${editor.scene.name} | ${configs.longName()}`}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                  </Helmet>
                  {this.state.modified && (
                    <BrowserPrompt
                      message={`${editor.scene.name} té canvis sense desar, estàs segur que desitges navegar fora d'aquesta pàgina?`}
                    />
                  )}
                  {onboardingContext.enabled && (
                    <Onboarding onFinish={this.onFinishTutorial} onSkip={this.onSkipTutorial} />
                  )}
                </DndProvider>
              </OnboardingContextProvider>
            </DialogContextProvider>
          </EditorContextProvider>
        </SettingsContextProvider>
      </StyledEditorContainer>
    );
  }
}

export default withApi(EditorContainer);
