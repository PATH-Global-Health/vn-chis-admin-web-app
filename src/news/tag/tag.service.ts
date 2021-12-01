import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';
import { Tag, TagCM, TagUM, TagDM } from '@news/tag/tag.model';

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
  try {
    await httpClient.delete({
      url: `${apiLinks.news.tag.delete}/${data.id}`,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const genderService = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
};

export default genderService;
