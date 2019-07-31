import React, { Component } from "react";
import { MediaItem, MediaType } from "../reducers/loadContent";

export type ContentItemMediaItemProps =
  & {
  media: MediaItem
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
    //TODO: save video volume globally
  };

  render(): React.ReactElement<ContentItemMediaItemProps, React.JSXElementConstructor<ContentItemMediaItemState>> {
    switch (this.props.media.type) {
      case MediaType.PHOTO:
        return <div
          style={{
            paddingTop: "100%",
            height: 0,
            position: "relative",
          }}>
          <div style={{
            backgroundImage: `url(${this.props.media.url})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%"
          }} />
        </div>;
      case MediaType.VIDEO:
        //TODO: use cover, don't load the video
        return <div
          style={{
            paddingTop: "100%",
            height: 0,
            position: "relative",
          }}>
          {!this.state.showVideo &&
          <React.Fragment>
            <div style={{
              backgroundImage: `url(${this.props.media.coverUrl})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%"
            }} />
            <div
              onClick={() => this.setState({ showVideo: true })}
              className={"video"}
            />
          </React.Fragment>
          }
          {this.state.showVideo &&
          <video
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
            }}
            controls
            autoPlay
            src={this.props.media.url} />
          }
        </div>;
    }
  }
}
