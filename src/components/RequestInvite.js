import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getRequestInviteOperation } from '../operations';
import { getMemberId } from '../members';
import { postOperation, fetchMemberByMidIfNeeded, fetchMemberByUidIfNeeded } from '../actions';
import { getAuthMemberDoc, getMemberDocByMid } from '../connectors';
import LogIn from './LogIn';
import YoutubeVideo, { getYoutubeUrlVideoId } from './YoutubeVideo';

export class RequestInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: '',
      toUid: '',
      errorMessage: '',
      fullName: props.fullName,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullName !== this.props.fullName) {
      this.setState({ fullName: nextProps.fullName });
    }
    this.fetchIfNeeded(nextProps);
  }

  fetchIfNeeded(props) {
    // TODO this logic very similar to Profile.componentWillReceiveProps.
    // Decomp/https://reactjs.org/docs/higher-order-components.html/https://github.com/acdlite/recompose
    if (props.memberId) {
      this.props.fetchMemberByMidIfNeeded(props.memberId);
    }
    if (props.authFirebaseUser) {
      this.props.fetchMemberByUidIfNeeded(props.authFirebaseUser.uid);
    }
  }

  setVideoURL = async (event: any): void => {
    this.setState({ videoUrl: event.target.value })
  }

  setFullName = async (event: any): void => {
    this.setState({ fullName: event.target.value });
  }

  handleOnSubmit = async (event: any): void => {
    event.stopPropagation();
    if (!getYoutubeUrlVideoId(this.state.videoUrl)) {
      // TODO instant validate instead of on submit, and make sure can play
      this.setState({ errorMessage: 'Please enter a valid Youtube video url' });
    } else {
      const toMemberDoc = this.props.toMemberDoc;
      const toUid = toMemberDoc.id;
      const toMid = toMemberDoc.get('mid');
      const fullName = this.state.fullName;
      const creatorMid = getMemberId(fullName);
      const videoUrl = this.state.videoUrl;
      const requestOp = getRequestInviteOperation(creatorMid, this.props.authFirebaseUser.uid, toMid, toUid, fullName, videoUrl);
      await this.props.postOperation(requestOp);  // TODO handle error
      this.setState({ submitted: true });
    }
  }

  clearErrorMessage(e: any): void {
    this.setState({ errorMessage: '' });
  }

  renderLogIn() {
    return (
      <div>
        <LogIn noRedirect />
        <FormattedMessage id="sign_up_above" />
      </div>
    );
  }

  renderForm() {
    return (
      <div>
        <br />
        <div>
          <input
            value={this.state.fullName || ''}
            onChange={this.setFullName}
            placeholder="First and last name"
            className="InviteInput DisplayNameInput"
          />
        </div>
        <div>
          <input
            onChange={this.setVideoURL}
            placeholder="Public invite video url"
            className="InviteInput VideoUrlInput"
          />
        </div>
        <button className="InviteButton Green"
          onClick={this.handleOnSubmit}>
          Invite me!
        </button>
        <div className="InviteError">{this.state.errorMessage}</div>
        {this.state.videoUrl && <YoutubeVideo youtubeUrl={this.state.videoUrl} />}
      </div>
    );
  }

  renderInviteInstructions() {
    const inviteUrl = `${window.location.origin}/m/${this.props.authMemberDoc.get('mid')}/invite`;
    return (
      <div>
        <FormattedMessage id="invite_others_instructions" values={{
          github_issue: <a href="https://github.com/rahafoundation/raha.io/issues">Github Issue</a>,
          full_name: this.props.authMemberDoc.get('full_name'),
          invite_link: <a href={inviteUrl}>{inviteUrl}</a>,
          ideas_email: <a href="mailto:ideas@raha.io?subject=Raha%20Improvement">ideas@raha.io</a>,
        }}/>
      </div>
    );
  }

  render() {
    if (this.state.submitted) {
      // TODO this will move into <ProfilePending /> component shown at /me
      return (
        <div>
          Your video has been submitted for review! After approval by us
          and {this.props.toMemberDoc.get('full_name')}, your profile will appear at
          to <a href="https://raha.io/me">https://raha.io/me</a>.
          We are available at <a href="mailto:help@raha.io">help@raha.io</a> if you have any questions.
        </div>
      );
    }
    if (!this.props.notSignedIn && !this.props.isAuthMemberDocLoaded) {
      // TODO the loading appears again breifly is user goes from logged out to signed in with this.renderLogIn()
      return <div>Loading</div>;
    }
    if (this.props.authMemberDoc && this.props.authMemberDoc.get('invite_confirmed')) {
      return this.renderInviteInstructions();
    }
    return (
      <div>
        <b>{<FormattedMessage id="request_invite" />}</b>
        <div>
          <FormattedMessage id="invite_me_intro" values={{completely_free: <b><FormattedMessage id="completely_free" /></b>}} />
        </div>
        {this.props.notSignedIn ? this.renderLogIn() : (this.props.isAuthLoaded ? this.renderForm() : <div>Loading</div>)}
      </div >
    );
  }
}

function mapStateToProps(state, ownProps) {
  const memberId = ownProps.match.params.memberId;
  const isAuthLoaded = state.auth.isLoaded;
  if (!isAuthLoaded) {
    return { isAuthLoaded, memberId };
  }
  const authFirebaseUser = state.auth.firebaseUser;
  if (!authFirebaseUser) {
    return { isAuthLoaded, memberId, notSignedIn: true };
  }
  const authMember = state.members.byUid[authFirebaseUser.uid];
  return {
    isAuthLoaded,
    authFirebaseUser,
    memberId,
    isAuthMemberDocLoaded: authMember && !authMember.isFetching,
    authMemberDoc: getAuthMemberDoc(state),
    fullName: state.auth.firebaseUser.displayName,
    toMemberDoc: getMemberDocByMid(state, ownProps.match.params.memberId)
  };
}

export default connect(
  mapStateToProps,
  { postOperation, fetchMemberByMidIfNeeded, fetchMemberByUidIfNeeded }
)(RequestInvite);