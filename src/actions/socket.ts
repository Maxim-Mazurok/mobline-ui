import { Dispatch } from 'redux';
import GlobalState, { Competitor } from '../types/GlobalState';
import {
  AddCompetitorAction,
  addCompetitorSetUsername,
  addCompetitorShowModal,
  addCompetitorSuccess,
  IGUsername,
} from './addCompetitor';
import { WS_HEARTBEAT, WS_HOST, WS_PORT, WS_SCHEME } from './index';
import { showSnackbarAction, SnackbarAction, SnackbarType } from './snackbar';
import { LoadCompetitorsAction } from './loadCompetitors';
import { ThunkDispatch } from 'redux-thunk';

export const WS_SUBSCRIBE = 'wsSubscribe';
export type WS_SUBSCRIBE = 'wsSubscribe';
export const WS_ADD_COMPETITOR = 'wsAddCompetitor';
export type WS_ADD_COMPETITOR = 'wsAddCompetitor';

export const WS_ADD_COMPETITOR_CALLBACK = 'wsAddCompetitorCallback';
export type WS_ADD_COMPETITOR_CALLBACK = 'wsAddCompetitorCallback';
export const WS_ADD_COMPETITOR_CALLBACK_QUEUED = 'wsAddCompetitorCallbackQueued';
export type WS_ADD_COMPETITOR_CALLBACK_QUEUED = 'wsAddCompetitorCallbackQueued';

export const WS_OPENED = 'wsOpened';
export type WS_OPENED = 'wsOpened';

export const WS_PARSE_FOLLOWERS_LIST_STARTED = 'parse-followers-list-started';
export type WS_PARSE_FOLLOWERS_LIST_STARTED = 'parse-followers-list-started';
export const WS_PARSE_FOLLOWERS_LIST_UPDATED = 'parse-followers-list-updated';
export type WS_PARSE_FOLLOWERS_LIST_UPDATED = 'parse-followers-list-updated';
export const WS_PARSE_FOLLOWERS_LIST_FINISHED = 'parse-followers-list-finished';
export type WS_PARSE_FOLLOWERS_LIST_FINISHED = 'parse-followers-list-finished';

export const WS_PARSE_POSTS_STARTED = 'parse-posts-started';
export type WS_PARSE_POSTS_STARTED = 'parse-posts-started';
export const WS_PARSE_POSTS_UPDATED = 'parse-posts-updated';
export type WS_PARSE_POSTS_UPDATED = 'parse-posts-updated';
export const WS_PARSE_POSTS_FINISHED = 'parse-posts-finished';
export type WS_PARSE_POSTS_FINISHED = 'parse-posts-finished';

export const WS_PARSE_FEED_ADS_STARTED = 'parse-feed-ads-started';
export type WS_PARSE_FEED_ADS_STARTED = 'parse-feed-ads-started';
export const WS_PARSE_FEED_ADS_UPDATED = 'parse-feed-ads-updated';
export type WS_PARSE_FEED_ADS_UPDATED = 'parse-feed-ads-updated';
export const WS_PARSE_FEED_ADS_FINISHED = 'parse-feed-ads-finished';
export type WS_PARSE_FEED_ADS_FINISHED = 'parse-feed-ads-finished';

export const wsOpened = (isOpened: boolean): {
  type: WS_OPENED,
  payload: boolean,
} => ({
  type: WS_OPENED,
  payload: isOpened,
});

export const wsSubscribe = (customerId: GlobalState['user']['customerId']): {
  type: WS_SUBSCRIBE,
  customerId: GlobalState['user']['customerId'],
} => ({
  type: WS_SUBSCRIBE,
  customerId,
});

export const wsAddCompetitor = (competitorUsername: IGUsername): {
  type: WS_ADD_COMPETITOR,
  competitorUsername: IGUsername,
} => ({
  type: WS_ADD_COMPETITOR,
  competitorUsername,
});

