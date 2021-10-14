export interface ServiceType {
  id: string;
  unitId: string;
  description: string;
  IsTeleHealth: boolean;
  canChooseDoctor: boolean;
  canChooseHour: boolean;
  canPostPay: boolean;
  canUseHealthInsurance: boolean;
}

export type ServiceTypeCM = Omit<ServiceType, 'Id'>;
