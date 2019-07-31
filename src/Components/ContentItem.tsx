import React, { Component } from "react";
import {
  Card,
  CardContent,
  Chip,
  createStyles,
  Divider,
  Grid,
  IconButton,
  Link,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Favorite, Link as LinkIcon, Message, Place, RemoveRedEye } from "@material-ui/icons";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { Content } from "../reducers/loadContent";
import { blue, green, grey, orange, pink, red, yellow } from "@material-ui/core/colors";
import copy from "copy-to-clipboard";
import { ContentItemMedia } from "./ContentItemMedia";

const styles = (theme: Theme) =>
  createStyles({
    chip: {
      color: grey[50],
    },
    chipLink: {
      display: "inline-block",
      color: grey[50],
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    chipIcon: {
      color: grey[50],
    },
    caption: {
      marginBottom: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }
  });

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {},
    dispatch
  );

export type ContentItemProps =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {
  content: Content
  classes: {
    chip: string,
    chipLink: string,
    chipIcon: string,
    caption: string,
    divider: string,
  }
};

type ContentItemState =
  & {
  linkCopied: boolean
};

const formatNumber = (number: number): string => {
  if (number < 999) return number.toString();
  if (number < 999999) return `${Math.round(number / 1000)} K`;
  return `${Math.round(number / 1000000)} M`;
};

const getEngagementRateBackgroundColor = (engagementRate: number) => {
  if (engagementRate > 5) return green[500];
  if (engagementRate > 2) return yellow[500];
  return red[500];
};

const getEngagementRateTextColor = (engagementRate: number) => {
  if (engagementRate > 5) return grey[50];
  if (engagementRate > 2) return grey[800];
  return grey[50];
};

class ContentItem extends Component<ContentItemProps, ContentItemState> {
  state = {
    linkCopied: false
  };

  render(): React.ReactElement<ContentItemProps, React.JSXElementConstructor<ContentItemState>> {
    const { classes } = this.props;

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <ContentItemMedia
            content={this.props.content.content}
          />
          <CardContent>
            <Typography
              className={classes.caption}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {this.props.content.caption}
            </Typography>
            {
              this.props.content.hashtags.map((hashtag, index) =>
                <Link
                  key={index}
                  className={classes.chipLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.instagram.com/explore/tags/${hashtag}/`}>
                  <Chip
                    clickable
                    style={{ backgroundColor: blue[500] }}
                    className={classes.chip}
                    size="small"
                    key={index}
                    label={`#${hashtag}`}
                  />
                </Link>
              )
            }
            {
              this.props.content.mentions.map((mention, index) =>
                <Link
                  key={index}
                  className={classes.chipLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.instagram.com/${mention}/`}>
                  <Chip
                    clickable
                    style={{ backgroundColor: orange[500] }}
                    className={classes.chip}
                    size="small"
                    key={index}
                    label={`@${mention}`}
                  />
                </Link>
              )
            }
            {
              this.props.content.location &&
              <Link
                className={classes.chipLink}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${this.props.content.location.lat},${this.props.content.location.lng}`}>
                <Chip
                  clickable
                  style={{ backgroundColor: pink[500] }}
                  className={classes.chip}
                  size="small"
                  label={`${this.props.content.location.name}`}
                  icon={<Place className={classes.chipIcon} />}
                />
              </Link>
            }
            <Divider className={classes.divider} />
            <Grid
              container
              alignItems={"center"}
              alignContent={"space-between"}
              justify={"space-between"}
            >
              <Grid item>
                {
                  this.props.content.engagementRate &&
                  <Tooltip title={"Engagement rate"}>
                    <Chip
                      style={{
                        backgroundColor: getEngagementRateBackgroundColor(this.props.content.engagementRate),
                        color: getEngagementRateTextColor(this.props.content.engagementRate),
                      }}
                      size="small"
                      label={`${this.props.content.engagementRate} %`}
                    />
                  </Tooltip>
                }
              </Grid>
              <Grid item>
                {this.props.content.likeCount !== null &&
                <Tooltip title={`${this.props.content.likeCount} likes`}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <Favorite
                      fontSize="inherit"
                      color="inherit"
                      style={{ verticalAlign: "middle" }}
                    />
                    <span
                      style={{ verticalAlign: "middle" }}
                    > {formatNumber(this.props.content.likeCount)}</span>
                  </Typography>
                </Tooltip>
                }
              </Grid>
              <Grid item>
                {this.props.content.commentCount !== null &&
                <Tooltip title={`${this.props.content.commentCount} comments`}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <Message
                      fontSize="inherit"
                      color="inherit"
                      style={{ verticalAlign: "middle" }}
                    />
                    <span
                      style={{ verticalAlign: "middle" }}
                    > {formatNumber(this.props.content.commentCount)}</span>
                  </Typography>
                </Tooltip>
                }
              </Grid>
              <Grid item>
                {this.props.content.viewCount !== null &&
                <Tooltip title={`${this.props.content.viewCount} views`}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <RemoveRedEye
                      fontSize="inherit"
                      color="inherit"
                      style={{ verticalAlign: "middle" }}
                    />
                    <span
                      style={{ verticalAlign: "middle" }}
                    > {formatNumber(this.props.content.viewCount)}</span>
                  </Typography>
                </Tooltip>
                }
              </Grid>
              <Grid item>
                {this.props.content.itemUrl !== null &&
                <Tooltip title={this.state.linkCopied ? "Link copied!" : "Copy media link"}>
                  <Link
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => event.preventDefault()}
                    href={this.props.content.itemUrl}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        copy(this.props.content.itemUrl, {
                          message: 'Press #{key} to copy',
                          format: "text/plain",
                        });
                        this.setState({ linkCopied: true });
                      }}
                    >
                      <LinkIcon />
                    </IconButton>
                  </Link>
                </Tooltip>}
              </Grid>
            </Grid>
          </CardContent>
          {/*<CardActions disableSpacing>*/}
          {/*  <IconButton aria-label="add to favorites">*/}
          {/*    <Favorite />*/}
          {/*  </IconButton>*/}
          {/*  <IconButton aria-label="share">*/}
          {/*    <Share />*/}
          {/*  </IconButton>*/}
          {/*</CardActions>*/}
        </Card>
      </Grid>
    );
  }
}

export const ContentItemConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ContentItem));
