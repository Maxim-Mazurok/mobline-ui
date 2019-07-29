import { defaultState } from "../defaultState";
import { Competitor } from "../types/GlobalState";
import { ContentExplorerAction } from "../actions/contentExplorer";
import { SELECT_COMPETITOR, SELECT_SINGLE_COMPETITOR, UNSELECT_COMPETITOR } from "./followersExplorer";

export const contentExplorerReducer = (state: typeof defaultState.contentExplorer = defaultState.contentExplorer, action: ContentExplorerAction): typeof defaultState.contentExplorer => {
  switch (action.type) {
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
