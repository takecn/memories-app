import axios from "axios";
import { users, user } from "../urls/index";

export const fetchUsersIndex = () => {
  return axios
    .get(users)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const postUser = (params) => {
  const { formData } = params;

  return axios
    .post(users, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const putUser = (params) => {
  const { userId, formData } = params;

  return axios
    .put(user(userId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const deleteUser = (params) => {
  const { userId } = params;

  return axios
    .delete(user(userId))
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
