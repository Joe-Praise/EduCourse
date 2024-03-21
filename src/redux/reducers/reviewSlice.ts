import { getLocalStorage } from '../../util/helperFunctions/helper';
import { reviewDatatype, reviewType } from '../api/reviewApi';
import * as types from '../constants/reviewConstants';

export type reviewState = {
	review: reviewDatatype;
	singleReview: reviewType;
	reviewError: string;
};

const initialState: reviewState = {
	review: {
		status: '',
		metaData: {
			totalPages: 0,
			totalDocuments: 0,
			page: 0,
			count: 0,
			limit: 0,
		},
		data: [],
	},
	singleReview: {
		_id: '',
		userId: {
			_id: '',
			name: '',
			email: '',
			photo: '',
			role: [],
		},
		courseId: '',
		review: '',
		rating: 0,
		createdAt: '',
	},
	reviewError: '',
};

const reviewSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.GET_COURSE_REVIEW_SUCCESS:
			return {
				...state,
				review: payload,
			};
		case types.UPDATE_REVIEWS_SUCCESS:
			return {
				...state,
				review: updateReview(state.review, payload),
				singleReview: payload || state.singleReview,
			};
		case types.GET_COURSE_REVIEW_FAIL:
		case types.UPDATE_REVIEWS_FAIL:
		case types.DELETE_REVIEW_FAIL:
			return {
				...state,
				reviewError: payload,
			};
		case types.DELETE_REVIEW_SUCCESS:
			return {
				...state,
				review: state.review.data.filter((post) => post._id !== payload),
			};
		case types.CREATE_COURSE_REVIEW_SUCCESS: {
			const newReview = { ...payload.data }; // Create a copy of the payload data

			// Calculate new metaData
			const newMetaData = calculateMetaData(state.review.metaData);

			// Add loggedInUserDetails to newReview
			newReview.userId = getLocalStorage('profile')?.user;

			// Update data array
			const newData = addLoggedInUserDetails(newReview, state.review);

			return {
				...state,
				review: {
					...state.review,
					metaData: newMetaData,
					data: newData,
				},
			};
		}
		case types.CREATE_COURSE_REVIEW_FAIL:
			return {
				...state,
				reviewError: payload,
			};
		default:
			return state;
	}
};

const updateReview = (state: reviewState['review'], payload: any) => {
	const newArr = state.data.map((review) =>
		review._id === payload._id ? payload : review
	);
	return newArr;
};

const addLoggedInUserDetails = (
	review: reviewType,
	state: reviewState['review']
): reviewType[] => {
	const newData = [...state.data];

	if (newData.length >= state.metaData.limit) {
		newData.pop(); // Remove the last item if the limit is reached
	}

	newData.unshift(review); // Add the new review to the beginning of the array

	return newData;
};

const calculateMetaData = (
	metaData: reviewDatatype['metaData']
): reviewDatatype['metaData'] => {
	const newMetaData = { ...metaData }; // Create a copy of the metaData

	newMetaData.totalDocuments += 1;
	newMetaData.totalPages = Math.ceil(
		newMetaData.totalDocuments / newMetaData.limit
	);
	newMetaData.count =
		newMetaData.count < newMetaData.limit
			? newMetaData.count + 1
			: newMetaData.count;

	return newMetaData;
};
export default reviewSlice;

// metaData: {
// 	...state.review.metaData,
// 	totalDocuments: state.review.metaData.totalDocuments + 1,
// 	totalPages: Math.ceil(
// 		state.review.metaData.totalDocuments / state.review.metaData.limit
// 	),
// 	count:
// 		state.review.metaData.count < state.review.metaData.limit
// 			? state.review.metaData.count + 1
// 			: state.review.metaData.count,
// },
// data: [addLoggedInUserDetails(payload.data), ...state.review.data],

// const addLoggedInUserDetails = (payload: reviewType) => {
// 	const payloadCopy = payload;
// 	payloadCopy.userId = getLocalStorage('profile')?.user;
// 	return payloadCopy;
// };

// const addLoggedInUserDetails = (payload: any, state: reviewState['review']) => {
// 	const stateCopy = state;
// 	const payloadCopy = payload;
// 	// stateCopy.metaData = calculateMetaData(stateCopy.metaData);
// 	payloadCopy.userId = getLocalStorage('profile')?.user;

// 	if (stateCopy.data.length >= stateCopy.metaData.limit) {
// 		stateCopy.data = [
// 			payloadCopy,
// 			...stateCopy.data.slice(0, stateCopy.data.length - 1),
// 		];
// 	} else {
// 		stateCopy.data = [payloadCopy, ...stateCopy.data];
// 	}

// 	// console.log(stateCopy);
// 	return stateCopy.data;
// };
