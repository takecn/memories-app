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
} from "@mui/material";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CreateIcon from '@mui/icons-material/Create';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PropTypes from 'prop-types';

export const PostCreateEditDialog = ({
  isOpen,
  errors,
  previews,
  onClose,
  onChangeMemorableDay,
  onChangeLocation,
  onChangeTags,
  onChangeComment,
  onChangePostDescription,
  onChangePostImages,
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
            <FormLabel>プレビュー</FormLabel>
        <Stack direction="row">
            {previews &&
              previews.map((preview) =>
                <span key={preview.id}>
                  <img
                    alt="preview"
                    src={preview}
                    height="50"
                    style={{marginLeft: "50%"}}
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
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeLocation}
          label="どこ？"
          type="text"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeTags}
          label="タグ"
          type="text"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          onChange={onChangeComment}
          label="コメント"
          type="text"
          fullWidth
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
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={onClick}
          variant="outlined"
          startIcon={<CreateIcon />}
        >
          投稿する
        </Button>
      </DialogActions>
    </Dialog>
  )
}

PostCreateEditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  previews: PropTypes.arrayOf(PropTypes.string).isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeMemorableDay: PropTypes.func.isRequired,
  onChangeLocation: PropTypes.func.isRequired,
  onChangeTags: PropTypes.func.isRequired,
  onChangeComment: PropTypes.func.isRequired,
  onChangePostDescription: PropTypes.func.isRequired,
  onChangePostImages: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
