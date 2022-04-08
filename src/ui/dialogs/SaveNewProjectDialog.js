import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import StringInput from "../inputs/StringInput";
import FormField from "../inputs/FormField";
import PreviewDialog from "./PreviewDialog";

export default function SaveNewProjectDialog({ thumbnailUrl, initialName, onConfirm, onCancel }) {
  const [name, setName] = useState(initialName);

  const onChangeName = useCallback(
    value => {
      setName(value);
    },
    [setName]
  );

  const onConfirmCallback = useCallback(
    e => {
      e.preventDefault();
      onConfirm({ name });
    },
    [name, onConfirm]
  );

  const onCancelCallback = useCallback(
    e => {
      e.preventDefault();
      onCancel();
    },
    [onCancel]
  );

  return (
    <PreviewDialog
      imageSrc={thumbnailUrl}
      title="Desar Projecte"
      onConfirm={onConfirmCallback}
      onCancel={onCancelCallback}
      confirmLabel="Desar Projecte"
    >
      <FormField>
        <label htmlFor="name">Nom del Projecte</label>
        <StringInput
          id="name"
          required
          pattern={"[A-Za-z0-9-':\"!@#$%^&*(),.?~ ]{4,64}"}
          title="El nom ha de tenir entre 4 i 64 caràcters i no pot contenir guions baixos"
          value={name}
          onChange={onChangeName}
        />
      </FormField>
    </PreviewDialog>
  );
}

SaveNewProjectDialog.propTypes = {
  thumbnailUrl: PropTypes.string.isRequired,
  initialName: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
