import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { Service, ServiceCM } from './service.model';

const getServices = async (): Promise<Service[]> => {
  const response = await httpClient.get({
    url: apiLinks.service.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Service[];
};

const createService = async (data: ServiceCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.service.create,
    data: {
      ...data,
      LimitedOlds: [],
      InjectionObject: null,
    },
  });
};

const updateService = async (data: Service): Promise<void> => {
  await httpClient.post({
    url: apiLinks.service.update,
    data: {
      ...data,
      LimitedOlds: [],
      InjectionObject: null,
    },
  });
};

const deleteService = async (id: string): Promise<void> => {
  await httpClient.post({
    url: apiLinks.service.delete + id,
  });
};

const serviceService = {
  getServices,
  createService,
  updateService,
  deleteService,
};

export default serviceService;
