import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { ObjectGroup } from "styled-icons/fa-solid/ObjectGroup";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import useSetPropertySelected from "./useSetPropertySelected";
import { MediaType } from "../../editor/nodes/MediaFrameNode";

const mediaTypeOptions = [
  { label: "Tots els Elements", value: MediaType.ALL },
  { label: "Només Elements 2D", value: MediaType.ALL_2D },
  { label: "Només Models 3D", value: MediaType.MODEL },
  { label: "Només Imatges", value: MediaType.IMAGE },
  { label: "Només Vídeos", value: MediaType.VIDEO },
  { label: "Només PDFs", value: MediaType.PDF }
];

export default function MediaFrameNodeEditor(props) {
  const { node, editor } = props;
  const onChangeMediaType = useSetPropertySelected(editor, "mediaType");
  return (
    <NodeEditor description={MediaFrameNodeEditor.description} {...props}>
      <InputGroup name="Tipus d'Elements" info="Limitar quins tipus d'elements capturarà aquest marc">
        <SelectInput options={mediaTypeOptions} value={node.mediaType} onChange={onChangeMediaType} />
      </InputGroup>
    </NodeEditor>
  );
}

MediaFrameNodeEditor.iconComponent = ObjectGroup;
MediaFrameNodeEditor.description = "Un marc per capturar objectes multimèdia.\n";

MediaFrameNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object
};
