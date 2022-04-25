import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import ColorInput from "../inputs/ColorInput";
import BooleanInput from "../inputs/BooleanInput";
import { SquareFull } from "styled-icons/fa-solid/SquareFull";

export default class GroundPlaneNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = SquareFull;

  static description = "Un pla de terra que s'estén en la distància.";

  onChangeColor = color => {
    this.props.editor.setPropertySelected("color", color);
  };

  onChangeReceiveShadow = receiveShadow => {
    this.props.editor.setPropertySelected("receiveShadow", receiveShadow);
  };

  onChangeWalkable = walkable => {
    this.props.editor.setPropertySelected("walkable", walkable);
  };

  render() {
    const node = this.props.node;

    return (
      <NodeEditor {...this.props} description={GroundPlaneNodeEditor.description}>
        <InputGroup name="Color">
          <ColorInput value={node.color} onChange={this.onChangeColor} />
        </InputGroup>
        <InputGroup name="Rebre Ombres">
          <BooleanInput value={node.receiveShadow} onChange={this.onChangeReceiveShadow} />
        </InputGroup>
        <InputGroup name="Caminable">
          <BooleanInput value={this.props.node.walkable} onChange={this.onChangeWalkable} />
        </InputGroup>
      </NodeEditor>
    );
  }
}
