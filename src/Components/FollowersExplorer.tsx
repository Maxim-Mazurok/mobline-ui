import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import GlobalState, { Competitor } from '../types/GlobalState';
import { loadCompetitors } from '../actions/loadCompetitors';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  createStyles,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  List,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import { grey, red } from '@material-ui/core/colors';
import { selectCompetitor, selectSingleCompetitor, setVerifiedOnly, unselectCompetitor } from '../actions';
import { ChipProps } from '@material-ui/core/Chip';
import { loadFollowers } from '../actions/loadFollowers';
import { Follower } from '../reducers/loadFollowers';
import { FollowerItemConnected } from './FollowerItem';
import InfiniteScroll from 'react-infinite-scroller';
import AddIcon from '@material-ui/icons/Add';
import { addCompetitorShowModal } from '../actions/addCompetitor';
import { ReactComponent as IconAdd } from '../icons/icon-add.svg';
import { ReactComponent as IconClose } from '../icons/icon-close.svg';

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
      fontWeight: 'bold',
    },
    paper: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    loader: {
      margin: theme.spacing(2),
    },
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
      selectSingleCompetitor,
      unselectCompetitor,
      loadFollowers,
      setVerifiedOnly,
      addCompetitorShowModal,
    },
    dispatch,
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
    loader: string,
  },
};

type FollowersExplorerState = {
  pageNumber: number,
}

const followersPerPage = 10;

class FollowersExplorer extends Component<FollowersExplorerProps, FollowersExplorerState> {
  state = {
    pageNumber: 0,
  };

  componentDidUpdate(prevProps: FollowersExplorerProps) {
    // TODO(repetition): think about merging this with componentDidMount to eliminate repetition
    if (this.props.followersExplorerSelectedCompetitors.length === 0 && this.props.loadCompetitorsCompetitors.length > 0) {
      // preselect first competitor (when navigating from followers explorer, for example)
      this.props.selectSingleCompetitor(this.props.loadCompetitorsCompetitors.filter(x => x.userPk)[0].userPk);
    } else if (
      prevProps.followersExplorerSelectedCompetitors !== this.props.followersExplorerSelectedCompetitors
      && this.props.followersExplorerSelectedCompetitors.length > 0
    ) {
      // if selected competitors are changed, reload content
      // TODO(optimization): load only if selected competitors changed (when navigating here, then to other page and then back here without changing selected competitors)
      this.props.loadFollowers();
      this.setState({ pageNumber: 0 });
    }
  }

  componentDidMount(): void {
    if (this.props.followersExplorerSelectedCompetitors.length === 0 && this.props.loadCompetitorsCompetitors.length > 0) {
      // preselect first competitor (when navigating from followers explorer, for example)
      this.props.selectSingleCompetitor(this.props.loadCompetitorsCompetitors.filter(x => x.userPk)[0].userPk);
    } else if (this.props.loadCompetitorsCompetitors.length === 0) {
      // if competitors list is not loaded - load it (when navigating directly)
      this.props.loadCompetitors();
    } else {
      // when competitors are loaded and selected - load content
      this.props.loadFollowers();
      this.setState({ pageNumber: 0 });
    }
  }

  handleVerifiedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setVerifiedOnly(event.target.checked);
  };

  render(): React.ReactElement<FollowersExplorerProps, React.JSXElementConstructor<FollowersExplorerState>> {
    const { classes } = this.props;

    return (
      <Container>
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
                <Box my={2}>
                  <div style={{
                    fontSize: 34,
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                    letterSpacing: -0.23,
                    color: '#1f2933',
                  }}>
                    Follower Insights
                  </div>
                </Box>

                <Box my={2} style={{
                  borderRadius: 4,
                  border: 'solid 1.2px #f1f5f8',
                }}>
                  <div style={{
                    padding: 32,
                  }}>
                    <div style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      letterSpacing: -0.13,
                      color: '#1f2933',
                      marginBottom: 24,
                    }}>
                      Select competitors:
                    </div>
                    <div id="alex-chips" style={{
                      marginLeft: -8,
                      marginRight: -8,
                    }}>
                      {this.props.loadCompetitorsCompetitors
                        .filter((competitor: Competitor) => competitor.userPk !== '') // handle queued competitors
                        // TODO(duplicate): create single component
                        .map((competitor, index) => {
                            const isSelected = this.props.followersExplorerSelectedCompetitors.indexOf(competitor.userPk) !== -1;
                            const props: ChipProps = {
                              color: isSelected ? 'primary' : 'default',
                            };
                            if (isSelected) {
                              props.onDelete = () => {
                                this.props.unselectCompetitor(competitor.userPk);
                              };
                              props.label = competitor.username;
                            } else {
                              props.onClick = () => {
                                this.props.selectCompetitor(competitor.userPk);
                              };
                              props.label = <>{competitor.username}&nbsp;&nbsp;<IconAdd /></>;
                            }
                            return (
                              <Chip
                                {...props}
                                className={classes.chip}
                                key={index}
                                deleteIcon={<IconClose />}
                                avatar={<Avatar alt={competitor.username} src={competitor.profilePicUrl} />}
                              />
                            );
                          },
                        )}
                    </div>
                  </div>
                </Box>
                <Box mb={2} hidden>
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
                    <LinearProgress
                      className={classes.loader}
                    />
                    :
                    this.props.loadFollowersError ?
                      <Box my={2}>
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
                        <InfiniteScroll
                          pageStart={0}
                          loadMore={() => this.setState({ pageNumber: this.state.pageNumber + 1 })}
                          hasMore={this.state.pageNumber * followersPerPage < this.props.loadFollowersFollowers.length}
                          loader={
                            <LinearProgress
                              key={1}
                              className={classes.loader}
                            />
                          }
                        >
                          <List
                            key={0}
                          >
                            {
                              this.props.loadFollowersFollowers
                                .sort((a, b) => b.following.length - a.following.length)
                                .filter((follower: Follower) =>
                                  this.props.followersExplorerVerifiedOnly ? follower.isVerified : true)
                                .slice(0, this.state.pageNumber * followersPerPage)
                                .map((follower: Follower, index) =>
                                  <React.Fragment
                                    key={index}
                                  >
                                    <FollowerItemConnected
                                      follower={follower}
                                    />
                                  </React.Fragment>,
                                )}
                          </List>
                        </InfiniteScroll>
                        :
                        <Box my={2}>
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
              </React.Fragment>
              :
              <Typography
                variant="h5"
                gutterBottom
                className={classes.noCompetitorsFound}
              >
                No competitors found, <Button
                variant="outlined"
                onClick={() => this.props.addCompetitorShowModal()}
              >
                <AddIcon />
                add new competitor
              </Button> first.
              </Typography>
        }
      </Container>
    );
  }
}

export const FollowersExplorerConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(FollowersExplorer));
