import React, { memo, useReducer, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import { fetchPosts } from "../../apis/posts";
import { postSession, postGuestSession, deleteSession } from "../../apis/sessions";
import { REQUEST_STATE } from "../../constants";
import { initialPostsState, postsActionTypes, postsReducer } from "../../reducers/posts";
import { Home } from "../presentations/Home.jsx";
import { LoginDialog } from '../presentations/LoginDialog.jsx';
import { UserDialog } from '../presentations/UserDialog.jsx';
import { PostDialog } from '../presentations/PostDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Posts = memo(() => {
  const [postsState, dispatch] = useReducer(postsReducer, initialPostsState);
  const [sessionsState, setSessionsState] = useState({
    isOpenLoginDialog: true,
    message: null,
  });
  const [postState, setPostState] = useState({
    isOpenPostDialog: false,
    selectedPost: null,
  });
  const [userState, setUserState] = useState({
    isOpenUserDialog: false,
    selectedUser: null,
  });
  const [errors, setErrors] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();

  const fetchPostList = () => {
    dispatch({ type: postsActionTypes.FETCHING });
    fetchPosts()
    .then((data) =>
      dispatch({
        type: postsActionTypes.FETCH_SUCCESS,
        payload: {
          posts: data.posts,
          users: data.users,
        },
      })
    );
  };

  useEffect(fetchPostList, []); // userState.selectedUserState

  const postUserMap = new Map(postsState.userList.map((user) => [user.id, user]));

  const createLoginFormData = () => {
    const formData = new FormData();
    // user_nameとemailのみ，nullを送信する．presenceバリデーションエラーを表示するため．
    // undefinedは送信しない．データが"undefined"に更新されてしまうため．
    if (userName !== undefined) formData.append("user_name", userName);
    if (userEmail !== undefined) formData.append("email", userEmail);
    if (userPassword !== undefined) formData.append("password", userPassword);
    return formData
  };

  const login = () => {
    const formData = createLoginFormData();

    postSession({formData})
    .then((data) => {
      if (data.message) {
        setSessionsState({
          isOpenLoginDialog: false,
          message: data.message,
        })
        setErrors()
        setUserName()
        setUserEmail()
        setUserPassword()
      } else {
        setErrors(data.error_messages)
      }
    });
  };

  const guestLogin = () => {
    postGuestSession()
    .then((data) => {
      if (data.message) {
      setSessionsState({
        isOpenLoginDialog: false,
        message: data.message,
      })
      setErrors()
      setUserName()
      setUserEmail()
      setUserPassword()
    } else {
      setErrors(data.error_messages)
    }
    });
  };

  const logout = () => {
    deleteSession()
    .then((data) => {
      setSessionsState({
        isOpenLoginDialog: true,
        message: data.message,
      })
    });
  };

  return (
    <>
      {/* ログインモーダル */}
      {
        sessionsState.isOpenLoginDialog &&
        <LoginDialog
          isOpen={sessionsState.isOpenLoginDialog}
          message={sessionsState.message}
          errors={errors}
          onChangeUserName={(e) => setUserName(e.target.value)}
          onChangeUserEmail={(e) => setUserEmail(e.target.value)}
          onChangeUserPassword={(e) => setUserPassword(e.target.value)}
          onClickLogin={login}
          onClickGuestLogin={guestLogin}
        />
      }

      {/* 投稿一覧 */}
      {
        postsState.fetchState === REQUEST_STATE.LOADING ?
          <CircularIndeterminate />
        :
        <>
          {sessionsState.message &&
            <Alert severity="success">{sessionsState.message}</Alert>
          }
          <Button
            variant="outlined"
            onClick={logout}
          >
            ログアウトする
          </Button>
          <Container>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              spacing={3}
              md={5}
            >
              {
              postsState.postList.map((post) => {
                return (
                  <Grid item xs={12} md={12} key={post.id}>
                    <Home
                      post={post}
                      user={postUserMap.get(post.user_id)}
                      onClickPost={() => {
                        setPostState({
                          ...postState,
                          isOpenPostDialog: true,
                          selectedPost: post,
                        })
                        setUserState({
                          ...userState,
                          selectedUser: postUserMap.get(post.user_id),
                        })
                        setSessionsState({
                          message: null
                        })
                      }}
                      onClickUser={() => {
                        setUserState({
                          ...userState,
                          isOpenUserDialog: true,
                          selectedUser: postUserMap.get(post.user_id),
                        })
                        setSessionsState({
                          message: null
                        })
                      }}
                    />
                  </Grid>
                );
              })
              }
            </Grid>
          </Container>
        </>
      }

      {/* ユーザー詳細モーダル */}
      {
        userState.isOpenUserDialog &&
        <UserDialog
          isOpen={userState.isOpenUserDialog}
          user={userState.selectedUser}
          onClose={() =>
            setUserState({
              ...userState,
              isOpenUserDialog: false,
            })
          }
        />
      }

      {/* 投稿詳細モーダル */}
      {
        postState.isOpenPostDialog &&
        <PostDialog
          isOpen={postState.isOpenPostDialog}
          post={postState.selectedPost}
          user={userState.selectedUser}
          onClose={() =>
            setPostState({
              ...postState,
              isOpenPostDialog: false,
            })
          }
        />
      }
    </>
  );
});
