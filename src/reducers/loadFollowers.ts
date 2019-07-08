import { defaultState } from "../defaultState";
import { LoadFollowersAction } from "../actions/loadFollowers";
import { Competitor } from "../types/GlobalState";

export const LOAD_FOLLOWERS_SUCCESS = 'loadFollowersSuccess';
export type LOAD_FOLLOWERS_SUCCESS = 'loadFollowersSuccess';

export const LOAD_FOLLOWERS_FAILURE = 'loadFollowersFailure';
export type LOAD_FOLLOWERS_FAILURE = 'loadFollowersFailure';

export const LOAD_FOLLOWERS_STARTED = 'loadFollowersStarted';
export type LOAD_FOLLOWERS_STARTED = 'loadFollowersStarted';

export type Follower = {
  username: Competitor["username"],
  userPk: Competitor["userPk"],
  profilePicUrl: Competitor["profilePicUrl"],
  isVerified?: Competitor["isVerified"],
  followersCount?: Competitor["followersCount"],
}

export const loadFollowersReducer = (state: typeof defaultState.loadFollowers = defaultState.loadFollowers, action: LoadFollowersAction): typeof defaultState.loadFollowers => {
  switch (action.type) {
    case LOAD_FOLLOWERS_STARTED:
      return {
        ...state,
        loading: true
      };
    case LOAD_FOLLOWERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        followers: action.payload,
      };
    case LOAD_FOLLOWERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Unknown error',
      };
    default:
      return state;
  }
};
