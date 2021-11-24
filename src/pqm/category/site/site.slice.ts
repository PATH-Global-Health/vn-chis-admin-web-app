import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

import { Site, SiteByCode } from './site.model';
import siteService from './site.service';

interface Filter {
  siteTypeId?: string;
  provinceCode?: string;
  districtCode?: string;
}

interface State {
  filter: Filter;
  siteList: Site[];
  siteByCode: SiteByCode;
  getSitesLoading: boolean;
  getSitesByCodeLoading: boolean;
}

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const initialState: State = {
  filter: {},
  siteList: [],
  siteByCode: {
    total: 0,
    pageCount: 0,
    data: [],
  },
  getSitesLoading: false,
  getSitesByCodeLoading: false,
};

const setFilterCR: CR<Filter> = (state, action) => ({
  ...state,
  filter: action.payload,
});

const getSites = createAsyncThunk(
  'pqm/category/site/getSites',
  async ({ districtId = '' }: { districtId?: string }) => {
    const result = await siteService.getSites({
      districtId,
    });
    return result;
  },
);

const getSitesByCode = createAsyncThunk(
  'pqm/category/site/getSitesByCode',
  async ({
    pageIndex = 0,
    pageSize = 10,
    siteTypeId = '',
    provinceCode = '',
    districtCode = '',
  }: {
    pageIndex: number;
    pageSize: number;
    siteTypeId: string;
    provinceCode: string;
    districtCode: string;
  }) => {
    const result = await siteService.getSitesByCode({
      pageIndex,
      pageSize,
      siteTypeId,
      provinceCode,
      districtCode,
    });
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/site',
  initialState,
  reducers: {
    setFilter: setFilterCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getSites.pending, (state) => ({
      ...state,
      getSitesLoading: true,
    }));
    builder.addCase(getSites.fulfilled, (state, { payload }) => ({
      ...state,
      siteList: payload,
      getSitesLoading: false,
    }));
    builder.addCase(getSites.rejected, (state) => ({
      ...state,
      getSitesLoading: false,
    }));
    builder.addCase(getSitesByCode.pending, (state) => ({
      ...state,
      getSitesByCodeLoading: true,
    }));
    builder.addCase(getSitesByCode.fulfilled, (state, { payload }) => ({
      ...state,
      siteByCode: payload,
      getSitesByCodeLoading: false,
    }));
    builder.addCase(getSitesByCode.rejected, (state) => ({
      ...state,
      getSitesByCodeLoading: false,
    }));
  },
});

export const { setFilter } = slice.actions;

export { getSites, getSitesByCode };

export default slice.reducer;
