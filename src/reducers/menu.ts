import { CLOSE_DRAWER, MenuAction, OPEN_DRAWER, SELECT_MENU } from "../actions";
import { defaultState } from "../store";
import { Dashboard, People, Settings, SvgIconComponent } from "@material-ui/icons";

export enum MenuItemType {
  ITEM = 'item',
  DIVIDER = 'divider',
  MARGIN_TOP_AUTO = 'mt-auto',
}

export type MenuItem = {
  type: MenuItemType,
  text?: string,
  icon?: SvgIconComponent,
}

export const menuItems: MenuItem[] = [
  {
    type: MenuItemType.ITEM,
    text: 'Dashboard',
    icon: Dashboard,
  },
  {
    type: MenuItemType.DIVIDER,
  },
  {
    type: MenuItemType.ITEM,
    text: 'Followers explorer',
    icon: People,
  },
  {
    type: MenuItemType.MARGIN_TOP_AUTO,
  },
  {
    type: MenuItemType.DIVIDER,
  },
  {
    type: MenuItemType.ITEM,
    text: 'Settings',
    icon: Settings,
  }
];

export const menuReducer = (state: typeof defaultState.menu = defaultState.menu, action: MenuAction): typeof defaultState.menu => {
  switch (action.type) {
    case SELECT_MENU:
      return {
        ...state,
        selectedMenuItem: action.payload,
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
