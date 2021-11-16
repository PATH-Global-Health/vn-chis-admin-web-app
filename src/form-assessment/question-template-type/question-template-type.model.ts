export interface QuestionTemplateType {
  id: string;
  description: string;
}

export type QuestionTemplateTypeCM = Omit<QuestionTemplateType, 'id'>;

export type QuestionTemplateTypeUM = QuestionTemplateType;

export type QuestionTemplateTypeDM = QuestionTemplateType;
