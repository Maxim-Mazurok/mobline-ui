import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import GlobalState from '../types/GlobalState';
import { Dispatch } from 'redux';
import { showSnackbarAction, SnackbarAction, SnackbarType } from './snackbar';
import { API_URL } from './index';
import { Content } from '../reducers/loadContent';
import { LOAD_FEED_ADS_FAILURE, LOAD_FEED_ADS_STARTED, LOAD_FEED_ADS_SUCCESS } from '../reducers/loadFeedAds';

const loadFeedAdsSuccess = (content: Content[]): {
  type: LOAD_FEED_ADS_SUCCESS,
  payload: Content[],
} => ({
  type: LOAD_FEED_ADS_SUCCESS,
  payload: content,
});

const loadFeedAdsStarted = (): {
  type: LOAD_FEED_ADS_STARTED,
} => ({
  type: LOAD_FEED_ADS_STARTED,
});

const loadFeedAdsFailure = (error: string): {
  type: LOAD_FEED_ADS_FAILURE,
  payload: string,
} => ({
  type: LOAD_FEED_ADS_FAILURE,
  payload: error,
});

export type LoadFeedAdsAction =
  | ReturnType<typeof loadFeedAdsStarted>
  | ReturnType<typeof loadFeedAdsSuccess>
  | ReturnType<typeof loadFeedAdsFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, LoadFeedAdsAction>;

export const loadFeedAds = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<LoadFeedAdsAction | SnackbarAction>, getState: () => GlobalState) => {
    const state = getState();
    if (state.loadFeedAds.loading) return; // Another loading is in progress

    dispatch(loadFeedAdsStarted());

    axios
      .post(`${API_URL}/get_feed_ads.php`, {
        competitorPks: state.contentExplorer.selectedCompetitors,
      })
      .then(result => {
        dispatch(loadFeedAdsSuccess(result.data));
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(loadFeedAdsFailure(errorMessage));
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
