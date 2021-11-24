import { httpClient, apiLinks } from '@app/utils';

import { ErrorLogging } from '@pqm/error-logging/models';

const getErrorLoggings = async ({
  code = undefined,
  from = undefined,
  to = undefined,
  pageIndex = 0,
  pageSize = 10,
}: {
  code?: string;
  from?: Date | string;
  to?: Date | string;
  pageIndex?: number;
  pageSize?: number;
}): Promise<ErrorLogging[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.errorLogging.get,
    params: {
      code,
      from,
      to,
      pageIndex,
      pageSize,
    },
  });
  return response.data as ErrorLogging[];
};

const errorLoggingService = {
  getErrorLoggings,
};

export default errorLoggingService;
