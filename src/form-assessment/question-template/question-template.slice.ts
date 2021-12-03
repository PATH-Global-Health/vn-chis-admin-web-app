import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction
} from '@reduxjs/toolkit';

import { QuestionTemplate, QuestionTemplateResponse } from './question-template.model';
import questionTemplateService from './question-template.service';

interface State {
  selectingQuestionTemplate?: QuestionTemplate;
  questionTemplateData: QuestionTemplateResponse;
  getQuestionTemplateLoading: boolean;
  questionTemplateDetail?: QuestionTemplate;
  getQuestionTemplateDetailLoading: boolean;
}

const initialState: State = {
  selectingQuestionTemplate: undefined,
  questionTemplateData: {
    pageIndex: 0,
    pageSize: 10,
    totalSize: 0,
    data: [],
  },
  getQuestionTemplateLoading: false,
  questionTemplateDetail: undefined,
  getQuestionTemplateDetailLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const setSelectingQuestionTemplateCR: CR<QuestionTemplate | undefined> = (state, action) => ({
  ...state,
  selectingQuestionTemplate: action.payload,
});

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

const getQuestionTemplateDetail = createAsyncThunk(
  'formAssessment/questionTemplate/getQuestionTemplateDetail',
  async (quesitonTemplateId: string) => {
    const result = await questionTemplateService.getQuestionTemplateDetail(quesitonTemplateId);
    return result;
  },
);

const slice = createSlice({
  name: 'formAssessment/questionTemplate',
  initialState,
  reducers: {
    setSelectingQuestionTemplate: setSelectingQuestionTemplateCR,
  },
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
    builder.addCase(getQuestionTemplateDetail.pending, (state) => ({
      ...state,
      getQuestionTemplateDetailLoading: true,
    }));
    builder.addCase(getQuestionTemplateDetail.fulfilled, (state, { payload }) => ({
      ...state,
      questionTemplateDetail: payload,
      getQuestionTemplateDetailLoading: false,
    }));
    builder.addCase(getQuestionTemplateDetail.rejected, (state) => ({
      ...state,
      getQuestionTemplateDetailLoading: false,
    }));
  },
});

export { getQuestionTemplates, getQuestionTemplateDetail };
export const { setSelectingQuestionTemplate } = slice.actions;

export default slice.reducer;
