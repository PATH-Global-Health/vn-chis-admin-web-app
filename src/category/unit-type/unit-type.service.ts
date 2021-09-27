import { httpClient, apiLinks } from '@app/utils';
import { UnitType } from '@category/unit-type/unit-type.model';

const getUnitTypes = async (): Promise<UnitType[]> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.unitType.get,
    });
    return result.data as UnitType[];
  } catch (error) {
    return [];
  }
};

const unitTypeService = {
  getUnitTypes
};

export default unitTypeService;