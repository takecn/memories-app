import React from "react";
import { Card, Stack } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EventIcon from '@mui/icons-material/Event';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChatIcon from '@mui/icons-material/Chat';
import PropTypes from "prop-types";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styled from "styled-components";

const CardMediaWrapper = styled.div`
  background: #e8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 194px;
  width: auto;
  object-fit: cover;
`;

const ItemWrapper = styled.span`
  background-color: #e8f8f8;
  border: solid;
  border-radius: 50% 20% / 10% 40%;
  margin: 3px;
  padding: 3px;
`;

export const Home = (props) => {
  const {
    post,
    postImages,
    user,
    map,
    tags,
    onClickPost,
    onClickUser,
  } = props;

  return (
    <Card sx={{ maxWidth: 500 }} elevation={12}>
      <CardHeader
        avatar={
          <Avatar
            alt={user.user_name}
            src={user.user_avatar}
            aria-label="recipe"
            onClick={onClickUser}
            style={{ cursor: 'pointer' }}
          />
        }
        title={user.user_name}
        subheader={`投稿日 ${post.created_at}`.slice(0, 14)}
      />
      <Typography variant="body2" color="text.secondary" style={{ fontSize: "large" }}>
        {post.comment}
      </Typography>
      {/* <Swiper
        spaceBetween={30}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      > */}
      {postImages &&
        <ImageList sx={{ width: "100%", height: 194 }} cols={3} rowHeight={164}>
          {postImages.map((image) =>
            <CardMediaWrapper>
              <ImageListItem key={image.id}>
                <CardMedia
                  component="img"
                  image={image}
                  alt="image"
                />
              </ImageListItem>
            </CardMediaWrapper>
            // <SwiperSlide key={image.id}>
            //   <CardMediaWrapper>
            //     <CardMedia
            //       component="img"
            //       image={image}
            //       alt="image"
            //     />
            //   </CardMediaWrapper>
            // </SwiperSlide>
          )}
        </ImageList>
      }
      {/* </Swiper> */}
      <CardContent onClick={onClickPost} style={{ cursor: 'pointer' }}>
        <Stack direction="row">
          <EventIcon />
          いつ？ <ItemWrapper>{post.memorized_on ? `${post.memorized_on}`.slice(0, 14) : "unknown"}</ItemWrapper>
          <WhereToVoteIcon />
          どこ？ <ItemWrapper>{map.location ? map.location : "unknown"}</ItemWrapper>
        </Stack>
        <Stack direction="row">
          <LocalOfferIcon />
          タグ {
          tags.map((tag) =>
            <ItemWrapper key={tag.id}>
              {tag.tag_name}
            </ItemWrapper>
          )}
        </Stack>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="favorites">
          <ThumbUpIcon />
        </IconButton>
        <IconButton aria-label="bookmark">
          <BookmarkIcon />
        </IconButton>
        <IconButton aria-label="chat">
          <ChatIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

Home.propTypes = {
  post: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  postImages: PropTypes.objectOf(PropTypes.string).isRequired,
  user: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string.isRequired,
      user_avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  map: PropTypes.objectOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
    })
  ).isRequired,
  tags: PropTypes.objectOf(
    PropTypes.shape({
      tag: PropTypes.objectOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          tag_name: PropTypes.string.isRequired,
        })
      )
    })
  ).isRequired,
  onClickPost: PropTypes.func.isRequired,
  onClickUser: PropTypes.func.isRequired,
};
