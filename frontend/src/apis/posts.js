import axios from "axios";
import { posts } from "../urls/index";

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
