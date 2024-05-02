import { landingPageDataType } from '../api/landingPageApi';
import * as types from '../constants/landingPageConstants';

export type landingPageState = {
	landingData: landingPageDataType;
};

const initialState: landingPageState = {
	landingData: {
		courses: [],
		instructors: [],
		categories: [],
		blogs: [],
	},
};

const landingPageSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.GET_LANDING_PAGE_SUCCESS:
			return {
				...state,
				landingData: payload,
			};
		case types.GET_LANDING_PAGE_FAIL:
			return {
				...state,
				landingData: {
					courses: [],
					instructor: [],
					categories: [],
					blogs: [],
				},
			};
		default:
			return {
				...state,
			};
	}
};

export default landingPageSlice;
