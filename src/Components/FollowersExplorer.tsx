import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import GlobalState from "../types/GlobalState";
import { loadCompetitors } from "../actions/loadCompetitors";
import {
  Avatar,
  Chip,
  CircularProgress,
  createStyles,
  Paper,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import { addCompetitor, addCompetitorSetUsername, addCompetitorShowModal } from "../actions/addCompetitor";
import { grey, red } from "@material-ui/core/colors";
import { selectCompetitor, unselectCompetitor } from "../actions";
import { ChipProps } from "@material-ui/core/Chip";

const styles = (theme: Theme) =>
  createStyles({
    noCompetitorsFound: {
      color: grey[600],
    },
    errorMessage: {
      color: red[900],
    },
    chip: {
      margin: theme.spacing(1),
    },
  });

const mapStateToProps = ({ loadCompetitors, selectedCompetitors }: GlobalState) => ({
  loadCompetitorsError: loadCompetitors.error,
  loadCompetitorsCompetitors: loadCompetitors.competitors,
  loadCompetitorsLoading: loadCompetitors.loading,
  selectedCompetitors,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadCompetitors,
      addCompetitor,
      addCompetitorSetUsername,
      addCompetitorShowModal,
      selectCompetitor,
      unselectCompetitor,
    },
    dispatch
  );

export type FollowersExplorerProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    noCompetitorsFound: string,
    errorMessage: string,
    chip: string,
  },
};

type FollowersExplorerState = {}

class FollowersExplorer extends Component<FollowersExplorerProps, FollowersExplorerState> {
  componentDidMount(): void {
    this.props.loadCompetitors();
  }

  render(): React.ReactElement<FollowersExplorerProps, React.JSXElementConstructor<FollowersExplorerState>> {
    const { classes } = this.props;

    return (
      <React.Fragment>
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
                {this.props.loadCompetitorsCompetitors.map((competitor, index) => {
                    const isSelected = this.props.selectedCompetitors.indexOf(competitor.userPk) !== -1;
                    const props: ChipProps = {
                      color: isSelected ? "primary" : "default",
                    };
                    if (isSelected) {
                      props.onDelete = () => {
                        this.props.unselectCompetitor(competitor.userPk);
                      };
                    } else {
                      props.onClick = () => {
                        this.props.selectCompetitor(competitor.userPk);
                      };
                    }
                    return (
                      <Chip
                        {...props}
                        className={classes.chip}
                        key={index}
                        avatar={<Avatar alt={competitor.username} src={competitor.profilePicUrl} />}
                        label={competitor.username}
                      />
                    );
                  }
                )}
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

export const FollowersExplorerConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(FollowersExplorer));
