import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import ColorInput from "../inputs/ColorInput";
import InputGroup from "../inputs/InputGroup";
import ImageInput from "../inputs/ImageInput";
import CompoundNumericInput from "../inputs/CompoundNumericInput";
import NumericInputGroup from "../inputs/NumericInputGroup";
import Vector3Input from "../inputs/Vector3Input";
import SelectInput from "../inputs/SelectInput";
import * as EasingFunctions from "@mozillareality/easing-functions";
import { camelPad } from "../utils";
import { SprayCan } from "styled-icons/fa-solid/SprayCan";

const CurveOptions = Object.keys(EasingFunctions).map(name => ({
  label: camelPad(name),
  value: name
}));

export default class ParticleEmitterNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = SprayCan;

  static description = "Emissor de partícules per crear partícules.";

  updateParticles() {
    for (const node of this.props.editor.selected) {
      node.updateParticles();
    }
  }

  onChangeColorCurve = colorCurve => {
    this.props.editor.setPropertySelected("colorCurve", colorCurve);
  };

  onChangeVelocityCurve = velocityCurve => {
    this.props.editor.setPropertySelected("velocityCurve", velocityCurve);
  };

  onChangeStartColor = startColor => {
    this.props.editor.setPropertySelected("startColor", startColor);
    this.updateParticles();
  };

  onChangeMiddleColor = middleColor => {
    this.props.editor.setPropertySelected("middleColor", middleColor);
  };

  onChangeEndColor = endColor => {
    this.props.editor.setPropertySelected("endColor", endColor);
  };

  onChangeStartOpacity = startOpacity => {
    this.props.editor.setPropertySelected("startOpacity", startOpacity);
  };

  onChangeMiddleOpacity = middleOpacity => {
    this.props.editor.setPropertySelected("middleOpacity", middleOpacity);
  };

  onChangeEndOpacity = endOpacity => {
    this.props.editor.setPropertySelected("endOpacity", endOpacity);
  };

  onChangeSrc = src => {
    this.props.editor.setPropertySelected("src", src);
  };

  onChangeSizeCurve = sizeCurve => {
    this.props.editor.setPropertySelected("sizeCurve", sizeCurve);
  };

  onChangeStartSize = startSize => {
    this.props.editor.setPropertySelected("startSize", startSize);
    this.updateParticles();
  };

  onChangeEndSize = endSize => {
    this.props.editor.setPropertySelected("endSize", endSize);
  };

  onChangeSizeRandomness = sizeRandomness => {
    this.props.editor.setPropertySelected("sizeRandomness", sizeRandomness);
    this.updateParticles();
  };

  onChangeStartVelocity = startVelocity => {
    this.props.editor.setPropertySelected("startVelocity", startVelocity);
  };

  onChangeEndVelocity = endVelocity => {
    this.props.editor.setPropertySelected("endVelocity", endVelocity);
  };

  onChangeAngularVelocity = angularVelocity => {
    this.props.editor.setPropertySelected("angularVelocity", angularVelocity);
  };

  onChangeParticleCount = particleCount => {
    this.props.editor.setPropertySelected("particleCount", particleCount);
    this.updateParticles();
  };

  onChangeLifetime = lifetime => {
    this.props.editor.setPropertySelected("lifetime", lifetime);
    this.updateParticles();
  };

  onChangeAgeRandomness = ageRandomness => {
    this.props.editor.setPropertySelected("ageRandomness", ageRandomness);
    this.updateParticles();
  };

  onChangeLifetimeRandomness = lifetimeRandomness => {
    this.props.editor.setPropertySelected("lifetimeRandomness", lifetimeRandomness);
    this.updateParticles();
  };

  render() {
    return (
      <NodeEditor {...this.props} description={ParticleEmitterNodeEditor.description}>
        <NumericInputGroup
          name="Nombre de Partícules"
          min={1}
          smallStep={1}
          mediumStep={1}
          largeStep={1}
          value={this.props.node.particleCount}
          onChange={this.onChangeParticleCount}
        />

        <InputGroup name="Imatge">
          <ImageInput value={this.props.node.src} onChange={this.onChangeSrc} />
        </InputGroup>

        <NumericInputGroup
          name="Atzar de Generació"
          info="La quantitat de variació entre quan es generen les partícules."
          min={0}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          value={this.props.node.ageRandomness}
          onChange={this.onChangeAgeRandomness}
          unit="s"
        />

        <NumericInputGroup
          name="Durada Màxima"
          info="El temps que durarà com a màxim una partícula abans de que sigui emesa."
          min={0}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          value={this.props.node.lifetime}
          onChange={this.onChangeLifetime}
          unit="s"
        />

        <NumericInputGroup
          name="Atzar de Durada"
          info="La quantitat de variació entre les durades de les partícules."
          min={0}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          value={this.props.node.lifetimeRandomness}
          onChange={this.onChangeLifetimeRandomness}
          unit="s"
        />

        <InputGroup name="Corba de la Mida">
          <SelectInput options={CurveOptions} value={this.props.node.sizeCurve} onChange={this.onChangeSizeCurve} />
        </InputGroup>

        <NumericInputGroup
          name="Mida Inicial de la Partícula"
          min={0}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          value={this.props.node.startSize}
          onChange={this.onChangeStartSize}
          unit="m"
        />

        <NumericInputGroup
          name="Mida Final de la Partícula"
          min={0}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          value={this.props.node.endSize}
          onChange={this.onChangeEndSize}
          unit="m"
        />

        <NumericInputGroup
          name="Atzar de la Mida"
          info="La quantitat de variació entre les mides inicials de les partícules."
          min={0}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1}
          value={this.props.node.sizeRandomness}
          onChange={this.onChangeSizeRandomness}
          unit="m"
        />

        <InputGroup name="Corba del Color">
          <SelectInput options={CurveOptions} value={this.props.node.colorCurve} onChange={this.onChangeColorCurve} />
        </InputGroup>

        <InputGroup name="Color Inicial">
          <ColorInput value={this.props.node.startColor} onChange={this.onChangeStartColor} />
        </InputGroup>

        <InputGroup name="Opacitat Inicial">
          <CompoundNumericInput
            min={0}
            max={1}
            step={0.01}
            value={this.props.node.startOpacity}
            onChange={this.onChangeStartOpacity}
          />
        </InputGroup>

        <InputGroup name="Color Intermig">
          <ColorInput value={this.props.node.middleColor} onChange={this.onChangeMiddleColor} />
        </InputGroup>

        <InputGroup name="Opacitat Intermitja">
          <CompoundNumericInput
            min={0}
            max={1}
            step={0.01}
            value={this.props.node.middleOpacity}
            onChange={this.onChangeMiddleOpacity}
          />
        </InputGroup>

        <InputGroup name="Color Final">
          <ColorInput value={this.props.node.endColor} onChange={this.onChangeEndColor} />
        </InputGroup>

        <InputGroup name="Opacitat Final">
          <CompoundNumericInput
            min={0}
            max={1}
            step={0.01}
            value={this.props.node.endOpacity}
            onChange={this.onChangeEndOpacity}
          />
        </InputGroup>

        <InputGroup name="Corba de la Velocitat">
          <SelectInput
            options={CurveOptions}
            value={this.props.node.velocityCurve}
            onChange={this.onChangeVelocityCurve}
          />
        </InputGroup>

        <InputGroup name="Velocitat Inicial">
          <Vector3Input
            value={this.props.node.startVelocity}
            smallStep={0.01}
            mediumStep={0.1}
            largeStep={1}
            onChange={this.onChangeStartVelocity}
          />
        </InputGroup>

        <InputGroup name="Velocitat Final">
          <Vector3Input
            value={this.props.node.endVelocity}
            smallStep={0.01}
            mediumStep={0.1}
            largeStep={1}
            onChange={this.onChangeEndVelocity}
          />
        </InputGroup>

        <NumericInputGroup
          name="Velocitat Angular"
          min={-100}
          smallStep={1}
          mediumStep={1}
          largeStep={1}
          value={this.props.node.angularVelocity}
          onChange={this.onChangeAngularVelocity}
          unit="°/s"
        />
      </NodeEditor>
    );
  }
}
