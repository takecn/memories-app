import axios from "axios";
import { bookmarks } from "../urls/index";

export const postBookmark = (params) => {
  const { postId } = params;

  return axios
    .post(
      bookmarks(postId),
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const deleteBookmark = (params) => {
  const { postId } = params;

  return axios
    .delete(bookmarks(postId), {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
