import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import GlobalState from "../types/GlobalState";
import { loadCompetitors } from "../actions/loadCompetitors";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  createStyles,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  List,
  Paper,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import { grey, red } from "@material-ui/core/colors";
import { selectCompetitor, setVerifiedOnly, unselectCompetitor } from "../actions";
import { ChipProps } from "@material-ui/core/Chip";
import { loadFollowers } from "../actions/loadFollowers";
import { Follower } from "../reducers/loadFollowers";
import { FollowerItemConnected, verifiedBadge } from "./FollowerItem";

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
    paper: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    }
  });

const mapStateToProps = ({ loadCompetitors, followersExplorer, loadFollowers }: GlobalState) => ({
  loadCompetitorsError: loadCompetitors.error,
  loadCompetitorsCompetitors: loadCompetitors.competitors,
  loadCompetitorsLoading: loadCompetitors.loading,
  followersExplorerSelectedCompetitors: followersExplorer.selectedCompetitors,
  followersExplorerVerifiedOnly: followersExplorer.verifiedOnly,
  loadFollowersError: loadFollowers.error,
  loadFollowersFollowers: loadFollowers.followers,
  loadFollowersLoading: loadFollowers.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadCompetitors,
      selectCompetitor,
      unselectCompetitor,
      loadFollowers,
      setVerifiedOnly,
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
    paper: string,
  },
};

type FollowersExplorerState = {}

class FollowersExplorer extends Component<FollowersExplorerProps, FollowersExplorerState> {
  componentDidUpdate(prevProps: FollowersExplorerProps) {
    if (prevProps.followersExplorerSelectedCompetitors !== this.props.followersExplorerSelectedCompetitors) {
      this.props.loadFollowers();
    }
  }

  componentDidMount(): void {
    this.props.loadCompetitors();
    this.props.loadFollowers();
  }

  handleVerifiedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setVerifiedOnly(event.target.checked);
  };

  render(): React.ReactElement<FollowersExplorerProps, React.JSXElementConstructor<FollowersExplorerState>> {
    const { classes } = this.props;

    return (
      <React.Fragment>
        {this.props.loadCompetitorsLoading ?
          <LinearProgress />
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
              <React.Fragment>
                <Box mx={2} my={2}>
                  <Typography
                    variant="h2"
                  >
                    Verified followers {verifiedBadge('span', 'inline-block')}
                  </Typography>
                </Box>
                <Paper
                  className={classes.paper}
                >
                  <Box mx={1} my={2}>
                    {this.props.loadCompetitorsCompetitors.map((competitor, index) => {
                        const isSelected = this.props.followersExplorerSelectedCompetitors.indexOf(competitor.userPk) !== -1;
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
                  </Box>
                  <Box mx={2} mb={2} hidden>
                    <FormGroup row>
                      <FormControlLabel
                        value="verified only"
                        control={
                          <Checkbox
                            checked={this.props.followersExplorerVerifiedOnly}
                            onChange={this.handleVerifiedOnlyChange}
                            value="verified only"
                            color="primary"
                            disabled
                          />
                        }
                        label="Verified only"
                        labelPlacement="end"
                      />
                    </FormGroup>
                  </Box>
                  {
                    this.props.loadFollowersLoading ?
                      <Box mx={2} my={2}> {/*TODO: fix a lot of boxes*/}
                        <LinearProgress />
                      </Box>
                      :
                      this.props.loadFollowersError ?
                        <Box mx={2} my={2}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            className={classes.errorMessage}
                          >
                            {this.props.loadFollowersError}
                          </Typography>
                        </Box>
                        :
                        this.props.loadFollowersFollowers.length > 0 ?
                          <List>
                            {
                              this.props.loadFollowersFollowers
                                .filter((follower: Follower) =>
                                  this.props.followersExplorerVerifiedOnly ? follower.isVerified : true)
                                .map((follower: Follower, index) =>
                                  <React.Fragment
                                    key={index}
                                  >
                                    <FollowerItemConnected
                                      follower={follower}
                                    />
                                  </React.Fragment>
                                )}
                          </List>
                          :
                          <Box mx={2} my={2}>
                            <Typography
                              color="textSecondary"
                              variant="h5"
                              gutterBottom
                              className={classes.noFollowersFound}
                            >
                              No verified followers found.
                            </Typography>
                          </Box>
                  }
                </Paper>
              </React.Fragment>
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
