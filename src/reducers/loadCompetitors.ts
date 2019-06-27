import { defaultState } from "../store";
import { LoadCompetitorsAction } from "../actions/loadCompetitors";

export const LOAD_COMPETITORS_SUCCESS = 'loadCompetitorsSuccess';
export type LOAD_COMPETITORS_SUCCESS = 'loadCompetitorsSuccess';
export const LOAD_COMPETITORS_FAILURE = 'loadCompetitorsFailure';
export type LOAD_COMPETITORS_FAILURE = 'loadCompetitorsFailure';
export const LOAD_COMPETITORS_STARTED = 'loadCompetitorsStarted';
export type LOAD_COMPETITORS_STARTED = 'loadCompetitorsStarted';

export const loadCompetitorsReducer = (state: typeof defaultState.loadCompetitors = defaultState.loadCompetitors, action: LoadCompetitorsAction): typeof defaultState.loadCompetitors => {
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
    default:
      return state;
  }
};
