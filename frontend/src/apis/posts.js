import axios from "axios";
import { posts, post } from "../urls/index";

export const fetchPosts = () => {
  return axios
    .get(posts)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const deletePost = (params) => {
  const { postId } = params;

  return axios
    .delete(post(postId))
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
