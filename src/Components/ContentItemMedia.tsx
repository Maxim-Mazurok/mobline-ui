import React, { Component } from "react";
import { Content, MediaItem } from "../reducers/loadContent";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./ContentItemMedia.scss";
import { ContentItemMediaItem } from "./ContentItemMediaItem";

export type ContentItemMediaProps =
  & {
  content: Content['content']
};

type ContentItemMediaState =
  & {};

export class ContentItemMedia extends Component<ContentItemMediaProps, ContentItemMediaState> {
  render(): React.ReactElement<ContentItemMediaProps, React.JSXElementConstructor<ContentItemMediaState>> {
    const settings = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      // arrows: true,
      cssEase: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    };
    return (
      this.props.content.length === 0 ? <React.Fragment />
        :
        this.props.content.length > 0 ?
          <Slider
            lazyLoad={"progressive"}
            {...settings}>
            {
              this.props.content.map((media: MediaItem, index) =>
                <React.Fragment key={index}>
                  <ContentItemMediaItem media={media} />
                </React.Fragment>
              )
            }
          </Slider>
          :
          <ContentItemMediaItem media={this.props.content[0]} />
    );
  }
}
