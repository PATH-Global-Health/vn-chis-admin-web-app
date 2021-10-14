export interface Category {
  id: string;
  description: string;
}

export type CategoryCM = Omit<Category, 'id'>;

export type CategoryUM = Category;

export type CategoryDM = Category;
