import axios from "axios";
import { home, posts, post } from "../urls/index";

export const fetchPosts = () => {
  return axios
    .get(home, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const postPost = (params) => {
  const { formData } = params;

  return axios
    .post(posts, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const putPost = (params) => {
  const { postId, formData } = params;

  return axios
    .put(post(postId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const deletePost = (params) => {
  const { postId } = params;

  return axios
    .delete(post(postId), {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
