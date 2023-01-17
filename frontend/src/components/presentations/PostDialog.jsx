import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  // Alert,
  Avatar,
  FormControl,
  FormLabel,
  Button,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

export const PostDialog = ({
  isOpen,
  post,
  user,
  // message,
  onClose,
  // onClickUserEdit,
  // onClickUserDelete,
  }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      {/* {message &&
        <Stack>
          <Alert severity="success">{message}</Alert>
        </Stack>
      } */}
      <DialogTitle>
        <Stack direction="row">
          <Avatar alt={user.user_name} src={user.user_avatar} style={{marginRight: "10px"}} />
          {user.user_name}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <div>Google Map</div>
        <div>
          <FormControl margin="normal">
            <FormLabel>画像</FormLabel>
            {/* {user.email} */}
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
            <FormLabel>どこ？</FormLabel>
            {/* {user.admin === true ? `あり` : `なし`} */}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>タグ</FormLabel>
            {/* {user.guest === true ? `あり` : `なし`} */}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>コメント</FormLabel>
            {post.comment}
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
            {user.description}
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
          // onClick={onClickUserDelete}
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
  user: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string.isRequired,
      user_avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  // message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  // onClickUserEdit: PropTypes.func.isRequired,
  // onClickUserDelete: PropTypes.func.isRequired,
};
