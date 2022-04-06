import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import ColorInput from "../inputs/ColorInput";
import NumericInputGroup from "../inputs/NumericInputGroup";
import { Sun } from "styled-icons/fa-solid/Sun";

export default class AmbientLightNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = Sun;

  static description = "Una llum que il·lumina tots els objectes de la teva escena";

  onChangeColor = color => {
    this.props.editor.setPropertySelected("color", color);
  };

  onChangeIntensity = intensity => {
    this.props.editor.setPropertySelected("intensity", intensity);
  };

  render() {
    const node = this.props.node;

    return (
      <NodeEditor {...this.props} description={AmbientLightNodeEditor.description}>
        <InputGroup name="Color">
          <ColorInput value={node.color} onChange={this.onChangeColor} />
        </InputGroup>
        <NumericInputGroup
          name="Intensitat"
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={node.intensity}
          onChange={this.onChangeIntensity}
          unit="cd"
        />
      </NodeEditor>
    );
  }
}
