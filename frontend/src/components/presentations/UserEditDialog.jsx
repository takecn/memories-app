import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Avatar,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import PropTypes from 'prop-types';

export const UserEditDialog = ({
  isOpen,
  user,
  preview,
  errors,
  onClose,
  onChangeUserName,
  onChangeUserEmail,
  onChangeUserAdmin,
  onChangeUserGuest,
  onChangeUserProfile,
  onChangeUserAvatar,
  onClick,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      {errors &&
        <Stack>
          {errors.map((error) =>
          <Alert key={error} severity="error">{error}</Alert>
          )}
        </Stack>
      }
      <DialogTitle>
        <Stack direction="row">
          <Avatar alt={user.user_name} src={user.user_avatar} style={{marginRight: "10px"}} />
          {user.user_name}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row">
          <FormControl>
            <FormLabel>アバター</FormLabel>
            <input onChange={onChangeUserAvatar} type="file" accept=".png, .jpg, .jpeg, .gif" />
          </FormControl>
          <FormControl>
            <FormLabel>preview</FormLabel>
            <Avatar alt={user.user_name} src={preview} style={{marginLeft: "50%"}} />
          </FormControl>
        </Stack>
        <TextField
          onChange={onChangeUserName}
          label="ユーザー名"
          type="text"
          fullWidth
          defaultValue={user.user_name}
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeUserEmail}
          label="メールアドレス"
          type="email"
          fullWidth
          defaultValue={user.email}
          variant="outlined"
          margin="normal"
        />
        <FormControl>
          <FormLabel>管理者権限</FormLabel>
          <RadioGroup onChange={onChangeUserAdmin} row defaultValue={user.admin}>
            <FormControlLabel value="false" control={<Radio />} label="なし" />
            <FormControlLabel value="true" control={<Radio />} label="あり" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>ゲスト権限</FormLabel>
          <RadioGroup onChange={onChangeUserGuest} row defaultValue={user.guest}>
            <FormControlLabel value="false" control={<Radio />} label="なし" />
            <FormControlLabel value="true" control={<Radio />} label="あり" />
          </RadioGroup>
        </FormControl>
        <TextField
          onChange={onChangeUserProfile}
          label="プロフィール"
          type="text"
          multiline
          fullWidth
          defaultValue={user.user_profile}
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={onClick}
          variant="outlined"
          startIcon={<UpdateIcon />}
        >
          編集を確定する
        </Button>
      </DialogActions>
    </Dialog>
  )
}

UserEditDialog.propTypes = {
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
    })
  ).isRequired,
  preview: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeUserName: PropTypes.func.isRequired,
  onChangeUserEmail: PropTypes.func.isRequired,
  onChangeUserAdmin: PropTypes.func.isRequired,
  onChangeUserGuest: PropTypes.func.isRequired,
  onChangeUserProfile: PropTypes.func.isRequired,
  onChangeUserAvatar: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
