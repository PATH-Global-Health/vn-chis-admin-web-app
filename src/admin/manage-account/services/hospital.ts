import { httpClient, apiLinks } from '@app/utils';

import { Hospital, HospitalCM, DataTableHospital } from '../models/hospital';

const getHospitals = async (pageIndex: number, pageSize: number): Promise<DataTableHospital> => {
    const result = await httpClient.get({
      url: apiLinks.unit.hospitals + 'GetListParentUnit',
      params: {pageIndex, pageSize}
    });
    return result.data as DataTableHospital;
};

const getHospitalById = async (id: string): Promise<Hospital> => {
    const result = await httpClient.get({
      url: apiLinks.unit.hospitals,
      params: {id: id}
    });
    return result.data as Hospital;
};

const geRefertHospitals = async (
  isTestingFacility: boolean,
  isPrEPFacility: boolean,
  isARTFacility: boolean,
  pageIndex: number,
  pageSize: number): Promise<DataTableHospital> => {
  const result = await httpClient.get({
    url: apiLinks.unit.referHospitals,
    params:{
      isTestingFacility: isTestingFacility ? isTestingFacility: null,
      isPrEPFacility: isPrEPFacility ? isPrEPFacility: null,
      isARTFacility: isARTFacility ? isARTFacility: null,
      pageIndex: pageIndex,
      pageSize: pageSize,
    }
  });
  return result.data as DataTableHospital;
};

type CreateError<T> = {
  [P in keyof T]?: string[];
};

const createHospital = async (
  data: Hospital,
): Promise<CreateError<HospitalCM>> => {
  await httpClient.post({
    url: apiLinks.unit.create,
    // params: {username: data.username},
    // params: data.username +"",
    data: data,
  });
  return {};
};

const updateHospital = async (data: Hospital): Promise<void> => {
  await httpClient.put({
    url: apiLinks.unit.hospitals,
    data,
  });
};

//----------
const setTestingFacility = async (id: string, isTestingFacility: boolean): Promise<void> => {
  await httpClient.put({
    url: apiLinks.unit.setTesting + `/${id}`,
    data: { isTestingFacility: isTestingFacility }
    // params: {id: id}
  });
};

const setPrEPFacility = async (id: string, isPrEPFacility: boolean): Promise<void> => {
  await httpClient.put({
    url: apiLinks.unit.setPrEP + `/${id}`,
    data: { isPrEPFacility: isPrEPFacility }
    // params: {id: id}
  });
};

const setARVFacility = async (id: string, isARTFacility: boolean): Promise<void> => {
  await httpClient.put({
    url: apiLinks.unit.setARV + `/${id}`,
    data: { isARTFacility: isARTFacility }
  });
};
//----------

const deleteHospital = async (id: string): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.unit.delete + `/${id}`,
      // params: { id },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateLogo = async (data: FormData): Promise<void> => {
  try {
    await httpClient.put({
      // url: "",
      url: apiLinks.unit.updateLogo,
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

const getHospitalLogo = async (unitId: string): Promise<void> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.unit.getLogo + `/${unitId}`,
    });
    // return result.data as Hospital[];
    console.log(result);
  } catch (error) {
    // return [];
  }
};

const hospitalService = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  updateLogo,
  getHospitalLogo,
  setTestingFacility,
  setARVFacility,
  setPrEPFacility,
  geRefertHospitals,
  getHospitalById
};

export default hospitalService;
