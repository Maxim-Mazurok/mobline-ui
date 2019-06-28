import { SELECT_MENU } from "./index";
import { MenuItem } from "../reducers/menu";

export const selectMenuAction = (menuItem: MenuItem): SelectMenuAction => ({
  type: SELECT_MENU,
  payload: menuItem,
});

export interface SelectMenuAction {
  type: typeof SELECT_MENU,
  payload: MenuItem,
}
