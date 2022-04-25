import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../../configs";
import OnboardingContainer from "./OnboardingContainer";
import OnboardingDialog from "./OnboardingDialog";
import OnboardingPopover from "./OnboardingPopover";
import { withEditor } from "../contexts/EditorContext";
import Icon from "../inputs/Icon";
import lmbIcon from "../../assets/onboarding/lmb.svg";
import rmbIcon from "../../assets/onboarding/rmb.svg";
import wasdIcon from "../../assets/onboarding/wasd.svg";
import HotkeyDescription from "./HotkeyDescription";
import { withApi } from "../contexts/ApiContext";
import { Button } from "../inputs/Button";
import Well from "../layout/Well";
import { cmdOrCtrlString } from "../utils";
import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */

class CreateModelPopover extends Component {
  componentDidMount() {
    // TODO: Check if object was added
    this.props.editor.setSource("sketchfab");
    this.props.editor.addListener("sceneGraphChanged", this.onObjectAdded);
  }

  onObjectAdded = () => {
    this.props.nextStep();
  };

  componentWillUnmount() {
    this.props.editor.removeListener("sceneGraphChanged", this.onObjectAdded);
  }

  render() {
    return (
      <OnboardingPopover target="#assets-panel" {...this.props} disableNext>
        Afegeix un model a la teva escena fent-hi clic.
      </OnboardingPopover>
    );
  }
}

const WrappedCreateModelPopover = withEditor(CreateModelPopover);

class SaveProjectDialog extends Component {
  componentDidMount() {
    this.props.api.addListener("project-saving", this.onProjectSaving);
  }

  onProjectSaving = () => {
    this.props.nextStep();
  };

  componentWillUnmount() {
    this.props.api.removeListener("project-saving", this.onProjectSaving);
  }

  render() {
    return (
      <OnboardingDialog {...this.props} disableNext>
        <h2>Desant i Publicant</h2>
        <h1>Desant el Teu Projecte</h1>
        <p>
          Abans de sortir de la p&agrave;gina, voldreu desar el vostre treball. Podeu fer-ho obrint el men&uacute; i
          fent clic a Desar Projecte o prement {cmdOrCtrlString} + S.
        </p>
        <Well>
          <HotkeyDescription action="Desar Projecte">
            <div>{cmdOrCtrlString}</div>
            <div>S</div>
          </HotkeyDescription>
        </Well>
      </OnboardingDialog>
    );
  }
}

const WrappedSaveProjectDialog = withApi(SaveProjectDialog);

class SaveProjectPopover extends Component {
  componentDidMount() {
    this.props.api.addListener("project-saved", this.onProjectSaved);
  }

  onProjectSaved = () => {
    this.props.nextStep();
  };

  componentWillUnmount() {
    this.props.api.removeListener("project-saved", this.onProjectSaved);
  }

  render() {
    return (
      <OnboardingPopover target="#viewport-panel .toolbar" {...this.props} position="bottom" disablePrev disableNext>
        Pressiona {cmdOrCtrlString} + S per desar el teu projecte.
        <Well>
          <HotkeyDescription action="Desar Projecte">
            <div>{cmdOrCtrlString}</div>
            <div>S</div>
          </HotkeyDescription>
        </Well>
      </OnboardingPopover>
    );
  }
}

const WrappedSaveProjectPopover = withApi(SaveProjectPopover);

class PublishScenePopover extends Component {
  componentDidMount() {
    this.props.api.addListener("project-published", this.onScenePublished);
  }

  onScenePublished = () => {
    this.props.nextStep();
  };

  componentWillUnmount() {
    this.props.api.removeListener("project-published", this.onScenePublishing);
  }

  render() {
    return (
      <OnboardingPopover target="#publish-button" {...this.props} position="bottom" disablePrev disableNext>
        Fes clic per publicar la teva escena.
      </OnboardingPopover>
    );
  }
}

const WrappedPublishScenePopover = withApi(PublishScenePopover);

