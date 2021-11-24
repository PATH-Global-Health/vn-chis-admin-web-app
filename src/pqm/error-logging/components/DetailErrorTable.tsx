import React from 'react';
import styled from 'styled-components';

import { FiCopy } from 'react-icons/fi';
import { Header } from 'semantic-ui-react';
import DataTable, { Column } from '@app/components/data-table';

import { useSelector } from '@app/hooks';
import { ResultRowError } from '@pqm/error-logging/models';

const HeaderWrapper = styled.div`
  font-size: 24px !important;
`;

const JSONWrapper = styled.div`
  font-size: 0.8rem !important;
  word-break: break-all;
  overflow: auto;
  max-height: 300px;
`;

const columns: Column<ResultRowError>[] = [
  {
    header: 'Dòng lỗi',
    accessor: 'row',
  },
  {
    header: 'Mã',
    accessor: 'code',
  },
  {
    header: 'Lỗi',
    accessor: 'error',
    render: (d) => d?.error ?? '',
  },
];

const DetailErrorTable: React.FC = () => {
  const { selectedErrorLogging } = useSelector(
    (state) => state.pqm.errorLogging,
  );

  const copyToClipboard = (content: string): void => {
    const textField = document.createElement('textarea');
    textField.innerText = content;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  return (
    <DataTable
      title={
        <HeaderWrapper>
          <Header as="h3">Danh sách những dòng bị lỗi</Header>
        </HeaderWrapper>
      }
      columns={columns}
      data={selectedErrorLogging?.result?.data?.error_rows ?? []}
      subComponent={(d) => {
        return (
          <JSONWrapper>
            <pre>
              {((d.raw_data?.datas ?? [])?.length ?? 0) >= d.row
                ? JSON.stringify(d.raw_data?.datas[d.row - 1], null, 2)
                : null}
            </pre>
          </JSONWrapper>
        );
      }}
      rowActions={[
        {
          icon: <FiCopy />,
          color: 'green',
          title: 'Copy dữ liệu',
          onClick: (d): void => {
            copyToClipboard(JSON.stringify(d.raw_data));
          },
        },
      ]}
    />
  );
};

export default DetailErrorTable;
