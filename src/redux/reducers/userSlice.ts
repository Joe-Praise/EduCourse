import { user, StreakData, BadgeData } from "../api/userApi";
import { LOGOUT, SIGNIN_SUCCESS } from "../constants/authConstants";
import * as types from "../constants/userConstants";

type userState = {
  userObj: user;
  // token: string;
  userError: string;
  streak: StreakData | null;
  badges: BadgeData[];
};

const initialState: userState = {
  userObj: {
    _id: "",
    name: "",
    email: "",
    photo: "",
    role: [],
  },
  // token: '',
  userError: "",
  streak: null,
  badges: [],
};

const userSlice = (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case SIGNIN_SUCCESS:
      return {
        ...state,
        userObj: payload?.user ?? state.userObj,
      };
    case LOGOUT:
      return {
        ...state,
        userObj: {},
        // token: '',
      };
    case types.GET_USER_SUCCESS:
      return {
        ...state,
        // payload.user if API wraps in { user: ... }
        // payload.data if API returns the envelope { status, data: <userDoc> }
        // fall back to current state so we never overwrite a valid userObj with undefined
        userObj: payload?.user ?? payload?.data ?? state.userObj,
      };
    case types.GET_USER_FAIL:
      return {
        ...state,
        userError: payload,
      };
    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        userObj: { ...state.userObj, ...payload.data?.user },
      };
    case types.GET_LEARNING_STREAK_SUCCESS:
      return { ...state, streak: payload ?? null };
    case types.GET_LEARNING_STREAK_FAIL:
      return { ...state, streak: null };
    case types.GET_USER_BADGES_SUCCESS:
      return { ...state, badges: payload ?? [] };
    case types.GET_USER_BADGES_FAIL:
      return { ...state, badges: [] };
    default:
      return state;
  }
};

export default userSlice;
