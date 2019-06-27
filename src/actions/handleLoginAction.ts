import { HANDLE_LOGIN } from "./index";
import { UserInfo } from "../types/GlobalState";

export const handleLoginAction = (userInfo: UserInfo): HandleLoginAction => ({
  type: HANDLE_LOGIN,
  payload: userInfo,
});

export interface HandleLoginAction {
  type: typeof HANDLE_LOGIN,
  payload: UserInfo
}
