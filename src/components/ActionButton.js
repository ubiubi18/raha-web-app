import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { interactive } from '../constants/palette';

import { getAuthMemberDoc } from '../connectors';
import { getTrustOperation } from '../operations';
import { postOperation } from '../actions';

// TODO code duplication in functions/srs/index.ts, decomp.

interface Props {
  toUid: string;
  toMid: string;
}

const ButtonElem = styled.button`
  cursor: pointer;
  color: white;
  background: ${interactive.primary};
  transition: background-color .25s;

  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 2px;

  :hover, :active, :focus {
    background: ${interactive.primaryHover};
  }
`;

// TODO(#8) instead of only trust, should be multi-functional button
class ActionButton extends Component<Props> {
  state = {}

  onTrustClick = () => {
    const trustOp = getTrustOperation(this.props.authMemberDoc.get('mid'), this.props.authMemberDoc.id, this.props.toMid, this.props.toUid);
    this.props.postOperation(trustOp);
  }

  onInviteClick = () => {
    this.setState({ invite: true });
  }

  render() {
    if (this.state.invite) {
      return <Redirect to={`/m/${this.props.toMid}/invite`} />
    }
    if (this.props.authMemberDoc.id && this.props.authMemberDoc.get('mid')) {
      return (
        <ButtonElem onClick={this.onTrustClick} className={this.props.className}>
          Trust
        </ButtonElem>
      );
    } else {
      return (
        <ButtonElem onClick={this.onInviteClick} className={this.props.className}>
          Share Invite Video to Join
        </ButtonElem>
      );
    }
  }
}

function mapStateToProps(state) {
  return { authMemberDoc: getAuthMemberDoc(state) };
}

export default connect(mapStateToProps, { postOperation })(ActionButton);
