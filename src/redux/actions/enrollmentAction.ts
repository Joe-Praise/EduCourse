import { ThunkAction } from 'redux-thunk';
import { AppDispatch, RootState } from '../store';
import * as types from '../constants/enrollmentConstants';
import * as api from '../api/enrollmentApi';
import {
  dispatchErrorHandler,
  dispatchSuccessHandler,
  throwErrorHandler,
} from '../../util/helperFunctions/helper';
import { NavigateFunction } from 'react-router-dom';

type EnrollmentThunk = ThunkAction<void, RootState, undefined, any>;

export const createEnrollmentAction =
  (
    payload: api.EnrollmentPayload,
    navigate: NavigateFunction,
    slug: string,
    courseId: string,
  ): EnrollmentThunk =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: types.ENROLLMENT_ENROLLING });
      const response = await api.createEnrollmentApi(payload);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.CREATE_ENROLLMENT_SUCCESS, payload: response.data });
      dispatchSuccessHandler(dispatch, 'Successful Enrollment!');
      navigate(`/courses/${slug}/lecture/${courseId}`);
    } catch (err: any) {
      dispatch({ type: types.CREATE_ENROLLMENT_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Enrollment failed');
      // Only redirect to sign in for auth errors
      if (err.message?.toLowerCase().includes('not logged in') || err.message?.toLowerCase().includes('unauthorized')) {
        navigate('/signin');
      }
    }
  };

export const checkEnrollmentAction =
  (userId: string, courseId: string): EnrollmentThunk =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: types.ENROLLMENT_CHECKING });
      const response = await api.checkEnrollmentApi(userId, courseId);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.CHECK_ENROLLMENT_SUCCESS, payload: response.data });
    } catch {
      dispatch({ type: types.CHECK_ENROLLMENT_FAIL });
    }
  };
