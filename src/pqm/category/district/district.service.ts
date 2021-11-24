import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import { District, DistrictCM, DistrictUM, DistrictDM } from './district.model';

const getDistricts = async ({
  provinceCode = '',
}: {
  provinceCode?: string;
}): Promise<District[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.district.get(provinceCode),
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as District[];
};

const createDistrict = async (data: DistrictCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.district.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateDistrict = async (data: DistrictUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.district.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteDistrict = async (data: DistrictDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.district.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const districtService = {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
};

export default districtService;
