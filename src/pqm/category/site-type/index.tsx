import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import CreateModal from '@pqm/category/site-type/components/CreateModal';
import UpdateModal from '@pqm/category/site-type/components/UpdateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { SiteType } from './site-type.model';
import { getSiteTypes } from './site-type.slice';
import siteTypeService from './site-type.service';

const columns: Column<SiteType>[] = [
  {
    header: 'Tên',
    accessor: 'name',
  },
  {
    header: 'Tạo bởi',
    accessor: 'createdBy',
  },
];

const SiteTypesPage: React.FC = () => {
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const { siteTypeList, getSiteTypesLoading } = useSelector(
    (state) => state.pqm.category.siteType,
  );
  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<SiteType>();

  const getData = useCallback(() => {
    dispatch(getSiteTypes());
  }, [dispatch]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_CATEGORY,
    ComponentKey.PQM_SITE_TYPE,
    getData,
  );
  useEffect(getData, [getData]);

  return (
    <>
      <DataTable
        title="Loại cơ sở"
        loading={getSiteTypesLoading || fetching}
        columns={columns}
        data={siteTypeList}
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
                await fetch(siteTypeService.deleteSiteType(d));
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

export default SiteTypesPage;
