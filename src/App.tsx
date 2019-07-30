import React, { Component } from 'react';
import './App.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TopBarConnected } from "./Components/TopBar";
import { MainDrawerConnected } from "./Components/MainDrawer";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router";
import Lock from "./Components/Lock";
import InviteCode from "./Components/InviteCode";
import GlobalState from "./types/GlobalState";
import { inviteCodeIsCorrect, isLoggedIn } from "./selectors";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { loadCompetitors } from "./actions/loadCompetitors";
import { getCustomerId } from "./actions/getCustomerId";
import { CompetitorsListConnected } from "./Components/CompetitorsList";
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
import { FollowersExplorerConnected } from "./Components/FollowersExplorer";
import { wsSubscribe } from "./actions/socket";
import { ContentExplorerConnected } from "./Components/Content";
import { DashboardConnected } from "./Components/Dashboard";
import { MenuItemId, MenuItemPaths } from "./defaultState";

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

const mapStateToProps = ({ user, loadCompetitors, menu }: GlobalState) => ({
  inviteCodeIsCorrect: inviteCodeIsCorrect(user),
  isLoggedIn: isLoggedIn(user),
  userProfile: user.userProfile || { name: "Not logged in" },
  loadCompetitors: loadCompetitors,
  userCustomerId: user.customerId,
  userCustomerIdLoading: user.customerIdLoading,
  userCustomerIdError: user.customerIdError,
  selectedMenuItemId: menu.selectedMenuItemId,
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
    //TODO
    alert('logout');
  };

  renderCurrentSection() {
    switch (this.props.selectedMenuItemId) {
      case MenuItemId.DASHBOARD:
        return <p>Dashboard will be here soon...</p>;
      case MenuItemId.COMPETITORS:
        return <CompetitorsListConnected />;
      case MenuItemId.CONTENT:
        return <ContentExplorerConnected />;
      case MenuItemId.FOLLOWERS_EXPLORER:
        return <FollowersExplorerConnected />;
      case MenuItemId.ADS:
        return <p>Ads will be here soon...</p>;
      case MenuItemId.SETTINGS:
        return <p>Setting will be here soon...</p>;
      default:
        console.error(`Unknown section id: ${this.props.selectedMenuItemId}`);
        return null;
    }
  }

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
          <Grid container spacing={3}>
            <Grid item xs={12} sm={10} md={8} xl={6}>
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
                      <Route path={MenuItemPaths[MenuItemId.DASHBOARD]} component={DashboardConnected} />
                      <Route path={MenuItemPaths[MenuItemId.COMPETITORS]} component={CompetitorsListConnected} />
                      <Route path={MenuItemPaths[MenuItemId.CONTENT]} component={ContentExplorerConnected} />
                      <Route path={MenuItemPaths[MenuItemId.FOLLOWERS_EXPLORER]}
                             component={FollowersExplorerConnected} />
                      <Route path={MenuItemPaths[MenuItemId.ADS]} component={DashboardConnected} />
                      <Route path={MenuItemPaths[MenuItemId.SETTINGS]} component={DashboardConnected} />
                      <Redirect from="/" to="/dashboard" />
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
