import React, { Component } from "react";
import PropTypes from "prop-types";
import ProgressBar from "../ui/inputs/ProgressBar";
import styled from "styled-components";

const StyledAuthEmailSentMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  align-self: center;

  & > * {
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
  }
`;

export default class AuthEmailSentMessage extends Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  onCancel = e => {
    e.preventDefault();
    e.target.blur();
    this.props.onCancel();
  };

  render() {
    return (
      <StyledAuthEmailSentMessage>
        <h2>Correu enviat!</h2>
        <p>Esperant que feu clic a l&#39;enlla&ccedil; enviat a {this.props.email}</p>
        <strong>No tanqueu aquesta pestanya del navegador perqu&egrave; podeu perdre la vostra feina!</strong>
        <ProgressBar />
        <div>
          <a href="" onClick={this.onCancel}>
            Cancel&#183;lar
          </a>
        </div>
      </StyledAuthEmailSentMessage>
    );
  }
}
