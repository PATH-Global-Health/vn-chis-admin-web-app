import { httpClient, apiLinks } from '@app/utils';

import {
  QuestionTemplateCM,
  QuestionTemplateUM,
  QuestionTemplateDM,
  QuestionTemplateResponse,
  QuestionTemplateFilter,
  AddQuestionToQuestionTemplate,
  AddSurveyResultToQuestionTemplate,
  DeleteQuestionOfQuestionTemplate,
  DeleteSurveyResultOfQuestionTemplate,
} from './question-template.model';

const getQuestionTemplates = async (params: QuestionTemplateFilter): Promise<QuestionTemplateResponse> => {
  const response = await httpClient.get({
    url: apiLinks.form.questionTemplate.get,
    params,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as QuestionTemplateResponse;
};

const createQuestionTemplate = async (data: QuestionTemplateCM): Promise<string> => {
  const result = await httpClient.post({
    url: apiLinks.form.questionTemplate.create,
    data,
  });
  return result.data as string;
};

const updateQuestionTemplate = async (data: QuestionTemplateUM): Promise<string> => {
  const result = await httpClient.put({
    url: `${apiLinks.form.questionTemplate.update}/${data.id}`,
    data,
  });
  return result.data as string;
};

const deleteQuestionTemplate = async (data: QuestionTemplateDM): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.form.questionTemplate.delete}/${data.id}`,
    data,
  });
};

const addQuestion = async (data: AddQuestionToQuestionTemplate): Promise<void> => {
  await httpClient.post({
    url: apiLinks.form.questionTemplate.addQuestion,
    data,
  });
};
const addSurveyResult = async (data: AddSurveyResultToQuestionTemplate): Promise<void> => {
  await httpClient.post({
    url: apiLinks.form.questionTemplate.addSurveyResult,
    data,
  });
};
const deleteQuestion = async (data: DeleteQuestionOfQuestionTemplate): Promise<void> => {
  await httpClient.post({
    url: apiLinks.form.questionTemplate.deleteQuestion,
    data,
  });
};
const deleteSurveyResult = async (data: DeleteSurveyResultOfQuestionTemplate): Promise<void> => {
  await httpClient.post({
    url: apiLinks.form.questionTemplate.deleteSurveyResult,
    data,
  });
};

const genderService = {
  getQuestionTemplates,
  createQuestionTemplate,
  updateQuestionTemplate,
  deleteQuestionTemplate,
  addQuestion,
  addSurveyResult,
  deleteQuestion,
  deleteSurveyResult
};

export default genderService;
