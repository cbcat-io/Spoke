import React from "react";
import PropTypes from "prop-types";
import MediaSourcePanel from "./MediaSourcePanel";

export default function ImageSourcePanel(props) {
  return <MediaSourcePanel {...props} searchPlaceholder={props.source.searchPlaceholder || "Cerca imatges..."} />;
}

ImageSourcePanel.propTypes = {
  source: PropTypes.object
};
