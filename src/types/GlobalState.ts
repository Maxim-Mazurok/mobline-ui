import { Auth0UserProfile } from "auth0-js";
import { IGUsername } from "../actions/addCompetitor";
import { SnackbarData } from "../actions/snackbar";
import { MenuItem } from "../reducers/menu";

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
  status: string,
}

export default interface GlobalState {
  menu: {
    selectedMenuItem: MenuItem,
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
}
