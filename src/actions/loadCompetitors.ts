import axios from 'axios';
import { ThunkAction } from "redux-thunk";
import GlobalState, { Competitor } from "../types/GlobalState";
import { Dispatch } from "redux";
import {
  LOAD_COMPETITORS_FAILURE,
  LOAD_COMPETITORS_STARTED,
  LOAD_COMPETITORS_SUCCESS
} from "../reducers/loadCompetitors";
import { showSnackbarAction, SnackbarAction, SnackbarType } from "./snackbar";
import { API_URL } from "./index";

const loadCompetitorsSuccess = (competitors: Competitor[]): {
  type: LOAD_COMPETITORS_SUCCESS,
  payload: Competitor[],
} => ({
  type: LOAD_COMPETITORS_SUCCESS,
  payload: competitors,
});

const loadCompetitorsStarted = (): {
  type: LOAD_COMPETITORS_STARTED,
} => ({
  type: LOAD_COMPETITORS_STARTED
});

const loadCompetitorsFailure = (error: string): {
  type: LOAD_COMPETITORS_FAILURE,
  payload: string,
} => ({
  type: LOAD_COMPETITORS_FAILURE,
  payload: error,
});

export type LoadCompetitorsAction =
  | ReturnType<typeof loadCompetitorsStarted>
  | ReturnType<typeof loadCompetitorsSuccess>
  | ReturnType<typeof loadCompetitorsFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, LoadCompetitorsAction>;

export const loadCompetitors = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<LoadCompetitorsAction | SnackbarAction>, getState: () => GlobalState) => {
    const state = getState();
    if (state.loadCompetitors.loading) return; // Another loading is in progress

    dispatch(loadCompetitorsStarted());

    axios
      .post(`${API_URL}/get_competitors.php`, {
        customerId: state.user.customerId,
      })
      .then(result => {
        dispatch(loadCompetitorsSuccess(result.data));
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(loadCompetitorsFailure(errorMessage));
        dispatch(showSnackbarAction({
          title: errorMessage,
          type: SnackbarType.ERROR,
        }));
      })
      .finally(() => {
        return;
      });
  };
};
