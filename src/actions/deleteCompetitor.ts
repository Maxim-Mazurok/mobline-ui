import axios from 'axios';
import { API_URL } from "./index";
import { ThunkAction } from "redux-thunk";
import GlobalState, { Competitor } from "../types/GlobalState";
import { Dispatch } from "redux";
import { showSnackbarAction, SnackbarAction, SnackbarType } from "./snackbar";

export const DELETE_COMPETITOR_STARTED = 'deleteCompetitorStarted';
export type DELETE_COMPETITOR_STARTED = 'deleteCompetitorStarted';

export const DELETE_COMPETITOR_SUCCESS = 'deleteCompetitorSuccess';
export type DELETE_COMPETITOR_SUCCESS = 'deleteCompetitorSuccess';

export const DELETE_COMPETITOR_FAILURE = 'deleteCompetitorFailure';
export type DELETE_COMPETITOR_FAILURE = 'deleteCompetitorFailure';

const deleteCompetitorSuccess = (username: Competitor['username'], userPk: Competitor['userPk']): {
  type: DELETE_COMPETITOR_SUCCESS,
  payload: {
    username: Competitor['username'],
    userPk: Competitor['userPk'],
  },
} => ({
  type: DELETE_COMPETITOR_SUCCESS,
  payload: {
    username,
    userPk,
  },
});

const deleteCompetitorStarted = (username: Competitor['username'], userPk: Competitor['userPk']): {
  type: DELETE_COMPETITOR_STARTED,
  payload: {
    username: Competitor['username'],
    userPk: Competitor['userPk'],
  },
} => ({
  type: DELETE_COMPETITOR_STARTED,
  payload: {
    username,
    userPk,
  },
});

const deleteCompetitorFailure = (error: string): {
  type: DELETE_COMPETITOR_FAILURE,
  payload: string,
} => ({
  type: DELETE_COMPETITOR_FAILURE,
  payload: error,
});

export type DeleteCompetitorAction =
  | ReturnType<typeof deleteCompetitorStarted>
  | ReturnType<typeof deleteCompetitorSuccess>
  | ReturnType<typeof deleteCompetitorFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, DeleteCompetitorAction>;

export const deleteCompetitor = (username = '', userPk = ''): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<DeleteCompetitorAction | SnackbarAction>, getState: () => GlobalState) => {
    dispatch(deleteCompetitorStarted(username, userPk));

    const state = getState();

    axios
      .post(`${API_URL}/delete_competitor.php`, {
        customerId: state.user.customerId,
        username,
        userPk,
      })
      .then(result => {
        dispatch(showSnackbarAction({
          title: result.data['ok'],
          type: SnackbarType.SUCCESS,
        }));
        dispatch(deleteCompetitorSuccess(username, userPk));
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(deleteCompetitorFailure(errorMessage));
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
