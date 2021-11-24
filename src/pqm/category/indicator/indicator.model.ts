export interface Indicator {
  id: string;
  order: number;
  code: string;
  name: string;
  description: string;
  createdBy: string;
  isTotal: boolean;
  indicatorGroupId: string;
}

export type IndicatorCM = Omit<Indicator, 'id'>;

export type IndicatorUM = Indicator;

export type IndicatorDM = Indicator;
