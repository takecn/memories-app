import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  TextField,
  FormControl,
  FormLabel,
  Button,
  IconButton,
} from "@mui/material";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import UpdateIcon from '@mui/icons-material/Update';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from 'prop-types';

export const PostEditDialog = ({
  isOpen,
  post,
  existingPostImagesPreviews,
  existingBlobs,
  newPostImagesPreviews,
  map,
  tags,
  errors,
  onClose,
  onChangeMemorableDay,
  onChangeLocation,
  onChangeTags,
  onChangeComment,
  onChangePostDescription,
  onChangePostImages,
  onSelectExistingImages,
  onRemoveExistingImages,
  onRemoveNewImages,
  onClick,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
    {errors &&
      <Stack>
        {errors.map((error) =>
        <Alert key={error} severity="error">{error}</Alert>
        )}
      </Stack>
    }
      <DialogTitle>
        <Stack>思い出を形に残そう</Stack>
      </DialogTitle>
      <DialogContent>
        {/* <Stack direction="row"> */}
        <div>
          <FormControl>
            <FormLabel startIcon={<PhotoCamera />}>写真・画像</FormLabel>
            {/* <label htmlFor={inputId}> */}
            <input
              // id={inputID}
              onChange={onChangePostImages}
              multiple
              type="file"
              accept=".png, .jpg, .jpeg, .gif"
            />
            {/* </label> */}
          </FormControl>
        </div>
          <FormControl>
            <FormLabel>プレビュー（投稿済み）</FormLabel>
            <Stack direction="row">
              {existingPostImagesPreviews && existingBlobs &&
                existingPostImagesPreviews.map((preview, index) =>
                  <span key={existingBlobs[index].id} style={{ position: "relative" }}>
                    <IconButton
                      aria-label="delete image"
                      style={{
                        position: "absolute",
                        top: -15,
                        left: -10,
                        color: "black",
                      }}
                      onClick={() => {
                        onSelectExistingImages(existingBlobs[index].id)
                        onRemoveExistingImages(index)
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                    <img
                      alt="preview"
                      src={preview}
                      height="50"
                      style={{marginLeft: "10px"}}
                    />
                  </span>
                )
              }
            </Stack>
            <FormLabel>プレビュー（未投稿）</FormLabel>
            <Stack direction="row">
              {newPostImagesPreviews &&
                newPostImagesPreviews.map((preview, index) =>
                  <span key={index} style={{ position: "relative" }}>
                    <IconButton
                      aria-label="delete image"
                      style={{
                        position: "absolute",
                        top: -15,
                        left: -10,
                        color: "black",
                      }}
                      onClick={() => onRemoveNewImages(index)}
                    >
                      <CancelIcon />
                    </IconButton>
                    <img
                      alt="preview"
                      src={preview}
                      height="50"
                      style={{marginLeft: "10px"}}
                    />
                  </span>
                )
              }
            </Stack>
          </FormControl>
        {/* </Stack> */}
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Responsive"
            openTo="year"
            views={['year', 'month', 'day']}
            value={null}
            onChange={onChangeMemorableDay}
            renderInput={() =>
              <TextField
                onChange={onChangeMemorableDay}
                type="date"
                label="いつ？"
                fullWidth
                variant="outlined"
                margin="normal"
              />
            }
          />
        </LocalizationProvider> */}
        <TextField
          onChange={onChangeMemorableDay}
          label="いつ？"
          type="date"
          fullWidth
          defaultValue={post.memorized_on ? post.memorized_on : null}
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeLocation}
          label="どこ？"
          type="text"
          fullWidth
          defaultValue={map.location ? map.location : null}
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeTags}
          label="タグ"
          type="text"
          fullWidth
          defaultValue={tags}
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeComment}
          label="コメント"
          type="text"
          fullWidth
          defaultValue={post.comment ? post.comment : null}
          variant="outlined"
          margin="normal"
        />
        {/* 公開先グループ（グループアイコンとグループ名） */}
        {/* 公開先ユーザー */}
        <TextField
          onChange={onChangePostDescription}
          label="詳細・補足"
          type="text"
          multiline
          fullWidth
          defaultValue={post.description ? post.description : null}
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={onClick}
          variant="outlined"
          startIcon={<UpdateIcon />}
        >
          編集を確定する
        </Button>
      </DialogActions>
    </Dialog>
  )
}

PostEditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  post: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  existingPostImagesPreviews: PropTypes.objectOf(PropTypes.string).isRequired,
  existingBlobs: PropTypes.objectOf(PropTypes.number).isRequired,
  newPostImagesPreviews: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeMemorableDay: PropTypes.func.isRequired,
  onChangeLocation: PropTypes.func.isRequired,
  onChangeTags: PropTypes.func.isRequired,
  onChangeComment: PropTypes.func.isRequired,
  onChangePostDescription: PropTypes.func.isRequired,
  onChangePostImages: PropTypes.func.isRequired,
  onSelectExistingImages: PropTypes.func.isRequired,
  onRemoveExistingImages: PropTypes.func.isRequired,
  onRemoveNewImages: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
