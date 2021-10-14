export interface Tag {
  id: string;
  description: string;
}

export type TagCM = Omit<Tag, 'id'>;

export type TagUM = Tag;

export type TagDM = Tag;
