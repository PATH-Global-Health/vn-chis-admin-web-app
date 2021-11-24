import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
// import { toast } from 'react-toastify';

import {
  // FiUpload,
  FiMoreVertical,
  FiAlignCenter,
  FiTrash2,
} from 'react-icons/fi';
import { Dimmer, Loader } from 'semantic-ui-react';
import DataTable, { Column } from '@app/components/data-table';
import AggregatedValueFilter from '@pqm/aggregated-value/components/AggregatedValueFilter';

import { useFetchApi, useConfirm, useSelector, useDispatch } from '@app/hooks';
import { openComponentTab } from '@app/slices/global';
import { GroupKey } from '@app/utils/component-tree';
import { AggregatedValue } from '@pqm/aggregated-value/models';
import {
  getAggregatedValues,
  setAggregatedValueSelected,
} from '@pqm/aggregated-value/slices';
import aggregatedValueService from '@pqm/aggregated-value/services';

interface ColumnExtended<T> extends Column<T> {
  index: number;
}

interface Group {
  id: string;
  columns: number[];
}

interface Props {
  group?: Group;
}

const Wrapper = styled.div`
  position: relative;
  & .invalid {
    background-color: #ffcccc;
  }
`;

const columns: ColumnExtended<AggregatedValue>[] = [
  {
    index: 0,
    header: 'Chu kì',
    accessor: 'periodType',
  },
  {
    index: 1,
    header: 'Năm',
    accessor: 'year',
  },
  {
    index: 2,
    header: 'Quý',
    accessor: 'quarter',
  },
  {
    index: 3,
    header: 'Tháng',
    accessor: 'month',
  },
  {
    index: 4,
    header: 'Chỉ số',
    accessor: 'indicator',
    render: (r) => r?.indicator?.name ?? '',
  },
  {
    index: 5,
    header: 'Nhóm tuổi',
    accessor: 'ageGroup',
    render: (r) => r?.ageGroup?.name ?? '',
  },
  {
    index: 6,
    header: 'Giới tính',
    accessor: 'gender',
    render: (r) => r?.gender?.name ?? '',
  },
  {
    index: 7,
    header: 'Nhóm nguy cơ',
    accessor: 'keyPopulation',
    render: (r) => r?.keyPopulation?.name ?? '',
  },
  {
    index: 8,
    header: 'Cơ sở',
    accessor: 'site',
    render: (r) => `${(r?.site?.name ?? '').substr(0, 50)}...`,
  },
  {
    index: 9,
    header: 'Tên thuốc',
    accessor: 'drugName',
    render: (r) => r?.drugName ?? '',
  },
  {
    index: 11,
    header: 'Nguồn',
    accessor: 'dataSource',
    render: (r) => r?.dataSource ?? '',
  },
  {
    index: 10,
    header: 'Giá trị',
    accessor: 'dataType',
    render: (r) => {
      let format = '';
      const dataType = r?.dataType ?? 1;
      if (dataType === 1) {
        format = `${r?.numerator ?? ''}`;
      } else if (dataType === 2) {
        format = `${r?.numerator ?? ''}/${r?.denominator ?? ''}`;
      }
      return format;
    },
  },
];

const AggregatedValueTable: React.FC<Props> = (props) => {
  const { group } = props;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const { filter, aggregatedValue, getAggregatedValuesLoading } = useSelector(
    (state) => state.pqm.aggregatedValue,
  );

  const { total: totalCount, pageCount, data } = aggregatedValue;
  // eslint-disable-next-line
  const {
    id: indicatorGroupId,
    columns: columnsProps,
  } = group || {
    id: '',
    columns: columns.map((column) => column.index),
  };

  const filteredColumns = useMemo(
    () =>
      columnsProps.reduce<ColumnExtended<AggregatedValue>[]>(
        (filtered, index) => {
          const found = columns.find((column) => column.index === index);
          if (found) {
            return [...filtered, found];
          }
          return filtered;
        },
        [],
      ),
    [columnsProps],
  );

  const getData = useCallback(() => {
    dispatch(
      getAggregatedValues({
        ...filter,
        indicatorGroupId,
        pageIndex,
        pageSize,
      }),
    );
  }, [indicatorGroupId, pageIndex, pageSize, filter, dispatch]);
  useEffect(getData, [getData]);

  return (
    <Wrapper>
      <Dimmer inverted active={fetching}>
        <Loader>Đang xử lý...</Loader>
      </Dimmer>
      <AggregatedValueFilter />
      <DataTable
        columns={filteredColumns}
        data={data}
        loading={getAggregatedValuesLoading}
        rowError={(r) => !r.isValid}
        pageCount={pageCount}
        totalCount={totalCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        rowActions={[
          {
            icon: <FiMoreVertical />,
            color: 'grey',
            title: 'Chức năng',
            dropdown: true,
            dropdownActions: [
              {
                icon: <FiAlignCenter />,
                color: 'green',
                titleDropdown: 'Chi tiết',
                onDropdownClick: (d): void => {
                  dispatch(setAggregatedValueSelected(d));
                  dispatch(
                    openComponentTab({
                      groupKey: GroupKey.ADMIN_PQM_AGGREGATED_VALUE_DETAIL,
                      key: GroupKey.ADMIN_PQM_AGGREGATED_VALUE_DETAIL,
                    }),
                  );
                },
              },
              {
                icon: <FiTrash2 />,
                color: 'red',
                titleDropdown: 'Xóa',
                onDropdownClick: (d): void => {
                  confirm('Xác nhận xoá', async () => {
                    await fetch(
                      aggregatedValueService.deleteAggregatedValue(d),
                    );
                    getData();
                  });
                },
              },
            ],
          },
        ]}
      />
    </Wrapper>
  );
};

export default AggregatedValueTable;
