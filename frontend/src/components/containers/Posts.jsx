import React, { memo, useReducer, useEffect, useState, useCallback, useContext } from "react";
import {
  Container,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import { fetchPosts, postPost, putPost, deletePost } from "../../apis/posts";
import { postFavorite, deleteFavorite } from "../../apis/favorites";
import { postBookmark, deleteBookmark } from "../../apis/bookmarks";
import { REQUEST_STATE } from "../../constants";
import {
  actionTypes,
  initialPostsState,
  initialFaviconsState,
  postsReducer,
  faviconsReducer,
} from "../../reducers/posts";
import { SessionContext } from "../providers/SessionProvider.jsx";
import { LocationsMap } from "../presentations/LocationsMap.jsx";
import { PostCard } from "../presentations/PostCard.jsx";
import { LoginDialog } from '../presentations/LoginDialog.jsx';
import { DeleteDialog } from '../presentations/DeleteDialog.jsx';
import { UserDialog } from '../presentations/UserDialog.jsx';
import { PostCreateDialog } from '../presentations/PostCreateDialog.jsx';
import { PostEditDialog } from '../presentations/PostEditDialog.jsx';
import { PostDialog } from '../presentations/PostDialog.jsx';
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Posts = memo(() => {
  const {
    sessionState,
    setSessionState,
    loginErrors,
    setUserName,
    setUserEmail,
    setUserPassword,
    login,
    guestLogin,
    logout,
    } = useContext(SessionContext);

  const [postsState, postsDispatch] = useReducer(postsReducer, initialPostsState);
  const [faviconsState, faviconsDispatch] = useReducer(faviconsReducer, initialFaviconsState);
  const [postState, setPostState] = useState({
    isHomePage: true,
    isOpenPostCreateDialog: false,
    isOpenPostDialog: false,
    isOpenPostEditDialog: false,
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
  const [beRemovedPostImagesBlobIds, setBeRemovedPostImagesBlobIds] = useState([]); // ActiveStorage::Blobのidを保持する．
  const [existingPostImagesPreviews, setExistingPostImagesPreviews] = useState([]); // ActiveStorageに保存済みの画像URLを保持する．プレビュー表示に使用する．
  const [newPostImagesPreviews, setNewPostImagesPreviews] = useState([]); // 入力フォームに追加した画像のパスを保持する．プレビュー表示に使用する．
  // const [reply, setReply] = useState();

  // postsレコードを取得する．
  const fetchPostList = useCallback(() => {
    postsDispatch({ type: actionTypes.FETCHING });
    fetchPosts()
    .then((data) => {
      postsDispatch({
        type: actionTypes.FETCH_SUCCESS,
        payload: {
          posts: data.posts,
          users: data.users,
          maps: data.maps,
          post_tags: data.post_tags,
          tags: data.tags,
        },
      });
    });
  }, []);

  // favoritesレコードを取得する．
  const fetchFaviconList = useCallback(() => {
    fetchPosts()
    .then((data) => {
      faviconsDispatch({
        type: actionTypes.FETCH_SUCCESS,
        payload: {
          favorites: data.favorites,
          favoritesAll: data.favorites_all,
          bookmarks: data.bookmarks,
        },
      });
    });
  }, []);

  // 各種配列にキーを設定する．投稿一覧Card, 投稿詳細モーダルにpropsで渡すための前処理．
  const postUserMap = new Map(postsState.userList.map((user) => [user.id, user]));
  const postMapMap = new Map(postsState.mapList.map((map) => [map.id, map]));
  const postFavoriteMap = new Map(faviconsState.favoriteList.map((favorite) => [favorite.post_id, favorite]));
  const postBookmarkMap = new Map(faviconsState.bookmarkList.map((bookmark) => [bookmark.post_id, bookmark]));
  const tagMap = new Map(postsState.tagList.map((tag) => [tag.id, tag]));
  const tagNameMap = new Map(postsState.tagList.map((tag) => [tag.id, tag.tag_name]));

  // 当該投稿のタグを配列で取得する．
  const postTags = (postId) => (
    postsState.postTagList.filter(
      (postTag) => postTag.post_id === postId
    )
    .map((postTag) => tagMap.get(postTag.tag_id))
  );

  // 当該投稿へのいいね数を取得する．
  const favoritesCount = (postId) => (
    faviconsState.favoriteListAll.filter(
      (favorite) => favorite.post_id === postId
    ).length
  );

  // 入力フォームに追加した画像をプレビュー表示する．
  const previewPostImages = (e) => {
    const imageFiles = [...e.target.files];
    const previewUrls = imageFiles.map((file) => window.URL.createObjectURL(file));
    setNewPostImagesPreviews([...newPostImagesPreviews, previewUrls].flat());
  };

  // 投稿済みの画像を削除する．
  const removeExistingImages = (index) => {
    const removeExistingPostImages = [...existingPostImagesPreviews];
    removeExistingPostImages.splice(index, 1);
    setExistingPostImagesPreviews(removeExistingPostImages);
  }

  // 入力フォームに追加した画像を削除する．
  const removeNewNewImages = (index) => {
    const removeNewPostImages = [...postImages];
    const removeNewPostImagesPreviews = [...newPostImagesPreviews];
    removeNewPostImages.splice(index, 1);
    removeNewPostImagesPreviews.splice(index, 1);
    setPostImages(removeNewPostImages);
    setNewPostImagesPreviews(removeNewPostImagesPreviews);
  };

  // フォームに入力したデータを保持する．
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
    if (beRemovedPostImagesBlobIds) {
      beRemovedPostImagesBlobIds.map((blobId) =>
        formData.append("images_blob_ids[]", blobId)
      )
    };
    return formData
  };

  // 投稿新設をリクエストする．
  const postCreate = () => {
    const formData = createFormData();
    postPost({formData})
    .then((data) => {
      if (data) {
        setPostState({
          ...postState,
          isOpenPostDialog: true,
          isOpenPostCreateDialog: false,
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
        setPostImages(data.post.post_images)
        setExistingPostImagesPreviews(postState.selectedPost.post_images)
        setNewPostImagesPreviews([])
      } else {
        setErrors(data.error_messages)
      }
    })
    fetchPostList()
  };

  // 投稿更新をリクエストする．
  const postUpdate = () => {
    if (memorableDay !== undefined ||
      location !== undefined ||
      tags !== undefined ||
      comment !== undefined ||
      postDescription !== undefined ||
      postImages !== undefined) {

      const formData = createFormData();
      putPost({
        postId: postState.selectedPost.id,
        formData,
      })
      .then((data) => {
        if (data) {
          setPostState({
            ...postState,
            isOpenPostDialog: true,
            isOpenPostEditDialog: false,
            selectedPost: data.post,
            message: data.message,
          })
          // setUserState({
          //   ...userState,
          //   selectedUser: sessionState.loginUser,
          // })
          setErrors()
          setMemorableDay()
          setLocation()
          setTags()
          setComment()
          setPostDescription()
          setPostImages(data.post.post_images)
          setBeRemovedPostImagesBlobIds([])
          setExistingPostImagesPreviews(postState.selectedPost.post_images)
          setNewPostImagesPreviews([])
        } else {
          setErrors(data.error_messages)
        }
      })
    }
    fetchPostList()
  };

  // 投稿削除をリクエストする．
  const postDelete = () => {
    deletePost({postId: postState.selectedPost.id})
    .then((data) => {
      setPostState({
        isOpenPostDialog: false,
        isOpenPostDeleteDialog: false,
        selectedPost: null,
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
      setNewPostImagesPreviews([])
    })
    fetchPostList()
  };

  // お気に入り登録・解除する．
  const favoriteCreateOrDelete = (id, e) => {
    if (e.target.checked) {
      postFavorite({postId: id})
      .then((data) => {
        setPostState(
          postState.isOpenPostDialog ?
            {...postState,
            isOpenPostDialog: true,
            message: data.message,
            }
          :
            {...postState,
              message: data.message,
            }
        )
      })
      fetchFaviconList()
    } else {
      deleteFavorite({postId: id})
      .then((data) => {
        setPostState(
          postState.isOpenPostDialog ?
            {...postState,
            isOpenPostDialog: true,
            message: data.message,
            }
          :
            {...postState,
              message: data.message,
            }
        )
      })
      fetchFaviconList()
    }
  };

  // ブックマーク登録・解除する．
  const bookmarkCreateOrDelete = (id, e) => {
    if (e.target.checked) {
      postBookmark({postId: id})
      .then((data) => {
        setPostState(
          postState.isOpenPostDialog ?
            {...postState,
            isOpenPostDialog: true,
            message: data.message,
            }
          :
            {...postState,
              message: data.message,
            }
        )
      })
      fetchFaviconList()
    } else {
      deleteBookmark({postId: id})
      .then((data) => {
        setPostState(
          postState.isOpenPostDialog ?
            {...postState,
            isOpenPostDialog: true,
            message: data.message,
            }
          :
            {...postState,
              message: data.message,
            }
        )
      })
      fetchFaviconList()
    }
  };

  // 再レンダリングする．sessionState.loginUserはログイン時にレンダリングするために指定している．
  useEffect(fetchPostList, [sessionState.loginUser, postImages, location]); // , login, guestLogin, postState.selectedPost, postImages, location, tags
  useEffect(fetchFaviconList, [sessionState.loginUser]);

  return (
    <>
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
                isOpenPostCreateDialog: true,
                message: null,
              })
            }
          >
            新規投稿する
          </Button>
          {/* GoogleMap */}
          {postsState.mapList.length > 0 &&
            <LocationsMap maps={postsState.mapList} />
          }
          {/* <LocationsMap googleMapsApiKey={googleMapsApiKey} /> */}
          {/* 投稿一覧 */}
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
                  <Grid key={post.id} item xs={12} md={12}>
                    <PostCard
                      post={post}
                      postImages={post.post_images}
                      user={postUserMap.get(post.user_id)}
                      map={postMapMap.get(post.map_id)}
                      tags={postTags(post.id)}
                      favoriteState={Boolean(postFavoriteMap.get(post.id))}
                      favoritesCount={favoritesCount(post.id)}
                      bookmarkState={Boolean(postBookmarkMap.get(post.id))}
                      onClickPost={() => {
                        setPostState({
                          ...postState,
                          isOpenPostDialog: true,
                          selectedPost: post,
                          message: null,
                        })
                        // setPostImages(post.post_images)
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
                      onClickFavorite={(e) => {
                        favoriteCreateOrDelete(post.id, e)
                      }}
                      onClickBookmark={(e) => {
                        bookmarkCreateOrDelete(post.id, e)
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

      {/* 新規投稿モーダル */}
      {
        postState.isOpenPostCreateDialog &&
        <PostCreateDialog
          isOpen={postState.isOpenPostCreateDialog}
          newPostImagesPreviews={newPostImagesPreviews}
          errors={errors}
          onClose={() => {
            setPostState({
              ...postState,
              isOpenPostCreateDialog: false,
            })
            setErrors()
            setMemorableDay()
            setLocation()
            setTags()
            setComment()
            setPostDescription()
            setPostImages([])
            setNewPostImagesPreviews([])
          }}
          onChangeMemorableDay={(e) => setMemorableDay(e.target.value)}
          onChangeLocation={(e) => setLocation(e.target.value)}
          onChangeTags={(e) => setTags(e.target.value)}
          onChangeComment={(e) => setComment(e.target.value)}
          onChangePostDescription={(e) => setPostDescription(e.target.value)}
          onChangePostImages={(e) => {
            setPostImages([...e.target.files])
            previewPostImages(e)
          }}
          onRemoveNewImages={((index) => removeNewNewImages(index))}
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
          tags={postTags(postState.selectedPost.id)}
          favoriteState={Boolean(postFavoriteMap.get(postState.selectedPost.id))}
          favoritesCount={favoritesCount(postState.selectedPost.id)}
          bookmarkState={Boolean(postBookmarkMap.get(postState.selectedPost.id))}
          message={postState.message}
          onClose={() =>
            setPostState({
              ...postState,
              isOpenPostDialog: false,
            })
          }
          onClickFavorite={(e) => {
            favoriteCreateOrDelete(postState.selectedPost.id, e)
          }}
          onClickBookmark={(e) => {
            bookmarkCreateOrDelete(postState.selectedPost.id, e)
          }}
          onClickPostEdit={() => {
            setPostState({
              ...postState,
              isOpenPostEditDialog: true,
            })
            setPostImages([])
            setExistingPostImagesPreviews(postState.selectedPost.post_images)
          }}
          onClickPostDelete={() =>
            setPostState({
              ...postState,
              isOpenPostDeleteDialog: true,
            })
          }
        />
      }

      {/* 投稿編集モーダル */}
      {
        postState.isOpenPostEditDialog &&
        <PostEditDialog
          isOpen={postState.isOpenPostEditDialog}
          post={postState.selectedPost}
          existingPostImagesPreviews={existingPostImagesPreviews}
          existingBlobs={postState.selectedPost.blobs}
          newPostImagesPreviews={newPostImagesPreviews}
          map={postMapMap.get(postState.selectedPost.map_id)}
          tags={
            Array.from(new Set(
              postsState.postTagList.filter(
                (postTag) => postTag.post_id === postState.selectedPost.id
              )
              .map((postTag) => tagNameMap.get(postTag.tag_id))
            ))
            .join(",")
          }
          errors={errors}
          onClose={() => {
            setPostState({
              ...postState,
              isOpenPostEditDialog: false,
            })
            setErrors()
          }}
          onChangeMemorableDay={(e) => setMemorableDay(e.target.value)}
          onChangeLocation={(e) => setLocation(e.target.value)}
          onChangeTags={(e) => setTags(e.target.value)}
          onChangeComment={(e) => setComment(e.target.value)}
          onChangePostDescription={(e) => setPostDescription(e.target.value)}
          onChangePostImages={(e) => {
            setPostImages([...e.target.files])
            previewPostImages(e)
          }}
          onSelectExistingImages={(blobId) =>
            setBeRemovedPostImagesBlobIds([...beRemovedPostImagesBlobIds, blobId])
          }
          onRemoveExistingImages={((index) => removeExistingImages(index))}
          onRemoveNewImages={((index) => removeNewNewImages(index))}
          onClick={postUpdate}
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
