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
import { loadContent } from "../actions/loadContent";
import { Content } from "../reducers/loadContent";
import { ContentItemConnected, verifiedBadge } from "./ContentItem";

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
    noCompetitorsFound: string,
    errorMessage: string,
    chip: string,
    paper: string,
  },
};

type ContentExplorerState = {}

class ContentExplorer extends Component<ContentExplorerProps, ContentExplorerState> {
  componentDidUpdate(prevProps: ContentExplorerProps) {
    if (prevProps.contentExplorerSelectedCompetitors !== this.props.contentExplorerSelectedCompetitors) {
      this.props.loadContent();
    }
  }

  componentDidMount(): void {
    this.props.loadCompetitors();
    this.props.loadContent();
  }

  handleVerifiedOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setVerifiedOnly(event.target.checked);
  };

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
                    Verified contents {verifiedBadge('span', 'inline-block')}
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
                  {
                    this.props.loadContentLoading ?
                      <Box mx={2} my={2}> {/*TODO: fix a lot of boxes*/}
                        <LinearProgress />
                      </Box>
                      :
                      this.props.loadContentError ?
                        <Box mx={2} my={2}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            className={classes.errorMessage}
                          >
                            {this.props.loadContentError}
                          </Typography>
                        </Box>
                        :
                        this.props.loadContentContents.length > 0 ?
                          <List>
                            {
                              this.props.loadContentContents
                                .map((content: Content, index) =>
                                  <React.Fragment
                                    key={index}
                                  >
                                    <ContentItemConnected
                                      content={content}
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
                              className={classes.noContentsFound}
                            >
                              No verified contents found.
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

export const ContentExplorerConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ContentExplorer));
