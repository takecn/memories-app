import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import styled from 'styled-components';
import postImage from "../../images/IMG_5612.jpeg"

// const SwiperWrapper = styled.div`
//     .mySwiper {
//         color: gray;
//     }
// `;

export const Home = (props) => {
  const { post } = props;

  return (
    <Card sx={{ maxWidth: 500 }} elevation={12}>
      <CardHeader
        avatar={
          <Avatar alt="ユーザー名" src="ユーザーアイコンURL" sx={{ bgcolor: red[500] }} aria-label="recipe" />
        }
        title="ユーザー名"
        subheader={`投稿日 ${post.created_at}`.slice(0, 14)}
      />
      {/* 画像をどう見せるかは要検討．MUIのImageListにする？ */}
      {/* <SwiperWrapper> */}
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
      {/* </SwiperWrapper> */}
      <CardContent>
        <div>
          <HistoryIcon />
          <EventIcon />
        </div>
        <div>
          <WhereToVoteIcon />
        </div>
        <div>
          <LocalOfferIcon />
        </div>
        <Typography variant="body2" color="text.secondary">
          {post.comment}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <ThumbUpIcon />
        </IconButton>
        <IconButton aria-label="share">
          <BookmarkIcon />
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
  // onClickPost: PropTypes.func.isRequired,
};
