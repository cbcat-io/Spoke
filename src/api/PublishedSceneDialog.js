import React from "react";
import PropTypes from "prop-types";
import configs from "../configs";
import PreviewDialog from "../ui/dialogs/PreviewDialog";
import { Button } from "../ui/inputs/Button";

export default function PublishedSceneDialog({ onCancel, sceneName, sceneUrl, screenshotUrl, ...props }) {
  return (
    <PreviewDialog imageSrc={screenshotUrl} title="Escena Publicada" {...props}>
      <h1>{sceneName}</h1>
      <p>La teva escena ha estat publicada{configs.isMoz() && " a Hubs"}.</p>
      <Button as="a" href={sceneUrl} target="_blank">
        Visualitza la teva Escena
      </Button>
    </PreviewDialog>
  );
}

PublishedSceneDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  sceneName: PropTypes.string.isRequired,
  sceneUrl: PropTypes.string.isRequired,
  screenshotUrl: PropTypes.string.isRequired
};
