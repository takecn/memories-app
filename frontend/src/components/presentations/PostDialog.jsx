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
  Button,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import styled from "styled-components";

const TagWrapper = styled.span`
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
  map,
  tags,
  message,
  onClose,
  // onClickUserEdit,
  onClickPostDelete,
  }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      {message &&
        <Stack>
          <Alert severity="success">{message}</Alert>
        </Stack>
      }
      <DialogTitle>
        {user &&
          <Stack direction="row">
          <Avatar alt={user.user_name} src={user.user_avatar} style={{marginRight: "10px"}} />
          {user.user_name}
        </Stack>}
      </DialogTitle>
      <DialogContent>
        <div>
          <FormControl margin="normal">
            <FormLabel>コメント</FormLabel>
            {post.comment}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>どこ？</FormLabel>
            {map.location}
          </FormControl>
        </div>
        <div>Google Map</div>
        <div>
          <FormControl margin="normal">
            <FormLabel>画像</FormLabel>
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
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>いつ？</FormLabel>
            {post.memorized_on}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>タグ</FormLabel>
            <span>
              {tags.map((tag) =>
                <TagWrapper key={tag.id}>
                  {tag.tag_name}
                </TagWrapper>
              )}
            </span>
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>お気に入り</FormLabel>
            {/* {user.guest === true ? `あり` : `なし`} */}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>ブックマーク</FormLabel>
            {/* {user.user_profile} */}
          </FormControl>
        </div>
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
        <div>
          <FormControl margin="normal">
            <FormLabel>リプライ</FormLabel>
            {/* {user.user_profile} */}
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DeleteIcon />}
          onClick={onClickPostDelete}
        >
          削除する
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          // onClick={onClickUserEdit}
          aria-hidden="true"
        >
          編集する
        </Button>
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
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  // onClickUserEdit: PropTypes.func.isRequired,
  onClickPostDelete: PropTypes.func.isRequired,
};
