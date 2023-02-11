import React, { memo } from 'react';
import {
  Stack,
  FormControl,
  Checkbox,
  Avatar,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";
import styled from "styled-components";

const LoginUserReplyWrapper = styled.div`
  background-color: #BAD3FF;
  border: solid;
  border-radius: 10px;
  margin: 3px 10px;
  padding: 0 5px 10px;
  max-width: 60%;
`;

const OtherUsersReplyWrapper = styled.div`
  background-color: #EEEEEE;
  border: solid;
  border-radius: 10px;
  margin: 3px 10px;
  padding: 0 5px 10px;
  max-width: 60%;
`;

export const PostReply = memo(({
  replyUser,
  loginUser,
  reply,
  onClickReplyDelete,
  }) => {
  return (
    replyUser.id === loginUser.id ?
      // ログインユーザーのコメントは右に寄せる.
      <>
        <Stack direction="row" justifyContent="flex-end">
          <Avatar alt={replyUser.user_name} src={replyUser.user_avatar} style={{marginRight: "10px"}} />
          {replyUser.user_name}
          <Checkbox
            icon={<DeleteIcon />}
            checkedIcon={<DeleteIcon style={{color: "blue"}} />}
            // checked={bookmarkState}
            onChange={() => onClickReplyDelete(reply.id)}
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <LoginUserReplyWrapper>
            <FormControl margin="normal">
              {reply.reply}
            </FormControl>
          </LoginUserReplyWrapper>
        </Stack>
      </>
    :
      // その他ユーザーのコメントは左に寄せる
      <>
        <Stack direction="row">
          <Avatar alt={replyUser.user_name} src={replyUser.user_avatar} style={{marginRight: "10px"}} />
          {replyUser.user_name}
        </Stack>
        <Stack direction="row">
          <OtherUsersReplyWrapper>
            <FormControl margin="normal">
              {reply.reply}
            </FormControl>
          </OtherUsersReplyWrapper>
        </Stack>
      </>
  )
});

PostReply.propTypes = {
  replyUser: PropTypes.objectOf(PropTypes.string).isRequired,
  loginUser: PropTypes.arrayOf(PropTypes.string).isRequired,
  reply: PropTypes.objectOf(PropTypes.string).isRequired,
  onClickReplyDelete: PropTypes.func.isRequired,
};
