import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import GlobalState, { Competitor } from '../types/GlobalState';
import { loadCompetitors } from '../actions/loadCompetitors';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  createStyles,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import { grey, red } from '@material-ui/core/colors';
import { selectCompetitor, selectSingleCompetitor, setVerifiedOnly, unselectCompetitor } from '../actions';
import { ChipProps } from '@material-ui/core/Chip';
import { loadContent } from '../actions/loadContent';
import { ContentItemConnected } from './ContentItem';
import InfiniteScroll from 'react-infinite-scroller';
import AddIcon from '@material-ui/icons/Add';
import { addCompetitorShowModal } from '../actions/addCompetitor';
import './Content.scss';
import { ReactComponent as IconClose } from '../icons/icon-close.svg';
import { ReactComponent as IconAdd } from '../icons/icon-add.svg';
import { differenceInCalendarWeeks } from 'date-fns';

const styles = (theme: Theme) =>
  createStyles({
    noCompetitorsFound: {
      color: grey[600],
    },
    noContentsFound: {
      color: grey[600],
    },
    errorMessage: {
      color: red[900],
    },
    chip: {
      margin: theme.spacing(1),
      fontWeight: 'bold',
    },
    loader: {
      marginTop: theme.spacing(2),
    },
  });

const mapStateToProps = ({ loadCompetitors, contentExplorer, loadContent }: GlobalState) => ({
  loadCompetitorsError: loadCompetitors.error,
  loadCompetitorsCompetitors: loadCompetitors.competitors,
  loadCompetitorsLoading: loadCompetitors.loading,
  contentExplorerSelectedCompetitors: contentExplorer.selectedCompetitors,
  loadContentError: loadContent.error,
  loadContentContents: loadContent.content,
  loadContentLoading: loadContent.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      loadCompetitors,
      selectCompetitor,
      selectSingleCompetitor,
      unselectCompetitor,
      loadContent,
      setVerifiedOnly,
      addCompetitorShowModal,
    },
    dispatch,
  );

export type ContentExplorerProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    noContentsFound: string,
    noCompetitorsFound: string,
    errorMessage: string,
    chip: string,
    loader: string,
  },
};

type ContentExplorerState = {
  pageNumber: number,
  sort: SortContent,
}

const postsPerPage = 9;

enum SortContent {
  DATE_DESCENDING,
  DATE_ASCENDING,
  ENGAGEMENT_RATE_DESCENDING,
  ENGAGEMENT_RATE_ASCENDING,
  LIKES_DESCENDING,
  LIKES_ASCENDING,
  COMMENTS_DESCENDING,
  COMMENTS_ASCENDING,
}

class ContentExplorer extends Component<ContentExplorerProps, ContentExplorerState> {
  state = {
    pageNumber: 0,
    sort: SortContent.DATE_DESCENDING,
  };

  componentDidUpdate(prevProps: ContentExplorerProps) {
    // TODO: unselect deleted competitors (or validate that they are getting unselected automatically)
    // TODO(repetition): think about merging this with componentDidMount to eliminate repetition
    if (this.props.contentExplorerSelectedCompetitors.length === 0 && this.props.loadCompetitorsCompetitors.length > 0) {
      // preselect first competitor (when navigating from followers explorer, for example)
      this.props.selectSingleCompetitor(this.props.loadCompetitorsCompetitors.filter(x => x.userPk)[0].userPk);
    } else if (
      prevProps.contentExplorerSelectedCompetitors !== this.props.contentExplorerSelectedCompetitors
      && this.props.contentExplorerSelectedCompetitors.length > 0
    ) {
      // if selected competitors are changed, reload content
      this.props.loadContent();
      this.setState({ pageNumber: 0 });
    }
  }

  componentDidMount(): void {
    if (this.props.contentExplorerSelectedCompetitors.length === 0 && this.props.loadCompetitorsCompetitors.length > 0) {
      // preselect first competitor (when navigating from followers explorer, for example)
      this.props.selectSingleCompetitor(this.props.loadCompetitorsCompetitors.filter(x => x.userPk)[0].userPk);
    } else if (this.props.loadCompetitorsCompetitors.length === 0) {
      // if competitors list is not loaded - load it (when navigating directly)
      this.props.loadCompetitors();
    } else {
      // when competitors are loaded and selected - load content
      // TODO(optimization): load only if selected competitors changed (when navigating here, then to other page and then back here without changing selected competitors)
      this.props.loadContent();
      this.setState({ pageNumber: 0 });
    }
  }

  postsThisWeek(): number {
    return this.props.loadContentContents.filter(content => differenceInCalendarWeeks(new Date(), new Date(content.timestamp * 1000)) < 1).length;
  }

