import { httpClient, apiLinks } from '@app/utils';
import { toast } from 'react-toastify';

import {
  AggregatedValueDM,
  AggregatedValueResponse,
  AggregatedValueImportResponse,
} from '@pqm/aggregated-value/models';

const getAggregatedValues = async ({
  pageIndex = 0,
  pageSize = 10,
  period = '',
  year = '',
  quarter = '',
  month = '',
  provinceId = '',
  districtId = '',
  siteId = '',
  indicatorId = '',
  indicatorGroupId = '',
  ageGroupId = '',
  keyPopulationId = '',
  genderId = '',
}: {
  pageIndex?: number;
  pageSize?: number;
  period?: string;
  year?: string;
  quarter?: string;
  month?: string;
  provinceId?: string;
  districtId?: string;
  siteId?: string;
  indicatorId?: string;
  indicatorGroupId?: string;
  ageGroupId?: string;
  keyPopulationId?: string;
  genderId?: string;
}): Promise<AggregatedValueResponse> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.aggregatedValue.get,
    params: {
      pageIndex,
      pageSize,
      period,
      year,
      quarter,
      month,
      provinceId,
      districtId,
      siteId,
      indicatorId,
      indicatorGroupId,
      ageGroupId,
      keyPopulationId,
      genderId,
    },
  });
  return response.data as AggregatedValueResponse;
};

const deleteAggregatedValue = async (
  data: AggregatedValueDM,
): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.pqm.aggregatedValue.delete,
    params: {
      id: data.id,
    },
  });
};

const uploadAggregatedValues = async (
  data: FormData,
  dispatch: Function,
): Promise<AggregatedValueImportResponse> => {
  try {
    const response = await httpClient.post({
      url: apiLinks.pqm.aggregatedValue.upload,
      contentType: 'multipart/form-data',
      data,
      onUploadProgress: (progressEvent: ProgressEvent): void => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        dispatch(percentCompleted);
      },
    });
    toast.success('Upload dữ liệu thành công');
    // eslint-disable-next-line
    return (response?.data?.data ?? {}) as AggregatedValueImportResponse;
  } catch (error) {
    toast.error('Upload dữ liệu thất bại');
    return {} as AggregatedValueImportResponse;
  }
};

const populateAggregatedValues = async (): Promise<void> => {
  await httpClient.post({
    url: apiLinks.pqm.aggregatedValue.populateData,
  });
};

const clearAggregatedValues = async (): Promise<void> => {
  await httpClient.get({
    url: apiLinks.pqm.aggregatedValue.clearAllData,
  });
};

const aggregatedValueService = {
  getAggregatedValues,
  deleteAggregatedValue,
  uploadAggregatedValues,
  populateAggregatedValues,
  clearAggregatedValues,
};

export default aggregatedValueService;
