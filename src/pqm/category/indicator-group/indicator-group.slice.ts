import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { IndicatorGroup } from './indicator-group.model';
import indicatorGroupService from './indicator-group.service';

interface State {
  selectedIndicatorGroup: IndicatorGroup | undefined;
  indicatorGroupList: IndicatorGroup[];
  getIndicatorGroupsLoading: boolean;
}

const initialState: State = {
  selectedIndicatorGroup: undefined,
  indicatorGroupList: [],
  getIndicatorGroupsLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const selectIndicatorGroupCR: CR<IndicatorGroup | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedIndicatorGroup: action.payload,
});

const getIndicatorGroups = createAsyncThunk(
  'pqm/category/indicatorGroup/getIndicatorGroups',
  async () => {
    const result = await indicatorGroupService.getIndicatorGroups();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/indicatorGroup',
  initialState,
  reducers: {
    selectIndicatorGroup: selectIndicatorGroupCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getIndicatorGroups.pending, (state) => ({
      ...state,
      getIndicatorGroupsLoading: true,
    }));
    builder.addCase(getIndicatorGroups.fulfilled, (state, { payload }) => ({
      ...state,
      indicatorGroupList: payload,
      getIndicatorGroupsLoading: false,
    }));
    builder.addCase(getIndicatorGroups.rejected, (state) => ({
      ...state,
      getIndicatorGroupsLoading: false,
    }));
  },
});

export const { selectIndicatorGroup } = slice.actions;
export { getIndicatorGroups };

export default slice.reducer;
