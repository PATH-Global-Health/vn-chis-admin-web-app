import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import CreateModal from '@news/category/components/CreateModal';
import UpdateModal from '@news/category/components/UpdateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { Category } from '@news/category/category.model';
import { getCategories } from '@news/category/category.slice';
import categoryService from '@news/category/category.service';

const CategorysPage: React.FC = () => {
  const { categoryList, getCategoriesLoading } = useSelector(
    (state) => state.news.category,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Category>();

  const getData = useCallback(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useRefreshCallback(GroupKey.ADMIN_NEW_MANAGEMENT, ComponentKey.NEWS_CATEGORY, getData);
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        toggle
        title="Danh sách thể loại bài viết"
        data={categoryList}
        loading={fetching || getCategoriesLoading}
        listActions={[
          {
            title: 'Tạo thể loại bài viết',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        itemActions={[
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: 'Xoá',
            onClick: (d): void => {
              confirm('Xác nhận xoá?', async () => {
                await fetch(categoryService.deleteCategory(d));
                getData();
              });
            },
          },
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: 'Sửa',
            onClick: (d): void => setUpdateDetails(d),
          },
        ]}
        itemHeaderRender={(d): string => d.description}
        getRowKey={(d): string => d.id}
      />

      <CreateModal
        open={openCreate}
        onClose={(): void => setOpenCreate(false)}
        onRefresh={getData}
      />

      <UpdateModal
        data={updateDetails}
        onClose={(): void => setUpdateDetails(undefined)}
        onRefresh={getData}
      />
    </>
  );
};

export default CategorysPage;
