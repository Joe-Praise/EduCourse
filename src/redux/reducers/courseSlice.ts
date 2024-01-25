// import { createSlice } from '@reduxjs/toolkit';
import * as types from '../constants/courseConstants';
// type user = {
// 	name: string;
// 	email: string;
// 	photo: string;
// 	role: string;
// 	createdAt: string;
// };

type courseState = {
	filterState: boolean;
};

const initialState: courseState = {
	filterState: false,
};

const courseSlice = (state = initialState, action: any) => {
	const { type } = action;
	switch (type) {
		case types.SET_FILTER:
			return {
				...state,
				filterState: !state.filterState,
			};
		default:
			return state;
	}
};

export default courseSlice;
