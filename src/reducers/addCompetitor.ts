import { defaultState } from "../store";
import { AddCompetitorAction } from "../actions/addCompetitor";

export const ADD_COMPETITOR_SET_USERNAME = 'addCompetitorSetUsername';
export type ADD_COMPETITOR_SET_USERNAME = 'addCompetitorSetUsername';

export const ADD_COMPETITOR_SHOW_MODAL = 'addCompetitorShowModal';
export type ADD_COMPETITOR_SHOW_MODAL = 'addCompetitorShowModal';

export const ADD_COMPETITOR_SUCCESS = 'addCompetitorSuccess';
export type ADD_COMPETITOR_SUCCESS = 'addCompetitorSuccess';

export const ADD_COMPETITOR_FAILURE = 'addCompetitorFailure';
export type ADD_COMPETITOR_FAILURE = 'addCompetitorFailure';

export const ADD_COMPETITOR_STARTED = 'addCompetitorStarted';
export type ADD_COMPETITOR_STARTED = 'addCompetitorStarted';

export const addCompetitorReducer = (state: typeof defaultState.addCompetitor = defaultState.addCompetitor, action: AddCompetitorAction): typeof defaultState.addCompetitor => {
  switch (action.type) {
    case ADD_COMPETITOR_SET_USERNAME:
      return {
        ...state,
        username: action.payload || "",
      };
    case ADD_COMPETITOR_SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload,
      };
    case ADD_COMPETITOR_STARTED:
      return {
        ...state,
        loading: true,
      };
    case ADD_COMPETITOR_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_COMPETITOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Unknown error',
      };
    default:
      return state;
  }
};
