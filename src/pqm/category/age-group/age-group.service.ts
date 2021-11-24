import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import {
  AgeGroup,
  AgeGroupCM,
  AgeGroupUM,
  AgeGroupDM,
} from './age-group.model';

const getAgeGroups = async (): Promise<AgeGroup[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.ageGroup.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as AgeGroup[];
};

const createAgeGroup = async (data: AgeGroupCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.ageGroup.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateAgeGroup = async (data: AgeGroupUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.ageGroup.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteAgeGroup = async (data: AgeGroupDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.ageGroup.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const ageGroupService = {
  getAgeGroups,
  createAgeGroup,
  updateAgeGroup,
  deleteAgeGroup,
};

export default ageGroupService;
