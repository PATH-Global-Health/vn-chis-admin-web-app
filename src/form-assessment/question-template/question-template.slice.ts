import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { QuestionTemplateResponse } from './question-template.model';
import questionTemplateService from './question-template.service';

interface State {
  questionTemplateData: QuestionTemplateResponse;
  getQuestionTemplateLoading: boolean;
}

const initialState: State = {
  questionTemplateData: {
    pageIndex: 0,
    pageSize: 10,
    totalSize: 0,
    data: [],
  },
  getQuestionTemplateLoading: false,
};

const getQuestionTemplates = createAsyncThunk(
  'formAssessment/questionTemplate/getQuestionTemplates',
  async ({
    pageIndex = 1,
    pageSize = 10,
  }: {
    pageIndex?: number;
    pageSize?: number;
  }) => {
    const result = await questionTemplateService.getQuestionTemplates({ pageIndex, pageSize });
    return result;
  },
);

const slice = createSlice({
  name: 'formAssessment/questionTemplate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQuestionTemplates.pending, (state) => ({
      ...state,
      getQuestionTemplateLoading: true,
    }));
    builder.addCase(getQuestionTemplates.fulfilled, (state, { payload }) => ({
      ...state,
      questionTemplateData: payload,
      getQuestionTemplateLoading: false,
    }));
    builder.addCase(getQuestionTemplates.rejected, (state) => ({
      ...state,
      getQuestionTemplateLoading: false,
    }));
  },
});

export { getQuestionTemplates };

export default slice.reducer;
