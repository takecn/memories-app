import axios from "axios";
import { favorites } from "../urls/index";

export const postFavorite = (params) => {
  const { postId } = params;

  return axios
    .post(
      favorites(postId),
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

export const deleteFavorite = (params) => {
  const { postId } = params;

  return axios
    .delete(favorites(postId), {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
