import React, { memo, useReducer, useEffect, useState, useContext } from "react";
import {
  Container,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import { fetchPosts, deletePost, postPost } from "../../apis/posts";
import { SessionContext } from "../providers/SessionProvider.jsx";
import { REQUEST_STATE } from "../../constants";
import { initialPostsState, postsActionTypes, postsReducer } from "../../reducers/posts";
import { Home } from "../presentations/Home.jsx";
import { LoginDialog } from '../presentations/LoginDialog.jsx';
import { DeleteDialog } from '../presentations/DeleteDialog.jsx';
import { UserDialog } from '../presentations/UserDialog.jsx';
import { PostCreateEditDialog } from '../presentations/PostCreateEditDialog.jsx';
import { PostDialog } from '../presentations/PostDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Posts = memo(() => {
  const {
    sessionState,
    setSessionState,
    loginErrors,
    // setLoginErrors,
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
    isOpenPostCreateEditDialog: false,
    isOpenPostDialog: false,
    isOpenPostDeleteDialog: false,
    selectedPost: null,
    message: null,
  });
  const [userState, setUserState] = useState({
    isOpenUserDialog: false,
    selectedUser: null,
  });
  const [errors, setErrors] = useState();
  const [memorableDay, setMemorableDay] = useState();
  const [location, setLocation] = useState();
  const [tags, setTags] = useState();
  const [comment, setComment] = useState();
  // const [disclosureGroups, setDisclosureGroups] = useState();
  // const [disclosureGroupsAvatars, setDisclosureGroupsAvatars] = useState();
  // const [disclosureGroupsUsers, setDisclosureGroupsUsers] = useState();
  const [postDescription, setPostDescription] = useState();
  const [postImages, setPostImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  // const [reply, setReply] = useState();

  const fetchPostList = () => {
    dispatch({ type: postsActionTypes.FETCHING });
    fetchPosts()
    .then((data) =>
      dispatch({
        type: postsActionTypes.FETCH_SUCCESS,
        payload: {
          posts: data.posts,
          users: data.users,
          maps: data.maps,
          post_tags: data.post_tags,
          tags: data.tags,
        },
      })
    );
  };

  const postUserMap = new Map(postsState.userList.map((user) => [user.id, user]));
  const postMapMap = new Map(postsState.mapList.map((map) => [map.id, map]));
  const tagMap = new Map(postsState.tagList.map((tag) => [tag.id, tag]));

  const previewPostImages = (e) => {
    const imageFiles = [...e.target.files];
    const previewUrls = imageFiles.map((file) => window.URL.createObjectURL(file));
    setPreviews([...previews, previewUrls].flat())
  };

  const createFormData = () => {
    const formData = new FormData();
    if (memorableDay) formData.append("memorized_on", memorableDay);
    if (location) formData.append("location", location);
    if (tags) formData.append("tag_name", tags);
    if (comment) formData.append("comment", comment);
    if (postDescription) formData.append("description", postDescription);
    if (postImages) {
      postImages.map((image) =>
        formData.append("post_images[]", image)
      )
    };
    return formData
  };

  const postCreate = () => {
    const formData = createFormData();

    postPost({formData})
    .then((data) => {
      if (data) {
        setPostState({
          ...postState,
          isOpenPostDialog: true,
          isOpenPostCreateEditDialog: false,
          selectedPost: data.post,
          message: data.message,
        })
        setUserState({
          ...userState,
          selectedUser: sessionState.loginUser,
        })
        setErrors()
        setMemorableDay()
        setLocation()
        setTags()
        setComment()
        setPostDescription()
        setPostImages([])
        setPreviews([])
      } else {
        setErrors(data.error_messages)
      }
    })
  };

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
  };

  useEffect(fetchPostList, [userState, postState.selectedPost, location, tags, postImages]);

  return (
    <>
      {/* ログインモーダル */}
      {
        sessionState.isOpenLoginDialog &&
        !(sessionState.loginUser) &&
        <LoginDialog
          isOpen={sessionState.isOpenLoginDialog}
          messages={sessionState.message}
          errors={loginErrors}
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
          <Button
            variant="outlined"
            onClick={() =>
              setPostState({
                ...postState,
                isOpenPostCreateEditDialog: true,
                message: null,
              })
            }
          >
            新規投稿する
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
                      postImages={post.post_images}
                      user={postUserMap.get(post.user_id)}
                      map={postMapMap.get(post.map_id)}
                      tags={
                        postsState.postTagList.filter(
                          (postTag) => postTag.post_id === post.id
                        )
                        .map((postTag) => tagMap.get(postTag.tag_id))
                      }
                      onClickPost={() => {
                        setPostState({
                          ...postState,
                          isOpenPostDialog: true,
                          selectedPost: post,
                          message: null,
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

      {/* 新規投稿モーダル */}
      {
        postState.isOpenPostCreateEditDialog &&
        <PostCreateEditDialog
          isOpen={postState.isOpenPostCreateEditDialog}
          previews={previews}
          errors={errors}
          onClose={() => {
            setPostState({
              ...postState,
              isOpenPostCreateEditDialog: false,
            })
            setErrors()
            setMemorableDay()
            setLocation()
            setTags()
            setComment()
            setPostDescription()
            setPostImages()
            setPreviews()
          }}
          onChangeMemorableDay={(e) => setMemorableDay(e.target.value)}
          onChangeLocation={(e) => setLocation(e.target.value)}
          onChangeTags={(e) => setTags(e.target.value)}
          onChangeComment={(e) => setComment(e.target.value)}
          onChangePostDescription={(e) => setPostDescription(e.target.value)}
          onChangePostImages={(e) => {
            setPostImages([...postImages, ...e.target.files])
            previewPostImages(e)
          }}
          onClick={postCreate}
        />
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
          postImages={postState.selectedPost.post_images}
          user={userState.selectedUser}
          map={postMapMap.get(postState.selectedPost.map_id)}
          tags={
            postsState.postTagList.filter(
              (postTag) => postTag.post_id === postState.selectedPost.id
            )
            .map((postTag) => tagMap.get(postTag.tag_id))
          }
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
          post={postState.selectedPost}
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
