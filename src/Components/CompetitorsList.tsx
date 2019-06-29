import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import GlobalState from "../types/GlobalState";
import { loadCompetitors } from "../actions/loadCompetitors";
import {
  CircularProgress,
  createStyles,
  Fab,
  List,
  Paper,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import { addCompetitor, addCompetitorSetUsername, addCompetitorShowModal } from "../actions/addCompetitor";
import AddIcon from '@material-ui/icons/Add';
import { grey, red } from "@material-ui/core/colors";
import { CompetitorItemConnected } from "./CompetitorItem";

const styles = (theme: Theme) =>
  createStyles({
    fabWrapper: {
      margin: 0,
      top: 'auto',
      right: theme.spacing(3),
      bottom: theme.spacing(3),
      left: 'auto',
      position: 'fixed',
    },
    noCompetitorsFound: {
      color: grey[600],
    },
    errorMessage: {
      color: red[900],
    },
  });

const mapStateToProps = ({ loadCompetitors }: GlobalState) => ({
  loadCompetitorsError: loadCompetitors.error,
  loadCompetitorsCompetitors: loadCompetitors.competitors,
  loadCompetitorsLoading: loadCompetitors.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadCompetitors,
      addCompetitor,
      addCompetitorSetUsername,
      addCompetitorShowModal,
    },
    dispatch
  );

export type CompetitorsListProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    fabWrapper: string,
    noCompetitorsFound: string,
    errorMessage: string,
  },
};

type CompetitorsListState = {}

class CompetitorsList extends Component<CompetitorsListProps, CompetitorsListState> {
  componentDidMount(): void {
    this.props.loadCompetitors();
  }

  render(): React.ReactElement<CompetitorsListProps, React.JSXElementConstructor<CompetitorsListState>> {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div
          className={`${classes.fabWrapper} mui-fixed`}
        >
          <Fab
            color="primary"
            variant="extended"
            aria-label="Add"
            onClick={() => this.props.addCompetitorShowModal()}
          >
            <AddIcon />
            Add new competitor
          </Fab>
        </div>
        {this.props.loadCompetitorsLoading ?
          <CircularProgress />
          :
          this.props.loadCompetitorsError ?
            <Typography
              variant="h5"
              gutterBottom
              className={classes.errorMessage}
            >
              {this.props.loadCompetitorsError}
            </Typography>
            :
            this.props.loadCompetitorsCompetitors.length > 0 ?
              <Paper>
                <List>
                  {this.props.loadCompetitorsCompetitors.map((competitor, index) =>
                    <React.Fragment
                      key={index}
                    >
                      <CompetitorItemConnected
                        username={competitor.username}
                        profilePicUrl={competitor.profilePicUrl}
                        userPk={competitor.userPk}
                        status={competitor.status}
                      />
                    </React.Fragment>
                  )}
                </List>
              </Paper>
              :
              <Typography
                variant="h5"
                gutterBottom
                className={classes.noCompetitorsFound}
              >
                No competitors found, add them first.
              </Typography>
        }
      </React.Fragment>
    );
  }
}

export const CompetitorsListConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(CompetitorsList));
