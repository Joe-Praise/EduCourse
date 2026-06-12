import { NavigateFunction } from "react-router-dom";
import {
  dispatchErrorHandler,
  dispatchSuccessHandler,
  getLocalStorage,
  removeLocalStorage,
  saveLocalStorage,
  throwErrorHandler,
  welcomeGreeting,
} from "../../util/helperFunctions/helper";
import * as api from "../api/authApi";
import * as types from "../constants/authConstants";
import { ThunkAction } from "redux-thunk";
import { AppDispatch, RootState } from "../store";

type SignUpSuccessAction = {
  type: typeof types.SIGNUP_SUCCESS;
  payload: any; // Adjust the payload type accordingly
};

type SignUpFailAction = {
  type: typeof types.SIGNUP_FAIL;
  payload: any; // Adjust the payload type accordingly
};

type SignInSuccessAction = {
  type: typeof types.SIGNIN_SUCCESS;
  payload: any; // Adjust the payload type accordingly
};

type SignInFailAction = {
  type: typeof types.SIGNIN_FAIL;
  payload: any; // Adjust the payload type accordingly
};

type RefreshTokenFail = {
  type: typeof types.REFRESH_TOKEN_FAIL;
  payload: any;
};

export type AuthActionTypes =
  | SignUpSuccessAction
  | SignUpFailAction
  | SignInSuccessAction
  | SignInFailAction
  | RefreshTokenFail;

// Correctly align the AppDispatch type
export type AppDispatchType = AppDispatch;

// Correctly align the AppThunk type
export type AuthThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  AuthActionTypes
>;

export const signUpAction =
  (details: api.signUpType, navigate: NavigateFunction): AuthThunk =>
  async (dispatch: AppDispatch) => {
    try {
      localStorage.removeItem("profile");
      const response = await api.signUp(details);
      const { error } = response;

      throwErrorHandler(error);

      dispatch({
        type: types.SIGNUP_SUCCESS,
        payload: types.SIGNUP_SUCCESS_MESSAGE,
      });

      dispatchSuccessHandler(dispatch, "Account Created!");
      navigate("/signin");
    } catch (error: any) {
      dispatchErrorHandler(dispatch, error.message);
      // dispatch({
      // 	type: types.SIGNUP_FAIL,
      // 	payload: error.message || types.ERROR_MESSAGE,
      // });
    }
  };

export const signInAction =
  (details: api.signInType, navigate: NavigateFunction): AuthThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.signIn(details);
      const { error } = response;

      throwErrorHandler(error);

      const { data: user, token, status } = response;

      const profile = {
        user: user?.user,
        token,
        status,
      };

      saveLocalStorage(profile, "profile");
      dispatch({
        type: types.SIGNIN_SUCCESS,
        payload: profile,
      });

      // dispatchSuccessHandler(dispatch, `Welcome Back ${user.user.name}!`);
      dispatchSuccessHandler(dispatch, welcomeGreeting(user?.user));

      navigate("/");
    } catch (error: any) {
      dispatchErrorHandler(dispatch, error.message);
      // await dispatch({
      // 	type: types.SIGNIN_FAIL,
      // 	payload: error.message || types.ERROR_MESSAGE,
      // });
    }
  };

export const isLoggedIn =
  (navigate: NavigateFunction): AuthThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.checkToken();
      const { error } = response;
      if (error) {
        removeLocalStorage("profile");
        dispatch({
          type: types.REFRESH_TOKEN_FAIL,
          payload: error,
        });
        navigate("/signin");
        return;
      }
      const { data: user, token, status } = response;
      const profile = {
        user: user?.user,
        token,
        status,
      };

      saveLocalStorage(profile, "profile");
      dispatch({
        type: types.SIGNIN_SUCCESS,
        payload: profile,
      });
    } catch (error: any) {
      dispatchErrorHandler(dispatch, error.message);
    }
  };

export const logoutAction = (navigate: NavigateFunction) => {
  // Fire-and-forget server revoke. We don't await it before clearing local
  // state — if the network is down the user still needs to be logged out
  // client-side immediately. The httpOnly refresh cookie ships with the
  // request because the axios instance has `withCredentials: true`.
  void api.logoutApi().catch(() => undefined);

  try {
    removeLocalStorage("profile");

    if (getLocalStorage("profile") === null) {
      navigate("/signin");
    } else {
      throw new Error("Somthing went wrong!");
    }
    return { type: types.LOGOUT };
  } catch (error: any) {
    return { type: types.LOGOUT, payload: types.ERROR_MESSAGE };
  }
};

export const setInitialAuthState = (navigate: NavigateFunction) => {
  navigate("/signin");
  return { type: types.LOGOUT };
};

export const forgotPasswordAction =
  (email: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.forgotPassword(email);
      const { error } = response;
      throwErrorHandler(error);
      dispatchSuccessHandler(
        dispatch,
        response?.message ||
          "If an account with that email exists, a reset link has been sent."
      );
      return { ok: true };
    } catch (error: any) {
      dispatchErrorHandler(dispatch, error.message);
      return { ok: false };
    }
  };

export const resetPasswordAction =
  (
    token: string,
    payload: api.resetPasswordPayload,
    navigate: NavigateFunction
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.resetPassword(token, payload);
      const { error } = response;
      throwErrorHandler(error);

      const { data: user, token: newToken, status } = response;
      const profile = {
        user: user?.user,
        token: newToken,
        status,
      };

      saveLocalStorage(profile, "profile");
      dispatch({
        type: types.SIGNIN_SUCCESS,
        payload: profile,
      });

      dispatchSuccessHandler(dispatch, "Password reset successful!");
      navigate("/");
      return { ok: true };
    } catch (error: any) {
      dispatchErrorHandler(dispatch, error.message);
      return { ok: false };
    }
  };
