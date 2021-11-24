import { Indicator } from '@pqm/category/indicator/indicator.model';

export interface IndicatorGroup {
  id: string;
  name: string;
  createdBy?: string;
  indicators: Indicator[];
}

export type IndicatorGroupCM = Omit<IndicatorGroup, 'id'>;

export type IndicatorGroupUM = IndicatorGroup;

export type IndicatorGroupDM = IndicatorGroup;
