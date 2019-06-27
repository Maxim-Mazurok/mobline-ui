import { SET_INVITE_CODE } from "./index";

export const setInviteCodeAction = (setInviteCode: string): SetInviteCodeAction => ({
  type: SET_INVITE_CODE,
  payload: setInviteCode,
});

export interface SetInviteCodeAction {
  type: typeof SET_INVITE_CODE,
  payload: string,
}
