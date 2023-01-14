import React, { memo, useReducer, useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { fetchUsersIndex, putUser, deleteUser } from "../../apis/users";
import { REQUEST_STATE } from "../../constants";
import { initialUsersState, usersActionTypes, usersReducer } from "../../reducers/users";
import { UsersIndex } from '../presentations/UsersIndex.jsx';
import { UserDialog } from '../presentations/UserDialog.jsx';
import { UserEditDialog } from '../presentations/UserEditDialog.jsx';
import { UserDeleteDialog } from '../presentations/UserDeleteDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Users = memo(() => {
  const [usersState, dispatch] = useReducer(usersReducer, initialUsersState);
  const [state, setState] = useState({
    isOpenUserDialog: false,
    isOpenUserEditDialog: false,
    isOpenUserDeleteDialog: false,
    selectedUser: null,
    message: null,
    deleteMessage: null
  });
  const [errors, setErrors] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [isUserAdmin, setIsUserAdmin] = useState();
  const [isUserGuest, setIsUserGuest] = useState();
  const [userProfile, setUserProfile] = useState();
  const [userAvatar, setUserAvatar] = useState();
  const [preview, setPreview] = useState();

  // ユーザー情報をサーバーサイドから取得する．
  const fetchUserList = () => {
    dispatch({ type: usersActionTypes.FETCHING });
    fetchUsersIndex()
    .then((data) =>
      dispatch({
        type: usersActionTypes.FETCH_SUCCESS,
        payload: { users: data.users },
      })
    );
  };

  // ユーザーのstateが更新されるたびにユーザー一覧ページをレンダリングする．
  useEffect(fetchUserList, [state.selectedUser, state.deleteMessage]);

  // ユーザー編集モーダルで選択した画像のアバタープレビューを表示する．
  const previewUserAvatar = (e) => {
    const file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file))
  };

  const userUpdate = () => {
    // 各種state内いずれかが変更されたときのみ，FormDataを送信する（未変更を示すundefinedを弾く）．
    if (userName !== undefined ||
      userEmail !== undefined ||
      isUserAdmin !== undefined ||
      isUserGuest !== undefined ||
      userProfile !== undefined ||
      userAvatar !== undefined) {

      const formData = new FormData();
      // user_nameとemailのみ，nullを送信する．presenceバリデーションエラーを表示するため．
      // undefinedは送信しない．データが"undefined"に更新されてしまうため．
      if (userName !== undefined) formData.append("user_name", userName);
      if (userEmail !== undefined) formData.append("email", userEmail);
      // 上記以外は，編集された場合のみFormDataに格納する．
      if (isUserAdmin) formData.append("admin", isUserAdmin);
      if (isUserGuest) formData.append("guest", isUserGuest);
      if (userProfile) formData.append("user_profile", userProfile);
      if (userAvatar) formData.append("user_avatar", userAvatar);

      // ユーザー編集情報をサーバーサイドに送る．
      putUser({
        userId: state.selectedUser.id,
        formData,
      }).then((data) => {
          // userが更新された場合，更新内容を反映する．
          if (data.user) {
            setState({
              ...state,
              isOpenUserDialog: true,
              isOpenUserEditDialog: false,
              selectedUser: data.user,
              message: data.message,
            })
            setErrors()
            setUserName()
            setUserEmail()
            setIsUserAdmin()
            setIsUserGuest()
            setUserProfile()
            setUserAvatar()
            setPreview()
          } else {
            // userが更新されていない場合，エラーメッセージをセットする．
            setErrors(data.error_messages)
          }
        }
      )
    }
  };

  const userDelete = () => {
    deleteUser({userId: state.selectedUser.id})
    .then((data) => {
      setState({
        ...state,
        isOpenUserDialog: false,
        isOpenUserDeleteDialog: false,
        deleteMessage: data.message,
      })
    })
  };

  return (
    <>
      {/* ユーザー一覧 */}
      {
        usersState.fetchState === REQUEST_STATE.LOADING ?
          <CircularIndeterminate />
        :
        <>
        {state.deleteMessage &&
          <Alert severity="success">{state.deleteMessage}</Alert>
        }
        {usersState.userList.map((user) =>
          <div key={user.id}>
            <UsersIndex
              user={user}
              onClickUser={() =>
                setState({
                  ...state,
                  isOpenUserDialog: true,
                  selectedUser: user,
                  deleteMessage: null,
                })
              }
            />
          </div>
        )}
        </>
      }

      {/* ユーザー詳細モーダル */}
      {
        state.isOpenUserDialog &&
        <UserDialog
          isOpen={state.isOpenUserDialog}
          user={state.selectedUser}
          message={state.message}
          onClose={() =>
            setState({
              ...state,
              isOpenUserDialog: false,
              message: null,
            })
          }
          onClickUserEdit={() =>
            setState({
              ...state,
              isOpenUserEditDialog: true,
            })
          }
          onClickUserDelete={() =>
            setState({
              ...state,
              isOpenUserDeleteDialog: true,
            })
          }
        />
      }

      {/* ユーザー編集モーダル */}
      {
        state.isOpenUserEditDialog &&
        <UserEditDialog
          isOpen={state.isOpenUserEditDialog}
          user={state.selectedUser}
          preview={preview}
          errors={errors}
          onClose={() => {
            setState({
              ...state,
              isOpenUserDialog: true,
              isOpenUserEditDialog: false,
            })
            // 編集を確定せずに閉じた場合は，各種stateを空にする．
            setErrors()
            setUserName()
            setUserEmail()
            setIsUserAdmin()
            setIsUserGuest()
            setUserProfile()
            setUserAvatar()
            setPreview()
          }
          }
          onChangeUserName={(e) => setUserName(e.target.value)}
          onChangeUserEmail={(e) => setUserEmail(e.target.value)}
          onChangeUserAdmin={(e) => setIsUserAdmin(e.target.value)}
          onChangeUserGuest={(e) => setIsUserGuest(e.target.value)}
          onChangeUserProfile={(e) => setUserProfile(e.target.value)}
          onChangeUserAvatar={(e) => {
            setUserAvatar(e.target.files[0])
            previewUserAvatar(e)
          }}
          onClick={userUpdate}
        />
      }

      {/* ユーザー削除モーダル */}
      {
        state.isOpenUserDeleteDialog &&
        <UserDeleteDialog
          isOpen={state.isOpenUserDeleteDialog}
          user={state.selectedUser}
          onClose={() =>
            setState({
              ...state,
              isOpenUserDialog: true,
              isOpenUserDeleteDialog: false,
            })
          }
          onClickDelete={userDelete}
          onClickCloseDelete={() =>
            setState({
              ...state,
              isOpenUserDialog: true,
              isOpenUserDeleteDialog: false,
            })
          }
        />
      }
    </>
  );
});