const steps = [
  {
    render(props) {
      return (
        <OnboardingDialog {...props}>
          <h2>Presentaci&oacute;</h2>
          <h1>Benvinguts{configs.isMoz() ? " a Spoke" : ""}</h1>
          <p>En aquest tutorial veurem com crear i publicar una escena.</p>
        </OnboardingDialog>
      );
    }
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#viewport-panel .toolbar" {...props} position="bottom">
          <p>
            Podeu orbitar per l&#39;escena mantenint premut el bot&oacute; esquerre del ratol&iacute; i arrossegant.
          </p>
          <p>
            Tamb&eacute; podeu volar per l&#39;escena mantenint premut el bot&oacute; dret del ratol&iacute; i
            utilitzant les tecles WASD.
          </p>
          <Well>
            <HotkeyDescription action="Orbitar">
              <Icon src={lmbIcon} />
            </HotkeyDescription>
            <HotkeyDescription action="Volar">
              <Icon src={rmbIcon} />
              <Icon src={wasdIcon} />
            </HotkeyDescription>
            <HotkeyDescription action="Impulsar">
              <Icon src={rmbIcon} />
              <Icon src={wasdIcon} />
              <div>Shift</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },
  {
    component: WrappedCreateModelPopover
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#assets-panel" {...props} position="top" disablePrev>
          <p>Mentre el model estigui carregant, veureu un indicador de c&agrave;rrega.</p>
          <p>Premeu Q per girar l&#39;objecte cap a l&#39;esquerra i E per girar l&#39;objecte cap a la dreta.</p>
          <p>Feu clic per col&#183;locar l&#39;objecte i premeu ESC per deixar de col&#183;locar objectes.</p>
          <Well>
            <HotkeyDescription action="Girar a l'Esquerra">
              <div>Q</div>
            </HotkeyDescription>
            <HotkeyDescription action="Girar a la Dreta">
              <div>E</div>
            </HotkeyDescription>
            <HotkeyDescription action="Cancel·lar Col·locació">
              <div>Esc</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#assets-panel" {...props} position="top" disablePrev>
          <p>Podeu seleccionar objectes fent clic sobre ells.</p>
          <p>Manteniu premuda la tecla maj&uacute;scules per seleccionar diversos objectes.</p>
          <p>Premeu ESC per deseleccionar tots els objectes.</p>
          <Well>
            <HotkeyDescription action="Seleccionar">
              <Icon src={lmbIcon} />
            </HotkeyDescription>
            <HotkeyDescription action="Afegir a la Selecció">
              <Icon src={lmbIcon} />
              <div>Shift</div>
            </HotkeyDescription>
            <HotkeyDescription action="Desseleccionar-ho Tot">
              <div>ESC</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#hierarchy-panel" {...props} position="left">
          Els objectes que afegiu a l&#39;escena es mostren al tauler de jerarquia. Feu doble clic a l&#39;objecte que
          heu afegit per enfocar-lo. Tamb&eacute; podeu pr&eacute;mer la tecla F per enfocar l&#39;objecte seleccionat.
          <Well>
            <HotkeyDescription action="Enfocar l'Objecte Seleccionat">
              <div>F</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#translate-button" {...props} position="bottom-left">
          <p>
            Podeu moure objectes per l&#39;escena utilitzant el gizmo de translaci&oacute; seleccionant un objecte i
            prement T per entrar en mode de translaci&oacute;.
          </p>
          <p>Arrossegueu les fletxes del gadget per moure l&#39;objecte als eixos X, Y o Z.</p>
          <Well>
            <HotkeyDescription action="Mode de Translació">
              <div>T</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#rotate-button" {...props} position="bottom-left">
          <p>
            Podeu girar objectes amb el gadget de rotaci&oacute; seleccionant un objecte i prement R per entrar al mode
            de rotaci&oacute;.
          </p>
          <p>Arrossegueu els anells del gadget per rotar l&#39;objecte als eixos X, Y o Z.</p>
          <Well>
            <HotkeyDescription action="Mode de Rotació">
              <div>R</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#scale-button" {...props} position="bottom-left">
          <p>
            Podeu escalar objectes utilitzant el gadget d&#39;escala seleccionant un objecte i prement Y per entrar al
            mode d&#39;escala.
          </p>
          <p>Arrossegueu el cub central del gadget per escalar l&#39;objecte cap amunt o cap avall.</p>
          <Well>
            <HotkeyDescription action="Mode d'Escala">
              <div>Y</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },
  {
    render(props) {
      return (
        <OnboardingPopover target="#translate-button" {...props} position="bottom-left">
          <p>
            Tamb&eacute; podeu moure objectes amb l&#39;eina de captura. Mentre es seleccionen objectes, premeu G per
            agafar la selecci&oacute;. Moveu el ratol&iacute; i feu clic per col&#183;locar l&#39;objecte a
            l&#39;escena.
          </p>
          <p>Premeu Esc o premeu G de nou per cancel&#183;lar la captura actual</p>
          <Well>
            <HotkeyDescription action="Caputar Objecte">
              <div>G</div>
            </HotkeyDescription>
            <HotkeyDescription action="Cancel·lar Captura">
              <div>Esc / G</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },

  {
    render(props) {
      return (
        <OnboardingPopover target="#transform-pivot" {...props} position="bottom-left">
          <p>
            A vegades, col&#183;locar un objecte pot ser dif&iacute;cil si el punt de pivot del model est&agrave;
            configurat incorrectament. Pots canviar com es calcula el pivot en aquest men&uacute; desplegable. El mode
            pivot es pot canviar prement X.
          </p>
          <Well>
            <HotkeyDescription action="Canviar Mode de Pivot">
              <div>X</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },

  {
    render(props) {
      return (
        <OnboardingPopover target="#transform-snap" {...props} position="bottom-left">
          <p>
            &Eacute;s possible que vulgueu moure un objecte amb una posici&oacute; o rotaci&oacute; precisa. Per fer-ho,
            activeu el mode d&#39;encaixament fent clic a la icona de l&#39;imant. Podeu establir la configuraci&oacute;
            de l&#39;ajustament de la translaci&oacute; i la rotaci&oacute; utilitzant els men&uacute;s desplegables.
          </p>
          <Well>
            <HotkeyDescription action="Alternar Mode d'Encaixar">
              <div>C</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },

  {
    render(props) {
      return (
        <OnboardingPopover target="#transform-grid" {...props} position="bottom-left">
          <p>
            En el mode de col&#183;locaci&oacute;, els objectes es poden col&#183;locar a sobre d&#39;altres objectes o
            de la quadr&iacute;cula. Quan es construeix verticalment, pot ser &uacute;til canviar l&#39;alçada de la
            quadr&iacute;cula.
          </p>
          <Well>
            <HotkeyDescription action="Augmentar Altura de la Quadrícula">
              <div>=</div>
            </HotkeyDescription>
            <HotkeyDescription action="Disminuir Altura de la Quadrícula">
              <div>-</div>
            </HotkeyDescription>
          </Well>
        </OnboardingPopover>
      );
    }
  },

  {
    render(props) {
      return (
        <OnboardingPopover target="#properties-panel" {...props} position="left">
          Es poden establir propietats addicionals de l&#39;objecte al tauler de propietats. Aix&ograve; inclou coses
          com ara ombres, color de la llum i molt m&eacute;s.
        </OnboardingPopover>
      );
    }
  },
  {
    component: WrappedSaveProjectDialog
  },
  {
    component: WrappedSaveProjectPopover
  },
  {
    render(props) {
      return (
        <OnboardingDialog {...props} disablePrev>
          <h2>Desar i Publicar</h2>
          <h1>Publicar Projecte</h1>
          <p>
            Un cop el vostre projecte estigui llest, podeu publicar-lo {configs.isMoz() && " a Hubs"} i convidar els
            vostres amics amb el clic d&#39;un bot&oacute;.
          </p>
        </OnboardingDialog>
      );
    }
  },
  {
    component: WrappedPublishScenePopover
  },
  {
    render(props) {
      return (
        <OnboardingDialog {...props} disablePrev disableSkip>
          <h2>Desar i Publicar</h2>
          <h1>Bona Feina!</h1>
          <p>
            Bona feina! Has tocat tots els conceptes b&agrave;sics {configs.isMoz() && "de Spoke "}i has publicat una
            escena {configs.isMoz() && "a Hubs"}! Per comen&ccedil;ar amb la vostra pr&ograve;pia escena, consulteu la
            vostra p&agrave;gina de projectes. O feu clic a Finalitzar per continuar treballant en aquesta escena.
          </p>
          <Button as={Link} onClick={() => props.onFinish("Navigate to Projects Page")} to="/projects">
            Els Meus Projectes
          </Button>
        </OnboardingDialog>
      );
    }
  }
];

export default function Onboarding({ onFinish, onSkip }) {
  return <OnboardingContainer steps={steps} onFinish={() => onFinish("Continue")} onSkip={onSkip} />;
}

Onboarding.propTypes = {
  onFinish: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired
};
