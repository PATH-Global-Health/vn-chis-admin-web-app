export interface KeyPopulation {
  id: string;
  name: string;
  order?: number;
  createdBy: string;
}

export type KeyPopulationCM = Omit<KeyPopulation, 'id' | 'createdBy'>;

export type KeyPopulationUM = Omit<KeyPopulation, 'createdBy'>;

export type KeyPopulationDM = Omit<KeyPopulation, 'createdBy'>;
