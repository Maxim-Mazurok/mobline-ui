import { CLOSE_DRAWER, MenuAction, OPEN_DRAWER, SELECT_MENU } from "../actions";
import { defaultState } from "../defaultState";
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
  id?: MenuItemId,
}

export enum MenuItemId {
  DASHBOARD,
  EXPLORER,
  SETTINGS,
}

export const menuItems: MenuItem[] = [
  {
    type: MenuItemType.ITEM,
    text: 'Dashboard',
    icon: Dashboard,
    id: MenuItemId.DASHBOARD,
  },
  {
    type: MenuItemType.DIVIDER,
  },
  {
    type: MenuItemType.ITEM,
    text: 'Followers explorer',
    icon: People,
    id: MenuItemId.EXPLORER,
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
    id: MenuItemId.SETTINGS,
  }
];

export const menuReducer = (state: typeof defaultState.menu = defaultState.menu, action: MenuAction): typeof defaultState.menu => {
  switch (action.type) {
    case SELECT_MENU:
      return {
        ...state,
        selectedMenuItemId: action.payload,
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
