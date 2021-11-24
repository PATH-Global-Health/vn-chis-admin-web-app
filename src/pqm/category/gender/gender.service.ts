import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import { Gender, GenderCM, GenderUM, GenderDM } from './gender.model';

const getGenders = async (): Promise<Gender[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.gender.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Gender[];
};

const createGender = async (data: GenderCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.gender.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateGender = async (data: GenderUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.gender.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteGender = async (data: GenderDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.gender.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const genderService = {
  getGenders,
  createGender,
  updateGender,
  deleteGender,
};

export default genderService;
