import { CLOSE_DRAWER, MenuAction, OPEN_DRAWER } from "../actions";
import { defaultState, MenuItemId } from "../defaultState";
import { Dashboard, List, People, PhotoLibrary, Settings, SvgIconComponent, TrendingUp } from "@material-ui/icons";
import { DashboardConnected } from "../Components/Dashboard";
import { CompetitorsListConnected } from "../Components/CompetitorsList";
import { ContentExplorerConnected } from "../Components/Content";
import { FollowersExplorerConnected } from "../Components/FollowersExplorer";
import { ConnectedComponentClass } from "react-redux";
import SvgIcon from "@material-ui/core/SvgIcon";

export enum MenuStructureItemType {
  ITEM = 'item',
  DIVIDER = 'divider',
  MARGIN_TOP_AUTO = 'mt-auto',
}

export type MenuItem = {
  text: string,
  icon: SvgIconComponent,
  path: string,
  component: ConnectedComponentClass<any, any>,
}

export const menuItems: {
  [key in MenuItemId]: MenuItem
} = {
  [MenuItemId.DASHBOARD]: {
    text: 'Dashboard',
    icon: Dashboard,
    path: "/",
    component: DashboardConnected,
  },
  [MenuItemId.COMPETITORS]: {
    text: 'Competitors',
    icon: List,
    path: "/competitors",
    component: CompetitorsListConnected,
  },
  [MenuItemId.CONTENT]: {
    text: 'Content',
    icon: PhotoLibrary,
    path: "/content",
    component: ContentExplorerConnected,
  },
  [MenuItemId.FOLLOWERS_EXPLORER]: {
    text: 'Follower Insights',
    icon: People,
    path: "/followers",
    component: FollowersExplorerConnected,
  },
  [MenuItemId.ADS]: {
    text: 'Ads',
    icon: TrendingUp,
    path: "/ads",
    component: DashboardConnected,
  },
  [MenuItemId.SETTINGS]: {
    text: 'Settings',
    icon: Settings,
    path: "/settings",
    component: DashboardConnected,
  },
};

type MenuStructureItem = {
  type: MenuStructureItemType,
  item: MenuItem,
};

// TODO: kind of dirty, get rid of dummy menu item
const dummyMenuItem = {
  text: '',
  icon: SvgIcon,
  path: "",
  component: DashboardConnected,
};

export const menuStructure: MenuStructureItem[] = [
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.DASHBOARD],
  },
  {
    type: MenuStructureItemType.DIVIDER,
    item: dummyMenuItem,
  },
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.COMPETITORS],
  },
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.CONTENT],
  },
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.FOLLOWERS_EXPLORER],
  },
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.ADS],
  },
  {
    type: MenuStructureItemType.MARGIN_TOP_AUTO,
    item: dummyMenuItem,
  },
  {
    type: MenuStructureItemType.DIVIDER,
    item: dummyMenuItem,
  },
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.SETTINGS],
  }
];

export const menuReducer = (state: typeof defaultState.menu = defaultState.menu, action: MenuAction): typeof defaultState.menu => {
  switch (action.type) {
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