export const wsAddCompetitorCallback = (competitor: Competitor): {
  type: WS_ADD_COMPETITOR_CALLBACK,
  payload: Competitor,
} => ({
  type: WS_ADD_COMPETITOR_CALLBACK,
  payload: competitor,
});

export const wsAddCompetitorCallbackQueued = (competitor: Competitor): {
  type: WS_ADD_COMPETITOR_CALLBACK_QUEUED,
  payload: Competitor,
} => ({
  type: WS_ADD_COMPETITOR_CALLBACK_QUEUED,
  payload: competitor,
});

export type ParseActionStarted = {
  userPk: Competitor['userPk'];
}

export type ParseActionUpdated = {
  done: number,
  total: number,
  userPk: Competitor['userPk'];
}

export type ParseActionFinished = {
  finished: boolean,
  userPk: Competitor['userPk'];
}

export const wsParseFollowersListStarted = (data: ParseActionStarted): {
  type: WS_PARSE_FOLLOWERS_LIST_STARTED,
  payload: ParseActionStarted,
} => ({
  type: WS_PARSE_FOLLOWERS_LIST_STARTED,
  payload: data,
});

export const wsParseFollowersListUpdated = (data: ParseActionUpdated): {
  type: WS_PARSE_FOLLOWERS_LIST_UPDATED,
  payload: ParseActionUpdated,
} => ({
  type: WS_PARSE_FOLLOWERS_LIST_UPDATED,
  payload: data,
});

export const wsParseFollowersListFinished = (data: ParseActionFinished): {
  type: WS_PARSE_FOLLOWERS_LIST_FINISHED,
  payload: ParseActionFinished,
} => ({
  type: WS_PARSE_FOLLOWERS_LIST_FINISHED,
  payload: data,
});

export const wsParsePostsStarted = (data: ParseActionStarted): {
  type: WS_PARSE_POSTS_STARTED,
  payload: ParseActionStarted,
} => ({
  type: WS_PARSE_POSTS_STARTED,
  payload: data,
});

export const wsParsePostsUpdated = (data: ParseActionUpdated): {
  type: WS_PARSE_POSTS_UPDATED,
  payload: ParseActionUpdated,
} => ({
  type: WS_PARSE_POSTS_UPDATED,
  payload: data,
});

export const wsParsePostsFinished = (data: ParseActionFinished): {
  type: WS_PARSE_POSTS_FINISHED,
  payload: ParseActionFinished,
} => ({
  type: WS_PARSE_POSTS_FINISHED,
  payload: data,
});

export const wsParseFeedAdsStarted = (data: ParseActionStarted): {
  type: WS_PARSE_FEED_ADS_STARTED,
  payload: ParseActionStarted,
} => ({
  type: WS_PARSE_FEED_ADS_STARTED,
  payload: data,
});

export const wsParseFeedAdsUpdated = (data: ParseActionUpdated): {
  type: WS_PARSE_FEED_ADS_UPDATED,
  payload: ParseActionUpdated,
} => ({
  type: WS_PARSE_FEED_ADS_UPDATED,
  payload: data,
});

export const wsParseFeedAdsFinished = (data: ParseActionFinished): {
  type: WS_PARSE_FEED_ADS_FINISHED,
  payload: ParseActionFinished,
} => ({
  type: WS_PARSE_FEED_ADS_FINISHED,
  payload: data,
});

export type SocketAction =
  | ReturnType<typeof wsOpened>
  | ReturnType<typeof wsSubscribe>
  | ReturnType<typeof wsAddCompetitor>
  | ReturnType<typeof wsAddCompetitorCallback>
  | ReturnType<typeof wsAddCompetitorCallbackQueued>

  | ReturnType<typeof wsParseFollowersListStarted>
  | ReturnType<typeof wsParseFollowersListUpdated>
  | ReturnType<typeof wsParseFollowersListFinished>

  | ReturnType<typeof wsParsePostsStarted>
  | ReturnType<typeof wsParsePostsUpdated>
  | ReturnType<typeof wsParsePostsFinished>

  | ReturnType<typeof wsParseFeedAdsStarted>
  | ReturnType<typeof wsParseFeedAdsUpdated>
  | ReturnType<typeof wsParseFeedAdsFinished>
  ;

