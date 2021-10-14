import { httpClient, apiLinks } from '@app/utils';

import { Tag, TagCM, TagUM, TagDM } from './tag.model';

const getTags = async (): Promise<Tag[]> => {
  const response = await httpClient.get({
    url: apiLinks.news.tag.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Tag[];
};

const createTag = async (data: TagCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.news.tag.create,
    data,
  });
};

const updateTag = async (data: TagUM): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.news.tag.update}/${data.id}`,
    data,
  });
};

const deleteTag = async (data: TagDM): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.news.tag.delete}/${data.id}`,
    data,
  });
};

const genderService = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
};

export default genderService;
