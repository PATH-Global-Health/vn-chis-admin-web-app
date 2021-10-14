
import { httpClient, apiLinks } from '@app/utils';
import { Category, CategoryCM, CategoryUM, CategoryDM } from './category.model';

const getCategories = async (): Promise<Category[]> => {
  const response = await httpClient.get({
    url: apiLinks.news.category.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Category[];
};

const createCategory = async (data: CategoryCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.news.category.create,
    data,
  });
};

const updateCategory = async (data: CategoryUM): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.news.category.update}/${data.id}`,
    data,
  });
};

const deleteCategory = async (data: CategoryDM): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.news.category.delete}/${data.id}`,
    data,
  });
};

const genderService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default genderService;