const setupSocket = (dispatch: Dispatch<SocketAction | SnackbarAction | AddCompetitorAction> & ThunkDispatch<GlobalState, undefined, LoadCompetitorsAction>): WebSocket => {
  const socket = new WebSocket(`${WS_SCHEME}://${WS_HOST}:${WS_PORT}`);

  socket.onopen = () => {
    dispatch(wsOpened(true));
    if (WS_HEARTBEAT) {
      setInterval(() => {
        socket.send(JSON.stringify({ type: 'wsHeartBeat' }));
      }, 10 * 1000);
    }
  };

  socket.onclose = () => {
    dispatch(wsOpened(false));
    dispatch(showSnackbarAction({
      title: 'Disconnected from server, reload the page',
      type: SnackbarType.INFO,
    }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const type = data.type;
    delete data.type;
    switch (type) {
      case WS_PARSE_FOLLOWERS_LIST_STARTED:
        dispatch(wsParseFollowersListStarted(data));
        break;
      case WS_PARSE_FOLLOWERS_LIST_UPDATED:
        dispatch(wsParseFollowersListUpdated(data));
        break;
      case WS_PARSE_FOLLOWERS_LIST_FINISHED:
        dispatch(wsParseFollowersListFinished(data));
        dispatch(showSnackbarAction({
          title: 'Getting followers list finished',
          type: SnackbarType.INFO,
        }));
        break;
      case WS_PARSE_POSTS_STARTED:
        dispatch(wsParsePostsStarted(data));
        break;
      case WS_PARSE_POSTS_UPDATED:
        dispatch(wsParsePostsUpdated(data));
        break;
      case WS_PARSE_POSTS_FINISHED:
        dispatch(wsParsePostsFinished(data));
        dispatch(showSnackbarAction({
          title: 'Getting posts finished',
          type: SnackbarType.INFO,
        }));
        break;
      case WS_PARSE_FEED_ADS_STARTED:
        dispatch(wsParseFeedAdsStarted(data));
        break;
      case WS_PARSE_FEED_ADS_UPDATED:
        dispatch(wsParseFeedAdsUpdated(data));
        break;
      case WS_PARSE_FEED_ADS_FINISHED:
        dispatch(wsParseFeedAdsFinished(data));
        dispatch(showSnackbarAction({
          title: 'Getting feed ads finished',
          type: SnackbarType.INFO,
        }));
        break;
      case WS_ADD_COMPETITOR_CALLBACK:
      case WS_ADD_COMPETITOR_CALLBACK_QUEUED:
        if (data.hasOwnProperty('info')) {
          dispatch(showSnackbarAction({
            title: data.info,
            type: SnackbarType.INFO,
          }));
        } else if (data.hasOwnProperty('ok')) {
          // dispatch(loadCompetitors()).then();
          dispatch(addCompetitorShowModal(false));
          dispatch(showSnackbarAction({
            title: data.ok,
            type: SnackbarType.INFO,
          }));
          dispatch(addCompetitorSuccess());
          if (type === WS_ADD_COMPETITOR_CALLBACK) {
            dispatch(wsAddCompetitorCallback(data.competitor));
          } else if (type === WS_ADD_COMPETITOR_CALLBACK_QUEUED) {
            dispatch(wsAddCompetitorCallbackQueued(data.competitor));
          }
        } else {
          const errorMessage = data.hasOwnProperty('error') ? data.error : 'Unknown error occurred';
          dispatch(showSnackbarAction({
            title: errorMessage,
            type: SnackbarType.ERROR,
          }));
          dispatch(addCompetitorSuccess()); //todo: probably, change the architecture
        }
        dispatch(addCompetitorSetUsername(''));
        break;
      default:
        break;
    }
  };

  return socket;
};

export default setupSocket;
