import { defaultState } from '../defaultState';
import { LoadCompetitorsAction } from '../actions/loadCompetitors';
import {
  SocketAction,
  WS_ADD_COMPETITOR_CALLBACK,
  WS_ADD_COMPETITOR_CALLBACK_QUEUED,
  WS_PARSE_FEED_ADS_FINISHED,
  WS_PARSE_FEED_ADS_STARTED,
  WS_PARSE_FEED_ADS_UPDATED,
  WS_PARSE_FOLLOWERS_LIST_FINISHED,
  WS_PARSE_FOLLOWERS_LIST_STARTED,
  WS_PARSE_FOLLOWERS_LIST_UPDATED,
  WS_PARSE_POSTS_FINISHED,
  WS_PARSE_POSTS_STARTED,
  WS_PARSE_POSTS_UPDATED,
} from '../actions/socket';
import { Competitor } from '../types/GlobalState';
import { DELETE_COMPETITOR_STARTED, DeleteCompetitorAction } from '../actions/deleteCompetitor';

export const LOAD_COMPETITORS_SUCCESS = 'loadCompetitorsSuccess';
export type LOAD_COMPETITORS_SUCCESS = 'loadCompetitorsSuccess';
export const LOAD_COMPETITORS_FAILURE = 'loadCompetitorsFailure';
export type LOAD_COMPETITORS_FAILURE = 'loadCompetitorsFailure';
export const LOAD_COMPETITORS_STARTED = 'loadCompetitorsStarted';
export type LOAD_COMPETITORS_STARTED = 'loadCompetitorsStarted';

export const loadCompetitorsReducer = (state: typeof defaultState.loadCompetitors = defaultState.loadCompetitors, action: LoadCompetitorsAction | SocketAction | DeleteCompetitorAction): typeof defaultState.loadCompetitors => {
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
    case WS_PARSE_POSTS_STARTED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parsePostsStarted: true,
        } : competitor)
      };
    case WS_PARSE_POSTS_UPDATED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parsePostsProgress: {
            done: action.payload.done,
            total: action.payload.total,
          },
        } : competitor)
      };
    case WS_PARSE_POSTS_FINISHED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parsePostsFinished: true,
        } : competitor)
      };
    case WS_PARSE_FEED_ADS_STARTED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parseFeedAdsStarted: true,
        } : competitor),
      };
    case WS_PARSE_FEED_ADS_UPDATED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parseFeedAdsProgress: {
            done: action.payload.done,
            total: action.payload.total,
          },
        } : competitor),
      };
    case WS_PARSE_FEED_ADS_FINISHED:
      return {
        ...state,
        competitors: state.competitors.map((competitor: Competitor) => competitor.userPk.toString() === action.payload.userPk.toString() ? {
          ...competitor,
          parseFeedAdsFinished: true,
        } : competitor),
      };
    case DELETE_COMPETITOR_STARTED:
      return {
        ...state,
        competitors: state.competitors.filter((competitor: Competitor) =>
          (action.payload.userPk.toString() !== "" && competitor.userPk.toString() !== action.payload.userPk.toString()) ||
          (action.payload.username.toString() !== "" && competitor.username.toString() !== action.payload.username.toString())
        )
      };
    default:
      return state;
  }
};
