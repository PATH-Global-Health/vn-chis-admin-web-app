import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import AliasModal from '@pqm/category/category-alias/components/AliasModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { CategoryAlias } from './category-alias.model';
import { getAliasesOfCategory } from './category-alias.slice';
import categoryAliasService from './category-alias.service';

const CategoryAliasesPage: React.FC = () => {
  const {
    selectedCategory,
    aliasesOfCategoryList,
    getAliasesOfCategoryLoading,
  } = useSelector((state) => state.pqm.category.categoryAlias);
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();

  const [aliasModal, setAliasModal] = useState(false);
  const [selected, setSelected] = useState<CategoryAlias>();

  const getData = useCallback(() => {
    dispatch(getAliasesOfCategory(selectedCategory?.id ?? ''));
  }, [dispatch, selectedCategory]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_CATEGORY,
    ComponentKey.PQM_CATEGORY_ALIAS,
    getData,
  );
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        toggle
        title={`Danh sách tên viết tắt${selectedCategory ? ` của danh mục: ${selectedCategory.name}` : ''
          }`}
        data={aliasesOfCategoryList}
        loading={fetching || getAliasesOfCategoryLoading}
        listActions={[
          {
            title: 'Tạo',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              setSelected(undefined);
              setAliasModal(true);
            },
          },
        ]}
        itemActions={[
          {
            title: 'Xóa',
            color: 'red',
            icon: <FiTrash2 />,
            onClick: (row): void => {
              confirm('Xác nhận xóa?', () => {
                fetch(categoryAliasService.deleteCategoryAlias(row));
                getData();
              });
            },
          },
          {
            title: 'Sửa',
            color: 'violet',
            icon: <FiEdit2 />,
            onClick: (row): void => {
              setSelected(row);
              setAliasModal(true);
            },
          },
        ]}
        getRowKey={(d): string => d.id}
        itemHeaderRender={(d): string => d.alias}
      />

      <AliasModal
        open={aliasModal}
        data={selected}
        onRefresh={getData}
        onClose={(): void => setAliasModal(false)}
      />
    </>
  );
};

export default CategoryAliasesPage;
