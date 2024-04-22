import { publicProfileType } from '../actions/publicProfileAction';
import * as types from '../constants/publicProfile';

type profileState = {
	publicProfile: publicProfileType;
};

const initialState: profileState = {
	publicProfile: {
		user: {
			_id: '',
			name: '',
			email: '',
			photo: '',
			role: '',
		},
		courses: {
			_id: '',
			title: '',
			description: '',
			level: '',
			instructors: [],
			category: {
				_id: '',
				name: '',
				group: '',
			},
			duration: '',
			ratingsAverage: 0,
			ratingSummary: [],
			ratingsQuantity: 0,
			price: 0,
			priceCategory: '',
			studentsQuantity: 0,
			createdAt: '',
			slug: '',
			imageCover: '',
			id: '',
		},
		isInstructor: false,
	},
};

const publicProfileSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.GET_USER_PUBLIC_PROFILE_SUCCESS:
			return {
				...state,
				publicProfile: payload,
			};
		case types.GET_USER_PUBLIC_PROFILE_FAIL:
			return {
				...state,
				publicProfile: {
					user: {
						_id: '',
						name: '',
						email: '',
						photo: '',
						role: '',
					},
					courses: {
						_id: '',
						title: '',
						description: '',
						level: '',
						instructors: [],
						category: {
							_id: '',
							name: '',
							group: '',
						},
						duration: '',
						ratingsAverage: 0,
						ratingSummary: [],
						ratingsQuantity: 0,
						price: 0,
						priceCategory: '',
						studentsQuantity: 0,
						createdAt: '',
						slug: '',
						imageCover: '',
						id: '',
					},
					isInstructor: false,
				},
			};
		default:
			return state;
	}
};

export default publicProfileSlice;
