
import { httpClient, apiLinks } from '@app/utils';
import { Question, QuestionCM, QuestionUM, QuestionDM } from './question.model';

const getQuestion = async (): Promise<Question[]> => {
  const response = await httpClient.get({
    url: apiLinks.form.question.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Question[];
};

const createQuestion = async (data: QuestionCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.form.question.create,
    data,
  });
};

const updateQuestion = async (data: QuestionUM): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.form.question.update}/${data.id}`,
    data,
  });
};

const deleteQuestion = async (data: QuestionDM): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.form.question.delete}/${data.id}`,
    data,
  });
};

const QuestionService = {
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

export default QuestionService;
