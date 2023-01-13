import axios from "axios";
import { usersIndex, userUpdate } from "../urls/index";

export const fetchUsersIndex = () => {
  return axios
    .get(usersIndex)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw e;
    });
};

export const putUserUpdate = (params) => {
  const { userId, formData } = params;

  return axios
    .put(userUpdate(userId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
