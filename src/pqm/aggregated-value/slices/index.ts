import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  AggregatedValue,
  AggregatedValueResponse,
  AggregatedValueImportResponse,
} from '@pqm/aggregated-value/models';
// eslint-disable-next-line import/no-cycle
import aggregatedValueService from '@pqm/aggregated-value/services';

type CR<T> = CaseReducer<State, PayloadAction<T>>;

interface Filter {
  period?: string;
  year?: string;
  quarter?: string;
  month?: string;
  provinceId?: string;
  districtId?: string;
  siteId?: string;
  indicatorId?: string;
  ageGroupId?: string;
  keyPopulationId?: string;
  genderId?: string;
}

interface State {
  filter: Filter;
  aggregatedValue: AggregatedValueResponse;
  aggregatedValueSelected: AggregatedValue | undefined;
  getAggregatedValuesLoading: boolean;
  uploadAggregatedValue: AggregatedValueImportResponse;
  uploadAggregatedValuesLoading: boolean;
  uploadAggregatedValuesProgress: number;
}

const initialState: State = {
  filter: {},
  aggregatedValue: {
    total: 0,
    pageCount: 0,
    data: [],
  },
  aggregatedValueSelected: undefined,
  getAggregatedValuesLoading: false,
  uploadAggregatedValue: {
    succeed: 0,
    updated: 0,
    succeedWithUndefinedDimValue: 0,
    errorRows: [],
  },
  uploadAggregatedValuesLoading: false,
  uploadAggregatedValuesProgress: 0,
};

const setFilterCR: CR<Filter> = (state, action) => ({
  ...state,
  filter: action.payload,
});

const setAggregatedValueSelectedCR: CR<AggregatedValue | undefined> = (
  state,
  action,
) => ({
  ...state,
  aggregatedValueSelected: action.payload,
});

const getAggregatedValues = createAsyncThunk(
  'pqm/aggregatedValue/getAggregatedValues',
  async ({
    pageIndex = 0,
    pageSize = 10,
    period = '',
    year = '',
    quarter = '',
    month = '',
    provinceId = '',
    districtId = '',
    siteId = '',
    indicatorId = '',
    indicatorGroupId = '',
    ageGroupId = '',
    keyPopulationId = '',
    genderId = '',
  }: {
    pageIndex?: number;
    pageSize?: number;
    period?: string;
    year?: string;
    quarter?: string;
    month?: string;
    provinceId?: string;
    districtId?: string;
    siteId?: string;
    indicatorId?: string;
    indicatorGroupId?: string;
    ageGroupId?: string;
    keyPopulationId?: string;
    genderId?: string;
  }) => {
    const result = await aggregatedValueService.getAggregatedValues({
      pageIndex,
      pageSize,
      period,
      year,
      quarter,
      month,
      provinceId,
      districtId,
      siteId,
      indicatorId,
      indicatorGroupId,
      ageGroupId,
      keyPopulationId,
      genderId,
    });
    return result;
  },
);

const uploadAggregatedValues = createAsyncThunk(
  'pqm/aggregatedValue/uploadAggregatedValues',
  async (data: FormData, { dispatch }) => {
    const result = await aggregatedValueService.uploadAggregatedValues(
      data,
      (progress: number): void => {
        dispatch({
          type: 'pqm/aggregatedValue',
          uploadAggregatedValuesProgress: progress,
        });
      },
    );
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/aggregatedValue',
  initialState,
  reducers: {
    setFilter: setFilterCR,
    setAggregatedValueSelected: setAggregatedValueSelectedCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getAggregatedValues.pending, (state) => ({
      ...state,
      getAggregatedValuesLoading: true,
    }));
    builder.addCase(getAggregatedValues.fulfilled, (state, { payload }) => ({
      ...state,
      aggregatedValue: payload,
      getAggregatedValuesLoading: false,
    }));
    builder.addCase(getAggregatedValues.rejected, (state) => ({
      ...state,
      getAggregatedValuesLoading: false,
    }));
    builder.addCase(uploadAggregatedValues.pending, (state) => ({
      ...state,
      uploadAggregatedValuesLoading: true,
      uploadAggregatedValuesProgress: 0,
    }));
    builder.addCase(uploadAggregatedValues.fulfilled, (state, { payload }) => ({
      ...state,
      uploadAggregatedValue: payload,
      uploadAggregatedValuesLoading: false,
      uploadAggregatedValuesProgress: 100,
    }));
    builder.addCase(uploadAggregatedValues.rejected, (state) => ({
      ...state,
      uploadAggregatedValuesLoading: false,
    }));
  },
});

export const { setFilter, setAggregatedValueSelected } = slice.actions;

export { getAggregatedValues, uploadAggregatedValues };

export default slice.reducer;
