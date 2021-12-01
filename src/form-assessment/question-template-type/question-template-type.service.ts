
import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';
import { QuestionTemplateType, QuestionTemplateTypeCM, QuestionTemplateTypeUM, QuestionTemplateTypeDM } from './question-template-type.model';

const getQuestionTemplateType = async (): Promise<QuestionTemplateType[]> => {
  const response = await httpClient.get({
    url: apiLinks.form.questionTemplateType.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as QuestionTemplateType[];
};

const createQuestionTemplateType = async (data: QuestionTemplateTypeCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.form.questionTemplateType.create,
    data,
  });
};

const updateQuestionTemplateType = async (data: QuestionTemplateTypeUM): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.form.questionTemplateType.update}/${data.id}`,
    data,
  });
};

const deleteQuestionTemplateType = async (data: QuestionTemplateTypeDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: `${apiLinks.form.questionTemplateType.delete}/${data.id}`,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const questionTemplateTypeService = {
  getQuestionTemplateType,
  createQuestionTemplateType,
  updateQuestionTemplateType,
  deleteQuestionTemplateType,
};

export default questionTemplateTypeService;