  render(): React.ReactElement<ContentExplorerProps, React.JSXElementConstructor<ContentExplorerState>> {
    const { classes } = this.props;
    const { sort, pageNumber } = this.state;

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
              <>
                <Box my={2}>
                  <div style={{
                    fontSize: 34,
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                    letterSpacing: -0.23,
                    color: '#1f2933',
                  }}>
                    Content
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
                            const isSelected = this.props.contentExplorerSelectedCompetitors.indexOf(competitor.userPk) !== -1;
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
                  <div style={{
                    backgroundColor: '#f1f5f8',
                    paddingTop: 20,
                    paddingBottom: 20,
                    paddingLeft: 32,
                    paddingRight: 32,
                  }}>
                    <div style={{
                      marginTop: -30,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{
                        marginTop: 30,
                        marginRight: 20,
                      }}>
                        <div style={{
                          fontSize: 14,
                          lineHeight: 1.86,
                          letterSpacing: -0.28,
                          color: '#3e4c59',
                        }}>
                          selected competitors have:
                        </div>
                        <div style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          letterSpacing: -0.33,
                          color: '#1f2933',
                        }}>
                          {this.postsThisWeek()} posts this week
                        </div>
                      </div>

                      <FormControl style={{
                        minWidth: 120,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        borderRadius: 4,
                        border: 'solid 1px #d1e2f5',
                        marginTop: 30,
                      }}>
                        <InputLabel htmlFor="sort" style={{
                          position: 'static',
                          fontSize: 15,
                          letterSpacing: -0.1,
                          color: '#3e4c59',
                          transform: 'none',
                          marginLeft: 10,
                          marginRight: 6,
                        }}>sort by</InputLabel>
                        <Select
                          autoWidth
                          value={sort}
                          onChange={({ target }) => {
                            this.setState({ sort: target.value as SortContent });
                          }}
                          inputProps={{
                            name: 'sort',
                            id: 'sort',
                          }}
                        >
                          <MenuItem value={SortContent.DATE_DESCENDING}>Date: New first</MenuItem>
                          <MenuItem value={SortContent.DATE_ASCENDING}>Date: Old first</MenuItem>
                          <Divider />
                          <MenuItem value={SortContent.ENGAGEMENT_RATE_DESCENDING}>Engagement rate: High to
                            Low</MenuItem>
                          <MenuItem value={SortContent.ENGAGEMENT_RATE_ASCENDING}>Engagement rate: Low to
                            High</MenuItem>
                          <Divider />
                          <MenuItem value={SortContent.LIKES_DESCENDING}>Likes: High to Low</MenuItem>
                          <MenuItem value={SortContent.LIKES_ASCENDING}>Likes: Low to High</MenuItem>
                          <Divider />
                          <MenuItem value={SortContent.COMMENTS_DESCENDING}>Comments: High to Low</MenuItem>
                          <MenuItem value={SortContent.COMMENTS_ASCENDING}>Comments: Low to High</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </Box>
                <Box my={2}>
                  {
                    this.props.loadContentLoading ?
                      <LinearProgress />
                      :
                      this.props.loadContentError ?
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.errorMessage}
                        >
                          {this.props.loadContentError}
                        </Typography>
                        :
                        this.props.loadContentContents.length > 0 ?
                          <InfiniteScroll
                            pageStart={0}
                            loadMore={() => this.setState({ pageNumber: pageNumber + 1 })}
                            hasMore={pageNumber * postsPerPage < this.props.loadContentContents.length}
                            loader={
                              <LinearProgress
                                key={1}
                                className={classes.loader}
                              />
                            }
                          >
                            <Grid
                              key={0}
                              container
                              spacing={2}
                            >
                              {
                                this.props.loadContentContents
                                  .sort((a, b) => {
                                    switch (sort) {
                                      case SortContent.ENGAGEMENT_RATE_DESCENDING:
                                        return b.engagementRate - a.engagementRate;
                                      case SortContent.COMMENTS_DESCENDING:
                                        return b.commentCount - a.commentCount;
                                      case SortContent.LIKES_DESCENDING:
                                        return b.likeCount - a.likeCount;
                                      case SortContent.ENGAGEMENT_RATE_ASCENDING:
                                        return a.engagementRate - b.engagementRate;
                                      case SortContent.COMMENTS_ASCENDING:
                                        return a.commentCount - b.commentCount;
                                      case SortContent.LIKES_ASCENDING:
                                        return a.likeCount - b.likeCount;
                                      case SortContent.DATE_ASCENDING:
                                        return a.timestamp - b.timestamp;
                                      case SortContent.DATE_DESCENDING:
                                      default:
                                        return b.timestamp - a.timestamp;
                                    }
                                  })
                                  .slice(0, pageNumber * postsPerPage)
                                  .map((content, index) =>
                                    <React.Fragment
                                      key={index}
                                    >
                                      <ContentItemConnected
                                        content={content}
                                      />
                                    </React.Fragment>,
                                  )
                              }
                            </Grid>
                          </InfiniteScroll>
                          :
                          <Typography
                            color="textSecondary"
                            variant="h5"
                            gutterBottom
                            className={classes.noContentsFound}
                          >
                            No content found.
                          </Typography>
                  }
                </Box>
              </>
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

export const ContentExplorerConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ContentExplorer));
