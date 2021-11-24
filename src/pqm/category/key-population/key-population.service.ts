import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import {
  KeyPopulation,
  KeyPopulationCM,
  KeyPopulationUM,
  KeyPopulationDM,
} from './key-population.model';

const getKeyPopulations = async (): Promise<KeyPopulation[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.keyPopulation.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as KeyPopulation[];
};

const createKeyPopulation = async (data: KeyPopulationCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.keyPopulation.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateKeyPopulation = async (data: KeyPopulationUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.keyPopulation.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteKeyPopulation = async (data: KeyPopulationDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.keyPopulation.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const keyPopulationService = {
  getKeyPopulations,
  createKeyPopulation,
  updateKeyPopulation,
  deleteKeyPopulation,
};

export default keyPopulationService;
