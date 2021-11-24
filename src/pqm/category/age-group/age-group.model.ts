export interface AgeGroup {
  id: string;
  name: string;
  from?: number;
  to?: number;
  order?: number;
}

export type AgeGroupCM = Omit<AgeGroup, 'id'>;

export type AgeGroupUM = AgeGroup;

export type AgeGroupDM = AgeGroup;
