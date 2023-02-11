import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Avatar,
  FormControl,
  FormLabel,
  TextField,
  IconButton,
  Checkbox,
  Badge,
  Paper,
} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SendIcon from '@mui/icons-material/Send';
import PropTypes from 'prop-types';

import ChatIcon from '@mui/icons-material/Chat';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import AccordionActions from '@mui/material/AccordionActions';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styled from "styled-components";
import { PostLocationMap } from "./PostLocationMap.jsx";
// import { PostReplies } from "./PostReplies.jsx";
import { PostReply } from "./PostReply.jsx";

const ItemWrapper = styled.span`
  background-color: #e8f8f8;
  border: solid;
  border-radius: 50% 20% / 10% 40%;
  margin: 3px;
  padding: 3px;
`;

export const PostDialog = ({
  isOpen,
  post,
  postImages,
  user,
  userList,
  loginUser,
  map,
  tags,
  favoriteState,
  favoritesCount,
  bookmarkState,
  replyText,
  replies,
  repliesCount,
  message,
  onClose,
  onClickFavorite,
  onClickBookmark,
  onChangeReply,
  onClickReplyCreate,
  onClickReplyDelete,
  onClickPostEdit,
  onClickPostDelete,
  }) => {

  // 投稿投稿へのreplyのみ取得する．
  const postReplies = replies.filter((reply) =>
    reply.post_id === post.id
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {message &&
        <Stack>
          <Alert severity="success">{message}</Alert>
        </Stack>
      }
      <DialogTitle>
        <Stack direction="row">
          {user &&
            <Stack direction="row">
              <Avatar alt={user.user_name} src={user.user_avatar} style={{marginRight: "10px"}} />
              {user.user_name}
            </Stack>
          }
        </Stack>
      </DialogTitle>
      <DialogContent>
        <FormControl margin="normal">
          <FormLabel>コメント</FormLabel>
          {post.comment}
        </FormControl>
        {map.latitude && <PostLocationMap map={map} />}
        <FormControl margin="normal">
          <span>
            {postImages &&
              postImages.map((image) =>
                <span key={image.id}>
                  <img alt="post_images" src={image} height="100" style={{ marginRight: "10px"}} />
                </span>
              )
            }
          </span>
        </FormControl>
        <FormControl margin="normal">
          <Stack direction="row">
            <EventIcon />
            <span>いつ？
              <ItemWrapper>
                {post.memorized_on ? `${post.memorized_on}`.slice(0, 14) : "unknown"}
              </ItemWrapper>
            </span>
            <WhereToVoteIcon />
            <span>どこ？
              <ItemWrapper>
                {map.location ? map.location : "unknown"}
              </ItemWrapper>
            </span>
          </Stack>
        </FormControl>
        <Stack direction="row">
          <LocalOfferIcon />タグ
          <span>
            {tags.map((tag) =>
              tag &&
              <ItemWrapper key={tag.id}>
                {tag.tag_name}
              </ItemWrapper>
            )}
          </span>
        </Stack>
        <div>
          <FormControl margin="normal">
            <FormLabel>公開先グループ（グループアイコンとグループ名）</FormLabel>
            {/* {user.guest === true ? `あり` : `なし`} */}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>公開先ユーザー</FormLabel>
            {/* {user.user_profile} */}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>投稿詳細</FormLabel>
            {post.description}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>作成日時</FormLabel>
            {`${post.created_at}`.slice(0, 10)}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>更新日時</FormLabel>
            {`${post.updated_at}`.slice(0, 10)}
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Badge badgeContent={favoritesCount} color="secondary">
          <Checkbox
            icon={<ThumbUpIcon />}
            checkedIcon={<ThumbUpIcon style={{color: "red"}} />}
            checked={favoriteState}
            onChange={onClickFavorite}
          />
        </Badge>
        <Checkbox
          icon={<BookmarkIcon />}
          checkedIcon={<BookmarkIcon style={{color: "blue"}} />}
          checked={bookmarkState}
          onChange={onClickBookmark}
        />
        <IconButton
          // startIcon={<DeleteIcon />}
          onClick={onClickPostDelete}
        >
          {/* 削除する */}
          <DeleteIcon />
        </IconButton>
        <IconButton
          variant="outlined"
          // startIcon={<EditIcon />}
          onClick={onClickPostEdit}
          aria-hidden="true"
        >
          <EditIcon />
          {/* 編集する */}
        </IconButton>
      </DialogActions>
      <DialogActions>
        <FormControl fullWidth margin="none">
          <Accordion elevation={5}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              {repliesCount > 0 ?
                <Badge badgeContent={repliesCount} color="secondary">
                  <ChatIcon  style={{color: "green"}}  />
                </Badge>
              :
                <ChatIcon />
              }
              <Typography>__投稿にコメントしよう！</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row">
                <TextField
                  onChange={onChangeReply}
                  label="コメントしよう！"
                  type="text"
                  value={replyText}
                  multiline
                  fullWidth
                  variant="standard"
                  margin="normal"
                />
                <IconButton
                  type="submit"
                  onClick={onClickReplyCreate}
                  variant="standard"
                >
                  <SendIcon />
                </IconButton>
              </Stack>
              <Paper>
                {postReplies &&
                  postReplies.map((reply) => {
                    // 投稿者を取得する．
                    const replyUser = userList.get(reply.user_id);

                    return (
                      <div key={reply.id}>
                        <PostReply
                          replyUser={replyUser}
                          loginUser={loginUser}
                          reply={reply}
                          onClickReplyDelete={onClickReplyDelete}
                        />
                      </div>
                    )
                  })
                }
              </Paper>
            </AccordionDetails>
          </Accordion>
        </FormControl>
      </DialogActions>
    </Dialog>
  )
}

PostDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  post: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  postImages: PropTypes.objectOf(PropTypes.string).isRequired,
  user: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string.isRequired,
      user_avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  userList: PropTypes.arrayOf(PropTypes.string).isRequired,
  loginUser: PropTypes.objectOf(PropTypes.string).isRequired,
  map: PropTypes.objectOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
    })
  ).isRequired,
  tags: PropTypes.objectOf(
    PropTypes.shape({
      tag: PropTypes.objectOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          tag_name: PropTypes.string.isRequired,
        })
      )
    })
  ).isRequired,
  favoriteState: PropTypes.bool.isRequired,
  favoritesCount: PropTypes.number.isRequired,
  bookmarkState: PropTypes.bool.isRequired,
  replyText: PropTypes.string.isRequired,
  replies: PropTypes.arrayOf(PropTypes.string).isRequired,
  repliesCount: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickFavorite: PropTypes.func.isRequired,
  onClickBookmark: PropTypes.func.isRequired,
  onChangeReply: PropTypes.func.isRequired,
  onClickReplyCreate: PropTypes.func.isRequired,
  onClickReplyDelete: PropTypes.func.isRequired,
  onClickPostEdit: PropTypes.func.isRequired,
  onClickPostDelete: PropTypes.func.isRequired,
};
