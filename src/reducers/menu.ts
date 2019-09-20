import { CLOSE_DRAWER, MenuAction, OPEN_DRAWER } from '../actions';
import { defaultState, MenuItemId } from '../defaultState';
import { DashboardConnected } from '../Components/Dashboard';
import { CompetitorsListConnected } from '../Components/CompetitorsList';
import { ContentExplorerConnected } from '../Components/Content';
import { FollowersExplorerConnected } from '../Components/FollowersExplorer';
import { ConnectedComponentClass } from 'react-redux';
import { FeedAdsConnected } from '../Components/FeedAds';
import { ReactComponent as Ads } from '../icons/ads.svg';
import { ReactComponent as Competitors } from '../icons/competitors.svg';
import { ReactComponent as Content } from '../icons/content.svg';
import { ReactComponent as Dashboard } from '../icons/dashboard.svg';
import { ReactComponent as Followers } from '../icons/followers.svg';
import * as React from 'react';
import { SettingsConnected } from '../Components/Settings';

export enum MenuStructureItemType {
  ITEM,
  LOGO,
  MARGIN_TOP_AUTO,
}

export type MenuItem = {
  text: string,
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  path: string,
  component: ConnectedComponentClass<any, any>,
}

export const menuItems: {
  [key in MenuItemId]: MenuItem
} = {
  [MenuItemId.DASHBOARD]: {
    text: 'Dashboard',
    icon: Dashboard,
    path: '/',
    component: DashboardConnected,
  },
  [MenuItemId.COMPETITORS]: {
    text: 'Competitors',
    icon: Competitors,
    path: '/competitors',
    component: CompetitorsListConnected,
  },
  [MenuItemId.CONTENT]: {
    text: 'Content',
    icon: Content,
    path: '/content',
    component: ContentExplorerConnected,
  },
  [MenuItemId.FOLLOWERS_EXPLORER]: {
    text: 'Follower Insights',
    icon: Followers,
    path: '/followers',
    component: FollowersExplorerConnected,
  },
  [MenuItemId.ADS]: {
    text: 'Ads',
    icon: Ads,
    path: '/ads',
    component: FeedAdsConnected,
  },
  [MenuItemId.SETTINGS]: {
    text: 'Settings →',
    path: '/settings',
    component: SettingsConnected,
  },
};

type MenuStructureItem = {
  type: MenuStructureItemType.LOGO | MenuStructureItemType.MARGIN_TOP_AUTO,
} | {
  type: MenuStructureItemType.ITEM,
  item: MenuItem
};

export const menuStructure: MenuStructureItem[] = [
  {
    type: MenuStructureItemType.LOGO,
  },
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.DASHBOARD],
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
  },
  {
    type: MenuStructureItemType.ITEM,
    item: menuItems[MenuItemId.SETTINGS],
  },
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
