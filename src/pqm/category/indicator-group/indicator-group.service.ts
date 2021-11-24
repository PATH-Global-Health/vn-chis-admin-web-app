import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import {
  IndicatorGroup,
  IndicatorGroupCM,
  IndicatorGroupUM,
  IndicatorGroupDM,
} from './indicator-group.model';

const getIndicatorGroups = async (): Promise<IndicatorGroup[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.indicatorGroup.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as IndicatorGroup[];
};

const createIndicatorGroup = async (data: IndicatorGroupCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.indicatorGroup.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateIndicatorGroup = async (data: IndicatorGroupUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.indicatorGroup.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteIndicatorGroup = async (data: IndicatorGroupDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.indicatorGroup.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const indicatorGroupService = {
  getIndicatorGroups,
  createIndicatorGroup,
  updateIndicatorGroup,
  deleteIndicatorGroup,
};

export default indicatorGroupService;
