import { SelectCompetitorAction } from "./selectCompetitors";
import { SET_HIDE_BOTS, SET_VERIFIED_ONLY } from "../reducers/followersExplorer";

export const setVerifiedOnly = (verifiedOnly: boolean): {
  type: SET_VERIFIED_ONLY,
  payload: boolean,
} => ({
  type: SET_VERIFIED_ONLY,
  payload: verifiedOnly,
});

export const setHideBots = (hideBots: boolean): {
  type: SET_HIDE_BOTS,
  payload: boolean,
} => ({
  type: SET_HIDE_BOTS,
  payload: hideBots,
});

export type FollowersExplorerAction =
  | SelectCompetitorAction
  | ReturnType<typeof setVerifiedOnly>
  | ReturnType<typeof setHideBots>
  ;
