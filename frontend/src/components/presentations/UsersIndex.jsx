import React from "react";
import { DataGrid } from '@mui/x-data-grid'
import PropTypes from 'prop-types';

const cols = [
  { field: "id", headerName: "id", width: 10 },
  { field: "user_name", headerName: "ユーザー名", width: 200 },
  { field: "email", headerName: "メールアドレス", width: 200 },
  { field: "admin", headerName: "管理者権限" },
  { field: "guest", headerName: "ゲスト権限" },
  { field: "created_at", headerName: "作成日", width: 200 },
  { field: "updated_at", headerName: "更新日", width: 200 },
];

export const UsersIndex = ({ user, onClickUser }) => {
  const rows = [{
    id: user.id,
    user_name: user.user_name,
    email: user.email,
    admin: user.admin,
    guest: user.guest,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }];

  return (
    <div onClick={() => onClickUser(user)} aria-hidden="true">
      <DataGrid columns={cols} rows={rows} density='comfortable' autoHeight />
    </div>
  )
}

UsersIndex.propTypes = {
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
  onClickUser: PropTypes.func.isRequired
};
