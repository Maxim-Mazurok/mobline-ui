import axios from 'axios';
import { ThunkAction } from "redux-thunk";
import GlobalState from "../types/GlobalState";
import { Dispatch } from "redux";
import { Content, LOAD_CONTENT_FAILURE, LOAD_CONTENT_STARTED, LOAD_CONTENT_SUCCESS } from "../reducers/loadContent";
import { showSnackbarAction, SnackbarAction, SnackbarType } from "./snackbar";
import { API_URL } from "./index";

const loadContentSuccess = (content: Content[]): {
  type: LOAD_CONTENT_SUCCESS,
  payload: Content[],
} => ({
  type: LOAD_CONTENT_SUCCESS,
  payload: content,
});

const loadContentStarted = (): {
  type: LOAD_CONTENT_STARTED,
} => ({
  type: LOAD_CONTENT_STARTED
});

const loadContentFailure = (error: string): {
  type: LOAD_CONTENT_FAILURE,
  payload: string,
} => ({
  type: LOAD_CONTENT_FAILURE,
  payload: error,
});

export type LoadContentAction =
  | ReturnType<typeof loadContentStarted>
  | ReturnType<typeof loadContentSuccess>
  | ReturnType<typeof loadContentFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, LoadContentAction>;

export const loadContent = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<LoadContentAction | SnackbarAction>, getState: () => GlobalState) => {
    const state = getState();
    if (state.loadContent.loading) return; // Another loading is in progress

    dispatch(loadContentStarted());

    axios
      .post(`${API_URL}/get_content.php`, {
        competitorPks: state.contentExplorer.selectedCompetitors,
      })
      .then(result => {
        dispatch(loadContentSuccess(result.data));
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(loadContentFailure(errorMessage));
        if (errorMessage === "Select at least one competitor.") {
          dispatch(showSnackbarAction({
            title: errorMessage,
            type: SnackbarType.INFO,
          }));
        } else {
          dispatch(showSnackbarAction({
            title: errorMessage,
            type: SnackbarType.ERROR,
          }));
        }
      })
      .finally(() => {
        return;
      });
  };
};
