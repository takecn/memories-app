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

export const UserDialog = ({
  isOpen,
  user,
  message,
  onClose,
  onClickUserEdit,
  onClickUserDelete,
  isHomePage,
  }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      {message &&
        <Stack>
          <Alert severity="success">{message}</Alert>
        </Stack>
      }
      <DialogTitle>
        <Stack direction="row">
          <Avatar alt={user.user_name} src={user.user_avatar} style={{marginRight: "10px"}} />
          {user.user_name}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <div>
          <FormControl margin="normal">
            <FormLabel>メールアドレス</FormLabel>
            {user.email}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>管理者権限</FormLabel>
            {user.admin === true ? `あり` : `なし`}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>ゲスト権限</FormLabel>
            {user.guest === true ? `あり` : `なし`}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>プロフィール</FormLabel>
            {user.user_profile}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>作成日時</FormLabel>
            {`${user.created_at}`.slice(0, 10)}
          </FormControl>
        </div>
        <div>
          <FormControl margin="normal">
            <FormLabel>更新日時</FormLabel>
            {`${user.updated_at}`.slice(0, 10)}
          </FormControl>
        </div>
      </DialogContent>
      {isHomePage ||
        <DialogActions>
          <Button
            startIcon={<DeleteIcon />}
            onClick={onClickUserDelete}
          >
            削除する
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={onClickUserEdit}
            aria-hidden="true"
          >
            編集する
          </Button>
        </DialogActions>
      }
    </Dialog>
  )
}

UserDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      admin: PropTypes.bool.isRequired,
      guest: PropTypes.bool.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
      user_avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickUserEdit: PropTypes.func.isRequired,
  onClickUserDelete: PropTypes.func.isRequired,
  isHomePage: PropTypes.bool.isRequired,
};
