import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import { Site, SiteCM, SiteUM, SiteDM, SiteByCode } from './site.model';

const getSites = async ({
  districtId = '',
}: {
  districtId: string;
}): Promise<Site[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.site.get(districtId),
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Site[];
};

const getSitesByCode = async ({
  pageIndex = 0,
  pageSize = 10,
  siteTypeId = '',
  provinceCode = '',
  districtCode = '',
}: {
  pageIndex: number;
  pageSize: number;
  siteTypeId: string;
  provinceCode: string;
  districtCode: string;
}): Promise<SiteByCode> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.site.getByCode(
      pageIndex,
      pageSize,
      siteTypeId,
      provinceCode,
      districtCode,
    ),
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as SiteByCode;
};

const createSite = async (data: SiteCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.site.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateSite = async (data: SiteUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.site.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteSite = async (data: SiteDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.site.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));

    throw error;
  }
};

const siteService = {
  getSites,
  getSitesByCode,
  createSite,
  updateSite,
  deleteSite,
};

export default siteService;
