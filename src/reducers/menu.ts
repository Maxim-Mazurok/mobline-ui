import { CLOSE_DRAWER, MenuAction, OPEN_DRAWER, SELECT_MENU } from "../actions";
import { defaultState } from "../store";

export const menuReducer = (state: typeof defaultState.menu = defaultState.menu, action: MenuAction): typeof defaultState.menu => {
  switch (action.type) {
    case SELECT_MENU:
      return {
        ...state,
        selectedMenuIndex: action.payload,
      };
    case OPEN_DRAWER:
      return {
        ...state,
        drawerIsOpen: true,
      };
    case CLOSE_DRAWER:
      return {
        ...state,
        drawerIsOpen: false,
      };
    default:
      return state;
  }
};
