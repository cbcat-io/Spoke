import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import StringInput from "../inputs/StringInput";
import { Running } from "styled-icons/fa-solid/Running";

const componentOptions = [
  {
    label: "video",
    value: "video",
    nodeNames: ["Video"],
    propertyOptions: [{ label: "paused", value: "paused", component: "video", input: BooleanInput, default: false }]
  },
  {
    label: "loop-animation",
    value: "loop-animation",
    nodeNames: ["Model"],
    propertyOptions: [
      { label: "paused", value: "paused", component: "loop-animation", input: BooleanInput, default: false }
    ]
  }
];

export default class TriggerVolumeNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = Running;

  static description = "Defineix una propietat a l'objecte de destinació en entrar i sortir.";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }

  onChangeTarget = target => {
    this.props.editor.setPropertiesSelected({
      target,
      enterComponent: null,
      enterProperty: null,
      enterValue: null,
      leaveComponent: null,
      leaveProperty: null,
      leaveValue: null
    });
  };

  onChangeEnterComponent = value => {
    this.props.editor.setPropertiesSelected({
      enterComponent: value,
      enterProperty: null,
      enterValue: null
    });
  };

  onChangeEnterProperty = (value, option) => {
    this.props.editor.setPropertiesSelected({
      enterProperty: value,
      enterValue: option.default !== undefined ? option.default : null
    });
  };

  onChangeEnterValue = value => {
    this.props.editor.setPropertySelected("enterValue", value);
  };

  onChangeLeaveComponent = value => {
    this.props.editor.setPropertiesSelected({
      leaveComponent: value,
      leaveProperty: null,
      leaveValue: null
    });
  };

  onChangeLeaveProperty = (value, option) => {
    this.props.editor.setPropertiesSelected({
      leaveProperty: value,
      leaveValue: option.default !== undefined ? option.default : null
    });
  };

  onChangeLeaveValue = value => {
    this.props.editor.setPropertySelected("leaveValue", value);
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
    const { node, multiEdit } = this.props;

    const targetOption = this.state.options.find(o => o.value === node.target);
    const target = targetOption ? targetOption.value : null;
    const targetNotFound = node.target && target === null;

    const filteredComponentOptions = targetOption
      ? componentOptions.filter(o => o.nodeNames.indexOf(targetOption.nodeName) !== -1)
      : [];
    const enterComponentOption = filteredComponentOptions.find(o => o.value === node.enterComponent);
    const enterComponent = enterComponentOption ? enterComponentOption.value : null;
    const leaveComponentOption = filteredComponentOptions.find(o => o.value === node.leaveComponent);
    const leaveComponent = leaveComponentOption ? leaveComponentOption.value : null;

    const filteredEnterPropertyOptions = enterComponentOption
      ? enterComponentOption.propertyOptions.filter(o => o.component === node.enterComponent)
      : [];
    const enterPropertyOption = filteredEnterPropertyOptions.find(o => o.value === node.enterProperty);
    const enterProperty = enterPropertyOption ? enterPropertyOption.value : null;

    const filteredLeavePropertyOptions = leaveComponentOption
      ? leaveComponentOption.propertyOptions.filter(o => o.component === node.leaveComponent)
      : [];
    const leavePropertyOption = filteredLeavePropertyOptions.find(o => o.value === node.leaveProperty);
    const leaveProperty = leavePropertyOption ? leavePropertyOption.value : null;

    const EnterInput = enterPropertyOption && enterPropertyOption.input;
    const LeaveInput = leavePropertyOption && leavePropertyOption.input;

    return (
      <NodeEditor description={TriggerVolumeNodeEditor.description} {...this.props}>
        <InputGroup name="Objecte Destí">
          <SelectInput
            error={targetNotFound}
            placeholder={targetNotFound ? "Error falta un node." : "Selecciona un node..."}
            value={node.target}
            onChange={this.onChangeTarget}
            options={this.state.options}
            disabled={multiEdit}
          />
        </InputGroup>
        <InputGroup name="Component d'Entrada">
          <SelectInput
            placeholder={node.enterComponent || "Selecciona un component..."}
            value={node.enterComponent}
            onChange={this.onChangeEnterComponent}
            options={filteredComponentOptions}
            disabled={multiEdit || !target}
          />
        </InputGroup>
        <InputGroup name="Propietat d'Entrada">
          <SelectInput
            placeholder={node.enterProperty || "Selecciona una propietat..."}
            value={node.enterProperty}
            onChange={this.onChangeEnterProperty}
            options={filteredEnterPropertyOptions}
            disabled={multiEdit || !enterComponent}
          />
        </InputGroup>
        <InputGroup name="Valor d'Entrada">
          {EnterInput ? (
            <EnterInput
              value={node.enterValue}
              onChange={this.onChangeEnterValue}
              disabled={multiEdit || !(target && enterComponent && enterProperty)}
            />
          ) : (
            <StringInput disabled />
          )}
        </InputGroup>
        <InputGroup name="Component de Sortida">
          <SelectInput
            placeholder={node.leaveComponent || "Selecciona un component..."}
            value={node.leaveComponent}
            onChange={this.onChangeLeaveComponent}
            options={filteredComponentOptions}
            disabled={multiEdit || !target}
          />
        </InputGroup>
        <InputGroup name="Propietat de Sortida">
          <SelectInput
            placeholder={node.leaveProperty || "Selecciona una propietat..."}
            value={node.leaveProperty}
            onChange={this.onChangeLeaveProperty}
            options={filteredLeavePropertyOptions}
            disabled={multiEdit || !leaveComponent}
          />
        </InputGroup>
        <InputGroup name="Valor de Sortida">
          {LeaveInput ? (
            <LeaveInput
              value={node.leaveValue}
              onChange={this.onChangeLeaveValue}
              disabled={multiEdit || !(target && leaveComponent && leaveProperty)}
            />
          ) : (
            <StringInput disabled />
          )}
        </InputGroup>
      </NodeEditor>
    );
  }
}
