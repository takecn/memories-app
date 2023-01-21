import axios from "axios";
import { login, guestLogin, logout } from "../urls/index";

export const postSession = (params) => {
  const { formData } = params;

  return axios
    .post(login, formData, {
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

export const postGuestSession = () => {
  return axios
    .post(guestLogin, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const deleteSession = () => {
  return axios
    .delete(logout, {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
