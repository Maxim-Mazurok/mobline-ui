import React, { Component } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  createStyles,
  Divider,
  Grid,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Favorite, Link as LinkIcon, LocalOffer, Message, OpenInNew, Place, RemoveRedEye } from '@material-ui/icons';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Content, Product } from '../reducers/loadContent';
import { blue, green, grey, orange, pink, red, yellow } from '@material-ui/core/colors';
import copy from 'copy-to-clipboard';
import { ContentItemMediaWithStyles } from './ContentItemMedia';
import { format } from 'date-fns';

const styles = (theme: Theme) =>
  createStyles({
    chip: {
      color: grey[50],
    },
    chipLink: {
      display: 'inline-block',
      color: grey[50],
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    chipIcon: {
      color: grey[50],
    },
    caption: {
      marginBottom: theme.spacing(1),
      color: '#334e68',
    },
    divider: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  });

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {},
    dispatch,
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

export const formatNumber = (number: number): string => {
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

const getPrice = (product: Product) => {
  if (product.discount > 0) {
    return (
      <React.Fragment>
        <Typography
          component="span"
          variant="body2"
          color="textSecondary"
        >
          <del>{product.fullPrice}</del>
        </Typography>
        <span>&nbsp;{product.currentPrice} </span>
        <Chip
          style={{ backgroundColor: grey[100] }}
          size="small"
          label={`−${product.discount}%`}
        />
      </React.Fragment>
    );
  } else {
    return product.currentPrice;
  }
};

class ContentItem extends Component<ContentItemProps, ContentItemState> {
  state = {
    linkCopied: false,
  };

  render(): React.ReactElement<ContentItemProps, React.JSXElementConstructor<ContentItemState>> {
    const { classes, content } = this.props;

    return (
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Card>
          <ContentItemMediaWithStyles
            content={content.content}
          />
          <CardContent>
            <div style={{
              fontSize: 15,
              fontWeight: 'bold',
              lineHeight: 1.3,
              letterSpacing: -0.11,
              color: '#1f2933',
              marginBottom: 4,
            }}>
              {content.username}
            </div>
            <div style={{
              fontSize: 13,
              lineHeight: 1.46,
              letterSpacing: -0.09,
              color: '#3e4c59',
              marginBottom: 16,
            }}>
              {/*{formatRelative(new Date(content.timestamp * 1000), new Date())} // TODO: maybe use relative dates*/}
              {format(new Date(content.timestamp * 1000), 'h:mm a')}
              &nbsp;&nbsp;&nbsp;
              {format(new Date(content.timestamp * 1000), 'd LLLL')}
            </div>
            <Typography
              className={classes.caption}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {content.caption}
            </Typography>
            {
              content.hashtags.map((hashtag, index) =>
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
                </Link>,
              )
            }
            {
              content.mentions.map((mention, index) =>
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
                </Link>,
              )
            }
            {
              content.location &&
              <Link
                className={classes.chipLink}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${content.location.lat},${content.location.lng}`}>
                <Chip
                  clickable
                  style={{ backgroundColor: pink[500] }}
                  className={classes.chip}
                  size="small"
                  label={`${content.location.name}`}
                  icon={<Place className={classes.chipIcon} />}
                />
              </Link>
            }
            {
              content.products.length > 0 &&
              content.products.map((product, index) =>
                <ListItem
                  key={index}
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar alt="Travis Howard" src={product.mainImage} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <span>{product.name} </span>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={product.externalUrl}
                        >Buy&nbsp;<OpenInNew
                          fontSize={'inherit'}
                        /></Link>
                      </React.Fragment>
                    }
                    secondary={
                      <Typography
                        component="div"
                        variant="body2"
                        color="textPrimary"
                      >
                        <LocalOffer
                          fontSize={'inherit'}
                        />
                        <span>&nbsp;{getPrice(product)}</span>
                      </Typography>
                    }
                  />
                </ListItem>,
              )
            }
            <Divider className={classes.divider} />
            <Grid
              container
              alignItems={'center'}
              alignContent={'space-between'}
              justify={'space-between'}
            >
              <Grid item>
                {
                  content.engagementRate !== undefined &&
                  <Tooltip title={'Engagement rate'}>
                    <Chip
                      style={{
                        backgroundColor: getEngagementRateBackgroundColor(content.engagementRate),
                        color: getEngagementRateTextColor(content.engagementRate),
                      }}
                      size="small"
                      label={`${content.engagementRate} %`}
                    />
                  </Tooltip>
                }
              </Grid>
              <Grid item>
                {content.likeCount !== null &&
                <Tooltip title={`${content.likeCount} likes`}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Favorite
                      fontSize="inherit"
                      color="inherit"
                    />
                    <span>&nbsp;{formatNumber(content.likeCount)}</span>
                  </Typography>
                </Tooltip>
                }
              </Grid>
              <Grid item>
                {content.commentCount !== null &&
                <Tooltip title={`${content.commentCount} comments`}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Message
                      fontSize="inherit"
                      color="inherit"
                    />
                    <span>&nbsp;{formatNumber(content.commentCount)}</span>
                  </Typography>
                </Tooltip>
                }
              </Grid>
              <Grid item>
                {content.viewCount !== null &&
                <Tooltip title={`${content.viewCount} views`}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <RemoveRedEye
                      fontSize="inherit"
                      color="inherit"
                    />
                    <span>&nbsp;{formatNumber(content.viewCount)}</span>
                  </Typography>
                </Tooltip>
                }
              </Grid>
              <Grid item>
                {content.itemUrl !== null &&
                <Tooltip title={this.state.linkCopied ? 'Link copied!' : 'Copy media link'}>
                  <Link
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => event.preventDefault()}
                    href={content.itemUrl}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        copy(content.itemUrl, {
                          message: 'Press #{key} to copy',
                          format: 'text/plain',
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
          {/*<CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <Favorite />
            </IconButton>
            <IconButton aria-label="share">
              <Share />
            </IconButton>
          </CardActions>*/}
        </Card>
      </Grid>
    );
  }
}

export const ContentItemConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ContentItem));
