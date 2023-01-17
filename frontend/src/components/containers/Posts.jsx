import React, { memo, useReducer, useEffect, useState } from "react";
import {
  Container,
  Grid,
} from '@mui/material';
import { fetchPosts } from "../../apis/posts";
import { REQUEST_STATE } from "../../constants";
import { initialPostsState, postsActionTypes, postsReducer } from "../../reducers/posts";
import { Home } from "../presentations/Home.jsx";
import { UserDialog } from '../presentations/UserDialog.jsx';
import { PostDialog } from '../presentations/PostDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Posts = memo(() => {
  const [postsState, dispatch] = useReducer(postsReducer, initialPostsState);
  const [postState, setPostState] = useState({
    isOpenPostDialog: false,
    selectedPost: null,
  });
  const [postUser, setPostUser] = useState({
    isOpenUserDialog: false,
    selectedUser: null,
  });

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

  useEffect(fetchPostList, []); // postUser.selectedPostUser

  const postUserMap = new Map(postsState.userList.map((user) => [user.id, user]));

  return (
    <>
      {/* 投稿一覧 */}
      {
        postsState.fetchState === REQUEST_STATE.LOADING ?
          <CircularIndeterminate />
        :
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            spacing={3}
            sm={8}
            md={10}
          >
            {
            postsState.postList.map((post) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Home
                    post={post}
                    user={postUserMap.get(post.user_id)}
                    onClickPost={() => {
                      setPostState({
                        ...postState,
                        isOpenPostDialog: true,
                        selectedPost: post,
                      })
                      setPostUser({
                        ...postUser,
                        selectedUser: postUserMap.get(post.user_id),
                      })
                    }}
                    onClickUser={() => {
                      setPostUser({
                        ...postUser,
                        isOpenUserDialog: true,
                        selectedUser: postUserMap.get(post.user_id),
                      })
                    }}
                  />
                </Grid>
              );
            })
            }
          </Grid>
        </Container>
      }

      {/* ユーザー詳細モーダル */}
      {
        postUser.isOpenUserDialog &&
        <UserDialog
          isOpen={postUser.isOpenUserDialog}
          user={postUser.selectedUser}
          onClose={() =>
            setPostUser({
              ...postState,
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
          user={postUser.selectedUser}
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
