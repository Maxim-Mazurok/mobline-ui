import { defaultState } from "../defaultState";
import { Competitor } from "../types/GlobalState";
import { FollowersExplorerAction } from "../actions/followersExplorer";

export const SELECT_COMPETITOR = 'selectCompetitor';
export type SELECT_COMPETITOR = 'selectCompetitor';

export const SELECT_SINGLE_COMPETITOR = 'selectSingleCompetitor';
export type SELECT_SINGLE_COMPETITOR = 'selectSingleCompetitor';

export const UNSELECT_COMPETITOR = 'unselectCompetitor';
export type UNSELECT_COMPETITOR = 'unselectCompetitor';

export const SET_VERIFIED_ONLY = 'setVerifiedOnly';
export type SET_VERIFIED_ONLY = 'setVerifiedOnly';

export const SET_HIDE_BOTS = 'setHideBots';
export type SET_HIDE_BOTS = 'setHideBots';

export const followersExplorerReducer = (state: typeof defaultState.followersExplorer = defaultState.followersExplorer, action: FollowersExplorerAction): typeof defaultState.followersExplorer => {
  switch (action.type) {
    case SET_HIDE_BOTS:
      return {
        ...state,
        hideBots: action.payload
      };
    case SET_VERIFIED_ONLY:
      return {
        ...state,
        verifiedOnly: action.payload
      };
    case SELECT_SINGLE_COMPETITOR:
      return {
        ...state,
        selectedCompetitors: [action.payload]
      };
    case SELECT_COMPETITOR:
      return {
        ...state,
        selectedCompetitors: [...state.selectedCompetitors, action.payload]
      };
    case UNSELECT_COMPETITOR:
      return {
        ...state,
        selectedCompetitors: state.selectedCompetitors
          .filter((userPk: Competitor["userPk"]) => userPk !== action.payload)
      };
    default:
      return state;
  }
};
