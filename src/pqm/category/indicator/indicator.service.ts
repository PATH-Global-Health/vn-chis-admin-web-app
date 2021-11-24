import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import {
  Indicator,
  IndicatorCM,
  IndicatorUM,
  IndicatorDM,
} from './indicator.model';

const getIndicators = async (): Promise<Indicator[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.indicator.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Indicator[];
};

const createIndicator = async (data: IndicatorCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.indicator.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateIndicator = async (data: IndicatorUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.indicator.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteIndicator = async (data: IndicatorDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.indicator.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const indicatorService = {
  getIndicators,
  createIndicator,
  updateIndicator,
  deleteIndicator,
};

export default indicatorService;
