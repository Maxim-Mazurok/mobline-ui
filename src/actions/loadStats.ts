import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import GlobalState, { Competitor } from '../types/GlobalState';
import { Dispatch } from 'redux';
import { LOAD_STATS_FAILURE, LOAD_STATS_STARTED, LOAD_STATS_SUCCESS, Stats } from '../reducers/loadStats';
import { showSnackbarAction, SnackbarAction, SnackbarType } from './snackbar';
import { API_URL } from './index';

const loadStatsSuccess = (stats: Stats): {
  type: LOAD_STATS_SUCCESS,
  payload: Stats,
} => ({
  type: LOAD_STATS_SUCCESS,
  payload: stats,
});

const loadStatsStarted = (): {
  type: LOAD_STATS_STARTED,
} => ({
  type: LOAD_STATS_STARTED,
});

const loadStatsFailure = (error: string): {
  type: LOAD_STATS_FAILURE,
  payload: string,
} => ({
  type: LOAD_STATS_FAILURE,
  payload: error,
});

export type LoadStatsAction =
  | ReturnType<typeof loadStatsStarted>
  | ReturnType<typeof loadStatsSuccess>
  | ReturnType<typeof loadStatsFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, LoadStatsAction>;

export const loadStats = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<LoadStatsAction | SnackbarAction>, getState: () => GlobalState) => {
    const state = getState();
    if (state.loadStats.loading) return; // Another loading is in progress

    dispatch(loadStatsStarted());

    axios
      .post(`${API_URL}/get_posts_per_day.php`, {
        competitorPks: state.loadCompetitors.competitors.map((competitor: Competitor) => competitor.userPk),
      })
      .then(result => {
        dispatch(loadStatsSuccess(result.data));
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(loadStatsFailure(errorMessage));
        if (errorMessage === 'Select at least one competitor.') {
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
