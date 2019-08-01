import { HANDLE_LOGIN, SET_INVITE_CODE, USER_PROFILE, UserAction } from "../actions";
import { defaultState } from "../defaultState";
import { GET_CUSTOMER_ID_FAILURE, GET_CUSTOMER_ID_STARTED, GET_CUSTOMER_ID_SUCCESS } from "../actions/getCustomerId";

export const userReducer = (state: typeof defaultState.user = defaultState.user, action: UserAction): typeof defaultState.user => {
  switch (action.type) {
    case HANDLE_LOGIN:
      localStorage.setItem('accessToken', action.payload.accessToken || "");
      localStorage.setItem('idToken', action.payload.idToken || "");
      localStorage.setItem('expiresAt', action.payload.expiresAt === null ? "0" : action.payload.expiresAt.toString());
      return {
        ...state,
        userInfo: {
          accessToken: action.payload.accessToken || null,
          idToken: action.payload.idToken || null,
          expiresAt: action.payload.expiresAt || null,
        },
      };
    case USER_PROFILE:
      localStorage.setItem('userProfile', action.payload === null ? "{}" : JSON.stringify(action.payload));
      return {
        ...state,
        userProfile: action.payload,
      };
    case SET_INVITE_CODE:
      localStorage.setItem('inviteCode', action.payload);
      return {
        ...state,
        inviteCode: action.payload,
      };
    case GET_CUSTOMER_ID_STARTED:
      return {
        ...state,
        customerIdLoading: true
      };
    case GET_CUSTOMER_ID_SUCCESS:
      return {
        ...state,
        customerIdLoading: false,
        customerIdError: null,
        customerId: action.payload,
      };
    case GET_CUSTOMER_ID_FAILURE:
      return {
        ...state,
        customerIdLoading: false,
        customerIdError: action.payload || 'Unknown error',
      };
    default:
      return state;
  }
};
