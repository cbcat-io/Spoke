import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import BooleanInput from "../inputs/BooleanInput";
import { DiceD6 } from "styled-icons/fa-solid/DiceD6";
import AudioParamsProperties from "./AudioParamsProperties";
import { SourceType } from "../../editor/objects/AudioParams";

export default class AudioZoneNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = DiceD6;

  static description =
    "Defineix una àrea 3D on els paràmetres d'àudio es substitueixen per a les fonts d'àudio contingudes.";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }

  onChangeEnabled = value => {
    this.props.editor.setPropertySelected("enabled", value);
  };

  onChangeInOut = value => {
    this.props.editor.setPropertySelected("inOut", value);
  };

  onChangeOutIn = value => {
    this.props.editor.setPropertySelected("outIn", value);
  };

  componentDidMount() {
    const options = [];

    const sceneNode = this.props.editor.scene;

    sceneNode.traverse(o => {
      if (o.isNode && o !== sceneNode) {
        options.push({ label: o.name, value: o.uuid, nodeName: o.nodeName });
      }
    });

    this.setState({ options });
  }

  render() {
    const { node } = this.props;

    return (
      <NodeEditor description={AudioZoneNodeEditor.description} {...this.props}>
        <InputGroup name="Habilitada" info="Si està activada, aquesta zona d'àudio s'habilitarà a l'inici">
          <BooleanInput value={node.enabled} onChange={this.onChangeEnabled} />
        </InputGroup>
        <InputGroup
          name="Dins-Fora"
          info="Si està activada aquesta zona d'àudio, els paràmetres d'àudio s'aplicaran a l'àudio que hi ha dins quan l'oient estigui fora"
        >
          <BooleanInput value={node.inOut} onChange={this.onChangeInOut} />
        </InputGroup>
        <InputGroup
          name="Fora-Dins"
          info="Si està activada aquesta zona d'àudio, els paràmetres d'àudio s'aplicaran als àudios fora d'ella quan l'oient estigui dins"
        >
          <BooleanInput value={node.outIn} onChange={this.onChangeOutIn} />
        </InputGroup>
        <AudioParamsProperties sourceType={SourceType.AUDIO_ZONE} {...this.props} />
      </NodeEditor>
    );
  }
}
