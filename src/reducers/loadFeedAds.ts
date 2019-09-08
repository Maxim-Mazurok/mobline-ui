import { defaultState } from '../defaultState';
import { LoadFeedAdsAction } from '../actions/loadFeedAds';

export const LOAD_FEED_ADS_SUCCESS = 'loadFeedAdsSuccess';
export type LOAD_FEED_ADS_SUCCESS = 'loadFeedAdsSuccess';

export const LOAD_FEED_ADS_FAILURE = 'loadFeedAdsFailure';
export type LOAD_FEED_ADS_FAILURE = 'loadFeedAdsFailure';

export const LOAD_FEED_ADS_STARTED = 'loadFeedAdsStarted';
export type LOAD_FEED_ADS_STARTED = 'loadFeedAdsStarted';

export const loadFeedAdsReducer = (state: typeof defaultState.loadFeedAds = defaultState.loadFeedAds, action: LoadFeedAdsAction): typeof defaultState.loadFeedAds => {
  switch (action.type) {
    case LOAD_FEED_ADS_STARTED:
      return {
        ...state,
        loading: true,
      };
    case LOAD_FEED_ADS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        content: action.payload,
      };
    case LOAD_FEED_ADS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Unknown error',
      };
    default:
      return state;
  }
};
