import React, { Component } from "react";
import PropTypes from "prop-types";
import { withApi } from "../ui/contexts/ApiContext";
import { trackEvent } from "../telemetry";

import AuthEmailSentMessage from "./AuthEmailSentMessage";
import AuthForm from "./AuthForm";

class AuthContainer extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
    onChange: PropTypes.func
  };

  state = {
    error: null,
    emailSent: false,
    email: null,
    abortController: null
  };

  onSubmit = email => {
    if (email.trim().length === 0) {
      return;
    }

    const abortController = new AbortController();

    this.props.api
      .authenticate(email, abortController.signal)
      .then(this.onSuccess)
      .catch(this.onError);

    const nextState = { emailSent: true, email, abortController };

    if (this.props.onChange) {
      this.props.onChange(nextState);
    }

    trackEvent("Inici de Sessió Enviat");

    this.setState(nextState);
  };

  onSuccess = (...args) => {
    trackEvent("Inici de Sessió amb Èxit");

    if (this.props.onSuccess) {
      this.props.onSuccess(...args);
    }
  };

  onError = err => {
    const nextState = {
      emailSent: false,
      email: null,
      error: err.message || "Error registrant-se. Si us plau torneu-ho a intentar.",
      abortController: null
    };

    if (this.props.onChange) {
      this.props.onChange(nextState);
    }

    trackEvent("Error a Iniciant de Sessió");

    this.setState(nextState);
  };

  onCancel = () => {
    const nextState = { emailSent: false, abortController: null };

    if (this.state.abortController) {
      this.state.abortController.abort();
    }

    if (this.props.onChange) {
      this.props.onChange(nextState);
    }

    this.setState(nextState);

    trackEvent("Inici de Sessió Cancel·lat");
  };

  render() {
    if (this.state.emailSent) {
      return <AuthEmailSentMessage email={this.state.email} onCancel={this.onCancel} />;
    }

    return <AuthForm error={this.state.error} onSubmit={this.onSubmit} />;
  }
}

export default withApi(AuthContainer);
