import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Province } from './province.model';
import provinceService from './province.service';

interface State {
  provinceList: Province[];
  getProvincesLoading: boolean;
}

const initialState: State = {
  provinceList: [],
  getProvincesLoading: false,
};

const getProvinces = createAsyncThunk(
  'pqm/category/province/getProvinces',
  async () => {
    const result = await provinceService.getProvinces();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/province',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProvinces.pending, (state) => ({
      ...state,
      getProvincesLoading: true,
    }));
    builder.addCase(getProvinces.fulfilled, (state, { payload }) => ({
      ...state,
      provinceList: payload,
      getProvincesLoading: false,
    }));
    builder.addCase(getProvinces.rejected, (state) => ({
      ...state,
      getProvincesLoading: false,
    }));
  },
});

export { getProvinces };

export default slice.reducer;
