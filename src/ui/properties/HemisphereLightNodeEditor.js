import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import ColorInput from "../inputs/ColorInput";
import NumericInputGroup from "../inputs/NumericInputGroup";
import { Certificate } from "styled-icons/fa-solid/Certificate";

export default class HemisphereLightNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = Certificate;

  static description = "Una llum que il·lumina l'escena directament des de dalt.";

  onChangeSkyColor = skyColor => {
    this.props.editor.setPropertySelected("skyColor", skyColor);
  };

  onChangeGroundColor = groundColor => {
    this.props.editor.setPropertySelected("groundColor", groundColor);
  };

  onChangeIntensity = intensity => {
    this.props.editor.setPropertySelected("intensity", intensity);
  };

  render() {
    const node = this.props.node;

    return (
      <NodeEditor {...this.props} description={HemisphereLightNodeEditor.description}>
        <InputGroup name="Color del Cel">
          <ColorInput value={node.skyColor} onChange={this.onChangeSkyColor} />
        </InputGroup>
        <InputGroup name="Color del Terra">
          <ColorInput value={node.groundColor} onChange={this.onChangeGroundColor} />
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
