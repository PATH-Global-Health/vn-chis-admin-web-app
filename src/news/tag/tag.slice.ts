import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Tag } from './tag.model';
import tagService from './tag.service';

interface State {
  tagList: Tag[];
  getTagsLoading: boolean;
}

const initialState: State = {
  tagList: [],
  getTagsLoading: false,
};

const getTags = createAsyncThunk('news/tag/getTags', async () => {
  const result = await tagService.getTags();
  return result;
});

const slice = createSlice({
  name: 'news/tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTags.pending, (state) => ({
      ...state,
      getTagsLoading: true,
    }));
    builder.addCase(getTags.fulfilled, (state, { payload }) => ({
      ...state,
      tagList: payload,
      getTagsLoading: false,
    }));
    builder.addCase(getTags.rejected, (state) => ({
      ...state,
      getTagsLoading: false,
    }));
  },
});

export { getTags };

export default slice.reducer;
