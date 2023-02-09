import { REQUEST_STATE } from "../constants";

export const actionTypes = {
  FETCHING: "FETCHING",
  FETCH_SUCCESS: "FETCH_SUCCESS",
};

export const initialPostsState = {
  fetchState: REQUEST_STATE.INITIAL,
  postList: [],
  userList: [],
  mapList: [],
  postTagList: [],
  tagList: [],
};

export const initialFaviconsState = {
  fetchState: REQUEST_STATE.INITIAL,
  favoriteList: [],
  favoriteListAll: [],
  bookmarkList: [],
};

export const postsReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCHING:
      return {
        ...state,
        fetchState: REQUEST_STATE.LOADING,
      };
    case actionTypes.FETCH_SUCCESS:
      return {
        fetchState: REQUEST_STATE.OK,
        postList: action.payload.posts,
        userList: action.payload.users,
        mapList: action.payload.maps,
        postTagList: action.payload.post_tags,
        tagList: action.payload.tags,
      };
    default:
      throw new Error();
  }
};

export const faviconsReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCHING:
      return {
        ...state,
        fetchState: REQUEST_STATE.LOADING,
      };
    case actionTypes.FETCH_SUCCESS:
      return {
        fetchState: REQUEST_STATE.OK,
        favoriteList: action.payload.favorites,
        favoriteListAll: action.payload.favoritesAll,
        bookmarkList: action.payload.bookmarks,
      };
    default:
      throw new Error();
  }
};
