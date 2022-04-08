import React from "react";
import NodeEditor from "./NodeEditor";
import { Cubes } from "styled-icons/fa-solid/Cubes";

export default function GroupNodeEditor(props) {
  return <NodeEditor {...props} description={GroupNodeEditor.description} />;
}

GroupNodeEditor.iconComponent = Cubes;

GroupNodeEditor.description =
  "Un grup de diversos objectes que es poden moure o duplicar junts.\n Arrossegueu i deixeu anar objectes al Grup a la Jerarquia.";
