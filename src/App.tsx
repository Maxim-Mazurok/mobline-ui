import React, { Component } from 'react';
import './App.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TopBarConnected } from "./Components/TopBar";
import { MainDrawerConnected } from "./Components/MainDrawer";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router";
import Lock from "./Components/Lock";
import InviteCode from "./Components/InviteCode";
import GlobalState from "./types/GlobalState";
import { inviteCodeIsCorrect, isLoggedIn } from "./selectors";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { loadCompetitors } from "./actions/loadCompetitors";
import { getCustomerId } from "./actions/getCustomerId";
import { SnackbarConnected } from "./Components/Snackbar";
import {
  CircularProgress,
  Container,
  createStyles,
  Grid,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import AddCompetitor from "./Components/AddCompetitor";
import { red } from "@material-ui/core/colors";
import { wsSubscribe } from "./actions/socket";
import { menuItems } from "./reducers/menu";

const styles = (theme: Theme) =>
  createStyles({
    mainContainer: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    errorMessage: {
      color: red[300],
    },
  });

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadCompetitors,
      getCustomerId,
      wsSubscribe,
    },
    dispatch
  );

const mapStateToProps = ({ user, loadCompetitors }: GlobalState) => ({
  inviteCodeIsCorrect: inviteCodeIsCorrect(user),
  isLoggedIn: isLoggedIn(user),
  userProfile: user.userProfile || { name: "Not logged in" },
  loadCompetitors: loadCompetitors,
  userCustomerId: user.customerId,
  userCustomerIdLoading: user.customerIdLoading,
  userCustomerIdError: user.customerIdError,
});

export type AppProps =
  ReturnType<typeof mapDispatchToProps>
  & ReturnType<typeof mapStateToProps>
  & StyledComponentProps
  & {
  classes: {
    errorMessage: string,
    mainContainer: string,
  }
};

// noinspection JSUnusedGlobalSymbols
export type RouterAppProps = RouteComponentProps<{}>;

type AppState = {
  subscribed: boolean,
}

class App extends Component<RouteComponentProps<{}> & AppProps, AppState> {
  state = {
    subscribed: false
  };

  componentDidUpdate(nextProps: AppProps) {
    if (!this.state.subscribed && nextProps.userCustomerId !== null) {
      this.setState({ subscribed: true });
      this.props.wsSubscribe(nextProps.userCustomerId);
    }
  }

  componentWillMount(): void {
    if (this.props.isLoggedIn && this.props.userCustomerId === null) {
      this.props.getCustomerId();
    }
  }

  logout: () => void = () => {
    // TODO: implement logout
    alert('logout');
  };

  render(): React.ReactElement {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <TopBarConnected title="Mobline" />
        <MainDrawerConnected />
        <InviteCode />
        <AddCompetitor />
        {this.props.inviteCodeIsCorrect && !this.props.isLoggedIn && <Lock />}
        {this.props.isLoggedIn &&
        <Container
          className={classes.mainContainer}
        >
          {/*TODO: remove grid from here, make it per section*/}
          <Grid container>
            <Grid item xs={12}>
              {this.props.userCustomerIdLoading ?
                <CircularProgress
                  disableShrink
                />
                :
                this.props.userCustomerIdError ?
                  <Typography
                    variant="h5"
                    gutterBottom
                    className={classes.errorMessage}
                  >
                    {this.props.userCustomerIdError}
                  </Typography>
                  :
                  this.props.userCustomerId &&
                  <React.Fragment>
                    <Switch>
                      {Object.entries(menuItems)
                        .map(([key, menuItem]) => (
                          <Route
                            key={key}
                            exact
                            path={menuItem.path}
                            component={menuItem.component} />
                        ))
                      }
                    </Switch>
                  </React.Fragment>
              }
            </Grid>
          </Grid>
        </Container>
        }
        <SnackbarConnected />
      </React.Fragment>
    );
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App)));
