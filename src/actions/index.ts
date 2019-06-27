import { SelectMenuAction } from "./selectMenuAction";
import { action } from 'typesafe-actions';
import { SelectedMenuIndex, UserInfo } from "../types/GlobalState";
import { OpenDrawerAction } from "./openDrawerAction";
import { CloseDrawerAction } from "./closeDrawerAction";
import { Auth0UserProfile } from "auth0-js";
import { HandleLoginAction } from "./handleLoginAction";
import { UserProfileAction } from "./userProfileAction";
import { SetInviteCodeAction } from "./setInviteCodeAction";
import { LoadCompetitorsAction } from "./loadCompetitors";
import { GetCustomerIdAction } from "./getCustomerId";
import { AddCompetitorAction } from "./addCompetitor";
import { SHOW_SNACKBAR, SnackbarAction, SnackbarData } from "./snackbar";

export const API_URL = process.env.REACT_API_URL;

export const SELECT_MENU = 'selectMenuAction';
export const OPEN_DRAWER = 'openDrawerAction';
export const CLOSE_DRAWER = 'closeDrawerAction';
export const HANDLE_LOGIN = 'handleLoginAction';
export const USER_PROFILE = 'userProfileAction';
export const SET_INVITE_CODE = 'setInviteCodeAction';

export const GET_CUSTOMER_ID_SUCCESS = 'getCustomerIdSuccess';
export type GET_CUSTOMER_ID_SUCCESS = 'getCustomerIdSuccess';
export const GET_CUSTOMER_ID_FAILURE = 'getCustomerIdFailure';
export type GET_CUSTOMER_ID_FAILURE = 'getCustomerIdFailure';
export const GET_CUSTOMER_ID_STARTED = 'getCustomerIdStarted';
export type GET_CUSTOMER_ID_STARTED = 'getCustomerIdStarted';

export type MenuAction =
  | SelectMenuAction
  | OpenDrawerAction
  | CloseDrawerAction
  ;

export type UserAction =
  | HandleLoginAction
  | UserProfileAction
  | SetInviteCodeAction
  | GetCustomerIdAction
  ;

export type Actions =
  & MenuAction
  & UserAction
  & LoadCompetitorsAction
  & AddCompetitorAction
  & SnackbarAction
  ;

export const selectMenu = (index: SelectedMenuIndex) => action(SELECT_MENU, index);
export const openDrawer = () => action(OPEN_DRAWER);
export const closeDrawer = () => action(CLOSE_DRAWER);
export const handleLogin = (userInfo: UserInfo) => action(HANDLE_LOGIN, userInfo);
export const handleUserProfile = (profile: Auth0UserProfile) => action(USER_PROFILE, profile);
export const setInviteCode = (inviteCode: string) => action(SET_INVITE_CODE, inviteCode);
export const showSnackbar = (data: SnackbarData) => action(SHOW_SNACKBAR, data);
