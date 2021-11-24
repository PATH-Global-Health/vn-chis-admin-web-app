export interface CategoryAlias {
  id: string;
  categoryId: string;
  alias: string;
  category: string;
}

export type CategoryAliasCM = Omit<CategoryAlias, 'id'>;

export type CategoryAliasUM = CategoryAlias;

export type CategoryAliasDM = CategoryAlias;
