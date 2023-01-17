import React from "react";
import Card from '@mui/material/Card';
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import postImage from "../../images/IMG_5612.jpeg"

export const Home = (props) => {
  const {
    post,
    user,
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
          />
        }
        title={user.user_name}
        subheader={`投稿日 ${post.created_at}`.slice(0, 14)}
        onClick={onClickUser}
      />
      <Swiper
        spaceBetween={30}
        // centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <CardMedia
            component="img"
            height="194"
            image={postImage}
            alt="image"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            height="194"
            image={postImage}
            alt="image"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            height="194"
            image={postImage}
            alt="image"
          />
        </SwiperSlide>
      </Swiper>
      <CardContent onClick={onClickPost}>
        <div>
          <EventIcon />
          いつ？
        </div>
        <div>
          <WhereToVoteIcon />
          どこ？
        </div>
        <div>
          <LocalOfferIcon />
          タグ？
        </div>
        <Typography variant="body2" color="text.secondary">
          {post.comment}
        </Typography>
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
  user: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string.isRequired,
      user_avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClickPost: PropTypes.func.isRequired,
  onClickUser: PropTypes.func.isRequired,
};
