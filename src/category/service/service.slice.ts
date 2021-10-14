import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import serviceService from './service.service';
import { Service } from './service.model';

interface State {
  serviceList: Service[];
  getServicesLoading: boolean;
}

const initialState: State = {
  serviceList: [],
  getServicesLoading: false,
};

const getServices = createAsyncThunk(
  'csyt/catalog/service/getServices',
  async () => {
    const result = await serviceService.getServices();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServices.pending, (state) => ({
      ...state,
      getServicesLoading: true,
    }));
    builder.addCase(getServices.fulfilled, (state, { payload }) => ({
      ...state,
      getServicesLoading: false,
      serviceList: payload,
    }));
    builder.addCase(getServices.rejected, (state) => ({
      ...state,
      getServicesLoading: false,
    }));
  },
});

export { getServices };

export default slice.reducer;
