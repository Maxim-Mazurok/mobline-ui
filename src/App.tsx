import React, { Component } from 'react';
import './App.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TopBarConnected } from "./Components/TopBar";
import { MainDrawerConnected } from "./Components/MainDrawer";
import { RouteComponentProps, withRouter } from "react-router";
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
import { MenuItemId } from "./reducers/menu";

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

type AppState = {}

class App extends Component<RouteComponentProps<{}> & AppProps, AppState> {
  componentWillMount(): void {
    if (this.props.isLoggedIn && this.props.userCustomerId === null) {
      this.props.getCustomerId();
    }
    // this.props.loadCompetitors();
  }

  logout: () => void = () => {
    //TODO
    alert('logout');
  };

  renderCurrentSection() {
    switch (this.props.selectedMenuItemId) {
      case MenuItemId.DASHBOARD:
        return <CompetitorsListConnected />;
      case MenuItemId.FOLLOWERS_EXPLORER:
        return <FollowersExplorerConnected />;
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
        {/*<h1>*/}
        {/*  {this.props.userProfile.name}*/}
        {/*</h1>*/}
        {this.props.isLoggedIn &&
        <Container
          className={classes.mainContainer}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={10} md={8} xl={6}>
              {this.props.userCustomerIdLoading ?
                <CircularProgress />
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
                  this.props.userCustomerId && this.renderCurrentSection()
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
