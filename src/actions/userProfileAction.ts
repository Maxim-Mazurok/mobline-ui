import { Auth0UserProfile } from "auth0-js";
import { USER_PROFILE } from "./index";

export const userProfileAction = (userProfile: Auth0UserProfile): UserProfileAction => ({
  type: USER_PROFILE,
  payload: userProfile,
});

export interface UserProfileAction {
  type: typeof USER_PROFILE,
  payload: Auth0UserProfile
}
