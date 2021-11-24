import { District } from '@pqm/category/district/district.model';

export interface Province {
  id: string;
  code: string;
  name: string;
  slug: string;
  type: string;
  nameWithType: string;
  districts?: District[];
}

export type ProvinceCM = Omit<Province, 'id' | 'districts'>;

export type ProvinceUM = Omit<Province, 'districts'>;

export type ProvinceDM = Omit<Province, 'districts'>;

export const provinceType: {
  [key: string]: string;
} = {
  tinh: 'Tỉnh',
  'thanh-pho': 'Thành phố',
};
