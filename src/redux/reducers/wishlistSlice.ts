import { metaData } from '../sharedTypes';
import * as types from '../constants/wishlistConstants';

type WishlistState = {
  items: any[];
  metaData: metaData;
  wishlisted: Record<string, boolean>;
  wishlistIds: Record<string, string>;
};

const initialState: WishlistState = {
  items: [],
  metaData: { totalDocuments: 0, totalPages: 0, page: 0, count: 0, limit: 0 },
  wishlisted: {},
  wishlistIds: {},
};

const wishlistSlice = (state = initialState, action: any): WishlistState => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_WISHLIST_SUCCESS: {
      const items = payload.data ?? [];
      const wishlisted: Record<string, boolean> = {};
      const wishlistIds: Record<string, string> = {};
      for (const item of items) {
        const cId = item.courseId?._id ?? item.courseId;
        if (cId) {
          wishlisted[cId] = true;
          wishlistIds[cId] = item._id;
        }
      }
      return {
        ...state,
        items,
        metaData: payload.metaData ?? initialState.metaData,
        wishlisted: { ...state.wishlisted, ...wishlisted },
        wishlistIds: { ...state.wishlistIds, ...wishlistIds },
      };
    }
    case types.GET_WISHLIST_FAIL:
      return { ...state, items: [] };

    case types.ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlisted: { ...state.wishlisted, [payload.courseId]: true },
        wishlistIds: payload.wishlistId
          ? { ...state.wishlistIds, [payload.courseId]: payload.wishlistId }
          : state.wishlistIds,
      };
    case types.ADD_TO_WISHLIST_FAIL:
      return state;

    case types.REMOVE_FROM_WISHLIST_SUCCESS: {
      const { [payload]: _removedId, ...remainingIds } = state.wishlistIds;
      return {
        ...state,
        items: state.items.filter((item) => item.courseId?._id !== payload),
        wishlisted: { ...state.wishlisted, [payload]: false },
        wishlistIds: remainingIds,
      };
    }
    case types.REMOVE_FROM_WISHLIST_FAIL:
      return state;

    case types.CHECK_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlisted: {
          ...state.wishlisted,
          [payload.courseId]: !!payload.wishlisted,
        },
        wishlistIds: payload.wishlistId
          ? { ...state.wishlistIds, [payload.courseId]: payload.wishlistId }
          : state.wishlistIds,
      };
    case types.CHECK_WISHLIST_FAIL:
      return state;

    default:
      return state;
  }
};

export default wishlistSlice;
