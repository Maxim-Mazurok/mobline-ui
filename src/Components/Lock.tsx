//TODO: add renew session?

import React, { Component } from 'react';
import Auth0Lock from 'auth0-lock';
import { AUTH_CONFIG } from '../Auth/auth0-variables';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { handleLogin, handleUserProfile } from "../actions";
import GlobalState from "../types/GlobalState";
import { connect } from "react-redux";
import { Auth0UserProfile } from "auth0-js";
import { Box, CircularProgress, createStyles, Modal, StyledComponentProps, withStyles } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { getCustomerId } from "../actions/getCustomerId";
import { isLoggedIn } from "../selectors";

export const calcExpiresAt = (expiresIn: number) => (expiresIn * 1000) + new Date().getTime();

const mapStateToProps = ({ user }: GlobalState) => ({
  userInfo: user.userInfo,
  userProfile: user.userProfile,
  isLoggedIn: isLoggedIn(user),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      handleLogin,
      handleUserProfile,
      getCustomerId,
    },
    dispatch
  );

type LockState = {
  loading: boolean,
};

export type LockProps =
  RouteComponentProps<{}>
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    loading: string,
  }
};

const styles = () =>
  createStyles({
    loading: {
      margin: "auto",
    },
  });

class Lock extends Component<LockProps, LockState> {
  state = {
    loading: true,
  };

  lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.domain, {
    auth: {
      responseType: 'token id_token',
      sso: false,
    },
    languageDictionary: {
      title: "Mobline"
    },
    container: AUTH_CONFIG.container,
    theme: {
      logo: '/images/logo.png',
      primaryColor: '#3f51b5'
    },
    allowedConnections: [
      'Username-Password-Authentication',
      'facebook',
      'google-oauth2',
    ]
  });

  constructor(props: LockProps) {
    super(props);
    this.onAuthenticated();
  }

  onAuthenticated = () => {
    this.lock.on('authenticated', this.handleAuth);
  };

  componentDidMount() {
    // Avoid showing Lock when hash is parsed.
    if (!(/access_token|id_token|error/.test(this.props.location.hash))) {
      if (this.props.isLoggedIn) {
        this.lock.checkSession({}, (error, authResult) => {
          if (error || !authResult) {
            this.forceUpdate(() => {
              this.lock.show();
            });
          } else {
            this.handleAuth(authResult);
          }
          this.setState({ loading: false });
        });
      } else {
        this.setState({ loading: false });
        this.forceUpdate(() => {
          this.lock.show();
        });
      }
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Modal open={true}>
        <Box display="grid" alignContent="center" minHeight="100%">
          {this.state.loading && <CircularProgress
            className={classes.loading}
          />}
          <div id={AUTH_CONFIG.container} />
        </Box>
      </Modal>
    );
  }

  componentWillUnmount(): void {
    this.lock.hide();
  }

  private handleAuth = (authResult: AuthResult) => {
    const accessToken = authResult.accessToken || null;
    const idToken = authResult.idToken || null;
    const expiresAt = calcExpiresAt(authResult.expiresIn || 0);

    this.props.handleLogin({
      accessToken,
      idToken,
      expiresAt,
    });

    if (accessToken !== null) {
      this.lock.getUserInfo(accessToken, (error: any, profile: Auth0UserProfile) => {
        if (error) {
          console.error(error);
          return;
        }

        this.props.handleUserProfile(profile);
        this.props.getCustomerId();
      });
    }
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Lock)));
