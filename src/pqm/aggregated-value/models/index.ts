import { Indicator } from '@pqm/category/indicator/indicator.model';
import { AgeGroup } from '@pqm/category/age-group/age-group.model';
import { Gender } from '@pqm/category/gender/gender.model';
import { KeyPopulation } from '@pqm/category/key-population/key-population.model';
import { Site } from '@pqm/category/site/site.model';

export const periodTypes: {
  [key: string]: string;
} = {
  month: 'Tháng',
  quarter: 'Quí',
};

export interface ErrorRow {
  row: number;
  error: string;
}

export interface AggregatedValue {
  id: string;
  periodType: string;
  year: string;
  quarter: string;
  month: string;
  day: string;
  indicator: Indicator;
  ageGroup: AgeGroup;
  gender: Gender;
  keyPopulation: KeyPopulation;
  site: Site;
  drugName?: string;
  dataSource?: string;
  dataType: number;
  denominator: number;
  numerator: number;
  isValid: boolean;
  invalidMessage: string;
}

export type AggregatedValueDM = AggregatedValue;

export interface AggregatedValueResponse {
  total: number;
  pageCount: number;
  data: AggregatedValue[];
}

export interface AggregatedValueImportResponse {
  succeed: number;
  updated: number;
  succeedWithUndefinedDimValue: number;
  errorRows: ErrorRow[];
}
