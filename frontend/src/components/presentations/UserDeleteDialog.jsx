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

export const UserDeleteDialog = ({
  isOpen,
  user,
  onClose,
  onClickDelete,
  onClickCloseDelete,
  }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>ユーザー削除</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`本当に「${user.user_name}」を削除しますか？`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DeleteIcon />}
          onClick={onClickDelete}
          autoFocus
        >
          削除する
        </Button>
        <Button
          variant="outlined"
          onClick={onClickCloseDelete}
          startIcon={<CancelIcon />}
        >
          削除しない
        </Button>
      </DialogActions>
    </Dialog>
  )
}

UserDeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickCloseDelete: PropTypes.func.isRequired,
};
