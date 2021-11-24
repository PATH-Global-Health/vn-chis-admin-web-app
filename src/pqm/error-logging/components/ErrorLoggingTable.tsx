import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';

import { FiRefreshCw } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import ErrorLoggingFilter from '@pqm/error-logging/components/ErrorLoggingFilter';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { GroupKey } from '@app/utils/component-tree';
import { ErrorLogging } from '@pqm/error-logging/models';
import {
  getErrorLoggings,
  selectErrorLogging,
} from '@pqm/error-logging/slices';
import { openComponentTab } from '@app/slices/global';

interface ErrorLoggingExtended extends ErrorLogging {
  index: number;
  row?: number;
  indicator?: string;
  site?: string;
  province?: string;
  code?: string;
  error?: string;
}

const columns: Column<ErrorLoggingExtended>[] = [
  {
    header: '#',
    accessor: 'index',
  },
  {
    header: 'Thời gian',
    accessor: 'dateTime',
    render: (d) => moment(d.dateTime).format('HH:mm | DD-MM-YYYY'),
  },
  {
    header: 'Tỉnh/Thành',
    accessor: 'detail',
    render: (d) => d?.detail?.province ?? '',
  },
  {
    header: 'Cơ sở',
    accessor: 'site',
    render: (d) => d?.detail?.site ?? '',
  },
  {
    header: 'Chỉ số',
    accessor: 'indicator',
    render: (d) => d?.detail?.indicator ?? '',
  },
  {
    header: 'Mã lỗi',
    accessor: 'code',
    render: (d) => d?.detail?.code ?? '',
  },
  {
    header: 'Mô tả',
    accessor: 'error',
    render: (d) => d?.detail?.error ?? '',
  },
];

const ErrorLoggingTable: React.FC = () => {
  const [data, setData] = useState<ErrorLogging[]>([]);
  const [initial, setInitial] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);

  const dispatch = useDispatch();
  const { errorFilter, errorLoggingList, getErrorLoggingLoading } = useSelector(
    (state) => state.pqm.errorLogging,
  );

  const loading = getErrorLoggingLoading;
  const handleLoadMore = useCallback(() => {
    if (!initial) {
      dispatch(
        getErrorLoggings({
          ...errorFilter,
          pageIndex,
          pageSize,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pageIndex, pageSize]);
  useEffect(handleLoadMore, [handleLoadMore]);

  const handleFilter = useCallback(() => {
    if (!initial) {
      setData([]);
      dispatch(
        getErrorLoggings({
          ...errorFilter,
          pageIndex,
          pageSize,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, errorFilter]);
  useEffect(handleFilter, [handleFilter]);

  useRefreshCallback(
    GroupKey.ADMIN_PQM_ERROR_LOGGING,
    GroupKey.ADMIN_PQM_ERROR_LOGGING,
    handleFilter,
  );

  useEffect(() => {
    if (initial) {
      setInitial(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFilter]);

  useEffect(() => {
    setData((prev) => [...prev, ...errorLoggingList]);
  }, [errorLoggingList]);

  return (
    <div>
      <ErrorLoggingFilter />
      <DataTable
        noPaging
        title="Danh sách lỗi"
        loading={loading}
        columns={columns}
        data={data.map((error, index) => ({
          ...error,
          index: index + 1,
        }))}
        onRowClick={(row): void => {
          console.log(row);
          dispatch(selectErrorLogging(row));
          dispatch(
            openComponentTab({
              groupKey: GroupKey.ADMIN_PQM_ERROR_LOGGING_DETAIL,
              key: GroupKey.ADMIN_PQM_ERROR_LOGGING_DETAIL,
            }),
          );
        }}
        tableActions={[
          {
            icon: <FiRefreshCw />,
            title: 'Lấy thêm dữ liệu',
            color: 'green',
            onClick: (): void => {
              setPageIndex(pageIndex + 1);
            },
          },
        ]}
      />
    </div>
  );
};

export default ErrorLoggingTable;
