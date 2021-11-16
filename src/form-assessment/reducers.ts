import { combineReducers } from '@reduxjs/toolkit';
import question from './question/question.slice'
import questionTemplateType from './question-template-type/question-template-type.slice';

export default combineReducers({
  question,
  questionTemplateType,
});