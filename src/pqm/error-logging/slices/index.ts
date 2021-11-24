import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

import { ErrorFilter, ErrorLogging } from '@pqm/error-logging/models';
import errorLoggingService from '@pqm/error-logging/services';

type CR<T> = CaseReducer<State, PayloadAction<T>>;

interface State {
  errorFilter: ErrorFilter;
  selectedErrorLogging?: ErrorLogging;
  errorLoggingList: ErrorLogging[];
  getErrorLoggingLoading: boolean;
}

const initialState: State = {
  errorFilter: {},
  selectedErrorLogging: undefined,
  errorLoggingList: [],
  getErrorLoggingLoading: false,
};

const setErrorFilterCR: CR<ErrorFilter> = (state, action) => ({
  ...state,
  errorFilter: action.payload,
});

const selectErrorLoggingCR: CR<ErrorLogging | undefined> = (state, action) => ({
  ...state,
  selectedErrorLogging: action.payload,
});

const getErrorLoggings = createAsyncThunk(
  'errorLogging/getErrorLoggings',
  async ({
    code = undefined,
    from = undefined,
    to = undefined,
    pageIndex = 0,
    pageSize = 10,
  }: {
    code?: string;
    from?: Date | string;
    to?: Date | string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    const result = await errorLoggingService.getErrorLoggings({
      code,
      from,
      to,
      pageIndex,
      pageSize,
    });
    return result;
  },
);

const slice = createSlice({
  name: 'errorLogging',
  initialState,
  reducers: {
    setErrorFilter: setErrorFilterCR,
    selectErrorLogging: selectErrorLoggingCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getErrorLoggings.pending, (state) => ({
      ...state,
      getErrorLoggingLoading: true,
    }));
    builder.addCase(getErrorLoggings.fulfilled, (state, { payload }) => ({
      ...state,
      errorLoggingList: payload,
      getErrorLoggingLoading: false,
    }));
    builder.addCase(getErrorLoggings.rejected, (state) => ({
      ...state,
      getErrorLoggingLoading: false,
    }));
  },
});

export const { setErrorFilter, selectErrorLogging } = slice.actions;

export { getErrorLoggings };

export default slice.reducer;
