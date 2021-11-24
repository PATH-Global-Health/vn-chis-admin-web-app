import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import CreateModal from '@pqm/category/province/components/CreateModal';
import UpdateModal from '@pqm/category/province/components/UpdateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { Province, provinceType } from './province.model';
import { getProvinces } from './province.slice';
import provinceService from './province.service';

const columns: Column<Province>[] = [
  {
    header: 'Mã',
    accessor: 'code',
  },
  {
    header: 'Slug',
    accessor: 'slug',
  },

  {
    header: 'Loại',
    accessor: 'type',
    render: (r) => provinceType[r?.type],
  },
  {
    header: 'Tên',
    accessor: 'name',
  },
  {
    header: 'Tên chuẩn',
    accessor: 'nameWithType',
  },
];

const ProvincesPage: React.FC = () => {
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const { provinceList, getProvincesLoading } = useSelector(
    (state) => state.pqm.category.province,
  );
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Province>();

  const getData = useCallback(() => {
    dispatch(getProvinces());
  }, [dispatch]);

  useRefreshCallback(GroupKey.ADMIN_PQM_CATEGORY, ComponentKey.PQM_PROVINCE, getData);
  useEffect(getData, [getData]);

  return (
    <>
      <DataTable
        title="Tỉnh/Thành"
        loading={getProvincesLoading || fetching}
        columns={columns}
        data={provinceList || []}
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
                await fetch(provinceService.deleteProvince(d));
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

export default ProvincesPage;
