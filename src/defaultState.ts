import { Auth0UserProfile } from 'auth0-js';
import GlobalState from './types/GlobalState';
import { SnackbarType } from './actions/snackbar';

export enum MenuItemId {
  DASHBOARD,
  COMPETITORS,
  CONTENT,
  FOLLOWERS_EXPLORER,
  ADS,
  HELP,
}

const getInitialUserProfile = (): Auth0UserProfile | null => {
  const userProfileString = localStorage.getItem('userProfile');
  if (userProfileString !== null && userProfileString !== '{}') {
    try {
      return JSON.parse(userProfileString);
    } catch (e) {
      console.error('Error parsing user profile: ', e);
    }
  }
  return null;
};
const getInitialCustomerId = (): number | null => {
  const customerIdString = localStorage.getItem('customerId');
  if (customerIdString !== null && customerIdString !== '') {
    const customerId = parseInt(customerIdString);
    if (!Number.isNaN(customerId)) return customerId;
  }
  return null;
};

export const defaultState: GlobalState = {
  menu: {
    drawerIsOpen: false,
  },
  user: {
    userInfo: {
      accessToken: localStorage.getItem('accessToken') || null,
      idToken: localStorage.getItem('idToken') || null,
      expiresAt: parseInt(localStorage.getItem('expiresAt') || '0'),
    },
    userProfile: getInitialUserProfile(),
    inviteCode: localStorage.getItem('inviteCode') || '',
    customerId: getInitialCustomerId(),
    customerIdLoading: false,
    customerIdError: null,
  },
  loadCompetitors: {
    loading: false,
    competitors: [],
    error: null,
  },
  addCompetitor: {
    loading: false,
    username: '',
    error: null,
    showModal: false,
  },
  snackbar: {
    type: SnackbarType.HIDDEN,
    title: '',
  },
  followersExplorer: {
    selectedCompetitors: [],
    verifiedOnly: true,
    hideBots: false,
    followersCount: {
      from: 10000,
      to: 100000,
    },
    engagementRate: {
      from: 0,
      to: 100,
    },
  },
  loadFollowers: {
    loading: false,
    followers: [],
    error: null,
  },
  loadContent: {
    loading: false,
    content: [],
    error: null,
  },
  loadStats: {
    loading: false,
    stats: [],
    error: null,
  },
  loadFeedAds: {
    loading: false,
    content: [],
    error: null,
  },
  contentExplorer: {
    selectedCompetitors: [],
  },
};
