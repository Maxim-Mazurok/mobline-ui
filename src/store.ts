import { applyMiddleware, combineReducers, compose, createStore, Dispatch, Reducer, Store } from 'redux';
import GlobalState from './types/GlobalState';
import { Actions } from './actions';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { userReducer } from './reducers/user';
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
import { loadCompetitorsReducer } from './reducers/loadCompetitors';
import { menuReducer } from './reducers/menu';
import { addCompetitorReducer } from './reducers/addCompetitor';
import { snackbarReducer } from './reducers/snackbar';
import { followersExplorerReducer } from './reducers/followersExplorer';
import { defaultState } from './defaultState';
import { loadFollowersReducer } from './reducers/loadFollowers';
import setupSocket, { SocketAction } from './actions/socket';
import createSagaMiddleware from 'redux-saga';
import handleWSOutgoingMessage from './sagas';
import { SnackbarAction } from './actions/snackbar';
import { AddCompetitorAction } from './actions/addCompetitor';
import { LoadCompetitorsAction } from './actions/loadCompetitors';
import { contentExplorerReducer } from './reducers/content';
import { loadContentReducer } from './reducers/loadContent';
import { loadStatsReducer } from './reducers/loadStats';
import { loadFeedAdsReducer } from './reducers/loadFeedAds';

const configureStore = (state: GlobalState = defaultState): Store<GlobalState, Actions> => {
  const rootReducer: Reducer<GlobalState, Actions> = combineReducers({
    menu: menuReducer,
    user: userReducer,
    loadCompetitors: loadCompetitorsReducer,
    addCompetitor: addCompetitorReducer,
    snackbar: snackbarReducer,
    followersExplorer: followersExplorerReducer,
    loadFollowers: loadFollowersReducer,
    contentExplorer: contentExplorerReducer,
    loadContent: loadContentReducer,
    loadStats: loadStatsReducer,
    loadFeedAds: loadFeedAdsReducer,
  });

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer as Reducer<GlobalState, Actions>,
    state as any,
    compose(
      applyMiddleware(
        thunk as ThunkMiddleware<GlobalState, Actions>,
        sagaMiddleware,
      ),
      devToolsEnhancer({ trace: true }),
    ),
  );

  const socket = setupSocket(store.dispatch as Dispatch<SocketAction | SnackbarAction | AddCompetitorAction> & ThunkDispatch<GlobalState, undefined, LoadCompetitorsAction>);
  sagaMiddleware.run(handleWSOutgoingMessage, socket);

  return store;
};

export const store = configureStore();
