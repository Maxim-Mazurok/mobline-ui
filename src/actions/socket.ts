import { Dispatch } from "redux";
import GlobalState, { Competitor } from "../types/GlobalState";
import {
  AddCompetitorAction,
  addCompetitorSetUsername,
  addCompetitorShowModal,
  addCompetitorSuccess,
  IGUsername
} from "./addCompetitor";
import { WS_HEARTBEAT, WS_HOST, WS_PORT, WS_SCHEME } from "./index";
import { showSnackbarAction, SnackbarAction, SnackbarType } from "./snackbar";
import { LoadCompetitorsAction } from "./loadCompetitors";
import { ThunkDispatch } from "redux-thunk";

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
export const WS_PARSE_FOLLOWERS_STARTED = 'parse-followers-started';
export type WS_PARSE_FOLLOWERS_STARTED = 'parse-followers-started';
export const WS_PARSE_FOLLOWERS_UPDATED = 'parse-followers-updated';
export type WS_PARSE_FOLLOWERS_UPDATED = 'parse-followers-updated';
export const WS_PARSE_FOLLOWERS_FINISHED = 'parse-followers-finished';
export type WS_PARSE_FOLLOWERS_FINISHED = 'parse-followers-finished';
export const WS_PARSE_FOLLOWERS_LIST_STARTED = 'parse-followers-list-started';
export type WS_PARSE_FOLLOWERS_LIST_STARTED = 'parse-followers-list-started';
export const WS_PARSE_FOLLOWERS_LIST_UPDATED = 'parse-followers-list-updated';
export type WS_PARSE_FOLLOWERS_LIST_UPDATED = 'parse-followers-list-updated';
export const WS_PARSE_FOLLOWERS_LIST_FINISHED = 'parse-followers-list-finished';
export type WS_PARSE_FOLLOWERS_LIST_FINISHED = 'parse-followers-list-finished';

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

export type ParseFollowersStarted = {
  userPk: Competitor['userPk'];
}

export type ParseFollowersUpdated = {
  done: number,
  total: number,
  followingPk: Competitor['userPk'];
  userPk: Competitor['userPk'];
}

export type ParseFollowersFinished = {
  finished: boolean;
  followingPk: Competitor['userPk'];
}

export type ParseFollowersListStarted = {
  userPk: Competitor['userPk'];
}

export type ParseFollowersListUpdated = {
  done: number,
  total: number,
  userPk: Competitor['userPk'];
}

export type ParseFollowersListFinished = {
  finished: boolean,
  userPk: Competitor['userPk'];
}

export const wsParseFollowersStarted = (data: ParseFollowersStarted): {
  type: WS_PARSE_FOLLOWERS_STARTED,
  payload: ParseFollowersStarted,
} => ({
  type: WS_PARSE_FOLLOWERS_STARTED,
  payload: data,
});

export const wsParseFollowersUpdated = (data: ParseFollowersUpdated): {
  type: WS_PARSE_FOLLOWERS_UPDATED,
  payload: ParseFollowersUpdated,
} => ({
  type: WS_PARSE_FOLLOWERS_UPDATED,
  payload: data,
});

export const wsParseFollowersFinished = (data: ParseFollowersFinished): {
  type: WS_PARSE_FOLLOWERS_FINISHED,
  payload: ParseFollowersFinished,
} => ({
  type: WS_PARSE_FOLLOWERS_FINISHED,
  payload: data,
});

export const wsParseFollowersListStarted = (data: ParseFollowersListStarted): {
  type: WS_PARSE_FOLLOWERS_LIST_STARTED,
  payload: ParseFollowersListStarted,
} => ({
  type: WS_PARSE_FOLLOWERS_LIST_STARTED,
  payload: data,
});

export const wsParseFollowersListUpdated = (data: ParseFollowersListUpdated): {
  type: WS_PARSE_FOLLOWERS_LIST_UPDATED,
  payload: ParseFollowersListUpdated,
} => ({
  type: WS_PARSE_FOLLOWERS_LIST_UPDATED,
  payload: data,
});

export const wsParseFollowersListFinished = (data: ParseFollowersListFinished): {
  type: WS_PARSE_FOLLOWERS_LIST_FINISHED,
  payload: ParseFollowersListFinished,
} => ({
  type: WS_PARSE_FOLLOWERS_LIST_FINISHED,
  payload: data,
});


export type SocketAction =
  | ReturnType<typeof wsOpened>
  | ReturnType<typeof wsSubscribe>
  | ReturnType<typeof wsAddCompetitor>
  | ReturnType<typeof wsAddCompetitorCallback>
  | ReturnType<typeof wsAddCompetitorCallbackQueued>
  | ReturnType<typeof wsParseFollowersStarted>
  | ReturnType<typeof wsParseFollowersUpdated>
  | ReturnType<typeof wsParseFollowersFinished>
  | ReturnType<typeof wsParseFollowersListStarted>
  | ReturnType<typeof wsParseFollowersListUpdated>
  | ReturnType<typeof wsParseFollowersListFinished>
  ;

const setupSocket = (dispatch: Dispatch<SocketAction | SnackbarAction | AddCompetitorAction> & ThunkDispatch<GlobalState, undefined, LoadCompetitorsAction>, getState: () => GlobalState): WebSocket => {
  const socket = new WebSocket(`${WS_SCHEME}://${WS_HOST}:${WS_PORT}`);

  socket.onopen = () => {
    dispatch(wsOpened(true));
    dispatch(wsSubscribe(getState().user.customerId));
    if (WS_HEARTBEAT) {
      setInterval(() => {
        socket.send(JSON.stringify({ type: "wsHeartBeat" }));
      }, 30 * 1000);
    }
  };
  socket.onclose = () => {
    dispatch(wsOpened(false));
    dispatch(showSnackbarAction({
      title: "Disconnected from server, reload the page",
      type: SnackbarType.INFO,
    }));
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const type = data.type;
    delete data.type;
    switch (type) {
      case WS_PARSE_FOLLOWERS_STARTED:
        dispatch(wsParseFollowersStarted(data));
        break;
      case WS_PARSE_FOLLOWERS_UPDATED:
        dispatch(wsParseFollowersUpdated(data));
        break;
      case WS_PARSE_FOLLOWERS_FINISHED:
        dispatch(wsParseFollowersFinished(data));
        dispatch(showSnackbarAction({
          title: "Parsing followers finished",
          type: SnackbarType.INFO,
        }));
        break;
      case WS_PARSE_FOLLOWERS_LIST_STARTED:
        dispatch(wsParseFollowersListStarted(data));
        break;
      case WS_PARSE_FOLLOWERS_LIST_UPDATED:
        dispatch(wsParseFollowersListUpdated(data));
        break;
      case WS_PARSE_FOLLOWERS_LIST_FINISHED:
        dispatch(wsParseFollowersListFinished(data));
        dispatch(showSnackbarAction({
          title: "Getting followers list finished",
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
          break;
        } else {
          const errorMessage = data.hasOwnProperty('error') ? data.error : "Unknown error occurred";
          dispatch(showSnackbarAction({
            title: errorMessage,
            type: SnackbarType.ERROR,
          }));
          dispatch(addCompetitorSuccess()); //todo: probably, change the architecture
        }
        dispatch(addCompetitorSetUsername(""));
        break;
      default:
        break;
    }
  };

  return socket;
};

export default setupSocket;
