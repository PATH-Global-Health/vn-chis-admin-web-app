import { httpClient, apiLinks } from '@app/utils';

import {
  PostCM,
  PostUM,
  PostDM,
  PostResponse,
  AddPartsToPost,
} from './post.model';

const getPosts = async (): Promise<PostResponse> => {
  const response = await httpClient.get({
    url: apiLinks.news.post.get,
    params: {
      pageIndex: 1,
      pageSize: 10000,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as PostResponse;
};

const createPost = async (data: PostCM): Promise<string> => {
  const result = await httpClient.post({
    url: apiLinks.news.post.create,
    data,
  });
  return result.data as string;
};

const updatePost = async (data: PostUM): Promise<string> => {
  const result = await httpClient.put({
    url: `${apiLinks.news.post.update}/${data.id}`,
    data,
  });
  return result.data as string;
};

const deletePost = async (data: PostDM): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.news.post.delete}/${data.id}`,
    data,
  });
};

const addPartsToPost = async (data: AddPartsToPost): Promise<void> => {
  await httpClient.post({
    url: apiLinks.news.post.addParts,
    data,
  });
};

const genderService = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  addPartsToPost,
};

export default genderService;
