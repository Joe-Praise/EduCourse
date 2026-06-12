import * as types from '../constants/instructorDashboardConstants';
import {
  DashboardOverviewType,
  EarningType,
  InstructorCourseType,
  CourseFormPayload,
  ActivityItem,
  HeatmapCell,
} from '../api/instructorDashboardApi';
import { OmittedInstructorDataType } from '../api/instructorApi';
import { metaData } from '../sharedTypes';

type InstructorCoursesState = {
  data: InstructorCourseType[];
  metaData: metaData;
};

type EditingCourse = CourseFormPayload & { _id: string };

type InstructorDashboardState = {
  overview: DashboardOverviewType | null;
  instructorCourses: InstructorCoursesState;
  earnings: EarningType[];
  activityFeed: ActivityItem[];
  engagementHeatmap: HeatmapCell[];
  instructorProfile: OmittedInstructorDataType | null;
  editingCourse: EditingCourse | null;
  loading: boolean;
  error: string;
};

const initialState: InstructorDashboardState = {
  overview: null,
  instructorCourses: {
    data: [],
    metaData: {
      totalDocuments: 0,
      totalPages: 0,
      page: 0,
      count: 0,
      limit: 0,
    },
  },
  earnings: [],
  activityFeed: [],
  engagementHeatmap: [],
  instructorProfile: null,
  editingCourse: null,
  loading: false,
  error: '',
};

const instructorDashboardSlice = (state = initialState, action: any): InstructorDashboardState => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_DASHBOARD_LOADING:
      return { ...state, loading: true, error: '' };

    case types.RESET_DASHBOARD_LOADING:
      return { ...state, loading: false };

    case types.GET_DASHBOARD_OVERVIEW_SUCCESS:
      return { ...state, loading: false, overview: payload };

    case types.GET_DASHBOARD_OVERVIEW_FAIL:
      return { ...state, loading: false };

    case types.GET_INSTRUCTOR_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        instructorCourses: {
          data: payload.data ?? [],
          metaData: payload.metaData ?? initialState.instructorCourses.metaData,
        },
      };

    case types.GET_INSTRUCTOR_COURSES_FAIL:
      return { ...state, loading: false };

    case types.UPDATE_INSTRUCTOR_PROFILE_SUCCESS:
      return { ...state, loading: false };

    case types.UPDATE_INSTRUCTOR_PROFILE_FAIL:
      return { ...state, loading: false };

    case types.SUBMIT_COURSE_FOR_REVIEW_SUCCESS:
      // Update the course's publishedStatus in local state
      return {
        ...state,
        instructorCourses: {
          ...state.instructorCourses,
          data: state.instructorCourses.data.map((course) =>
            course._id === payload?._id
              ? { ...course, publishedStatus: 'review' }
              : course,
          ),
        },
      };

    case types.SUBMIT_COURSE_FOR_REVIEW_FAIL:
      return { ...state };

    case types.GET_INSTRUCTOR_EARNINGS_SUCCESS:
      return { ...state, loading: false, earnings: payload.data ?? [] };

    case types.GET_INSTRUCTOR_EARNINGS_FAIL:
      return { ...state, loading: false, earnings: [] };

    case types.GET_MY_INSTRUCTOR_PROFILE_SUCCESS:
      return { ...state, instructorProfile: payload };

    case types.GET_MY_INSTRUCTOR_PROFILE_FAIL:
      return { ...state };

    case types.CREATE_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        instructorCourses: {
          ...state.instructorCourses,
          data: [payload, ...state.instructorCourses.data],
        },
      };

    case types.CREATE_COURSE_FAIL:
      return { ...state, loading: false };

    case types.UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        instructorCourses: {
          ...state.instructorCourses,
          data: state.instructorCourses.data.map((c) =>
            c._id === payload?._id ? { ...c, ...payload } : c,
          ),
        },
      };

    case types.UPDATE_COURSE_FAIL:
      return { ...state, loading: false };

    case types.GET_EDITING_COURSE_SUCCESS:
      return { ...state, loading: false, editingCourse: payload };

    case types.GET_EDITING_COURSE_FAIL:
      return { ...state, loading: false };

    case types.CLEAR_EDITING_COURSE:
      return { ...state, editingCourse: null };

    case types.GET_ACTIVITY_FEED_SUCCESS:
      return { ...state, activityFeed: payload ?? [] };

    case types.GET_ACTIVITY_FEED_FAIL:
      return { ...state, activityFeed: [] };

    case types.GET_ENGAGEMENT_HEATMAP_SUCCESS:
      return { ...state, engagementHeatmap: payload ?? [] };

    case types.GET_ENGAGEMENT_HEATMAP_FAIL:
      return { ...state, engagementHeatmap: [] };

    default:
      return state;
  }
};

export default instructorDashboardSlice;
