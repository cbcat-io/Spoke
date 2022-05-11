import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { ThemeContext } from "styled-components";
import Dialog from "./Dialog";
import { bytesToSize } from "../utils";

const ColoredText = styled.span`
  color: ${props => props.color};
`;

const PerformanceItemContainer = styled.li`
  display: flex;
  min-height: 100px;
  background-color: ${props => props.theme.toolbar};
  border: 1px solid ${props => props.theme.panel};
  border-radius: 4px;
  margin: 4px;
  color: white;
  max-width: 560px;

  & > :first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
  }

  & > :last-child {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 12px;
    border-left: 1px solid ${props => props.theme.panel2};
  }

  h5 {
    font-size: 20px;
  }

  h6 {
    font-size: 16px;
  }

  a {
    white-space: nowrap;
    color: ${props => props.theme.blue};
  }

  p {
    margin: 0;
  }
`;

function PerformanceCheckItem({ score, scoreColor, title, description, learnMoreUrl, children }) {
  return (
    <PerformanceItemContainer>
      <div>
        <ColoredText as="h5" color={scoreColor}>
          {score}
        </ColoredText>
      </div>
      <div>
        <h6>
          {title}: {children}
        </h6>
        <p>
          {description}{" "}
          <a rel="noopener noreferrer" target="_blank" href={learnMoreUrl}>
            Obtenir M&eacute;s Informaci&oacute;
          </a>
        </p>
      </div>
    </PerformanceItemContainer>
  );
}

PerformanceCheckItem.propTypes = {
  score: PropTypes.string.isRequired,
  scoreColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  description: PropTypes.string.isRequired,
  learnMoreUrl: PropTypes.string.isRequired
};

const scoreToValue = {
  Baix: 0,
  Normal: 1,
  Alt: 2
};

export default function PerformanceCheckDialog({ scores, ...rest }) {
  const theme = useContext(ThemeContext);

  const scoreToColor = {
    Baix: theme.green,
    Normal: theme.yellow,
    Alt: theme.red
  };

  const texturesScore =
    scoreToValue[scores.textures.largeTexturesScore] > scoreToValue[scores.textures.score]
      ? scores.textures.largeTexturesScore
      : scores.textures.score;

  return (
    <Dialog {...rest}>
      <ul>
        <PerformanceCheckItem
          title="Nombre de Polígons"
          description="Recomanem que la teva escena no tingui més de 50,000 triangles per dispositius mòbils."
          learnMoreUrl="https://hubs.mozilla.com/docs/spoke-optimization.html"
          score={scores.polygons.score}
          scoreColor={scoreToColor[scores.polygons.score]}
        >
          <ColoredText color={scoreToColor[scores.polygons.score]}>
            {scores.polygons.value.toLocaleString()} Triangles
          </ColoredText>
        </PerformanceCheckItem>
        <PerformanceCheckItem
          title="Materials"
          description="Recomanem fer servir menys de 25 materials únics a l'escena per dispositius mòbils."
          learnMoreUrl="https://hubs.mozilla.com/docs/spoke-optimization.html"
          score={scores.materials.score}
          scoreColor={scoreToColor[scores.materials.score]}
        >
          <ColoredText color={scoreToColor[scores.materials.score]}>
            {scores.materials.value} Materials &Uacute;nics
          </ColoredText>
        </PerformanceCheckItem>
        <PerformanceCheckItem
          title="Textures"
          description="Recomanem que les textures no utilitzin més de 256MB de RAM de vídeo per dispositius mòbils. També recomanem no utilitzar textures més grans de 2048 x 2048"
          learnMoreUrl="https://hubs.mozilla.com/docs/spoke-optimization.html"
          score={texturesScore}
          scoreColor={scoreToColor[texturesScore]}
        >
          <ColoredText color={scoreToColor[scores.textures.score]}>
            ~{bytesToSize(scores.textures.value)} RAM V&iacute;deo
          </ColoredText>
          ,{" "}
          <ColoredText color={scoreToColor[scores.textures.largeTexturesScore]}>
            {scores.textures.largeTexturesValue} Textures Grans
          </ColoredText>
        </PerformanceCheckItem>
        <PerformanceCheckItem
          title="Llums"
          description="Tot i que les llums dinàmiques no estan habilitades als dispositius mòbils, us recomanem que no utilitzeu més de 3 llums a la vostra escena (excepte les llums ambientals i hemisferiques) perquè la vostra escena funcioni en ordinadors de gamma baixa."
          learnMoreUrl="https://hubs.mozilla.com/docs/spoke-optimization.html"
          score={scores.lights.score}
          scoreColor={scoreToColor[scores.lights.score]}
        >
          <ColoredText color={scoreToColor[scores.lights.score]}>{scores.lights.value} Llums</ColoredText>
        </PerformanceCheckItem>
        <PerformanceCheckItem
          title="Mida Del Fitxer"
          description="Recomanem una mida final del fitxer de no més de 16 MB per a connexions amb una amplada de banda baixa. Reduir la mida del fitxer reduirà el temps que triga a descarregar la vostra escena."
          learnMoreUrl="https://hubs.mozilla.com/docs/spoke-optimization.html"
          score={scores.fileSize.score}
          scoreColor={scoreToColor[scores.fileSize.score]}
        >
          <ColoredText color={scoreToColor[scores.fileSize.score]}>{bytesToSize(scores.fileSize.value)}</ColoredText>
        </PerformanceCheckItem>
      </ul>
    </Dialog>
  );
}

PerformanceCheckDialog.propTypes = {
  scores: PropTypes.object.isRequired,
  tag: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string.isRequired
};

PerformanceCheckDialog.defaultProps = {
  tag: "div",
  title: "Comprovació de Rendiment",
  confirmLabel: "Publicar Escena"
};
