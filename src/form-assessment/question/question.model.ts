export interface Answer {
  id: string;
  score: number;
  description: string;
}
export interface Question {
  id: string;
  order?: number;
  description: string;
  isMultipleChoice: boolean,
  answers: any[];
}

export type QuestionCM = Omit<Question, 'id'>;

export type QuestionUM = Omit<Question, 'answers'>;

export type QuestionDM = Question;

export interface QuestionForQuestionTemplateCM {
  order: number;
  questionId: string;
}

export type QuestionForQuestionTemplateUM = QuestionForQuestionTemplateCM;

export type QuestionForQuestionTemplateDM = QuestionForQuestionTemplateUM;

export type SingleAnwserCM = Omit<Answer, 'id'>;

export interface MultipleAnswerCM {
  questionId: string;
  answers: SingleAnwserCM[];
}

export type AnswerUM = Answer;

export type AnswerDM = Answer;
