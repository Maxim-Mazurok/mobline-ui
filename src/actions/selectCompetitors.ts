import { Competitor } from "../types/GlobalState";
import { SELECT_COMPETITOR, UNSELECT_COMPETITOR } from "../reducers/selectedCompetitors";

const selectCompetitor = (competitorPk: Competitor["userPk"]): {
  type: SELECT_COMPETITOR,
  payload: Competitor["userPk"],
} => ({
  type: SELECT_COMPETITOR,
  payload: competitorPk,
});

const unselectCompetitor = (competitorPk: Competitor["userPk"]): {
  type: UNSELECT_COMPETITOR,
  payload: Competitor["userPk"],
} => ({
  type: UNSELECT_COMPETITOR,
  payload: competitorPk,
});

export type SelectCompetitorAction =
  | ReturnType<typeof selectCompetitor>
  | ReturnType<typeof unselectCompetitor>
  ;
