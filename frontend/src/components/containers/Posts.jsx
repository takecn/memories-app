import React, { memo, useReducer, useEffect, useState, useContext } from "react";
import {
  Container,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import { fetchPosts, deletePost } from "../../apis/posts";
import { SessionContext } from "../providers/SessionProvider.jsx";
import { REQUEST_STATE } from "../../constants";
import { initialPostsState, postsActionTypes, postsReducer } from "../../reducers/posts";
import { Home } from "../presentations/Home.jsx";
import { LoginDialog } from '../presentations/LoginDialog.jsx';
import { DeleteDialog } from '../presentations/DeleteDialog.jsx';
import { UserDialog } from '../presentations/UserDialog.jsx';
import { PostDialog } from '../presentations/PostDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Posts = memo(() => {
  const {
    sessionState,
    setSessionState,
    errors,
    // setErrors,
    // userName,
    setUserName,
    // userEmail,
    setUserEmail,
    // userPassword,
    setUserPassword,
    login,
    guestLogin,
    logout,
    } = useContext(SessionContext);

  const [postsState, dispatch] = useReducer(postsReducer, initialPostsState);
  const [postState, setPostState] = useState({
    isHomePage: true,
    isOpenPostDialog: false,
    isOpenPostDeleteDialog: false,
    selectedPost: null,
    message: null,
  });
  const [userState, setUserState] = useState({
    isOpenUserDialog: false,
    selectedUser: null,
  });

  const postUserMap = new Map(postsState.userList.map((user) => [user.id, user]));

  const postDelete = () => {
    deletePost({postId: postState.selectedPost.id})
    .then((data) => {
      setPostState({
        isOpenPostDialog: false,
        isOpenPostDeleteDialog: false,
        selectedPost: null,
        message: data.message,
      })
    })
  }

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

  useEffect(fetchPostList, [postState.selectedPost]);

  return (
    <>
      {/* ログインモーダル */}
      {
        sessionState.isOpenLoginDialog &&
        !(sessionState.loginUser) &&
        <LoginDialog
          isOpen={sessionState.isOpenLoginDialog}
          messages={sessionState.message}
          errors={errors}
          onChangeUserName={(e) => setUserName(e.target.value)}
          onChangeUserEmail={(e) => setUserEmail(e.target.value)}
          onChangeUserPassword={(e) => setUserPassword(e.target.value)}
          onClickLogin={login}
          onClickGuestLogin={guestLogin}
        />
      }

      {/* ログアウトモーダル */}
      {
        sessionState.isOpenLogoutDialog &&
        <DeleteDialog
          isOpen={sessionState.isOpenLogoutDialog}
          session={sessionState.isOpenLogoutDialog}
          onClose={() =>
            setSessionState({
              ...sessionState,
              isOpenLogoutDialog: false,
            })
          }
          onClickDelete={logout}
          onClickCloseDelete={() =>
            setSessionState({
              ...sessionState,
              isOpenLogoutDialog: false,
            })
          }
        />
      }

      {/* 投稿一覧 */}
      {
        postsState.fetchState === REQUEST_STATE.LOADING ?
          <CircularIndeterminate />
        :
        <>
          {sessionState.message &&
            <Alert severity="success">{sessionState.message}</Alert>
          }
          {postState.message &&
            <Alert severity="success">{postState.message}</Alert>
          }
          <Button
            variant="outlined"
            onClick={() =>
              setSessionState({
                ...sessionState,
                isOpenLogoutDialog: true,
              })
            }
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
                        setSessionState({
                          message: null
                        })
                      }}
                      onClickUser={() => {
                        setUserState({
                          ...userState,
                          isOpenUserDialog: true,
                          selectedUser: postUserMap.get(post.user_id),
                        })
                        setSessionState({
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
          isHomePage={postState.isHomePage}
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
          onClickPostDelete={() =>
            setPostState({
              ...postState,
              isOpenPostDeleteDialog: true,
            })
          }
        />
      }

      {/* 投稿削除モーダル */}
      {
        postState.isOpenPostDeleteDialog &&
        <DeleteDialog
          isOpen={postState.isOpenPostDeleteDialog}
          message={postState.message}
          onClose={() =>
            setPostState({
              ...postState,
              isOpenPostDialog: true,
              isOpenPostDeleteDialog: false,
            })
          }
          onClickDelete={postDelete}
          onClickCloseDelete={() =>
            setPostState({
              ...postState,
              isOpenPostDialog: true,
              isOpenPostDeleteDialog: false,
            })
          }
        />
      }
    </>
  );
});
