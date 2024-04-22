import { AppDispatch, RootState } from '../store';
import * as api from '../api/publicProfileApi';
import * as types from '../constants/publicProfile';
import { ThunkAction } from 'redux-thunk';
import { OmittedInstructorDataType } from '../api/instructorApi';
import { NavigateFunction } from 'react-router-dom';
import {
	dispatchErrorHandler,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';
import { user } from '../api/userApi';

type GetPublicProfileSuccess = {
	type: typeof types.GET_USER_PUBLIC_PROFILE_SUCCESS;
	payload: any;
};

type GetPublicProfileFail = {
	type: typeof types.GET_USER_PUBLIC_PROFILE_FAIL;
	payload: any;
};

export type PublicProfileActionTypes =
	| GetPublicProfileSuccess
	| GetPublicProfileFail;
export type UserThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	PublicProfileActionTypes
>;

interface CourseType {
	_id: string;
	title: string;
	description: string;
	level: string;
	instructors: Instructor[];
	category: Category;
	duration: string;
	ratingsAverage: number;
	ratingSummary: any[];
	ratingsQuantity: number;
	price: number;
	priceCategory: string;
	studentsQuantity: number;
	createdAt: string;
	slug: string;
	imageCover: string;
	id: string;
}

export interface Category {
	_id: string;
	name: string;
	group: string;
}

export interface Instructor {
	_id: string;
	userId: UserID;
	description: string;
	links: Link[];
	id: string;
}

export interface Link {
	_id: string;
	platform: string;
	url: string;
}

export interface UserID {
	_id: string;
	name: string;
	email: string;
	role: string[];
	photo: string;
}

export interface publicProfileType {
	user: user | OmittedInstructorDataType;
	courses: CourseType;
	isInstructor: boolean;
}

export const getPublicProfileAction =
	(
		// details: paginateType,
		userId: string,
		navigate: NavigateFunction
		// queryString: string = ''
	): UserThunk =>
	async (dispatch: AppDispatch) => {
		try {
			dispatch(resetPublicProfile());
			const response = await api.getPublicProfileApi(userId);

			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_USER_PUBLIC_PROFILE_SUCCESS,
				payload: response,
			});

			navigate(`/user/${userId}`);
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			dispatch({
				type: types.GET_USER_PUBLIC_PROFILE_FAIL,
				payload: error.message,
			});
		}
	};

export const resetPublicProfile = () => {
	return {
		type: types.RESET_USER_PUBLIC_PROFILE,
	};
};
