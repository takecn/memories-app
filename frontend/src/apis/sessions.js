import axios from "axios";
import { login, guestLogin, logout } from "../urls/index";

export const postSession = (params) => {
  const { formData } = params;

  return axios
    .post(login, formData, {
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

export const postGuestSession = () => {
  return axios
    .post(guestLogin)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const deleteSession = () => {
  // const { userId } = params;

  return axios
    .delete(logout)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
