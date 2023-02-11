import axios from "axios";
import { replies, reply } from "../urls/index";

export const postReply = (params) => {
  const { postId, formData } = params;

  return axios
    .post(replies(postId), formData, {
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

export const deleteReply = (params) => {
  const { postId, replyId } = params;

  return axios
    .delete(reply(postId, replyId), {
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
