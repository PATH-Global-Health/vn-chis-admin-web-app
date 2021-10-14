import { Category } from '@news/category/category.model';
import { Tag } from '@news/tag/tag.model';
import { Part } from '@news/part/part.model';

export interface Post {
  id: string;
  name: string;
  publishDate: string;
  writter: string;
  description?: string;
  categories: Category[];
  tags: Tag[];
}

export interface PostCM extends Omit<Post, 'id' | 'categories' | 'tags'> {
  categories: string[];
  tags: string[];
  parts?: Part[];
}

export interface PostUM extends Omit<Post, 'categories' | 'tags'> {
  categories: string[];
  tags: string[];
  parts?: Part[];
}

export type PostDM = Post;

export interface PostResponse {
  pageIndex: number;
  pageSize: number;
  totalSize: number;
  data: Post[];
}

export interface PostPreview extends Post {
  parts?: Part[];
}

export interface PostForm extends Omit<Post, 'id' | 'categories' | 'tags'> {
  id: string;
  categories: Category[];
  tags: Tag[];
  parts?: Part[];
}

export interface AddPartsToPost {
  postId: string;
  parts: Part[];
}
