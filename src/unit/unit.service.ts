import { httpClient, apiLinks } from '@app/utils';
import { UnitCM } from '@unit/unit.model';

const createUnitWithUser = async (username: string, data: UnitCM) => {
  try {
    await httpClient.put({
      url: apiLinks.unit.createUnitWithUser(username),
      data,
    });
    // eslint-disable-next-line
  } catch (error) {}
};

export { createUnitWithUser };