import { Auth0UserProfile } from 'auth0-js';
import { IGUsername } from '../actions/addCompetitor';
import { SnackbarData } from '../actions/snackbar';
import { Follower } from '../reducers/loadFollowers';
import { Content } from '../reducers/loadContent';
import { Stats } from '../reducers/loadStats';

export type DrawerIsOpen = boolean;

export interface UserInfo {
  accessToken: string | null,
  idToken: string | null,
  expiresAt: number | null,
}

export interface Competitor {
  userPk: string,
  username: string,
  profilePicUrl: string,
  isVerified?: boolean,
  mediaCount: number,
  followerCount: number,
  followingCount: number,
  status: string,
  parseFollowersListStarted?: boolean,
  parseFollowersListFinished?: boolean,
  parseFollowersListProgress?: {
    done: number,
    total: number,
  },
  parsePostsStarted?: boolean,
  parsePostsFinished?: boolean,
  parsePostsProgress?: {
    done: number,
    total: number,
  },
  parseFeedAdsStarted?: boolean,
  parseFeedAdsFinished?: boolean,
  parseFeedAdsProgress?: {
    done: number,
    total: number,
  },
}

export default interface GlobalState {
  menu: {
    drawerIsOpen: DrawerIsOpen,
  },
  user: {
    userInfo: UserInfo,
    userProfile: Auth0UserProfile | null,
    inviteCode: string,
    customerId: number | null,
    customerIdLoading: boolean,
    customerIdError: string | null,
  },
  loadCompetitors: {
    loading: boolean,
    competitors: Competitor[],
    error: string | null,
  },
  addCompetitor: {
    loading: boolean,
    username: IGUsername,
    error: string | null,
    showModal: boolean,
  },
  snackbar: SnackbarData,
  followersExplorer: {
    selectedCompetitors: Competitor['userPk'][],
    verifiedOnly: boolean,
    hideBots: boolean,
    followersCount: {
      from: number,
      to: number,
    },
    engagementRate: {
      from: number,
      to: number,
    }
  }
  loadFollowers: {
    loading: boolean,
    followers: Follower[],
    error: string | null,
  },
  loadContent: {
    loading: boolean,
    content: Content[],
    error: string | null,
  },
  loadStats: {
    loading: boolean,
    stats: Stats | null,
    error: string | null,
  },
  loadFeedAds: {
    loading: boolean,
    content: Content[],
    error: string | null,
  },
  contentExplorer: {
    selectedCompetitors: Competitor['userPk'][],
  }
}
