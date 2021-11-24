import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Indicator } from './indicator.model';
import indicatorService from './indicator.service';

interface State {
  indicatorList: Indicator[];
  getIndicatorsLoading: boolean;
}

const initialState: State = {
  indicatorList: [],
  getIndicatorsLoading: false,
};

const getIndicators = createAsyncThunk(
  'pqm/category/indicator/getIndicators',
  async () => {
    const result = await indicatorService.getIndicators();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/indicator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIndicators.pending, (state) => ({
      ...state,
      getIndicatorsLoading: true,
    }));
    builder.addCase(getIndicators.fulfilled, (state, { payload }) => ({
      ...state,
      indicatorList: payload,
      getIndicatorsLoading: false,
    }));
    builder.addCase(getIndicators.rejected, (state) => ({
      ...state,
      getIndicatorsLoading: false,
    }));
  },
});

export { getIndicators };

export default slice.reducer;
