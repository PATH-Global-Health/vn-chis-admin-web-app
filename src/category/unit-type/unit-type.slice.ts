import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { UnitType } from '@category/unit-type/unit-type.model';
import unitTypeService from '@category/unit-type/unit-type.service';

interface State {
  unitTypeList: UnitType[];
  getUnitTypeLoading: boolean;
}

const initialState: State = {
  unitTypeList: [],
  getUnitTypeLoading: false,
};

const getUnitTypes = createAsyncThunk(
  'category/unitType/getUnitTypes',
  async () => {
    const result = await unitTypeService.getUnitTypes();
    return result;
  },
);

const slice = createSlice({
  name: 'category/unitType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnitTypes.pending, (state) => ({
      ...state,
      getUnitTypeLoading: true,
    }));
    builder.addCase(getUnitTypes.fulfilled, (state, { payload }) => ({
      ...state,
      getUnitTypeLoading: false,
      unitTypeList: payload,
    }));
    builder.addCase(getUnitTypes.rejected, (state) => ({
      ...state,
      getUnitTypeLoading: false,
    }));
  }
});

export {
  getUnitTypes,
};

export default slice.reducer;