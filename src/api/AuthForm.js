import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../configs";
import styled from "styled-components";
import Input from "../ui/inputs/Input";

const StyledAuthForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  align-self: center;

  & > * {
    margin-bottom: 20px;
  }

  button {
    display: inline-block;
    border: none;
    border-radius: 4px;
    background: ${props => props.theme.blue};
    color: ${props => props.theme.white};
    white-space: nowrap;
    min-height: 36px;
    font-size: 16px;
    padding: 1px 6px;

    &:hover,
    &:active {
      background-color: ${props => props.theme.bluePressed};
    }
  }

  h3 {
    font-size: 2em;
    color: ${props => props.theme.text};
  }

  h4 {
    font-size: 1.1em;
    color: ${props => props.theme.text};
  }
`;

const FormInput = styled(Input)`
  font-size: 20px;
  padding: 8px;
  height: 36px;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.red};
  margin-bottom: 20px;
`;

const LegalText = styled.p`
  margin-bottom: 20px;
`;

export default class AuthForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    email: ""
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.email);
  };

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  render() {
    return (
      <StyledAuthForm onSubmit={this.onSubmit}>
        {this.props.error && <ErrorMessage>{this.props.error}</ErrorMessage>}
        <h3>Registra&#39;t o Inicia Sessi&oacute;</h3>
        <h4>Inicia Sessi&oacute; per desar projectes i publicar escenes{configs.isMoz() && " a Hubs"}.</h4>
        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          value={this.state.email}
          onChange={this.onEmailChange}
        />
        <LegalText>
          En procedir, accepteu les{" "}
          <a rel="noopener noreferrer" target="_blank" href="https://github.com/mozilla/hubs/blob/master/TERMS.md">
            condicions d&#39;&uacute;s
          </a>{" "}
          i{" "}
          <a rel="noopener noreferrer" target="_blank" href="https://github.com/mozilla/hubs/blob/master/PRIVACY.md">
            l&#39;av&iacute;s de privacitat
          </a>
          .
        </LegalText>
        <button type="submit">Enviar Enlla&ccedil;</button>
      </StyledAuthForm>
    );
  }
}
