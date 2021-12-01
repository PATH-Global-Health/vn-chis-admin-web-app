import { httpClient, apiLinks } from '@app/utils';

import { UnitType } from '../models/unit-type';

const getUnitTypes = async (): Promise<UnitType[]> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.unit.unitTypes,
    });
    return result.data as UnitType[];
  } catch (error) {
    return [];
  }
};

const createUnitType = async (data: UnitType): Promise<void> => {
  await httpClient.post({
    url: apiLinks.unit.unitTypes,
    data,
  });
};

const updateUnitType = async (data: UnitType): Promise<void> => {
  await httpClient.put({
    url: apiLinks.unit.unitTypes,
    data,
  });
};

const deleteUnitType = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.unit.unitTypes + id,
  });
};

const unitTypeService = {
  getUnitTypes,
  createUnitType,
  updateUnitType,
  deleteUnitType,
};

export default unitTypeService;
