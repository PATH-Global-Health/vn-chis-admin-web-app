export interface Answer {
  id: string;
  score: number;
  description: string;
}
export interface Question {
  id: string;
  description: string;
  isMultipleChoice: boolean,
  answers: any[];
}

export type QuestionCM = Omit<Question, 'id'>;

export type QuestionUM = Omit<Question, 'answers'>;

export type QuestionDM = Question;
