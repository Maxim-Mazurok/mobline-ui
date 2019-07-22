import { defaultState } from "../defaultState";
import { LoadCompetitorsAction } from "../actions/loadCompetitors";
import {
  SocketAction,
  WS_ADD_COMPETITOR_CALLBACK,
  WS_ADD_COMPETITOR_CALLBACK_QUEUED,
  WS_PARSE_FOLLOWERS_LIST_FINISHED,
  WS_PARSE_FOLLOWERS_LIST_STARTED,
  WS_PARSE_FOLLOWERS_LIST_UPDATED
} from "../actions/socket";
import { Competitor } from "../types/GlobalState";

export const LOAD_COMPETITORS_SUCCESS = 'loadCompetitorsSuccess';
export type LOAD_COMPETITORS_SUCCESS = 'loadCompetitorsSuccess';
export const LOAD_COMPETITORS_FAILURE = 'loadCompetitorsFailure';
export type LOAD_COMPETITORS_FAILURE = 'loadCompetitorsFailure';
export const LOAD_COMPETITORS_STARTED = 'loadCompetitorsStarted';
export type LOAD_COMPETITORS_STARTED = 'loadCompetitorsStarted';

export const loadCompetitorsReducer = (state: typeof defaultState.loadCompetitors = defaultState.loadCompetitors, action: LoadCompetitorsAction | SocketAction): typeof defaultState.loadCompetitors => {
  switch (action.type) {
    case LOAD_COMPETITORS_STARTED:
      return {
        ...state,
        loading: true
      };
    case LOAD_COMPETITORS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        competitors: action.payload,
      };
    case LOAD_COMPETITORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Unknown error',
      };
    case WS_ADD_COMPETITOR_CALLBACK:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.username.toString() === action.payload.username.toString()
          ? action.payload : competitor)
      };
    case WS_ADD_COMPETITOR_CALLBACK_QUEUED:
      return {
        ...state,
        competitors: [action.payload, ...state.competitors]
      };
    case WS_PARSE_FOLLOWERS_LIST_STARTED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parseFollowersListStarted: true,
        } : competitor)
      };
    case WS_PARSE_FOLLOWERS_LIST_UPDATED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parseFollowersListProgress: {
            done: action.payload.done,
            total: action.payload.total,
          },
        } : competitor)
      };
    case WS_PARSE_FOLLOWERS_LIST_FINISHED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parseFollowersListFinished: true,
        } : competitor)
      };
    default:
      return state;
  }
};
