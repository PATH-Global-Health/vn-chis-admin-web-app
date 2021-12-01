import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction
} from '@reduxjs/toolkit';

import { Question, Answer } from '@form-assessment/question/question.model';
import questionService from '@form-assessment/question/question.service';

interface State {
  selectedQuestion?: Question,
  questionList: Question[];
  anwserOfQuestionList: Answer[];
  getQuestionLoading: boolean;
  getAnswerOfQuestionLoading: boolean;
}

const initialState: State = {
  selectedQuestion: undefined,
  questionList: [],
  anwserOfQuestionList: [],
  getQuestionLoading: false,
  getAnswerOfQuestionLoading: false
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const setSelectedQuestionCR: CR<Question | undefined> = (state, action) => ({
  ...state,
  selectedQuestion: action.payload,
});

const getQuestion = createAsyncThunk(
  'formAssessment/question/getQuestion',
  async () => {
    const result = await questionService.getQuestion();
    return result;
  },
);

const getAnswerOfQuestion = createAsyncThunk(
  'formAssessment/question/getAnswerOfQuestion',
  async (questionId: string) => {
    const result = await questionService.getAnswerOfQuestion(questionId);
    return result;
  },
);

const slice = createSlice({
  name: 'formAssessment/question',
  initialState,
  reducers: {
    setSelectedQuestion: setSelectedQuestionCR,
  },
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
    builder.addCase(getAnswerOfQuestion.pending, (state) => ({
      ...state,
      anwserOfQuestionList: [],
      getAnswerOfQuestionLoading: true,
    }));
    builder.addCase(getAnswerOfQuestion.fulfilled, (state, { payload }) => ({
      ...state,
      anwserOfQuestionList: payload,
      getAnswerOfQuestionLoading: false,
    }));
    builder.addCase(getAnswerOfQuestion.rejected, (state) => ({
      ...state,
      getAnswerOfQuestionLoading: false,
    }));
  },
});

export const { setSelectedQuestion } = slice.actions;
export { getQuestion, getAnswerOfQuestion };

export default slice.reducer;
