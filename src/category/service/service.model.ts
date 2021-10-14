
export interface Service {
  _id: number;
  Id: string;
  code: string;
  name: string;
  Price: number;
  Interval: number;
  serviceFormId: string;
  ServiceType: string;
  serviceTypeId: string;
  //InjectionObject?: InjectionObject;
}

export type ServiceCM = Omit<Service, 'Id' | 'InjectionObject'>;
