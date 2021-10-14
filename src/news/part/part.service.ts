import { httpClient, apiLinks } from '@app/utils';

import { Part, PartUM, PartDM } from './part.model';

const getParts = async (postId: string): Promise<Part[]> => {
  const response = await httpClient.get({
    url: `${apiLinks.news.part.get}/${postId}`,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Part[];
};

const updatePart = async (data: PartUM): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.news.part.update}/${data.id}`,
    data,
  });
};

const deletePart = async (data: PartDM): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.news.part.delete}/${data.id}`,
    data,
  });
};

const genderService = {
  getParts,
  updatePart,
  deletePart,
};

export default genderService;
