import { OPEN_DRAWER } from "./index";

export const openDrawerAction = (): OpenDrawerAction => ({
  type: OPEN_DRAWER,
});

export interface OpenDrawerAction {
  type: typeof OPEN_DRAWER,
}
