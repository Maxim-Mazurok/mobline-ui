import { CLOSE_DRAWER, MenuAction, OPEN_DRAWER, SELECT_MENU } from "../actions";
import { defaultState } from "../defaultState";
import { Dashboard, List, People, PhotoLibrary, Settings, SvgIconComponent } from "@material-ui/icons";

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
  COMPETITORS,
  CONTENT,
  FOLLOWERS_EXPLORER,
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
    text: 'Competitors',
    icon: List,
    id: MenuItemId.COMPETITORS,
  },
  {
    type: MenuItemType.ITEM,
    text: 'Content',
    icon: PhotoLibrary,
    id: MenuItemId.CONTENT,
  },
  {
    type: MenuItemType.ITEM,
    text: 'Follower Insights',
    icon: People,
    id: MenuItemId.FOLLOWERS_EXPLORER,
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
