import { httpClient, apiLinks } from '@app/utils';

import {
  SiteType,
  SiteTypeCM,
  SiteTypeUM,
  SiteTypeDM,
} from './site-type.model';

const getSiteTypes = async (): Promise<SiteType[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.category.siteType.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as SiteType[];
};

const createSiteType = async (data: SiteTypeCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.pqm.category.siteType.create,
    data,
  });
};

const updateSiteType = async (data: SiteTypeUM): Promise<void> => {
  await httpClient.put({
    url: apiLinks.pqm.category.siteType.update,
    data,
  });
};

const deleteSiteType = async (data: SiteTypeDM): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.pqm.category.siteType.delete,
    data,
  });
};

const siteTypeService = {
  getSiteTypes,
  createSiteType,
  updateSiteType,
  deleteSiteType,
};

export default siteTypeService;
