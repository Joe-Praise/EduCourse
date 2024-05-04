import { OmittedInstructorDataType } from '../api/instructorApi';
import * as types from '../constants/instructorConstants';

export type instructorState = {
	instructors: OmittedInstructorDataType[];
	myLearningInstructors: OmittedInstructorDataType[];
	singleInstructor: OmittedInstructorDataType;
	instructorError: string;
};

const initialState: instructorState = {
	instructors: [],
	myLearningInstructors: [],
	singleInstructor: {
		_id: '',
		userId: {
			_id: '',
			name: '',
			email: '',
			role: [],
			photo: '',
		},
		description: '',
		expertise: '',
		links: [],
		id: '',
	},
	instructorError: '',
};

const instructorSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.GET_INSTRUCTORS_SUCCESS:
			return {
				...state,
				instructors: payload,
			};
		case types.UPDATE_INSTRUCTOR_SUCCESS:
			return {
				...state,
				instructors: state.instructors.map((instructor) =>
					instructor._id === payload._id ? payload : instructor
				),
				singleInstructor: payload || state.singleInstructor,
			};
		case types.GET_INSTRUCTORS_FAIL:
		case types.UPDATE_INSTRUCTOR_FAIL:
		case types.DELETE_INSTRUCTOR_FAIL:
			return {
				...state,
				instructorError: payload,
			};
		case types.GET_MY_LEARNING_INSTRUCTORS_SUCCESS:
			return {
				...state,
				myLearningInstructors: payload,
			};
		case types.GET_MY_LEARNING_INSTRUCTORS_FAIL:
			return {
				...state,
				myLearningInstructors: [],
			};
		case types.CREATE_INSTRUCTOR_SUCCESS:
			return {
				...state,
				instructors: [payload.data, ...state.instructors],
			};
		case types.CREATE_INSTRUCTOR_FAIL:
			return {
				...state,
				instructorError: payload,
			};
		default:
			return state;
	}
};

export default instructorSlice;
