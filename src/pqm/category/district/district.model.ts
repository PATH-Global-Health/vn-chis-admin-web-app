export interface District {
  id: string;
  code: string;
  name: string;
  type: string;
  slug: string;
  nameWithType: string;
  path: string;
  pathWithType: string;
  parentCode: string;
  createdBy: string;
}

export type DistrictCM = Omit<District, 'id'>;

export type DistrictUM = Omit<District, 'createdBy'>;

export type DistrictDM = Omit<District, 'createdBy'>;

export const districtType: {
  [key: string]: string;
} = {
  quan: 'Quận',
  huyen: 'Huyện',
  'thi-xa': 'Thị xã',
  'thanh-pho': 'Thành phố',
};
