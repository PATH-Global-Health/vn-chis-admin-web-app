import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiKey, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import CreateModal from '@pqm/category/key-population/components/CreateModal';
import UpdateModal from '@pqm/category/key-population/components/UpdateModal';

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
import { KeyPopulation } from './key-population.model';
import { getKeyPopulations } from './key-population.slice';
import keyPopulationService from './key-population.service';

const columns: Column<KeyPopulation>[] = [
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

const KeyPopulationsPage: React.FC = () => {
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const { keyPopulationList, getKeyPopulationsLoading } = useSelector(
    (state) => state.pqm.category.keyPopulation,
  );
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<KeyPopulation>();

  const getData = useCallback(() => {
    dispatch(getKeyPopulations());
  }, [dispatch]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_CATEGORY,
    ComponentKey.PQM_KEY_POPULATION,
    getData,
  );
  useEffect(getData, [getData]);

  return (
    <>
      <DataTable
        title="Nhóm nguy cơ"
        loading={getKeyPopulationsLoading || fetching}
        columns={columns}
        data={keyPopulationList}
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
                  type: 'KeyPopulation',
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
                await fetch(keyPopulationService.deleteKeyPopulation(d));
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

export default KeyPopulationsPage;
