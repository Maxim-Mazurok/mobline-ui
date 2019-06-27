import { defaultState } from "../store";
import { SHOW_SNACKBAR, SnackbarAction } from "../actions/snackbar";

export const snackbarReducer = (state: typeof defaultState.snackbar = defaultState.snackbar, action: SnackbarAction): typeof defaultState.snackbar => {
  // noinspection JSRedundantSwitchStatement
  switch (action.type) {
    case SHOW_SNACKBAR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
