import { combineReducers } from '@reduxjs/toolkit';
import question from './question/question.slice'
import questionTemplate from './question-template/question-template.slice';
import questionTemplateType from './question-template-type/question-template-type.slice';

export default combineReducers({
  question,
  questionTemplate,
  questionTemplateType,
});