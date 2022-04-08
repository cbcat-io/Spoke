import React from "react";
import PropTypes from "prop-types";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import NumericInputGroup from "../inputs/NumericInputGroup";
import CompoundNumericInput from "../inputs/CompoundNumericInput";
import {
  AudioType,
  AudioTypeOptions,
  Defaults,
  DistanceModelOptions,
  DistanceModelType,
  SourceType
} from "../../editor/objects/AudioParams";
import useOptionalParam from "./useOptionalParam";
import useSetPropertySelected from "./useSetPropertySelected";
import BooleanInput from "../inputs/BooleanInput";

export default function AudioParamsProperties({ node, editor, multiEdit, sourceType }) {
  const onChangeOverrideAudioSettings = useSetPropertySelected(editor, "overrideAudioSettings");
  const isOptional = sourceType === SourceType.AUDIO_ZONE;
  const paramProps = {
    audioType: useOptionalParam(node, editor, "audio-params", "audioType", Defaults[sourceType]["audioType"]),
    gain: useOptionalParam(node, editor, "audio-params", "gain", Defaults[sourceType]["gain"]),
    distanceModel: useOptionalParam(
      node,
      editor,
      "audio-params",
      "distanceModel",
      Defaults[sourceType]["distanceModel"]
    ),
    rolloffFactor: useOptionalParam(
      node,
      editor,
      "audio-params",
      "rolloffFactor",
      Defaults[sourceType]["rolloffFactor"]
    ),
    refDistance: useOptionalParam(node, editor, "audio-params", "refDistance", Defaults[sourceType]["refDistance"]),
    maxDistance: useOptionalParam(node, editor, "audio-params", "maxDistance", Defaults[sourceType]["maxDistance"]),
    coneInnerAngle: useOptionalParam(
      node,
      editor,
      "audio-params",
      "coneInnerAngle",
      Defaults[sourceType]["coneInnerAngle"]
    ),
    coneOuterAngle: useOptionalParam(
      node,
      editor,
      "audio-params",
      "coneOuterAngle",
      Defaults[sourceType]["coneOuterAngle"]
    ),
    coneOuterGain: useOptionalParam(
      node,
      editor,
      "audio-params",
      "coneOuterGain",
      Defaults[sourceType]["coneOuterGain"]
    )
  };

  // TODO: Make node audio settings work with multi-edit

  return (
    <>
      <InputGroup name="Substituir les Configuracions d'Àudio">
        <BooleanInput value={node.overrideAudioSettings} onChange={onChangeOverrideAudioSettings} />
      </InputGroup>
      {node.overrideAudioSettings && (
        <>
          <InputGroup name="Tipus d'Àudio" optional={isOptional} {...paramProps.audioType}>
            <SelectInput options={AudioTypeOptions} value={node.audioType} onChange={paramProps.audioType.onChange} />
          </InputGroup>
          <InputGroup name="Volum" optional={isOptional} {...paramProps.gain}>
            <CompoundNumericInput value={node.gain} onChange={paramProps.gain.onChange} />
          </InputGroup>
          {!multiEdit && node.audioType === AudioType.PannerNode && (
            <>
              <InputGroup
                name="Distància del Model"
                info="L'algoritme que s'utilitza per calcular la pèrdua d'àudio."
                optional={isOptional}
                {...paramProps.distanceModel}
              >
                <SelectInput
                  options={DistanceModelOptions}
                  value={node.distanceModel}
                  onChange={paramProps.distanceModel.onChange}
                />
              </InputGroup>

              {node.distanceModel === DistanceModelType.linear ? (
                <InputGroup
                  name="Factor Pèrdua"
                  info="Un valor doble que descriu la rapidesa amb què es redueix el volum a mesura que la font s'allunya de l'oient. Valors de 0 a 1"
                  optional={isOptional}
                  {...paramProps.rolloffFactor}
                >
                  <CompoundNumericInput
                    min={0}
                    max={1}
                    smallStep={0.001}
                    mediumStep={0.01}
                    largeStep={0.1}
                    value={node.rolloffFactor}
                    onChange={paramProps.rolloffFactor.onChange}
                  />
                </InputGroup>
              ) : (
                <NumericInputGroup
                  name="Factor Pèrdua"
                  info="Un valor doble que descriu la rapidesa amb què es redueix el volum a mesura que la font s'allunya de l'oient. Valors de 0 a 1"
                  min={0}
                  smallStep={0.1}
                  mediumStep={1}
                  largeStep={10}
                  value={node.rolloffFactor}
                  optional={isOptional}
                  onChange={paramProps.rolloffFactor.onChange}
                  {...paramProps.rolloffFactor}
                />
              )}
              <NumericInputGroup
                name="Ref Distance"
                info="Un valor doble que representa la distància de referència per reduir el volum a mesura que la font d'àudio s'allunya de l'oient."
                min={0}
                smallStep={0.1}
                mediumStep={1}
                largeStep={10}
                value={node.refDistance}
                optional={isOptional}
                unit="m"
                onChange={paramProps.refDistance.onChange}
                {...paramProps.refDistance}
              />
              <NumericInputGroup
                name="Distància Màxima"
                info="Un valor doble que representa la distància màxima entre la font d'àudio i l'oient, després de la qual el volum no es redueix més."
                min={0.00001}
                smallStep={0.1}
                mediumStep={1}
                largeStep={10}
                value={node.maxDistance}
                optional={isOptional}
                unit="m"
                onChange={paramProps.maxDistance.onChange}
                {...paramProps.maxDistance}
              />
              <NumericInputGroup
                name="Angle Interior del Con"
                info="Un valor doble que descriu l'angle, en graus, d'un con dins del qual no hi haurà reducció de volum."
                min={0}
                max={360}
                smallStep={0.1}
                mediumStep={1}
                largeStep={10}
                value={node.coneInnerAngle}
                optional={isOptional}
                unit="°"
                disabled={multiEdit}
                onChange={paramProps.coneInnerAngle.onChange}
                {...paramProps.coneInnerAngle}
              />
              <NumericInputGroup
                name="Angle Exterior del Con"
                info="Un valor doble que descriu l'angle, en graus, d'un con fora del qual el volum es reduirà en un valor constant, definit per l'atribut de guany."
                min={0}
                max={360}
                smallStep={0.1}
                mediumStep={1}
                largeStep={10}
                value={node.coneOuterAngle}
                optional={isOptional}
                unit="°"
                disabled={multiEdit}
                onChange={paramProps.coneOuterAngle.onChange}
                {...paramProps.coneOuterAngle}
              />
              <InputGroup
                name="Guany Exterior del Con"
                info="Un valor doble que descriu la quantitat de reducció de volum fora del con definit per l'atribut de l'angle. El seu valor per defecte és 0, el que significa que no es pot escoltar cap so."
                optional={isOptional}
                {...paramProps.coneOuterGain}
              >
                <CompoundNumericInput
                  min={0}
                  max={1}
                  step={0.01}
                  value={node.coneOuterGain}
                  onChange={paramProps.coneOuterGain.onChange}
                />
              </InputGroup>
            </>
          )}
        </>
      )}
    </>
  );
}

AudioParamsProperties.propTypes = {
  node: PropTypes.object,
  editor: PropTypes.object,
  multiEdit: PropTypes.bool,
  sourceType: PropTypes.number
};
