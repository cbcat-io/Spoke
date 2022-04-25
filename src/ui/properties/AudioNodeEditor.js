import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import AudioInput from "../inputs/AudioInput";
import BooleanInput from "../inputs/BooleanInput";
import { VolumeUp } from "styled-icons/fa-solid/VolumeUp";
import AudioParamsProperties from "./AudioParamsProperties";
import useSetPropertySelected from "./useSetPropertySelected";
import { SourceType } from "../../editor/objects/AudioParams";

export default function AudioNodeEditor(props) {
  const { editor, node } = props;
  const onChangeSrc = useSetPropertySelected(editor, "src");
  const onChangeControls = useSetPropertySelected(editor, "controls");
  const onChangeAutoPlay = useSetPropertySelected(editor, "autoPlay");
  const onChangeLoop = useSetPropertySelected(editor, "loop");

  return (
    <NodeEditor description={AudioNodeEditor.description} {...props}>
      <InputGroup name="Enllaç de l'Àudio">
        <AudioInput value={node.src} onChange={onChangeSrc} />
      </InputGroup>
      <InputGroup name="Controls" info="Canvia la visibilitat dels controls multimèdia a Hubs.">
        <BooleanInput value={node.controls} onChange={onChangeControls} />
      </InputGroup>
      <InputGroup name="Inici Automàtic" info="Si està habilitat, s'iniciarà l'àudio quan algú entri a l'escena.">
        <BooleanInput value={node.autoPlay} onChange={onChangeAutoPlay} />
      </InputGroup>
      <InputGroup name="Bucle" info="Si està habilitat l'àudio sonarà en bucle indefinidament.">
        <BooleanInput value={node.loop} onChange={onChangeLoop} />
      </InputGroup>
      <AudioParamsProperties sourceType={SourceType.MEDIA_VIDEO} {...props} />
    </NodeEditor>
  );
}

AudioNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object,
  multiEdit: PropTypes.bool
};

AudioNodeEditor.iconComponent = VolumeUp;

AudioNodeEditor.description = "Carrega àudio dinàmicament";
