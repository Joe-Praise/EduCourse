import * as types from '../constants/platformConstants';
import { PlatformStats } from '../api/platformApi';

type PlatformState = {
  stats: PlatformStats | null;
};

const initialState: PlatformState = {
  stats: null,
};

const platformSlice = (state = initialState, action: any): PlatformState => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_PLATFORM_STATS_SUCCESS:
      return { ...state, stats: payload };
    case types.GET_PLATFORM_STATS_FAIL:
      return { ...state, stats: null };
    default:
      return state;
  }
};

export default platformSlice;
