import React, { Component } from 'react';
import { MediaItem, MediaType } from '../reducers/loadContent';

export type ContentItemMediaItemProps =
  & {
  media: MediaItem
  slickControlsHack: boolean
};

type ContentItemMediaItemState =
  & {
  linkCopied: boolean,
  showVideo: boolean,
};

export class ContentItemMediaItem extends Component<ContentItemMediaItemProps, ContentItemMediaItemState> {
  state = {
    linkCopied: false,
    showVideo: false,
    // TODO: save video volume globally
  };

  // TODO: get rid of this hack (i.e., replace slick with other lib)
  slickControlsHack = this.props.slickControlsHack ? {
    disablePictureInPicture: true,
    controlsList: 'nodownload',
  } : {};

  render(): React.ReactElement<ContentItemMediaItemProps, React.JSXElementConstructor<ContentItemMediaItemState>> {
    switch (this.props.media.type) {
      case MediaType.PHOTO:
        return <div
          style={{
            paddingTop: '100%',
            height: 0,
            position: 'relative',
          }}>
          <div style={{
            backgroundImage: `url(${this.props.media.url})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
          }} />
        </div>;
      case MediaType.VIDEO:
        return <div
          style={{
            paddingTop: '100%',
            height: 0,
            position: 'relative',
          }}>
          {!this.state.showVideo &&
          <React.Fragment>
            <div style={{
              backgroundImage: `url(${this.props.media.coverUrl})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '100%',
            }} />
            <div
              onClick={() => this.setState({ showVideo: true }) /* TODO: pause video on navigation */}
              className={'video'}
            />
          </React.Fragment>
          }
          {this.state.showVideo &&
          <video
            {...this.slickControlsHack}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            controls
            autoPlay
            src={this.props.media.url} />
          }
        </div>;
    }
  }
}
