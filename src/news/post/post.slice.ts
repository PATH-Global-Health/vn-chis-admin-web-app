import {
  createSlice,
  createAsyncThunk,
  CaseReducer,
  PayloadAction,
} from '@reduxjs/toolkit';

import { PostResponse, PostPreview } from '@news/post/post.model';
import partService from '@news/part/part.service';
import postService from '@news/post/post.service';

interface State {
  selectedPost?: PostPreview;
  postList: PostResponse;
  getPostsLoading: boolean;
  getPartsOfSelectedPostLoading: boolean;
}

const initialState: State = {
  selectedPost: undefined,
  postList: {
    pageIndex: 1,
    pageSize: 10,
    totalSize: 0,
    data: [],
  },
  getPostsLoading: false,
  getPartsOfSelectedPostLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const setPostCR: CR<PostPreview | undefined> = (state, action) => ({
  ...state,
  selectedPost: action.payload,
});

const getPosts = createAsyncThunk('pqm/news/post/getPosts', async () => {
  const result = await postService.getPosts();
  return result;
});

const getPartsOfSelectedPost = createAsyncThunk(
  'pqm/news/post/getPartsOfSelectedPost',
  async (postId: string) => {
    const result = await partService.getParts(postId);
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/news/post',
  initialState,
  reducers: {
    setPost: setPostCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => ({
      ...state,
      getPostsLoading: true,
    }));
    builder.addCase(getPosts.fulfilled, (state, { payload }) => ({
      ...state,
      postList: payload,
      getPostsLoading: false,
    }));
    builder.addCase(getPosts.rejected, (state) => ({
      ...state,
      getPostsLoading: false,
    }));
    builder.addCase(getPartsOfSelectedPost.pending, (state) => ({
      ...state,
      getPartsOfSelectedPostLoading: true,
    }));
    builder.addCase(getPartsOfSelectedPost.fulfilled, (state, { payload }) => ({
      ...state,
      selectedPost: state?.selectedPost
        ? { ...state.selectedPost, parts: payload }
        : undefined,
      getPartsOfSelectedPostLoading: false,
    }));
    builder.addCase(getPartsOfSelectedPost.rejected, (state) => ({
      ...state,
      getPartsOfSelectedPostLoading: false,
    }));
  },
});

export const { setPost } = slice.actions;

export { getPosts, getPartsOfSelectedPost };

export default slice.reducer;
