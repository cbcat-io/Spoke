import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { Camera } from "styled-icons/fa-solid/Camera";
import { PropertiesPanelButton } from "../inputs/Button";

export default class ScenePreviewCameraNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = Camera;

  static description =
    "La càmera genera la miniatura de la teva escena i la posició inicial de la càmera de vista prèvia a Hubs.";

  onSetFromViewport = () => {
    this.props.node.setFromViewport();
  };

  render() {
    return (
      <NodeEditor {...this.props} description={ScenePreviewCameraNodeEditor.description}>
        <PropertiesPanelButton onClick={this.onSetFromViewport}>Establir Des Del Panell</PropertiesPanelButton>
      </NodeEditor>
    );
  }
}
