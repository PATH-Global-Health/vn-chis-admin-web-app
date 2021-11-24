import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

import { District } from './district.model';
import districtService from './district.service';

interface Filter {
  provinceCode?: string;
}

interface State {
  filter: Filter;
  districtList: District[];
  getDistrictsLoading: boolean;
}

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const initialState: State = {
  filter: {},
  districtList: [],
  getDistrictsLoading: false,
};

const setFilterCR: CR<Filter> = (state, action) => ({
  ...state,
  filter: action.payload,
});

const getDistricts = createAsyncThunk(
  'pqm/category/district/getDistricts',
  async ({ provinceCode = '' }: { provinceCode?: string }) => {
    const result = await districtService.getDistricts({
      provinceCode,
    });
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/district',
  initialState,
  reducers: {
    setFilter: setFilterCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getDistricts.pending, (state) => ({
      ...state,
      getDistrictsLoading: true,
    }));
    builder.addCase(getDistricts.fulfilled, (state, { payload }) => ({
      ...state,
      districtList: payload,
      getDistrictsLoading: false,
    }));
    builder.addCase(getDistricts.rejected, (state) => ({
      ...state,
      getDistrictsLoading: false,
    }));
  },
});

export const { setFilter } = slice.actions;

export { getDistricts };

export default slice.reducer;
