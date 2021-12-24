import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';
import {
  Question,
  QuestionCM,
  QuestionUM,
  QuestionDM,
  Answer,
  MultipleAnswerCM,
  AnswerUM,
  AnswerDM
} from '@form-assessment/question/question.model';

const getQuestion = async (): Promise<Question[]> => {
  const response = await httpClient.get({
    url: apiLinks.form.question.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Question[];
};

const createQuestion = async (data: QuestionCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.form.question.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateQuestion = async (data: QuestionUM): Promise<void> => {
  try {
    await httpClient.put({
      url: `${apiLinks.form.question.update}/${data.id}`,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteQuestion = async (data: QuestionDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: `${apiLinks.form.question.delete}/${data.id}`,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const getAnswerOfQuestion = async (questionId: string): Promise<Answer[]> => {
  const response = await httpClient.get({
    url: `${apiLinks.form.question.get}?id=${questionId}`,
  });
  console.log(response);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (response.data?.answers ?? []) as Answer[];
};


const createAnswer = async (data: MultipleAnswerCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.form.answer.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateAnswer = async (data: AnswerUM): Promise<void> => {
  try {
    await httpClient.put({
      url: `${apiLinks.form.answer.update}/${data.id}`,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteAnswer = async (data: AnswerDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: `${apiLinks.form.answer.delete}/${data.id}`,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const QuestionService = {
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAnswerOfQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
};

export default QuestionService;
