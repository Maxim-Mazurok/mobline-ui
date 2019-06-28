import axios from 'axios';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import GlobalState from "../types/GlobalState";
import { Dispatch } from "redux";
import {
  ADD_COMPETITOR_FAILURE,
  ADD_COMPETITOR_SET_USERNAME,
  ADD_COMPETITOR_SHOW_MODAL,
  ADD_COMPETITOR_STARTED,
  ADD_COMPETITOR_SUCCESS,
} from "../reducers/addCompetitor";
import { loadCompetitors, LoadCompetitorsAction } from "./loadCompetitors";
import { showSnackbarAction, SnackbarAction, SnackbarType } from "./snackbar";
import { API_URL } from "./index";

export type IGUsername = string;

export const addCompetitorSetUsername = (username: IGUsername): {
  type: ADD_COMPETITOR_SET_USERNAME,
  payload: IGUsername,
} => ({
  type: ADD_COMPETITOR_SET_USERNAME,
  payload: username,
});

export const addCompetitorShowModal = (show: boolean = true): {
  type: ADD_COMPETITOR_SHOW_MODAL,
  payload: boolean,
} => ({
  type: ADD_COMPETITOR_SHOW_MODAL,
  payload: show,
});

const addCompetitorSuccess = (): {
  type: ADD_COMPETITOR_SUCCESS,
} => ({
  type: ADD_COMPETITOR_SUCCESS,
});

const addCompetitorStarted = (): {
  type: ADD_COMPETITOR_STARTED,
} => ({
  type: ADD_COMPETITOR_STARTED
});

const addCompetitorFailure = (error: string): {
  type: ADD_COMPETITOR_FAILURE,
  payload: string,
} => ({
  type: ADD_COMPETITOR_FAILURE,
  payload: error,
});

export type AddCompetitorAction =
  | ReturnType<typeof addCompetitorSetUsername>
  | ReturnType<typeof addCompetitorShowModal>
  | ReturnType<typeof addCompetitorStarted>
  | ReturnType<typeof addCompetitorSuccess>
  | ReturnType<typeof addCompetitorFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, AddCompetitorAction>;

export const addCompetitor = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<AddCompetitorAction | SnackbarAction> & ThunkDispatch<GlobalState, undefined, LoadCompetitorsAction>, getState: () => GlobalState) => {
    const state = getState();
    const username = state.addCompetitor.username;

    dispatch(addCompetitorStarted());

    axios
      .post(`${API_URL}/add_competitor.php`, {
        customerId: state.user.customerId,
        username,
      })
      .then((response) => {
        dispatch(addCompetitorSuccess());

        switch (response.data) {
          case 'Competitor already added.':
          case 'Competitor already queued for processing.':
            dispatch(showSnackbarAction({
              title: response.data,
              type: SnackbarType.INFO,
            }));
            break;
          case 'Request timed out.':
            dispatch(loadCompetitors()).then();
            dispatch(showSnackbarAction({
              title: 'Worker is busy, your action is queued',
              type: SnackbarType.INFO,
            }));
            break;
          default:
            dispatch(loadCompetitors()).then();
            dispatch(showSnackbarAction({
              title: 'Competitor added',
              type: SnackbarType.SUCCESS,
            }));
            break;
        }
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(addCompetitorFailure(errorMessage));
        dispatch(showSnackbarAction({
          title: errorMessage,
          type: SnackbarType.ERROR,
        }));
      })
      .finally(() => {
        dispatch(addCompetitorSetUsername(""));
        return;
      });
  };
};
