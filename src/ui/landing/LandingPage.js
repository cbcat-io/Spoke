import React, { Component } from "react";
import styled from "styled-components";
import spokeLogo from "../../assets/spoke-logo.png";
import landingVideoMp4 from "../../assets/video/SpokePromo.mp4";
import landingVideoWebm from "../../assets/video/SpokePromo.webm";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import Callout from "./Callout";
import { Link } from "react-router-dom";
import { LargeButton } from "../inputs/Button";
import benches from "../../assets/landing/benches.jpg";
import editor from "../../assets/landing/environment-editor.jpg";
import meeting from "../../assets/landing/meeting.jpg";

const Section = styled.section`
  padding: 100px 0;
`;

const HeroContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  grid-gap: 80px;
  max-width: 1200px;
  padding: 0 20px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
`;

const HeroLeft = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-weight: lighter;
    font-size: 2em;
    margin-bottom: 1.5em;
  }

  a {
    color: ${props => props.theme.text};
  }

  @media (max-width: 1200px) {
    font-size: 10px;
  }

  @media (max-width: 800px) {
    font-size: 8px;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  margin-bottom: 5em;
  max-width: 385px;

  h2 {
    position: absolute;
    right: 6px;
    bottom: -8px;
    font-weight: bold;
    font-size: 3em;
  }
`;

const HeroRight = styled.div`
  video {
    border-radius: 8px;
    background-color: ${props => props.theme.panel};
  }
`;

const CalloutContainer = styled.div`
  display: grid;
  grid-gap: 80px;
  max-width: 1200px;
  padding: 0 20px;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export default class LandingPage extends Component {
  render() {
    return (
      <>
        <NavBar />
        <main>
          <Section>
            <HeroContainer>
              <HeroLeft>
                <LogoContainer>
                  <img src={spokeLogo} alt="Spoke by Mozilla" />
                  <h2>crea el teu espai</h2>
                </LogoContainer>
                <h3>
                  Crea escenes socials 3D per{" "}
                  <a href="https://hubs.mozilla.com" rel="noopener noreferrer">
                    Hubs
                  </a>
                </h3>
                <LargeButton as={Link} to="/new">
                  Comen&ccedil;ar
                </LargeButton>
              </HeroLeft>
              <HeroRight>
                <video playsInline loop autoPlay muted>
                  <source src={landingVideoMp4} type="video/mp4" />
                  <source src={landingVideoWebm} type="video/webm" />
                </video>
              </HeroRight>
            </HeroContainer>
          </Section>
          <Section>
            <CalloutContainer>
              <Callout imageSrc={benches}>
                <h3>Descobrir</h3>
                <p>
                  Exploreu imatges, v&iacute;deos i models 3D de la web, tot sense obrir una pestanya nova. Amb
                  integracions multim&egrave;dia d&#39;Sketchfab, podr&agrave;s crear una escena en molt poc temps.
                </p>
              </Callout>
              <Callout imageSrc={editor}>
                <h3>Crear</h3>
                <p>
                  No cal cap programari extern ni experi&egrave;ncia en modelatge 3D: creeu escenes en 3D amb
                  l&#39;editor web de Spoke podent disposar d&#39;un espai totalment personalitzat segons les teves
                  necessitats. Des d&#39;una sala de juntes fins a l&#39;espai exterior i m&eacute;s enll&agrave;, el
                  teu espai est&agrave; sota el teu control.
                </p>
              </Callout>
              <Callout imageSrc={meeting}>
                <h3>Compartir</h3>
                <p>
                  Convida persones i que es puguin con&egrave;ixer al teu nou espai publicant el teu contingut a Hubs
                  immediatament. Amb nom&eacute;s uns clics, tindreu un m&oacute;n propi per experimentar i compartir -
                  tot des del vostre navegador.
                </p>
              </Callout>
            </CalloutContainer>
          </Section>
        </main>
        <Footer />
      </>
    );
  }
}
