import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import GlobalState from "../types/GlobalState";
import { loadCompetitors } from "../actions/loadCompetitors";
import {
  Avatar,
  Box,
  Chip,
  createStyles,
  Grid,
  LinearProgress,
  Paper,
  StyledComponentProps,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import { grey, red } from "@material-ui/core/colors";
import { selectCompetitor, selectSingleCompetitor, setVerifiedOnly, unselectCompetitor } from "../actions";
import { ChipProps } from "@material-ui/core/Chip";
import { loadContent } from "../actions/loadContent";
import { ContentItemConnected } from "./ContentItem";
import InfiniteScroll from 'react-infinite-scroller';

const styles = (theme: Theme) =>
  createStyles({
    noContentsFound: {
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
    },
    dispatch
  );

export type ContentExplorerProps =
  ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    noContentsFound: string,
    errorMessage: string,
    chip: string,
    paper: string,
    loader: string,
  },
};

type ContentExplorerState = {
  pageNumber: number,
}

const postsPerPage = 9;

class ContentExplorer extends Component<ContentExplorerProps, ContentExplorerState> {
  state = {
    pageNumber: 0
  };

  componentDidUpdate(prevProps: ContentExplorerProps) {
    // TODO(repetition): think about merging this with componentDidMount to eliminate repetition
    if (this.props.contentExplorerSelectedCompetitors.length === 0 && this.props.loadCompetitorsCompetitors.length > 0) {
      // preselect first competitor (when navigating from followers explorer, for example)
      this.props.selectSingleCompetitor(this.props.loadCompetitorsCompetitors[0].userPk);
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
      this.props.selectSingleCompetitor(this.props.loadCompetitorsCompetitors[0].userPk);
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

  render(): React.ReactElement<ContentExplorerProps, React.JSXElementConstructor<ContentExplorerState>> {
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
                    Content
                  </Typography>
                </Box>
                <Paper
                  className={classes.paper}
                >
                  <Box mx={1} my={2}>
                    {this.props.loadCompetitorsCompetitors.map((competitor, index) => {
                        const isSelected = this.props.contentExplorerSelectedCompetitors.indexOf(competitor.userPk) !== -1;
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
                  <Box mx={2} my={2}>
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
                              loadMore={() => this.setState({ pageNumber: this.state.pageNumber + 1 })}
                              hasMore={this.state.pageNumber * postsPerPage < this.props.loadContentContents.length}
                              loader={
                                <LinearProgress
                                  className={classes.loader}
                                />
                              }
                            >
                              <Grid container spacing={2}>
                                {
                                  this.props.loadContentContents
                                    .slice(0, this.state.pageNumber * postsPerPage)
                                    .map((content, index) =>
                                      <React.Fragment
                                        key={index}
                                      >
                                        <ContentItemConnected
                                          content={content}
                                        />
                                      </React.Fragment>
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
                </Paper>
              </React.Fragment>
              :
              <Typography
                variant="h5"
                gutterBottom
                className={classes.noContentsFound}
              >
                No competitors found, add them first.
              </Typography>
        }
      </React.Fragment>
    );
  }
}

export const ContentExplorerConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ContentExplorer));
