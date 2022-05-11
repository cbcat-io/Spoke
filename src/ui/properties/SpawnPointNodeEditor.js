import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { StreetView } from "styled-icons/fa-solid/StreetView";

export default class SpawnPointNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = StreetView;

  static description =
    "Un punt on les persones apareixeran quan entrin a la teva escena.\nLa icona de la finestra representa la mida real d'un avatar.";

  render() {
    return <NodeEditor description={SpawnPointNodeEditor.description} {...this.props} />;
  }
}
