import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { Globe } from "styled-icons/fa-solid/Globe";
import NumericInputGroup from "../inputs/NumericInputGroup";
import CompoundNumericInput from "../inputs/CompoundNumericInput";
import ColorInput from "../inputs/ColorInput";
import InputGroup from "../inputs/InputGroup";
import { FogType } from "../../editor/nodes/SceneNode";
import SelectInput from "../inputs/SelectInput";
import useSetPropertySelected from "./useSetPropertySelected";
import BooleanInput from "../inputs/BooleanInput";
import { Defaults, DistanceModelOptions, DistanceModelType, SourceType } from "../../editor/objects/AudioParams";
import useOptionalParam from "./useOptionalParam";

const FogTypeOptions = [
  {
    label: "Deshabilitada",
    value: FogType.Disabled
  },
  {
    label: "Linear",
    value: FogType.Linear
  },
  {
    label: "Exponencial",
    value: FogType.Exponential
  }
];

export default function SceneNodeEditor(props) {
  const { editor, node } = props;

  const onChangeBackground = useSetPropertySelected(editor, "background");
  const onChangeFogType = useSetPropertySelected(editor, "fogType");
  const onChangeFogColor = useSetPropertySelected(editor, "fogColor");
  const onChangeFogNearDistance = useSetPropertySelected(editor, "fogNearDistance");
  const onChangeFogFarDistance = useSetPropertySelected(editor, "fogFarDistance");
  const onChangeFogDensity = useSetPropertySelected(editor, "fogDensity");

  const onChangeOverrideAudioSettings = useSetPropertySelected(editor, "overrideAudioSettings");
  const mediaParamProps = {
    gain: useOptionalParam(node, editor, "scene", "mediaVolume", Defaults[SourceType.MEDIA_VIDEO]["gain"]),
    distanceModel: useOptionalParam(
      node,
      editor,
      "scene",
      "mediaDistanceModel",
      Defaults[SourceType.MEDIA_VIDEO]["distanceModel"]
    ),
    rolloffFactor: useOptionalParam(
      node,
      editor,
      "scene",
      "mediaRolloffFactor",
      Defaults[SourceType.MEDIA_VIDEO]["rolloffFactor"]
    ),
    refDistance: useOptionalParam(
      node,
      editor,
      "scene",
      "mediaRefDistance",
      Defaults[SourceType.MEDIA_VIDEO]["refDistance"]
    ),
    maxDistance: useOptionalParam(
      node,
      editor,
      "scene",
      "mediaMaxDistance",
      Defaults[SourceType.MEDIA_VIDEO]["maxDistance"]
    ),
    coneInnerAngle: useOptionalParam(
      node,
      editor,
      "scene",
      "mediaConeInnerAngle",
      Defaults[SourceType.MEDIA_VIDEO]["coneInnerAngle"]
    ),
    coneOuterAngle: useOptionalParam(
      node,
      editor,
      "scene",
      "mediaConeOuterAngle",
      Defaults[SourceType.MEDIA_VIDEO]["coneOuterAngle"]
    ),
    coneOuterGain: useOptionalParam(
      node,
      editor,
      "scene",
      "mediaConeOuterGain",
      Defaults[SourceType.MEDIA_VIDEO]["coneOuterGain"]
    )
  };
  const avatarParamProps = {
    distanceModel: useOptionalParam(
      node,
      editor,
      "scene",
      "avatarDistanceModel",
      Defaults[SourceType.AVATAR_AUDIO_SOURCE]["distanceModel"]
    ),
    rolloffFactor: useOptionalParam(
      node,
      editor,
      "scene",
      "avatarRolloffFactor",
      Defaults[SourceType.AVATAR_AUDIO_SOURCE]["rolloffFactor"]
    ),
    refDistance: useOptionalParam(
      node,
      editor,
      "scene",
      "avatarRefDistance",
      Defaults[SourceType.AVATAR_AUDIO_SOURCE]["refDistance"]
    ),
    maxDistance: useOptionalParam(
      node,
      editor,
      "scene",
      "avatarMaxDistance",
      Defaults[SourceType.AVATAR_AUDIO_SOURCE]["maxDistance"]
    )
  };

  return (
    <NodeEditor {...props} description={SceneNodeEditor.description}>
      <InputGroup name="Color del Fons">
        <ColorInput value={node.background} onChange={onChangeBackground} />
      </InputGroup>
      <InputGroup name="Tipus de Boira">
        <SelectInput options={FogTypeOptions} value={node.fogType} onChange={onChangeFogType} />
      </InputGroup>
      {node.fogType !== FogType.Disabled && (
        <InputGroup name="Color de la Boira">
          <ColorInput value={node.fogColor} onChange={onChangeFogColor} />
        </InputGroup>
      )}
      {node.fogType === FogType.Linear && (
        <>
          <NumericInputGroup
            name="Distància de la Boira Propera"
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            min={0}
            value={node.fogNearDistance}
            onChange={onChangeFogNearDistance}
          />
          <NumericInputGroup
            name="Distància de la Boira Llunyana"
            smallStep={1}
            mediumStep={100}
            largeStep={1000}
            min={0}
            value={node.fogFarDistance}
            onChange={onChangeFogFarDistance}
          />
        </>
      )}
      {node.fogType === FogType.Exponential && (
        <NumericInputGroup
          name="Densitat de la Boira"
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={0.25}
          min={0}
          value={node.fogDensity}
          onChange={onChangeFogDensity}
        />
      )}
      <InputGroup name="Substituir les Configuracions d'Àudio">
        <BooleanInput value={node.overrideAudioSettings} onChange={onChangeOverrideAudioSettings} />
      </InputGroup>
      {node.overrideAudioSettings && (
        <>
          <InputGroup
            name="Model de Distància d'Avatar"
            info="L'algoritme calcula la pèrdua d'àudio."
            {...avatarParamProps.distanceModel}
          >
            <SelectInput
              options={DistanceModelOptions}
              value={node.avatarDistanceModel}
              onChange={avatarParamProps.distanceModel.onChange}
            />
          </InputGroup>

          {node.avatarDistanceModel === DistanceModelType.linear ? (
            <InputGroup
              name="Factor de Descàrrega de l'Avatar"
              info="Un valor doble que descriu la rapidesa amb què es redueix el volum a mesura que la font s'allunya de l'oient. El valor va de 0 a 1"
              {...avatarParamProps.rolloffFactor}
            >
              <CompoundNumericInput
                min={0}
                max={1}
                smallStep={0.001}
                mediumStep={0.01}
                largeStep={0.1}
                value={node.avatarRolloffFactor}
                onChange={avatarParamProps.rolloffFactor.onChange}
              />
            </InputGroup>
          ) : (
            <NumericInputGroup
              name="Factor de Descàrrega de l'Avatar"
              info="Un valor doble que descriu la rapidesa amb què es redueix el volum a mesura que la font s'allunya de l'oient. El valor va de 0 a l'infinit"
              min={0}
              smallStep={0.1}
              mediumStep={1}
              largeStep={10}
              value={node.avatarRolloffFactor}
              onChange={avatarParamProps.rolloffFactor.onChange}
              {...avatarParamProps.rolloffFactor}
            />
          )}
          <NumericInputGroup
            name="Distància de Referència de l'Avatar"
            info="Un valor doble que representa la distància de referència per reduir el volum a mesura que la font d'àudio s'allunya de l'oient."
            min={0}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.avatarRefDistance}
            unit="m"
            onChange={avatarParamProps.refDistance.onChange}
            {...avatarParamProps.refDistance}
          />
          <NumericInputGroup
            name="Distància Màxima de l'Avatar"
            info="Un valor doble que representa la distància màxima entre la font d'àudio i l'oient, després de la qual el volum no es redueix més."
            min={0}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.avatarMaxDistance}
            unit="m"
            onChange={avatarParamProps.maxDistance.onChange}
            {...avatarParamProps.maxDistance}
          />
          <InputGroup name="Volum Multimèdia" {...mediaParamProps.gain}>
            <CompoundNumericInput value={node.mediaVolume} onChange={mediaParamProps.gain.onChange} />
          </InputGroup>
          <InputGroup
            name="Distància de Multimèdia del Model"
            info="L'algoritme calcula la pèrdua d'àudio."
            {...mediaParamProps.distanceModel}
          >
            <SelectInput
              options={DistanceModelOptions}
              value={node.mediaDistanceModel}
              onChange={mediaParamProps.distanceModel.onChange}
            />
          </InputGroup>

          {node.mediaDistanceModel === DistanceModelType.linear ? (
            <InputGroup
              name="Factor de Pèrdua de Multimèdia"
              info="Un valor doble que descriu la rapidesa amb què es redueix el volum a mesura que la font s'allunya de l'oient. El valor va de 0 a 1"
              {...mediaParamProps.rolloffFactor}
            >
              <CompoundNumericInput
                min={0}
                max={1}
                smallStep={0.001}
                mediumStep={0.01}
                largeStep={0.1}
                value={node.mediaRolloffFactor}
                onChange={mediaParamProps.rolloffFactor.onChange}
              />
            </InputGroup>
          ) : (
            <NumericInputGroup
              name="Factor de Pèrdua de Multimèdia"
              info="Un valor doble que descriu la rapidesa amb què es redueix el volum a mesura que la font s'allunya de l'oient. El valor va de 0 a l'infinit"
              min={0}
              smallStep={0.1}
              mediumStep={1}
              largeStep={10}
              value={node.mediaRolloffFactor}
              onChange={mediaParamProps.rolloffFactor.onChange}
              {...mediaParamProps.rolloffFactor}
            />
          )}
          <NumericInputGroup
            name="Distància de Referència de Multimèdia"
            info="Un valor doble que representa la distància de referència per reduir el volum a mesura que la font d'àudio s'allunya de l'oient."
            min={0}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.mediaRefDistance}
            unit="m"
            onChange={mediaParamProps.refDistance.onChange}
            {...mediaParamProps.refDistance}
          />
          <NumericInputGroup
            name="Distància Màxima de Multimèdia"
            info="Un valor doble que representa la distància màxima entre la font d'àudio i l'oient, després de la qual el volum no es redueix més."
            min={0}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.mediaMaxDistance}
            unit="m"
            onChange={mediaParamProps.maxDistance.onChange}
            {...mediaParamProps.maxDistance}
          />
          <NumericInputGroup
            name="Angle Interior del Con de Mitjans"
            info="Un valor doble que descriu l'angle, en graus, d'un con dins del qual no hi haurà reducció de volum."
            min={0}
            max={360}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.mediaConeInnerAngle}
            unit="°"
            onChange={mediaParamProps.coneInnerAngle.onChange}
            {...mediaParamProps.coneInnerAngle}
          />
          <NumericInputGroup
            name="Angle Exterior del Con de Mitjans"
            info="Un valor doble que descriu l'angle, en graus, d'un con fora del qual el volum es reduirà en un valor constant, definit per l'atribut de guany."
            min={0}
            max={360}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.mediaConeOuterAngle}
            unit="°"
            onChange={mediaParamProps.coneOuterAngle.onChange}
            {...mediaParamProps.coneOuterAngle}
          />
          <InputGroup
            name="Guany Exterior del Con de Mitjans"
            info="Un valor doble que descriu la quantitat de reducció de volum fora del con definit per l'atribut de guany. El seu valor per defecte és 0, el que significa que no es pot escoltar cap so."
            {...mediaParamProps.coneOuterGain}
          >
            <CompoundNumericInput
              min={0}
              max={1}
              step={0.01}
              value={node.mediaConeOuterGain}
              onChange={mediaParamProps.coneOuterGain.onChange}
            />
          </InputGroup>
        </>
      )}
    </NodeEditor>
  );
}

SceneNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object
};

SceneNodeEditor.iconComponent = Globe;

SceneNodeEditor.description = "L'objecte arrel de l'escena.";
