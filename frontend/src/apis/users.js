import axios from "axios";
import { usersIndex } from "../urls/index";

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
