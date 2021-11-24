import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { KeyPopulation } from './key-population.model';
import keyPopulationService from './key-population.service';

interface State {
  keyPopulationList: KeyPopulation[];
  getKeyPopulationsLoading: boolean;
}

const initialState: State = {
  keyPopulationList: [],
  getKeyPopulationsLoading: false,
};

const getKeyPopulations = createAsyncThunk(
  'pqm/category/keyPoplation/getKeyPopulations', async () => {
    const result = await keyPopulationService.getKeyPopulations();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/keyPopulation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getKeyPopulations.pending, (state) => ({
      ...state,
      getKeyPopulationsLoading: true,
    }));
    builder.addCase(getKeyPopulations.fulfilled, (state, { payload }) => ({
      ...state,
      keyPopulationList: payload,
      getKeyPopulationsLoading: false,
    }));
    builder.addCase(getKeyPopulations.rejected, (state) => ({
      ...state,
      getKeyPopulationsLoading: false,
    }));
  },
});

export { getKeyPopulations };

export default slice.reducer;
