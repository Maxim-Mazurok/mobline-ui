import { defaultState } from '../defaultState';
import { LoadStatsAction } from '../actions/loadStats';

export const LOAD_STATS_SUCCESS = 'loadStatsSuccess';
export type LOAD_STATS_SUCCESS = 'loadStatsSuccess';

export const LOAD_STATS_FAILURE = 'loadStatsFailure';
export type LOAD_STATS_FAILURE = 'loadStatsFailure';

export const LOAD_STATS_STARTED = 'loadStatsStarted';
export type LOAD_STATS_STARTED = 'loadStatsStarted';

export type Stats = {
  annotations: Array<{
    xMin: string,
    xMax: string
  }>,
  data: {
    labels: string[],
    datasets: Array<{
      fill: boolean,
      data: number[],
      label: string,
      borderColor: string,
    }>
  }
}

export const loadStatsReducer = (state: typeof defaultState.loadStats = defaultState.loadStats, action: LoadStatsAction): typeof defaultState.loadStats => {
  switch (action.type) {
    case LOAD_STATS_STARTED:
      return {
        ...state,
        loading: true,
      };
    case LOAD_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        stats: action.payload,
      };
    case LOAD_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Unknown error',
      };
    default:
      return state;
  }
};
