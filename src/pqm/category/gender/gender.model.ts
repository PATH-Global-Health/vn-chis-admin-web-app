export interface Gender {
  id: string;
  name: string;
  order?: number;
  createdBy: string;
}

export type GenderCM = Omit<Gender, 'id' | 'createdBy'>;

export type GenderUM = Omit<Gender, 'createdBy'>;

export type GenderDM = Gender;
