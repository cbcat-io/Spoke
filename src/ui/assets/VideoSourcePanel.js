import React from "react";
import PropTypes from "prop-types";
import MediaSourcePanel from "./MediaSourcePanel";

export default function VideoSourcePanel(props) {
  return <MediaSourcePanel {...props} searchPlaceholder={props.source.searchPlaceholder || "Cerca vídeos..."} />;
}

VideoSourcePanel.propTypes = {
  source: PropTypes.object
};
