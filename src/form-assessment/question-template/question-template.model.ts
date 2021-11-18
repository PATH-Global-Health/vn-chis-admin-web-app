import { Question } from '@form-assessment/question/question.model';
import { SurveyResult, SurveyResultCM } from '@form-assessment/survey-result/survey-result.model';

export interface QuestionTemplate {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  surveyResults: SurveyResult[];
  questionTemplateTypeId: string;
}

export interface QuestionTemplateCM {
  title: string;
  description: string;
  questions: string[];
  surveyResults: SurveyResultCM[],
  questionTemplateTypeId: string;
}

export type QuestionTemplateUM = Omit<QuestionTemplate, 'surveyResults'>;

export type QuestionTemplateDM = QuestionTemplate;

export interface QuestionTemplateFilter {
  pageIndex?: number;
  pageSize?: number;
}

export interface QuestionTemplateResponse {
  pageIndex: number;
  pageSize: number;
  totalSize: number;
  data: QuestionTemplate[];
}

export interface AddQuestionToQuestionTemplate {
  id: string;
  questions: string[];
}

export interface AddSurveyResultToQuestionTemplate {
  id: string;
  surveyResults: SurveyResultCM[];
}

export interface DeleteQuestionOfQuestionTemplate {
  id: string;
  questions: string[];
}

export interface DeleteSurveyResultOfQuestionTemplate {
  id: string;
  surveyResults: string[];
}