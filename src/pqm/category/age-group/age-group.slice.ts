import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { AgeGroup } from './age-group.model';
import ageGroupService from './age-group.service';

interface State {
  ageGroupList: AgeGroup[];
  getAgeGroupsLoading: boolean;
}

const initialState: State = {
  ageGroupList: [],
  getAgeGroupsLoading: false,
};

const getAgeGroups = createAsyncThunk(
  'pqm/category/ageGroup/getAgeGroups',
  async () => {
    const result = await ageGroupService.getAgeGroups();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/ageGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAgeGroups.pending, (state) => ({
      ...state,
      getAgeGroupsLoading: true,
    }));
    builder.addCase(getAgeGroups.fulfilled, (state, { payload }) => ({
      ...state,
      ageGroupList: payload,
      getAgeGroupsLoading: false,
    }));
    builder.addCase(getAgeGroups.rejected, (state) => ({
      ...state,
      getAgeGroupsLoading: false,
    }));
  },
});

export { getAgeGroups };

export default slice.reducer;
