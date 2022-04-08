import React from "react";
import PropTypes from "prop-types";
import MediaSourcePanel from "./MediaSourcePanel";

export default function UploadSourcePanel(props) {
  return <MediaSourcePanel {...props} searchPlaceholder={props.source.searchPlaceholder || "Cerca recursos..."} />;
}

UploadSourcePanel.propTypes = {
  source: PropTypes.object
};
