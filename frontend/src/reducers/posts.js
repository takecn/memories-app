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

export const initialFavoritesState = {
  fetchState: REQUEST_STATE.INITIAL,
  favoriteList: [],
  favoriteListAll: [],
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

export const favoritesReducer = (state, action) => {
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
      };
    default:
      throw new Error();
  }
};
