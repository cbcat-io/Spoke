import React from "react";
import PropTypes from "prop-types";
import MediaSourcePanel from "./MediaSourcePanel";

export default function ModelSourcePanel(props) {
  return <MediaSourcePanel {...props} searchPlaceholder={props.source.searchPlaceholder || "Cerca models..."} />;
}

ModelSourcePanel.propTypes = {
  source: PropTypes.object
};
