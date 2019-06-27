import axios from 'axios';
import { API_URL, GET_CUSTOMER_ID_FAILURE, GET_CUSTOMER_ID_STARTED, GET_CUSTOMER_ID_SUCCESS } from "./index";
import { ThunkAction } from "redux-thunk";
import GlobalState from "../types/GlobalState";
import { Dispatch } from "redux";
import { showSnackbarAction, SnackbarAction, SnackbarType } from "./snackbar";

const getCustomerIdSuccess = (customerId: number | null): {
  type: GET_CUSTOMER_ID_SUCCESS,
  payload: number | null,
} => {
  localStorage.setItem('customerId', customerId ? customerId.toString() : "");
  return {
    type: GET_CUSTOMER_ID_SUCCESS,
    payload: customerId,
  };
};

const getCustomerIdStarted = (): {
  type: GET_CUSTOMER_ID_STARTED,
} => ({
  type: GET_CUSTOMER_ID_STARTED
});

const getCustomerIdFailure = (error: string): {
  type: GET_CUSTOMER_ID_FAILURE,
  payload: string,
} => ({
  type: GET_CUSTOMER_ID_FAILURE,
  payload: error,
});

export type GetCustomerIdAction =
  | ReturnType<typeof getCustomerIdStarted>
  | ReturnType<typeof getCustomerIdSuccess>
  | ReturnType<typeof getCustomerIdFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, GetCustomerIdAction>;

export const getCustomerId = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<GetCustomerIdAction | SnackbarAction>, getState: () => GlobalState) => {
    dispatch(getCustomerIdStarted());

    const state = getState();

    axios
      .post(`${API_URL}/get_customer_id.php`, {
        sub: state.user.userProfile ? state.user.userProfile.sub : "",
      })
      .then(result => {
        let customerId: number | null = parseInt(result.data);
        if (Number.isNaN(customerId)) customerId = null;
        dispatch(getCustomerIdSuccess(customerId));
      })
      .catch(error => {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch(getCustomerIdFailure(errorMessage));
        dispatch(showSnackbarAction({
          title: errorMessage,
          type: SnackbarType.ERROR,
        }));
      })
      .finally(() => {
        return;
      });
  };
};
