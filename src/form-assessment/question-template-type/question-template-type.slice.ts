import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { QuestionTemplateType } from './question-template-type.model';
import QuestionTemplateTypeService from './question-template-type.service';

interface State {
  questionTemplateTypeList: QuestionTemplateType[];
  getQuestionTemplateTypeLoading: boolean;
}

const initialState: State = {
  questionTemplateTypeList: [],
  getQuestionTemplateTypeLoading: false,
};

const getQuestionTemplateType = createAsyncThunk(
  'pqm/form/QuestionTemplateType/getQuestionTemplateType',
  async () => {
    const result = await QuestionTemplateTypeService.getQuestionTemplateType();
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/form/QuestionTemplateType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQuestionTemplateType.pending, (state) => ({
      ...state,
      getQuestionTemplateTypeLoading: true,
    }));
    builder.addCase(getQuestionTemplateType.fulfilled, (state, { payload }) => ({
      ...state,
      questionTemplateTypeList: payload,
      getQuestionTemplateTypeLoading: false,
    }));
    builder.addCase(getQuestionTemplateType.rejected, (state) => ({
      ...state,
      getQuestionTemplateTypeLoading: false,
    }));
  },
});

export { getQuestionTemplateType };

export default slice.reducer;
