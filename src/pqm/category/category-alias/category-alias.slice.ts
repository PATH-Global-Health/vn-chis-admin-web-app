import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

import { CategoryAlias } from './category-alias.model';
import categoryAliasService from './category-alias.service';

interface Category {
  id: string;
  name: string;
  type: string;
}
interface State {
  selectedCategory?: Category;
  aliasesList: CategoryAlias[];
  aliasesOfCategoryList: CategoryAlias[];
  getAliasesLoading: boolean;
  getAliasesOfCategoryLoading: boolean;
}

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const initialState: State = {
  selectedCategory: undefined,
  aliasesList: [],
  aliasesOfCategoryList: [],
  getAliasesLoading: false,
  getAliasesOfCategoryLoading: false,
};

const setCategoryCR: CR<Category | undefined> = (state, action) => ({
  ...state,
  selectedCategory: action.payload,
});

const getAliases = createAsyncThunk(
  'pqm/category/categoryAlias/getAliases',
  async () => {
    const result = await categoryAliasService.getCategoryAliases();
    return result;
  },
);

const getAliasesOfCategory = createAsyncThunk(
  'pqm/category/categoryAlias/getAliasesOfCategory',
  async (categoryId: string) => {
    const result = await categoryAliasService.getAliasesOfCategory(categoryId);
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/category/categoryAlias',
  initialState,
  reducers: {
    setCategory: setCategoryCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getAliases.pending, (state) => ({
      ...state,
      getAliasesLoading: true,
    }));
    builder.addCase(getAliases.fulfilled, (state, { payload }) => ({
      ...state,
      aliasesList: payload,
      getAliasesLoading: false,
    }));
    builder.addCase(getAliases.rejected, (state) => ({
      ...state,
      getAliasesLoading: false,
    }));
    builder.addCase(getAliasesOfCategory.pending, (state) => ({
      ...state,
      getAliasesOfCategoryLoading: true,
    }));
    builder.addCase(getAliasesOfCategory.fulfilled, (state, { payload }) => ({
      ...state,
      aliasesOfCategoryList: payload,
      getAliasesOfCategoryLoading: false,
    }));
    builder.addCase(getAliasesOfCategory.rejected, (state) => ({
      ...state,
      getAliasesOfCategoryLoading: false,
    }));
  },
});

export const { setCategory } = slice.actions;

export { getAliases, getAliasesOfCategory };

export default slice.reducer;
