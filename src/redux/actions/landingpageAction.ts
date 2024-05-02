import { ThunkAction } from 'redux-thunk';
import * as api from '../api/landingPageApi';
import * as types from '../constants/landingPageConstants';
import { AppDispatch, RootState } from '../store';
import {
	dispatchErrorHandler,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';

type GetLandingPageSuccessAction = {
	type: typeof types.GET_LANDING_PAGE_SUCCESS;
	payload: any;
};

type GetLandingPageFailAction = {
	type: typeof types.GET_LANDING_PAGE_FAIL;
	payload: any;
};

export type LandingPageActionTypes =
	| GetLandingPageSuccessAction
	| GetLandingPageFailAction;

export type LandingPageThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	LandingPageActionTypes
>;

export const getLandingPageAction =
	(): LandingPageThunk => async (dispatch: AppDispatch) => {
		try {
			const response = await api.getLandingPageApi();
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_LANDING_PAGE_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
		}
	};
