import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import GlobalState from '../types/GlobalState';
import { Dispatch } from 'redux';
import {
  Follower,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_STARTED,
  LOAD_FOLLOWERS_SUCCESS,
} from '../reducers/loadFollowers';
import { showSnackbarAction, SnackbarAction, SnackbarType } from './snackbar';
import { API_URL } from './index';

const loadFollowersSuccess = (followers: Follower[]): {
  type: LOAD_FOLLOWERS_SUCCESS,
  payload: Follower[],
} => ({
  type: LOAD_FOLLOWERS_SUCCESS,
  payload: followers,
});

const loadFollowersStarted = (): {
  type: LOAD_FOLLOWERS_STARTED,
} => ({
  type: LOAD_FOLLOWERS_STARTED
});

const loadFollowersFailure = (error: string): {
  type: LOAD_FOLLOWERS_FAILURE,
  payload: string,
} => ({
  type: LOAD_FOLLOWERS_FAILURE,
  payload: error,
});

export type LoadFollowersAction =
  | ReturnType<typeof loadFollowersStarted>
  | ReturnType<typeof loadFollowersSuccess>
  | ReturnType<typeof loadFollowersFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, LoadFollowersAction>;

export const loadFollowers = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<LoadFollowersAction | SnackbarAction>, getState: () => GlobalState) => {
    const state = getState();
    if (state.loadFollowers.loading) return; // Another loading is in progress

    dispatch(loadFollowersStarted());

    axios
      .post(`${API_URL}/get_followers.php`, {
        competitorPks: state.followersExplorer.selectedCompetitors,
      })
      .then(result => {
        dispatch(loadFollowersSuccess(result.data));
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(loadFollowersFailure(errorMessage));
        if (errorMessage === "Select at least one competitor.") {
          dispatch(showSnackbarAction({
            title: errorMessage,
            type: SnackbarType.ERROR,
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
