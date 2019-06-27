import { CLOSE_DRAWER } from "./index";

export const closeDrawerAction = (): CloseDrawerAction => ({
  type: CLOSE_DRAWER,
});

export interface CloseDrawerAction {
  type: typeof CLOSE_DRAWER,
}
