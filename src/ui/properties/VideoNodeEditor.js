import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import StringInput from "../inputs/StringInput";
import { VideoProjection } from "../../editor/objects/Video";
import VideoInput from "../inputs/VideoInput";
import { Video } from "styled-icons/fa-solid/Video";
import AudioParamsProperties from "./AudioParamsProperties";
import useSetPropertySelected from "./useSetPropertySelected";
import AttributionNodeEditor from "./AttributionNodeEditor";
import { SourceType } from "../../editor/objects/AudioParams";

const videoProjectionOptions = Object.values(VideoProjection).map(v => ({ label: v, value: v }));

export default function VideoNodeEditor(props) {
  const { editor, node } = props;
  const onChangeSrc = useSetPropertySelected(editor, "src");
  const onChangeProjection = useSetPropertySelected(editor, "projection");
  const onChangeBillboard = useSetPropertySelected(editor, "billboard");
  const onChangeHref = useSetPropertySelected(editor, "href");
  const onChangeControls = useSetPropertySelected(editor, "controls");
  const onChangeAutoPlay = useSetPropertySelected(editor, "autoPlay");
  const onChangeLoop = useSetPropertySelected(editor, "loop");

  return (
    <NodeEditor description={VideoNodeEditor.description} {...props}>
      <InputGroup name="Vídeo">
        <VideoInput value={node.src} onChange={onChangeSrc} />
      </InputGroup>
      <InputGroup
        name="Mostrar Frontalment"
        info="El vídeo sempre es mostra frontalment a l'usuari a Hubs. No es mostra a Spoke."
      >
        <BooleanInput value={node.billboard} onChange={onChangeBillboard} />
      </InputGroup>
      {node.projection === VideoProjection.Flat && (
        <InputGroup name="Enllaç" info="Permet al vídeo funcionar com un enllaç amb la url donada.">
          <StringInput value={node.href} onChange={onChangeHref} />
        </InputGroup>
      )}
      <InputGroup name="Projecció">
        <SelectInput options={videoProjectionOptions} value={node.projection} onChange={onChangeProjection} />
      </InputGroup>
      <InputGroup name="Controls" info="Canvia la visibilitat dels controls multimèdia a Hubs.">
        <BooleanInput value={node.controls} onChange={onChangeControls} />
      </InputGroup>
      <InputGroup name="Inici Automàtic" info="Si està habilitat, s'iniciarà el vídeo quan algú entri a l'escena.">
        <BooleanInput value={node.autoPlay} onChange={onChangeAutoPlay} />
      </InputGroup>
      <InputGroup name="Bucle" info="Si està habilitat el vídeo es mostrarà en bucle indefinidament.">
        <BooleanInput value={node.loop} onChange={onChangeLoop} />
      </InputGroup>
      <AudioParamsProperties sourceType={SourceType.MEDIA_VIDEO} {...props} />
      <AttributionNodeEditor name="Atribució" {...props} />
    </NodeEditor>
  );
}

VideoNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object,
  multiEdit: PropTypes.bool
};

VideoNodeEditor.iconComponent = Video;

VideoNodeEditor.description = "Carrega un vídeo dinàmicament.";
