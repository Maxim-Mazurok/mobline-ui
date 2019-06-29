import { SelectCompetitorAction } from "../actions/selectCompetitors";
import { defaultState } from "../defaultState";
import { Competitor } from "../types/GlobalState";

export const SELECT_COMPETITOR = 'selectCompetitor';
export type SELECT_COMPETITOR = 'selectCompetitor';
export const UNSELECT_COMPETITOR = 'unselectCompetitor';
export type UNSELECT_COMPETITOR = 'unselectCompetitor';

export const selectedCompetitorsReducer = (state: typeof defaultState.selectedCompetitors = defaultState.selectedCompetitors, action: SelectCompetitorAction): typeof defaultState.selectedCompetitors => {
  switch (action.type) {
    case SELECT_COMPETITOR:
      return [...state, action.payload];
    case UNSELECT_COMPETITOR:
      return state.filter((userPk: Competitor["userPk"]) => userPk !== action.payload);
    default:
      return state;
  }
};
