import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Gender } from './gender.model';
import genderService from './gender.service';

interface State {
  genderList: Gender[];
  getGendersLoading: boolean;
}

const initialState: State = {
  genderList: [],
  getGendersLoading: false,
};

const getGenders = createAsyncThunk(
  'pqm/category/gender/getGenders',
  async () => {
    const result = await genderService.getGenders();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/gender',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGenders.pending, (state) => ({
      ...state,
      getGendersLoading: true,
    }));
    builder.addCase(getGenders.fulfilled, (state, { payload }) => ({
      ...state,
      genderList: payload,
      getGendersLoading: false,
    }));
    builder.addCase(getGenders.rejected, (state) => ({
      ...state,
      getGendersLoading: false,
    }));
  },
});

export { getGenders };

export default slice.reducer;
