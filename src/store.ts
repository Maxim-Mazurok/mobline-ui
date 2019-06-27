import { applyMiddleware, combineReducers, compose, createStore, Reducer, Store } from "redux";
import GlobalState from "./types/GlobalState";
import { Actions } from "./actions";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { userReducer } from "./reducers/user";
import { Auth0UserProfile } from "auth0-js";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { loadCompetitorsReducer } from "./reducers/loadCompetitors";
import { menuReducer } from "./reducers/menu";
import { addCompetitorReducer } from "./reducers/addCompetitor";
import { snackbarReducer } from "./reducers/snackbar";
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
    selectedMenuIndex: undefined,
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
};

const configureStore = (state: GlobalState = defaultState): Store => {
  const rootReducer: Reducer<GlobalState, Actions> = combineReducers({
    menu: menuReducer,
    user: userReducer,
    loadCompetitors: loadCompetitorsReducer,
    addCompetitor: addCompetitorReducer,
    snackbar: snackbarReducer,
  });
  return createStore(
    rootReducer as Reducer<GlobalState, Actions>,
    state as any,
    compose(
      applyMiddleware(
        thunk as ThunkMiddleware<GlobalState, Actions>,
      ),
      devToolsEnhancer({ trace: true })
    )
  );
};

export const store = configureStore();
