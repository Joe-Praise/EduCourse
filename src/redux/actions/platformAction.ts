import { getPlatformStatsApi } from '../api/platformApi';
import * as types from '../constants/platformConstants';
import { throwErrorHandler } from '../../util/helperFunctions/helper';

export const getPlatformStatsAction = () => async (dispatch: any) => {
  try {
    const response = await getPlatformStatsApi() as any;
    throwErrorHandler(response?.error);
    dispatch({ type: types.GET_PLATFORM_STATS_SUCCESS, payload: response?.data });
  } catch {
    dispatch({ type: types.GET_PLATFORM_STATS_FAIL });
  }
};
