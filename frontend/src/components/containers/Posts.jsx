import React, { memo, useReducer, useEffect } from "react";
import {
  Container,
  // Box,
  Grid,
} from '@mui/material';
import { fetchPosts } from "../../apis/posts";
import { REQUEST_STATE } from "../../constants";
import { initialPostsState, postsActionTypes, postsReducer } from "../../reducers/posts";
import { Home } from "../presentations/Home.jsx";
import { CircularIndeterminate } from '../presentations/CircularIndeterminate.jsx';

export const Posts = memo(() => {
  const [postsState, dispatch] = useReducer(postsReducer, initialPostsState);
  // const [state, setState] = useState({
  //   isOpenPostDialog: false,
  //   selectedPost: null,
  // });

  const fetchPostList = () => {
    dispatch({ type: postsActionTypes.FETCHING });
    fetchPosts()
    .then((data) =>
      dispatch({
        type: postsActionTypes.FETCH_SUCCESS,
        payload: { posts: data.posts },
      })
    );
  };

  useEffect(fetchPostList, []); //! state.selectedPost

  return (
    <>
      {/* 投稿一覧 */}
      {
        postsState.fetchState === REQUEST_STATE.LOADING ?
          <CircularIndeterminate />
        :
        <Container>
        <Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          spacing={3}
          sm={8}
          md={10}
        >
          {postsState.postList.map((post) =>
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Home
                post={post}
                // onClickPost={() =>
                //   setState({
                //     ...state,
                //     isOpenPostDialog: true,
                //     selectedPost: post,
                //   })
                // }
              />
            </Grid>
          )}
        </Grid>
        </Grid>
        </Container>
      }
    </>
  );
});
