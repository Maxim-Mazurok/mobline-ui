export const SHOW_SNACKBAR = 'showSnackbar';
export type SHOW_SNACKBAR = 'showSnackbar';

export enum SnackbarType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO',
  HIDDEN = 'HIDDEN',
}

export type SnackbarData = {
  type: SnackbarType,
  title: string,
};

export const showSnackbarAction = (data: SnackbarData): SnackbarAction => ({
  type: SHOW_SNACKBAR,
  payload: data,
});

export interface SnackbarAction {
  type: typeof SHOW_SNACKBAR,
  payload: SnackbarData,
}
