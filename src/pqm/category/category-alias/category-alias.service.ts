import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import {
  CategoryAlias,
  CategoryAliasCM,
  CategoryAliasUM,
  CategoryAliasDM,
} from './category-alias.model';

const getCategoryAliases = async (): Promise<CategoryAlias[]> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.pqm.category.categoryAlias.get,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return response.data as CategoryAlias[];
  } catch (error) {
    return [];
  }
};

const getAliasesOfCategory = async (
  categoryId: string,
): Promise<CategoryAlias[]> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.pqm.category.categoryAlias.getAliasesOfCategory(categoryId),
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data as CategoryAlias[];
  } catch (error) {
    return [];
  }
};

const createCategoryAlias = async (data: CategoryAliasCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.pqm.category.categoryAlias.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateCategoryAlias = async (data: CategoryAliasUM): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.pqm.category.categoryAlias.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteCategoryAlias = async (data: CategoryAliasDM): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.pqm.category.categoryAlias.delete,
      data,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line
    toast.warn(getResponseError(error.response?.data));
  }
};

const categoryAliasService = {
  getCategoryAliases,
  getAliasesOfCategory,
  createCategoryAlias,
  updateCategoryAlias,
  deleteCategoryAlias,
};

export default categoryAliasService;
