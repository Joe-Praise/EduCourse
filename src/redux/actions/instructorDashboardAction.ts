import { AppDispatch, RootState } from '../store';
import { ThunkAction } from 'redux-thunk';
import * as types from '../constants/instructorDashboardConstants';
import * as api from '../api/instructorDashboardApi';
import { CourseFormPayload } from '../api/instructorDashboardApi';
import {
  dispatchErrorHandler,
  dispatchSuccessHandler,
  throwErrorHandler,
} from '../../util/helperFunctions/helper';
import { NavigateFunction } from 'react-router-dom';

type DashboardThunk = ThunkAction<void, RootState, undefined, any>;

export const getDashboardOverviewAction = (): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.SET_DASHBOARD_LOADING });
    try {
      const response = await api.getDashboardOverviewApi();
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.GET_DASHBOARD_OVERVIEW_SUCCESS, payload: response.data });
    } catch (err: any) {
      dispatch({ type: types.GET_DASHBOARD_OVERVIEW_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to load dashboard');
    }
  };

export const getInstructorCoursesAction =
  (instructorId: string, page = '1'): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.SET_DASHBOARD_LOADING });
    try {
      const response = await api.getInstructorCoursesApi(instructorId, page);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.GET_INSTRUCTOR_COURSES_SUCCESS, payload: response });
    } catch (err: any) {
      dispatch({ type: types.GET_INSTRUCTOR_COURSES_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to load courses');
    }
  };

export const updateInstructorProfileAction =
  (payload: Record<string, any>): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.SET_DASHBOARD_LOADING });
    try {
      const response = await api.updateInstructorProfileApi(payload);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.UPDATE_INSTRUCTOR_PROFILE_SUCCESS, payload: response.data });
      dispatchSuccessHandler(dispatch, 'Profile updated successfully!');
    } catch (err: any) {
      dispatch({ type: types.UPDATE_INSTRUCTOR_PROFILE_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to update profile');
    }
  };

export const submitCourseForReviewAction =
  (courseId: string): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.submitCourseForReviewApi(courseId);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.SUBMIT_COURSE_FOR_REVIEW_SUCCESS, payload: response.data });
      dispatchSuccessHandler(dispatch, 'Course submitted for review!');
    } catch (err: any) {
      dispatch({ type: types.SUBMIT_COURSE_FOR_REVIEW_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to submit course');
    }
  };

export const getMyInstructorProfileAction =
  (userId: string): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.getMyInstructorProfileApi(userId);
      const { error } = response;
      throwErrorHandler(error);
      const profile = Array.isArray(response.data) ? response.data[0] : response.data;
      dispatch({ type: types.GET_MY_INSTRUCTOR_PROFILE_SUCCESS, payload: profile });
    } catch (err: any) {
      dispatch({ type: types.GET_MY_INSTRUCTOR_PROFILE_FAIL });
    }
  };

export const createCourseAction =
  (payload: CourseFormPayload, navigate: NavigateFunction): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.SET_DASHBOARD_LOADING });
    try {
      const response = await api.createCourseApi(payload);
      const { error } = response;
      throwErrorHandler(error ?? '');
      dispatch({ type: types.CREATE_COURSE_SUCCESS, payload: response.data });
      dispatchSuccessHandler(dispatch, 'Course created successfully!');
      navigate('/instructor/dashboard');
    } catch (err: any) {
      dispatch({ type: types.CREATE_COURSE_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to create course');
    }
  };

export const updateCourseAction =
  (courseId: string, payload: Partial<CourseFormPayload>, navigate: NavigateFunction): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.SET_DASHBOARD_LOADING });
    try {
      const response = await api.updateCourseApi(courseId, payload);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.UPDATE_COURSE_SUCCESS, payload: response.data });
      dispatchSuccessHandler(dispatch, 'Course updated successfully!');
      navigate('/instructor/dashboard');
    } catch (err: any) {
      dispatch({ type: types.UPDATE_COURSE_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to update course');
    }
  };

export const getEditingCourseAction =
  (courseId: string): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.SET_DASHBOARD_LOADING });
    try {
      const response = await api.getSingleCourseByIdApi(courseId);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.GET_EDITING_COURSE_SUCCESS, payload: response.data });
    } catch (err: any) {
      dispatch({ type: types.GET_EDITING_COURSE_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to load course');
    }
  };

export const clearEditingCourseAction = (): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.CLEAR_EDITING_COURSE });
  };

export const getInstructorEarningsAction =
  (instructorId: string, page = '1'): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: types.SET_DASHBOARD_LOADING });
    try {
      const response = await api.getInstructorEarningsApi(instructorId, page);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.GET_INSTRUCTOR_EARNINGS_SUCCESS, payload: response });
    } catch (err: any) {
      dispatch({ type: types.GET_INSTRUCTOR_EARNINGS_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to load earnings');
    }
  };

export const getActivityFeedAction = (): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.getActivityFeedApi() as any;
      throwErrorHandler(response?.error);
      dispatch({ type: types.GET_ACTIVITY_FEED_SUCCESS, payload: response?.data ?? [] });
    } catch {
      dispatch({ type: types.GET_ACTIVITY_FEED_FAIL });
    }
  };

export const getEngagementHeatmapAction = (): DashboardThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.getEngagementHeatmapApi() as any;
      throwErrorHandler(response?.error);
      dispatch({ type: types.GET_ENGAGEMENT_HEATMAP_SUCCESS, payload: response?.data ?? [] });
    } catch {
      dispatch({ type: types.GET_ENGAGEMENT_HEATMAP_FAIL });
    }
  };
