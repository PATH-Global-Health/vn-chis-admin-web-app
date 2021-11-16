export interface SurveyResult {
  id: string;
  fromScore: number;
  toScore: number;
  description: string;
}

export type SurveyResultCM = Omit<SurveyResult, 'id'>;