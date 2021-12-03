import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import {
  QuestionTemplate,
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

const getQuestionTemplateDetail = async (questionTemplateId: string): Promise<QuestionTemplate> => {
  const response = await httpClient.get({
    url: apiLinks.form.questionTemplate.getDetail(questionTemplateId),
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as QuestionTemplate;
}

const createQuestionTemplate = async (data: QuestionTemplateCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.form.questionTemplate.create,
      data,
    });
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateQuestionTemplate = async (data: QuestionTemplateUM): Promise<void> => {
  try {
    await httpClient.put({
      url: `${apiLinks.form.questionTemplate.update}/${data.id}`,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteQuestionTemplate = async (data: QuestionTemplateDM): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.form.questionTemplate.delete}/${data.id}`,
    data,
  });
};

const addQuestion = async (data: AddQuestionToQuestionTemplate): Promise<void> => {
  await httpClient.put({
    url: apiLinks.form.questionTemplate.addQuestion,
    data,
  });
};

const deleteQuestion = async (data: DeleteQuestionOfQuestionTemplate): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.form.questionTemplate.deleteQuestion,
    data,
  });
};

const addSurveyResult = async (data: AddSurveyResultToQuestionTemplate): Promise<void> => {
  await httpClient.put({
    url: apiLinks.form.questionTemplate.addSurveyResult,
    data,
  });
};

const deleteSurveyResult = async (data: DeleteSurveyResultOfQuestionTemplate): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.form.questionTemplate.deleteSurveyResult,
    data,
  });
};

const genderService = {
  getQuestionTemplates,
  getQuestionTemplateDetail,
  createQuestionTemplate,
  updateQuestionTemplate,
  deleteQuestionTemplate,
  addQuestion,
  addSurveyResult,
  deleteQuestion,
  deleteSurveyResult
};

export default genderService;
