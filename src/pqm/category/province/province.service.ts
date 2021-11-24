import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import { Province, ProvinceCM, ProvinceUM, ProvinceDM } from './province.model';

const getProvinces = async (): Promise<Province[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.province.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Province[];
};

const createProvince = async (data: ProvinceCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.province.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateProvince = async (data: ProvinceUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.province.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteProvince = async (data: ProvinceDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.province.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const provinceService = {
  getProvinces,
  createProvince,
  updateProvince,
  deleteProvince,
};

export default provinceService;
