import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import { FiPlus, FiKey, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import SiteFilter from '@pqm/category/site/components/SiteFilter';
import CreateModal from '@pqm/category/site/components/CreateModal';
import UpdateModal from '@pqm/category/site/components/UpdateModal';

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
import { Site } from './site.model';
import { getSitesByCode } from './site.slice';
import siteService from './site.service';

const SitesPage: React.FC = () => {
  const { siteTypeList, getSiteTypesLoading } = useSelector(
    (state) => state.pqm.category.siteType,
  );
  const { filter, siteByCode, getSitesByCodeLoading } = useSelector(
    (state) => state.pqm.category.site,
  );

  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();

  const { data, pageCount, total: totalCount } = siteByCode;
  const loading = fetching || getSitesByCodeLoading || getSiteTypesLoading;
  const columns: Column<Site>[] = useMemo(
    () => [
      {
        header: '#',
        accessor: 'order',
      },
      {
        header: 'Mã',
        accessor: 'code',
      },
      {
        header: 'Tên',
        accessor: 'name',
      },
      {
        header: 'Loại cơ sở',
        accessor: 'siteTypeId',
        render: (r) =>
          (siteTypeList || []).find((o) => (o?.id ?? '') === r.siteTypeId)
            ?.name ?? '',
      },
      {
        header: 'Ngày tạo',
        accessor: 'dateCreated',
        render: (r) =>
          (r?.dateCreated ?? '') !== ''
            ? moment(r.dateCreated).format('DD/MM/YYYY')
            : '',
      },
      {
        header: 'Ngày cập nhập',
        accessor: 'dateUpdated',
        render: (r) =>
          (r?.dateUpdated ?? '') !== ''
            ? moment(r.dateUpdated).format('DD/MM/YYYY')
            : '',
      },
      {
        header: 'Tạo bởi',
        accessor: 'createdBy',
      },
    ],
    [siteTypeList],
  );

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Site>();

  const getData = useCallback(() => {
    dispatch(
      getSitesByCode({
        pageIndex,
        pageSize,
        siteTypeId: filter?.siteTypeId ?? '',
        provinceCode: filter?.provinceCode ?? '',
        districtCode: filter?.districtCode ?? '',
      }),
    );
  }, [filter, pageIndex, pageSize, dispatch]);

  useRefreshCallback(GroupKey.ADMIN_PQM_CATEGORY, ComponentKey.PQM_SITE, getData);

  useEffect(getData, [getData]);

  return (
    <>
      <SiteFilter />
      <DataTable
        title="Cơ sở"
        columns={columns}
        data={data}
        loading={loading}
        pageCount={pageCount}
        totalCount={totalCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        tableActions={
          filter?.districtCode
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
                await fetch(siteService.deleteSite(d));
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

export default SitesPage;
