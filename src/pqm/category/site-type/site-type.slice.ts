import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { SiteType } from './site-type.model';
import siteTypeService from './site-type.service';

interface State {
  siteTypeList: SiteType[];
  getSiteTypesLoading: boolean;
}

const initialState: State = {
  siteTypeList: [],
  getSiteTypesLoading: false,
};

const getSiteTypes = createAsyncThunk(
  'pqm/category/siteType/getSiteTypes',
  async () => {
    const result = await siteTypeService.getSiteTypes();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/siteType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSiteTypes.pending, (state) => ({
      ...state,
      getSiteTypesLoading: true,
    }));
    builder.addCase(getSiteTypes.fulfilled, (state, { payload }) => ({
      ...state,
      siteTypeList: payload,
      getSiteTypesLoading: false,
    }));
    builder.addCase(getSiteTypes.rejected, (state) => ({
      ...state,
      getSiteTypesLoading: false,
    }));
  },
});

export { getSiteTypes };

export default slice.reducer;
