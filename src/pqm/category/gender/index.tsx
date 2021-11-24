import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiKey, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import CreateModal from '@pqm/category/gender/components/CreateModal';
import UpdateModal from '@pqm/category/gender/components/UpdateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { setCategory } from '@pqm/category/category-alias/category-alias.slice';
import { openComponentTab } from '@app/slices/global';
import { Gender } from './gender.model';
import { getGenders } from './gender.slice';
import genderService from './gender.service';

const columns: Column<Gender>[] = [
  {
    header: '#',
    accessor: 'order',
  },
  {
    header: 'Tên',
    accessor: 'name',
  },
  {
    header: 'Tạo bởi',
    accessor: 'createdBy',
  },
];

const GendersPage: React.FC = () => {
  const { genderList, getGendersLoading } = useSelector(
    (state) => state.pqm.category.gender,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Gender>();

  const getData = useCallback(() => {
    dispatch(getGenders());
  }, [dispatch]);

  useRefreshCallback(GroupKey.ADMIN_PQM_CATEGORY, ComponentKey.PQM_GENDER, getData);
  useEffect(getData, [getData]);

  return (
    <>
      <DataTable
        title="Nhóm tuổi"
        loading={getGendersLoading || fetching}
        columns={columns}
        data={genderList}
        tableActions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: 'Thêm',
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        rowActions={[
          {
            icon: <FiKey />,
            color: 'yellow',
            title: 'Viết tắt',
            onClick: (d): void => {
              dispatch(
                setCategory({
                  id: d.id,
                  name: d.name,
                  type: 'Gender',
                }),
              );
              dispatch(
                openComponentTab({
                  groupKey: GroupKey.ADMIN_PQM_CATEGORY,
                  key: ComponentKey.PQM_CATEGORY_ALIAS,
                }),
              );
            },
          },
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: 'Sửa',
            onClick: (d): void => setUpdateDetails(d),
          },
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: 'Xoá',
            onClick: (d): void => {
              confirm('Xác nhận xoá', async () => {
                await fetch(genderService.deleteGender(d));
                getData();
              });
            },
          },
        ]}
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

export default GendersPage;
