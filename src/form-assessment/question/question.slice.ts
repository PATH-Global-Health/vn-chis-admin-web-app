import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Question } from './question.model';
import QuestionService from './question.service';

interface State {
  questionList: Question[];
  getQuestionLoading: boolean;
}

const initialState: State = {
  questionList: [],
  getQuestionLoading: false,
};

const getQuestion = createAsyncThunk(
  'formAssessment/question/getQuestion',
  async () => {
    const result = await QuestionService.getQuestion();
    return result;
  },
);

const slice = createSlice({
  name: 'formAssessment/question',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQuestion.pending, (state) => ({
      ...state,
      getQuestionLoading: true,
    }));
    builder.addCase(getQuestion.fulfilled, (state, { payload }) => ({
      ...state,
      questionList: payload,
      getQuestionLoading: false,
    }));
    builder.addCase(getQuestion.rejected, (state) => ({
      ...state,
      getQuestionLoading: false,
    }));
  },
});

export { getQuestion };

export default slice.reducer;
