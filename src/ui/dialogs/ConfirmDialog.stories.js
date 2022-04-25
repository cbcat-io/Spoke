import React from "react";
import ConfirmDialog from "./ConfirmDialog";
import { action } from "@storybook/addon-actions";

export default {
  title: "ConfirmDialog",
  component: ConfirmDialog
};

export const confirmDialog = () => (
  <ConfirmDialog
    message="Estàs segur que vols continuar?"
    onCancel={action("onCancel")}
    onConfirm={action("onConfirm")}
  />
);
