import { combineReducers } from '@reduxjs/toolkit';
import tag from './tag/tag.slice';
import part from './part/part.slice';
import category from './category/category.slice';
import post from './post/post.slice';

export default combineReducers({
  tag,
  part,
  category,
  post,
});
