import { applyMiddleware, combineReducers, compose, createStore, Reducer, Store } from "redux";
import GlobalState from "./types/GlobalState";
import { Actions } from "./actions";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { userReducer } from "./reducers/user";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { loadCompetitorsReducer } from "./reducers/loadCompetitors";
import { menuReducer } from "./reducers/menu";
import { addCompetitorReducer } from "./reducers/addCompetitor";
import { snackbarReducer } from "./reducers/snackbar";
import { selectedCompetitorsReducer } from "./reducers/selectedCompetitors";
import { defaultState } from "./defaultState";
import { loadFollowersReducer } from "./reducers/loadFollowers";

const configureStore = (state: GlobalState = defaultState): Store => {
  const rootReducer: Reducer<GlobalState, Actions> = combineReducers({
    menu: menuReducer,
    user: userReducer,
    loadCompetitors: loadCompetitorsReducer,
    addCompetitor: addCompetitorReducer,
    snackbar: snackbarReducer,
    selectedCompetitors: selectedCompetitorsReducer,
    loadFollowers: loadFollowersReducer,
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
