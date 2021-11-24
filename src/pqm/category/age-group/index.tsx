import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiKey, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import CreateModal from '@pqm/category/age-group/components/CreateModal';
import UpdateModal from '@pqm/category/age-group/components/UpdateModal';

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
import { AgeGroup } from './age-group.model';
import { getAgeGroups } from './age-group.slice';
import ageGroupService from './age-group.service';

const columns: Column<AgeGroup>[] = [
  {
    header: '#',
    accessor: 'order',
  },
  {
    header: 'Tên',
    accessor: 'name',
  },
  {
    header: 'Từ',
    accessor: 'from',
  },
  {
    header: 'Đến',
    accessor: 'to',
  },
];

const AgeGroupsPage: React.FC = () => {
  const { ageGroupList, getAgeGroupsLoading } = useSelector(
    (state) => state.pqm.category.ageGroup,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<AgeGroup>();

  const getData = useCallback(() => {
    dispatch(getAgeGroups());
  }, [dispatch]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_CATEGORY,
    ComponentKey.PQM_AGE_GROUP,
    getData,
  );
  useEffect(getData, [getData]);

  return (
    <>
      <DataTable
        title="Nhóm tuổi"
        loading={getAgeGroupsLoading || fetching}
        columns={columns}
        data={ageGroupList}
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
                  type: 'AgeGroup',
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
                await fetch(ageGroupService.deleteAgeGroup(d));
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

export default AgeGroupsPage;
