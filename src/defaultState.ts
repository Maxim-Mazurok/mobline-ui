import { Auth0UserProfile } from "auth0-js";
import GlobalState from "./types/GlobalState";
import { MenuItemId } from "./reducers/menu";
import { SnackbarType } from "./actions/snackbar";

const getInitialUserProfile = (): Auth0UserProfile | null => {
  const userProfileString = localStorage.getItem('userProfile');
  if (userProfileString !== null && userProfileString !== "{}") {
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
  if (customerIdString !== null && customerIdString !== "") {
    const customerId = parseInt(customerIdString);
    if (!Number.isNaN(customerId)) return customerId;
  }
  return null;
};

export const defaultState: GlobalState = {
  menu: {
    selectedMenuItemId: MenuItemId.DASHBOARD,
    drawerIsOpen: false,
  },
  user: {
    userInfo: {
      accessToken: localStorage.getItem('accessToken') || null,
      idToken: localStorage.getItem('idToken') || null,
      expiresAt: parseInt(localStorage.getItem('expiresAt') || "0"),
    },
    userProfile: getInitialUserProfile(),
    inviteCode: localStorage.getItem('inviteCode') || "",
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
    username: "",
    error: null,
    showModal: false,
  },
  snackbar: {
    type: SnackbarType.HIDDEN,
    title: "",
  },
  selectedCompetitors: [],
};
