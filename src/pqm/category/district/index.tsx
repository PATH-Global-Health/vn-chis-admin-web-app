import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import DistrictFilter from '@pqm/category/district/components/DistrictFilter';
import CreateModal from '@pqm/category/district/components/CreateModal';
import UpdateModal from '@pqm/category/district/components/UpdateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { District, districtType } from './district.model';
import { getDistricts } from './district.slice';
import districtService from './district.service';

const columns: Column<District>[] = [
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
    render: (r) => districtType[r?.type],
  },
  {
    header: 'Tên',
    accessor: 'name',
  },
  {
    header: 'Tên chuẩn',
    accessor: 'nameWithType',
  },
  {
    header: 'Địa chỉ',
    accessor: 'path',
  },
  {
    header: 'Địa chỉ chuẩn',
    accessor: 'pathWithType',
  },
  {
    header: 'Tạo bởi',
    accessor: 'createdBy',
  },
];

const DistrictsPage: React.FC = () => {
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const { filter, districtList, getDistrictsLoading } = useSelector(
    (state) => state.pqm.category.district,
  );
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<District>();

  const getData = useCallback(() => {
    dispatch(getDistricts(filter));
  }, [filter, dispatch]);

  useRefreshCallback(GroupKey.ADMIN_PQM_CATEGORY, ComponentKey.PQM_DISTRICT, getData);
  useEffect(getData, [getData]);

  return (
    <>
      <DistrictFilter />
      <DataTable
        title="Quận/Huyện"
        loading={getDistrictsLoading || fetching}
        columns={columns}
        data={districtList}
        tableActions={
          filter?.provinceCode
            ? [
                {
                  icon: <FiPlus />,
                  color: 'green',
                  title: 'Thêm',
                  onClick: (): void => setOpenCreate(true),
                },
              ]
            : []
        }
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
                await fetch(districtService.deleteDistrict(d));
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

export default DistrictsPage;
