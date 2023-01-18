import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import PropTypes from 'prop-types';

export const DeleteDialog = ({
  isOpen,
  session,
  user,
  post,
  onClose,
  onClickDelete,
  onClickCloseDelete,
  }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {session && `ログアウト`}
        {user && `ユーザー削除`}
        {post && `投稿削除`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {session && `ログアウトしますか？`}
          {user && `本当に「${user.user_name}」を削除しますか？`}
          {post && `本当にこの投稿を削除しますか？`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DeleteIcon />}
          onClick={onClickDelete}
          autoFocus
        >
          {session && `ログアウトする`}
          {user && `削除する`}
          {post && `削除する`}
        </Button>
        <Button
          variant="outlined"
          onClick={onClickCloseDelete}
          startIcon={<CancelIcon />}
        >
          {session && `ログアウトしない`}
          {user && `削除しない`}
          {post && `削除しない`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  session: PropTypes.bool.isRequired,
  user: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  post: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickCloseDelete: PropTypes.func.isRequired,
};
