import { defaultState } from "./store";
import { SelectedMenuIndex } from "./types/GlobalState";

export const getSelectedMenuIndex = (state: typeof defaultState.menu): SelectedMenuIndex => state.selectedMenuIndex;
export const drawerIsOpen = (state: typeof defaultState.menu = defaultState.menu): boolean => state.drawerIsOpen;
export const inviteCodeIsCorrect = (state: typeof defaultState.user = defaultState.user): boolean => state.inviteCode === 'moblinebeta';
export const isLoggedIn = (state: typeof defaultState.user = defaultState.user): boolean => {
  if (state.userInfo.expiresAt === null) {
    return false;
  }
  return new Date().getTime() < state.userInfo.expiresAt;
};
