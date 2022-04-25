import React from "react";
import PropTypes from "prop-types";
import Dialog from "./Dialog";

export default function SupportDialog({ onCancel, ...props }) {
  return (
    <Dialog {...props} title="Ajut">
      <div>
        <p>Necessites informar d&#39;un problema?</p>
        <p>
          Podeu presentar un{" "}
          <a href="https://github.com/mozilla/Spoke/issues/new" target="_blank" rel="noopener noreferrer">
            problema de Github
          </a>{" "}
          o enviar-nos un correu electr&ograve;nic per obtenir ajut a{" "}
          <a href="mailto:hubs@mozilla.com">hubs@mozilla.com</a>
        </p>
        <p>
          Tamb&eacute; ens podeu trobar a{" "}
          <a href="https://discord.gg/wHmY4nd" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </p>
      </div>
    </Dialog>
  );
}
SupportDialog.propTypes = {
  onCancel: PropTypes.func
};
