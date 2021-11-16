import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction
} from '@reduxjs/toolkit';

import { Question } from './question.model';
import QuestionService from './question.service';

interface State {
  selectedQuestion?: Question,
  questionList: Question[];
  getQuestionLoading: boolean;
  getSelectedQuestionLoading: boolean;
}

const initialState: State = {
  selectedQuestion: undefined,
  questionList: [],
  getQuestionLoading: false,
  getSelectedQuestionLoading: false
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const setSelectedQuestionCR: CR<Question | undefined> = (state, action) => ({
  ...state,
  selectedQuestion: action.payload,
});
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
  },
});

export const { setSelectedQuestion } = slice.actions;
export { getQuestion };

export default slice.reducer;
