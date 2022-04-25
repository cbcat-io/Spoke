import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { StreetView } from "styled-icons/fa-solid/StreetView";
import InputGroup from "../inputs/InputGroup";
import BooleanInput from "../inputs/BooleanInput";

const messages = {
  "waypoint.label-canBeSpawnPoint": "Punt de Generació",
  "waypoint.label-canBeOccupied": "Pot ser ocupat",
  "waypoint.label-canBeClicked": "Clicable",
  "waypoint.label-willDisableMotion": "Desactivar Moviment",
  "waypoint.label-willDisableTeleporting": "Desactivar Teletransport",
  "waypoint.label-snapToNavMesh": "Enganxar al terra",
  "waypoint.label-willMaintainInitialOrientation": "Mantenir orientació inicial",
  "waypoint.description-canBeSpawnPoint": "Els avatars seran teletransportats a aquest punt quan entrin a l'escena",
  "waypoint.description-canBeOccupied":
    "Després de cada ús, aquest punt estarà deshabilitat fins que l'usuari anterior s'allunyi d'aquest",
  "waypoint.description-canBeClicked":
    "Aquest punt estarà visible al mode de pausa i clicant-lo t'hi teletransportaràs.",
  "waypoint.description-willDisableMotion": "Els avatars no es podran moure després de fer servir aquest punt",
  "waypoint.description-willDisableTeleporting":
    "El avatars no es podran teletransportar després de fer servir aquest punt",
  "waypoint.description-snapToNavMesh":
    "Els avatars es mouran el més a prop possible d'aquest punt però no sortiran del terra",
  "waypoint.description-willMaintainInitialOrientation":
    "En comptes de rotar per estar en la mateixa direcció que el punt, els usuaris mantindran la mateixa orientació que tenien abans de ser teletransportats"
};

const propertyNames = [
  "canBeSpawnPoint",
  "canBeOccupied",
  "canBeClicked",
  "willDisableMotion",
  "willDisableTeleporting",
  "snapToNavMesh",
  "willMaintainInitialOrientation"
];

export default class WayPointNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = StreetView;

  static description = "Un punt on la gent s'hi pot teletransportar.\n";

  constructor(props) {
    super(props);
    const createPropSetter = propName => value => {
      return this.props.editor.setPropertySelected(propName, value);
    };
    this.setters = new Map(propertyNames.map(name => [name, createPropSetter(name)]));
  }

  render() {
    const { node } = this.props;
    return (
      <NodeEditor description={WayPointNodeEditor.description} {...this.props}>
        {propertyNames.map(name => (
          <InputGroup
            key={`${name}-input-group`}
            name={messages[`waypoint.label-${name}`]}
            info={messages[`waypoint.description-${name}`]}
          >
            <BooleanInput value={node[name]} onChange={this.setters.get(name)} />
          </InputGroup>
        ))}
      </NodeEditor>
    );
  }
}
