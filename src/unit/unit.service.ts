import { httpClient, apiLinks } from '@app/utils';
import { UnitCM } from '@unit/unit.model';

const createUnitWithUser = async (username: string, data: UnitCM) => {
  try {
    await httpClient.post({
      url: apiLinks.unit.createUnitWithUser(username),
      data,
    });
    // eslint-disable-next-line
  } catch (error) {}
};

const unitService = {
  createUnitWithUser,
}

export default unitService;