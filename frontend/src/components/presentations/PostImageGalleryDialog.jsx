import React from "react";

// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
// import ImageListItemBar from '@mui/material/ImageListItemBar';
// import ListSubheader from '@mui/material/ListSubheader';
import {
  useMediaQuery,
  useTheme,
  Dialog,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Avatar,
  IconButton,
  // Stack,
} from "@mui/material";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PropTypes from 'prop-types';

export const PostImageGalleryDialog = ({
  isOpen,
  postList,
  mapList,
  userList,
  onClose,
  onClickPost,
  onClickUser,
}) => {

  const theme = useTheme();
  const matcheDownSm = useMediaQuery(theme.breakpoints.down('sm'));
  const matcheDownMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog maxWidth="lg" open={isOpen} onClose={onClose}>
      <ImageList
        // sx={{ width: "auto" }}
        // sx={{ width: "100%" }}
        // sx={{ width: 1000, height: 1000 }}
        cols={matcheDownSm ? 2 : matcheDownMd ? 3 : 4}
        variant="quilted"
        // rowHeight={121}
      >
        <ImageListItem
          key="Subheader"
          cols={matcheDownSm ? 2 : matcheDownMd ? 3 : 4}
        >
          <ListSubheader sx={{ fontSize: '24px' }}>
            <IconButton aria-label="PhotoLibraryIcon">
              <PhotoLibraryIcon fontSize="large" />
            </IconButton>
            イメージギャラリー（画像をタップ！）
          </ListSubheader>
        </ImageListItem>

        {postList &&
          postList.map((post) => {

            // 思い出場所，投稿者を取得する．
            const postMap = mapList.get(post.map_id);
            const postUser = userList.get(post.user_id);

            return (
              post.post_images &&
                post.post_images.map((image, index) => {
                  return (
                    <ImageListItem key={index}>
                      <ImageListItem onClick={() => onClickPost(post)} sx={{ cursor: 'pointer' }}>
                        <img
                          src={image}
                          alt="post_images"
                          loading="lazy"
                        />
                      </ImageListItem>
                      <ImageListItemBar
                        title={`${
                            postMap.location ? postMap.location : "anywhere"
                          } ${
                            post.memorized_on ? String(post.memorized_on).slice(0, 10) : "sometime"
                          }`}
                        subtitle={postUser.user_name}
                        actionIcon={
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            aria-label={`info about ${postUser.user_name} ${index}`}
                            onClick={() => onClickUser(postUser)}
                          >
                            <Avatar alt={postUser.user_name} src={postUser.user_avatar} />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  )
                })

            )
          })
        }

      </ImageList>
    </Dialog>
  );
};

PostImageGalleryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  postList: PropTypes.arrayOf(
    PropTypes.shape({
      post: PropTypes.objectOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          user_id: PropTypes.string.isRequired,
          memorized_on: PropTypes.string.isRequired,
          post_images: PropTypes.string.isRequired,
        })
      )
    })
  ).isRequired,
  mapList: PropTypes.objectOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
    })
  ).isRequired,
  userList: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string.isRequired,
      user_avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onClickPost: PropTypes.func.isRequired,
  onClickUser: PropTypes.func.isRequired,
};
