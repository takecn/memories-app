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
import CreateIcon from '@mui/icons-material/Create';
import PropTypes from 'prop-types';

export const UserCreateDialog = ({
  isOpen,
  errors,
  preview,
  onClose,
  onChangeUserName,
  onChangeUserEmail,
  onChangeUserPassword,
  onChangeUserPasswordConfirmation,
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
        <Stack>ユーザー登録</Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row">
          <FormControl>
            <FormLabel>アバター</FormLabel>
            <input onChange={onChangeUserAvatar} type="file" accept=".png, .jpg, .jpeg, .gif" />
          </FormControl>
          <FormControl>
            <FormLabel>preview</FormLabel>
            <Avatar alt="preview" src={preview} style={{marginLeft: "50%"}} />
          </FormControl>
        </Stack>
        <TextField
          onChange={onChangeUserName}
          label="ユーザー名"
          type="text"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeUserEmail}
          label="メールアドレス"
          type="email"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeUserPassword}
          label="パスワード"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeUserPasswordConfirmation}
          label="パスワード（確認）"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <FormControl>
          <FormLabel>管理者権限</FormLabel>
          <RadioGroup onChange={onChangeUserAdmin} row>
            <FormControlLabel value="false" control={<Radio />} label="なし" />
            <FormControlLabel value="true" control={<Radio />} label="あり" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>ゲスト権限</FormLabel>
          <RadioGroup onChange={onChangeUserGuest} row>
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
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={onClick}
          variant="outlined"
          startIcon={<CreateIcon />}
        >
          ユーザー登録する
        </Button>
      </DialogActions>
    </Dialog>
  )
}

UserCreateDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  preview: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeUserName: PropTypes.func.isRequired,
  onChangeUserEmail: PropTypes.func.isRequired,
  onChangeUserPassword: PropTypes.func.isRequired,
  onChangeUserPasswordConfirmation: PropTypes.func.isRequired,
  onChangeUserAdmin: PropTypes.func.isRequired,
  onChangeUserGuest: PropTypes.func.isRequired,
  onChangeUserProfile: PropTypes.func.isRequired,
  onChangeUserAvatar: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
