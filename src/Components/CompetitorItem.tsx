import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Competitor } from '../types/GlobalState';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { selectSingleCompetitor } from '../actions';
import { RouteComponentProps, withRouter } from 'react-router';
import { deleteCompetitor } from '../actions/deleteCompetitor';
import { CompetitorItemDesign, Progress } from './CompetitorItemDesign';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      selectSingleCompetitor,
      deleteCompetitor,
    },
    dispatch,
  );

export type CompetitorItemProps =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {
  competitor: Competitor,
};

type CompetitorItemState =
  & {};

class CompetitorItem extends Component<RouteComponentProps<{}> & CompetitorItemProps, CompetitorItemState> {
  getFollowersListParsedProgress = (): number => {
    if (this.props.competitor.hasOwnProperty('parseFollowersListProgress') && this.props.competitor.parseFollowersListProgress !== undefined) {
      return this.props.competitor.parseFollowersListProgress.done / this.props.competitor.parseFollowersListProgress.total * 100;
    }
    return 0;
  };

  getFollowersListParsedProgressDetailed = (): string => {
    if (this.props.competitor.hasOwnProperty('parseFollowersListProgress') && this.props.competitor.parseFollowersListProgress !== undefined) {
      return `${this.props.competitor.parseFollowersListProgress.done} / ${this.props.competitor.parseFollowersListProgress.total} followers parsed`;
    }
    return '';
  };

  getPostsParsedProgress = (): number => {
    if (this.props.competitor.hasOwnProperty('parsePostsProgress') && this.props.competitor.parsePostsProgress !== undefined) {
      return this.props.competitor.parsePostsProgress.done / this.props.competitor.parsePostsProgress.total * 100;
    }
    return 0;
  };

  getPostsParsedProgressDetailed = (): string => {
    if (this.props.competitor.hasOwnProperty('parsePostsProgress') && this.props.competitor.parsePostsProgress !== undefined) {
      return `${this.props.competitor.parsePostsProgress.done} / ${this.props.competitor.parsePostsProgress.total} pages parsed`;
    }
    return '';
  };

  getFeedAdsParsedProgressDetailed = (): string => {
    if (this.props.competitor.hasOwnProperty('parseFeedAdsProgress') && this.props.competitor.parseFeedAdsProgress !== undefined) {
      return `${this.props.competitor.parseFeedAdsProgress.done} ads parsed`;
    }
    return '';
  };

  parsingFollowersList = () =>
    (
      (this.props.competitor.hasOwnProperty('parseFollowersListStarted') && this.props.competitor.parseFollowersListStarted)
      || this.getFollowersListParsedProgress() > 0
    ) &&
    !(this.props.competitor.hasOwnProperty('parseFollowersListFinished') && this.props.competitor.parseFollowersListFinished);

  parsingPosts = () =>
    (
      (this.props.competitor.hasOwnProperty('parsePostsStarted') && this.props.competitor.parsePostsStarted)
      || this.getPostsParsedProgress() > 0
    ) &&
    !(this.props.competitor.hasOwnProperty('parsePostsFinished') && this.props.competitor.parsePostsFinished);

  parsingFeedAds = () =>
    (
      (this.props.competitor.hasOwnProperty('parseFeedAdsStarted') && this.props.competitor.parseFeedAdsStarted)
      || this.getFeedAdsParsedProgressDetailed() !== ''
    ) &&
    !(this.props.competitor.hasOwnProperty('parseFeedAdsFinished') && this.props.competitor.parseFeedAdsFinished);

  processing = () =>
    this.parsingFollowersList()
    || this.parsingPosts()
  ;

  render(): React.ReactElement<CompetitorItemProps, React.JSXElementConstructor<CompetitorItemState>> {
    const { competitor, selectSingleCompetitor, deleteCompetitor, history } = this.props;

    const progress: Progress[] = [];

    if (this.parsingFollowersList()) {
      progress.push({
        label: 'Getting followers',
        status: this.getFollowersListParsedProgress() > 0
          ? `${this.getFollowersListParsedProgress().toFixed()}% done`
          : `initializing...`,
        variant: this.getFollowersListParsedProgress() > 0 ? 'determinate' : 'indeterminate',
        tooltip: this.getFollowersListParsedProgressDetailed(),
        value: this.getFollowersListParsedProgress(),
      });
    }

    if (this.parsingPosts()) {
      progress.push({
        label: 'Getting posts',
        status: this.getPostsParsedProgress() > 0
          ? `${this.getPostsParsedProgress().toFixed()}% done`
          : `initializing...`,
        variant: this.getPostsParsedProgress() > 0 ? 'determinate' : 'indeterminate',
        tooltip: this.getPostsParsedProgressDetailed(),
        value: this.getPostsParsedProgress(),
      });
    }

    if (this.processing() && this.parsingFeedAds()) {
      progress.push({
        label: 'Getting feed ads',
        status: this.getFeedAdsParsedProgressDetailed() !== ''
          ? this.getFeedAdsParsedProgressDetailed()
          : `initializing...`,
        variant: 'indeterminate',
        tooltip: this.getFeedAdsParsedProgressDetailed(),
      });
    }

    return (
      <CompetitorItemDesign
        profilePicUrl={competitor.profilePicUrl}
        username={competitor.username}
        posts={competitor.mediaCount}
        followers={competitor.followerCount}
        following={competitor.followingCount}
        progress={progress}
        userPk={competitor.userPk}
        selectSingleCompetitor={selectSingleCompetitor}
        historyPush={history.push}
        deleteCompetitor={deleteCompetitor}
      />
    );
  }
}

export const CompetitorItemConnected = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompetitorItem));
