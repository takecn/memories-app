import { REQUEST_STATE } from "../constants";

export const initialPostsState = {
  fetchState: REQUEST_STATE.INITIAL,
  postList: [],
  userList: [],
};

export const postsActionTypes = {
  FETCHING: "FETCHING",
  FETCH_SUCCESS: "FETCH_SUCCESS",
};

export const postsReducer = (state, action) => {
  switch (action.type) {
    case postsActionTypes.FETCHING:
      return {
        ...state,
        fetchState: REQUEST_STATE.LOADING,
      };
    case postsActionTypes.FETCH_SUCCESS:
      return {
        fetchState: REQUEST_STATE.OK,
        postList: action.payload.posts,
        userList: action.payload.users,
      };
    default:
      throw new Error();
  }
};
