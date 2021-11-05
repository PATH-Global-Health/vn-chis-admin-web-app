import React, { useEffect, useCallback, useState } from 'react';

import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import {
  useSelector,
  useDispatch,
  useRefreshCallback,
  useFetchApi,
} from '@app/hooks';

import { getServices } from './service.slice';
import { Service } from './service.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<Service>[] = [
  { accessor: 'code', header: 'Mã' },
  { accessor: 'name', header: 'Dịch vụ' },
];

const ServicesPage: React.FC = () => {
  const { serviceList, getServicesLoading } = useSelector(
    (state) => state.category.service,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getServices());
  }, [dispatch]);
  useRefreshCallback(GroupKey.CSYT_CATALOG, ComponentKey.CSYT_SERVICE, getData);
  useEffect(getData, [getData]);

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Service>();

  const { fetching } = useFetchApi();
  const loading = fetching || getServicesLoading;
  return (
    <>
      <DataTable
        title="Dịch vụ"
        loading={loading}
        columns={columns}
        data={serviceList}
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

export default ServicesPage;
