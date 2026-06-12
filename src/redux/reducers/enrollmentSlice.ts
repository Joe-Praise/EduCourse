import * as types from '../constants/enrollmentConstants';

type EnrollmentState = {
  enrolled: boolean;
  enrollmentData: any;
  isChecking: boolean;
  isEnrolling: boolean;
};

const initialState: EnrollmentState = {
  enrolled: false,
  enrollmentData: null,
  isChecking: false,
  isEnrolling: false,
};

const enrollmentSlice = (state = initialState, action: any): EnrollmentState => {
  const { type, payload } = action;
  switch (type) {
    case types.ENROLLMENT_CHECKING:
      return { ...state, isChecking: true, enrolled: false };
    case types.ENROLLMENT_ENROLLING:
      return { ...state, isEnrolling: true };
    case types.CREATE_ENROLLMENT_SUCCESS:
      return { ...state, enrolled: true, enrollmentData: payload, isEnrolling: false };
    case types.CREATE_ENROLLMENT_FAIL:
      return { ...state, enrolled: false, isEnrolling: false };
    case types.CHECK_ENROLLMENT_SUCCESS:
      return { ...state, enrolled: !!payload?.enrolled, isChecking: false };
    case types.CHECK_ENROLLMENT_FAIL:
      return { ...state, enrolled: false, isChecking: false };
    default:
      return state;
  }
};

export default enrollmentSlice;
