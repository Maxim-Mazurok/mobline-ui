import React, { Component } from 'react';
import { Content, MediaItem } from '../reducers/loadContent';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import './ContentItemMedia.scss';
import { ContentItemMediaItem } from './ContentItemMediaItem';
import { createStyles, Theme, Typography, withStyles } from '@material-ui/core';

export type ContentItemMediaProps =
  & {
  content: Content['content']
} & {
  classes: {
    caption: string
  }
};

type ContentItemMediaState =
  & {};

const styles = (theme: Theme) =>
  createStyles({
    caption: {
      margin: theme.spacing(2),
      marginBottom: 0,
    },
  });

export class ContentItemMedia extends Component<ContentItemMediaProps, ContentItemMediaState> {
  render(): React.ReactElement<ContentItemMediaProps, React.JSXElementConstructor<ContentItemMediaState>> {
    const { classes } = this.props;
    const settings = {
      infiniteLoop: true,
      showThumbs: false,
      showStatus: false,
    };
    return (
      this.props.content.length === 0 ? <React.Fragment />
        :
        this.props.content.length > 1 ?
          <Carousel
            {...settings}>
            {
              this.props.content.map((media: MediaItem, index) =>
                <React.Fragment
                  key={index}
                >
                  <ContentItemMediaItem
                    slickControlsHack={true}
                    media={media}
                  />
                  {media.text && <Typography
                    className={classes.caption}
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >{media.text}</Typography>}
                </React.Fragment>,
              )
            }
          </Carousel>
          :
          <ContentItemMediaItem
            slickControlsHack={false}
            media={this.props.content[0]}
          />
    );
  }
}

export const ContentItemMediaWithStyles = withStyles(styles)(ContentItemMedia);
