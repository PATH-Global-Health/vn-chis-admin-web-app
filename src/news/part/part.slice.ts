import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Part } from './part.model';
import partService from './part.service';

interface State {
  partList: Part[];
  getPartsLoading: boolean;
}

const initialState: State = {
  partList: [],
  getPartsLoading: false,
};

const getParts = createAsyncThunk(
  'pqm/post/part/getParts',
  async (postId: string) => {
    const result = await partService.getParts(postId);
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/post/part',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getParts.pending, (state) => ({
      ...state,
      getPartsLoading: true,
    }));
    builder.addCase(getParts.fulfilled, (state, { payload }) => ({
      ...state,
      partList: payload,
      getPartsLoading: false,
    }));
    builder.addCase(getParts.rejected, (state) => ({
      ...state,
      getPartsLoading: false,
    }));
  },
});

export { getParts };

export default slice.reducer;
