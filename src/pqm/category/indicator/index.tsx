import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import CreateModal from '@pqm/category/indicator/components/CreateModal';
import UpdateModal from '@pqm/category/indicator/components/UpdateModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { Indicator } from './indicator.model';
import { getIndicators } from './indicator.slice';
import indicatorService from './indicator.service';
import { getIndicatorGroups as fetchIndicatorGroups } from '../indicator-group/indicator-group.slice';

const IndicatorsPage: React.FC = () => {
  const { indicatorList, getIndicatorsLoading } = useSelector(
    (state) => state.pqm.category.indicator,
  );
  const { indicatorGroupList, getIndicatorGroupsLoading } = useSelector(
    (state) => state.pqm.category.indicatorGroup,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Indicator | undefined>();

  const loading = getIndicatorsLoading || getIndicatorGroupsLoading || fetching;
  const columns: Column<Indicator>[] = useMemo(
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
        header: 'Tính tổng số hiện hữu',
        accessor: 'isTotal',
        render: (r) => (r.isTotal ? 'Có' : 'Không'),
      },
      {
        header: 'Thuộc nhóm chỉ số',
        accessor: 'indicatorGroupId',
        render: (r) =>
          (indicatorGroupList || []).find((o) => o.id === r.indicatorGroupId)
            ?.name ?? '',
      },
      {
        header: 'Tạo bởi',
        accessor: 'createdBy',
      },
    ],
    [indicatorGroupList],
  );

  const getData = useCallback(() => {
    dispatch(getIndicators());
  }, [dispatch]);
  const getIndicatorGroups = useCallback(() => {
    dispatch(fetchIndicatorGroups());
  }, [dispatch]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_CATEGORY,
    ComponentKey.PQM_INDICATOR,
    getData,
  );

  useEffect(getData, [getData]);
  useEffect(() => {
    if (indicatorGroupList.length === 0) {
      getIndicatorGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getIndicatorGroups]);

  return (
    <>
      <DataTable
        title="Chỉ số"
        loading={loading}
        columns={columns}
        data={indicatorList}
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
                await fetch(indicatorService.deleteIndicator(d));
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

export default IndicatorsPage;
