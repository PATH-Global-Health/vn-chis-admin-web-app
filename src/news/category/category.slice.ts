import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Category } from './category.model';
import categoryService from './category.service';

interface State {
  categoryList: Category[];
  getCategoriesLoading: boolean;
}

const initialState: State = {
  categoryList: [],
  getCategoriesLoading: false,
};

const getCategories = createAsyncThunk(
  'pqm/post/category/getCategories',
  async () => {
    const result = await categoryService.getCategories();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/post/category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => ({
      ...state,
      getCategoriesLoading: true,
    }));
    builder.addCase(getCategories.fulfilled, (state, { payload }) => ({
      ...state,
      categoryList: payload,
      getCategoriesLoading: false,
    }));
    builder.addCase(getCategories.rejected, (state) => ({
      ...state,
      getCategoriesLoading: false,
    }));
  },
});

export { getCategories };

export default slice.reducer;
