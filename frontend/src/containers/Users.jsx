import React, { useReducer, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid'

// apis
import { fetchUsers } from "../apis/users";

// reducers
import { initialState, usersActionTypes, usersReducer } from "../reducers/users";

export const Users = () => {
  const [state, dispatch] = useReducer(usersReducer, initialState)
  const cols = [
    { field: "id", headerName: "id", width: 10 },
    { field: "user_name", headerName: "ユーザー名", width: 200 },
    { field: "email", headerName: "メールアドレス", width: 200 },
    { field: "admin", headerName: "管理者権限" },
    { field: "guest", headerName: "ゲスト権限" },
    { field: "created_at", headerName: "作成日", width: 200 },
    { field: "updated_at", headerName: "更新日", width: 200 },
  ];
  const rows = state.usersList.map((user) => ({
    id: user.id,
    user_name: user.user_name,
    email: user.email,
    admin: user.admin,
    guest: user.guest,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }));

  useEffect(() => {
    dispatch({ type: usersActionTypes.FETCHING });
    fetchUsers()
    .then((data) =>
      dispatch({
        type: usersActionTypes.FETCH_SUCCESS,
        payload: {
          users: data.users
        }
      })
    )
  }, []);

  return (
    <div style={{  }}>
      <DataGrid columns={cols} rows={rows} density='comfortable' autoHeight />
    </div>
  )
}
