import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  TextField,
  // FormControl,
  // FormLabel,
  // RadioGroup,
  // FormControlLabel,
  // Radio,
  Button,
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import PropTypes from 'prop-types';

export const LoginDialog = ({
  isOpen,
  message,
  errors,
  onChangeUserName,
  onChangeUserEmail,
  onChangeUserPassword,
  onClickLogin,
  onClickGuestLogin,
}) => {
  return (
    <Dialog open={isOpen}>
      {errors &&
        <Stack>
          {errors.map((error) =>
            <Alert key={error} severity="error">{error}</Alert>
          )}
        </Stack>
      }
      {message &&
        <Alert severity="success">{message}</Alert>
      }
      <DialogTitle>
        <Stack>Mamoryとは？</Stack>
      </DialogTitle>
      <DialogContent>
        Mamoryの説明
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={onClickGuestLogin}
          variant="outlined"
          startIcon={<LoginIcon />}
          // justifyContent="center"
          // alignItems="center"
        >
          ゲストログインする
        </Button>
      </DialogActions>
      <DialogTitle>
        <Stack>ログインフォーム</Stack>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={onClickLogin}
          variant="outlined"
          startIcon={<LoginIcon />}
        >
          ログインする
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LoginDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChangeUserName: PropTypes.func.isRequired,
  onChangeUserEmail: PropTypes.func.isRequired,
  onChangeUserPassword: PropTypes.func.isRequired,
  onClickLogin: PropTypes.func.isRequired,
  onClickGuestLogin: PropTypes.func.isRequired,
};
