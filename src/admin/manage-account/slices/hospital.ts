import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import { hospitalService } from '../services';
import { Hospital, DataTableHospital } from '../models/hospital';

interface State {
  selectedHospital: Hospital | undefined;
  selectedReferHospital: Hospital | undefined;
  hospitalList: Hospital[];
  referHospital: Hospital[];
  dataHospital: DataTableHospital;
  getHospitalsLoading: boolean;
}

const initialState: State = {
  selectedHospital: undefined,
  selectedReferHospital: undefined,
  hospitalList: [],
  referHospital: [],
  dataHospital: {
    data: [],
    pageIndex: 1,
    pageSize: 1,
    totalPage: 0,
    totalSize: 0
  },
  getHospitalsLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const getHospitals = createAsyncThunk(
  'admin/account/hospital/getHospitals',
  async (arg: {pageIndex: number, pageSize: number}) => {
    const result = await hospitalService.getHospitals(arg.pageIndex, arg.pageSize);
    return result;
  },
);


const getReferHospitals = createAsyncThunk(
  'admin/account/hospital/getReferHospitals',
  async (arg: {
    isTestingFacility: boolean,
    isPrEPFacility: boolean,
    isARTFacility: boolean,
    pageIndex: number,
    pageSize: number
  }) => {
    const result = await hospitalService.geRefertHospitals(
      arg.isTestingFacility,
      arg.isPrEPFacility,
      arg.isARTFacility,
      arg.pageIndex,
      arg.pageSize);
    return result;
  },
);


const slice = createSlice({
  name: 'admin/account/hospital',
  initialState,
  reducers: {
    selectHospital: (state, action) => {
      state.selectedHospital = action.payload;
    },
    setSlectedReferHospital: (state, action) => {
      state.selectedReferHospital = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHospitals.pending, (state) => ({
      ...state,
      getHospitalsLoading: true,
    }));
    builder.addCase(getHospitals.fulfilled, (state, { payload }) => ({
      ...state,
      dataHospital: payload,
      getHospitalsLoading: false,
    }));
    builder.addCase(getHospitals.rejected, (state) => ({
      ...state,
      getHospitalsLoading: false,
    }));
    
    //getReferHospital-------------------------------------------
    builder.addCase(getReferHospitals.pending, (state) => ({
      ...state,
      getHospitalsLoading: true,
    }));
    builder.addCase(getReferHospitals.fulfilled, (state, { payload }) => ({
      ...state,
      referHospital: payload.data,
      getHospitalsLoading: false,
    }));
    builder.addCase(getReferHospitals.rejected, (state) => ({
      ...state,
      getHospitalsLoading: false,
    }));

    //------------------------------------------------------------

  },
});

export { getHospitals, getReferHospitals };
export const { selectHospital, setSlectedReferHospital } = slice.actions;

export default slice.reducer;
