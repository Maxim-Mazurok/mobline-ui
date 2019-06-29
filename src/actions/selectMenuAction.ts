import { SELECT_MENU } from "./index";
import { MenuItemId } from "../reducers/menu";

export const selectMenuAction = (menuItemId: MenuItemId): SelectMenuAction => ({
  type: SELECT_MENU,
  payload: menuItemId,
});

export interface SelectMenuAction {
  type: typeof SELECT_MENU,
  payload: MenuItemId,
}
