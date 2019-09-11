import { action } from 'typesafe-actions';
import { Competitor, UserInfo } from '../types/GlobalState';
import { OpenDrawerAction } from './openDrawerAction';
import { CloseDrawerAction } from './closeDrawerAction';
import { Auth0UserProfile } from 'auth0-js';
import { HandleLoginAction } from './handleLoginAction';
import { UserProfileAction } from './userProfileAction';
import { SetInviteCodeAction } from './setInviteCodeAction';
import { GetCustomerIdAction } from './getCustomerId';
import { SHOW_SNACKBAR, SnackbarData } from './snackbar';
import {
  SELECT_COMPETITOR,
  SELECT_SINGLE_COMPETITOR,
  SET_VERIFIED_ONLY,
  UNSELECT_COMPETITOR,
} from '../reducers/followersExplorer';
import { AnyAction } from 'redux';

export const API_URL = process.env.REACT_APP_API_URL;
export const WS_HOST = process.env.REACT_APP_WS_HOST;
export const WS_PORT = process.env.REACT_APP_WS_PORT;
export const WS_SCHEME = process.env.REACT_APP_WS_SCHEME;
export const WS_HEARTBEAT = process.env.REACT_APP_WS_HEARTBEAT === 'true';

export const OPEN_DRAWER = 'openDrawerAction';
export const CLOSE_DRAWER = 'closeDrawerAction';
export const HANDLE_LOGIN = 'handleLoginAction';
export const USER_PROFILE = 'userProfileAction';
export const SET_INVITE_CODE = 'setInviteCodeAction';

export type MenuAction =
  | OpenDrawerAction
  | CloseDrawerAction
  ;

export type UserAction =
  | HandleLoginAction
  | UserProfileAction
  | SetInviteCodeAction
  | GetCustomerIdAction
  ;

export type Actions = AnyAction;

export const openDrawer = () => action(OPEN_DRAWER);
export const closeDrawer = () => action(CLOSE_DRAWER);
export const handleLogin = (userInfo: UserInfo) => action(HANDLE_LOGIN, userInfo);
export const handleUserProfile = (profile: Auth0UserProfile) => action(USER_PROFILE, profile);
export const setInviteCode = (inviteCode: string) => action(SET_INVITE_CODE, inviteCode);
export const showSnackbar = (data: SnackbarData) => action(SHOW_SNACKBAR, data);
export const selectCompetitor = (competitorPk: Competitor['userPk']) => action(SELECT_COMPETITOR, competitorPk);
export const setVerifiedOnly = (verifiedOnly: boolean) => action(SET_VERIFIED_ONLY, verifiedOnly);
export const selectSingleCompetitor = (competitorPk: Competitor['userPk']) => action(SELECT_SINGLE_COMPETITOR, competitorPk);
export const unselectCompetitor = (competitorPk: Competitor['userPk']) => action(UNSELECT_COMPETITOR, competitorPk);
