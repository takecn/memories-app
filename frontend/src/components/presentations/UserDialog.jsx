import React from "react";
import { DialogContent, Dialog, DialogTitle } from "@mui/material";
import PropTypes from 'prop-types';

export const UserDialog = ({ isOpen, user, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {user.user_name}
      </DialogTitle>
      <DialogContent>
        <ul>
          <li>{user.email}</li>
          <li>{`管理者権限：${user.admin}`}</li>
          <li>{`ゲスト権限：${user.guest}`}</li>
          <li>{user.created_at}</li>
          <li>{user.updated_at}</li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}

UserDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.arrayOf(
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
  onClose: PropTypes.func.isRequired,
};
