import React from "react";
import { DataGrid } from '@mui/x-data-grid'
import PropTypes from 'prop-types';

const cols = [
  { field: "id", headerName: "id", width: 10 },
  { field: "user_name", headerName: "ユーザー名", width: 200 },
  { field: "email", headerName: "メールアドレス", width: 200 },
  { field: "admin", headerName: "管理者権限" },
  { field: "guest", headerName: "ゲスト権限" },
  { field: "user_avatar", headerName: "アバター" },
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
    user_avatar: user.user_avatar,
    created_at: `${user.created_at}`.slice(0, 10),
    updated_at: `${user.updated_at}`.slice(0, 10),
  }];

  return (
    <div onClick={onClickUser} aria-hidden="true" style={{ cursor: 'pointer' }}>
      <DataGrid columns={cols} rows={rows} density='comfortable' autoHeight />
    </div>
  )
}

UsersIndex.propTypes = {
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
  onClickUser: PropTypes.func.isRequired,
};
