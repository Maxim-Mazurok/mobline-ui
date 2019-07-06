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
import { LoadCompetitorsAction } from "./loadCompetitors";
import { SnackbarAction } from "./snackbar";
import { SocketAction, wsAddCompetitor } from "./socket";

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

export const addCompetitorSuccess = (): {
  type: ADD_COMPETITOR_SUCCESS,
} => ({
  type: ADD_COMPETITOR_SUCCESS,
});

const addCompetitorStarted = (): {
  type: ADD_COMPETITOR_STARTED,
} => ({
  type: ADD_COMPETITOR_STARTED
});

export const addCompetitorFailure = (error: string): {
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
  return async (dispatch: Dispatch<AddCompetitorAction | SnackbarAction | SocketAction> & ThunkDispatch<GlobalState, undefined, LoadCompetitorsAction>, getState: () => GlobalState) => {
    const state = getState();
    const username = state.addCompetitor.username;

    dispatch(addCompetitorStarted());

    dispatch(wsAddCompetitor(username));
  };
};
