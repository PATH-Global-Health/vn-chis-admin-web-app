import React from 'react';
import styled from 'styled-components';

import {
  FiMoreHorizontal,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import {
  Segment,
  Pagination as SemanticPagination,
  StrictPaginationProps,
  StrictDropdownProps,
  Select,
} from 'semantic-ui-react';

const Wrapper = styled(Segment)`
  display: flex;
  padding: 0.5rem !important;
  box-shadow: none !important;
  background: #f9fafb !important;
  text-align: inherit;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.87);
  margin: 8px 0 !important;
  & .pagination {
    box-shadow: none;
  }
`;
const StyledCurrentCount = styled.div`
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
  margin-left: auto;
  padding: 0.25rem;
`;
const StyledSelect = styled(Select)<{ margin: string }>`
  min-width: 8em !important;
  margin-left: ${(props) => props.margin};
`;

interface Props {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  gotoPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const Pagination: React.FC<Props> = (props) => {
  const {
    pageIndex,
    pageSize,
    pageCount,
    totalCount,
    gotoPage,
    setPageSize,
  } = props;

  return (
    <Wrapper>
      <SemanticPagination
        size="mini"
        activePage={pageIndex + 1}
        totalPages={pageCount}
        ellipsisItem={{ content: <FiMoreHorizontal />, icon: true }}
        firstItem={{ content: <FiChevronsLeft />, icon: true }}
        lastItem={{ content: <FiChevronsRight />, icon: true }}
        prevItem={{ content: <FiChevronLeft />, icon: true }}
        nextItem={{ content: <FiChevronRight />, icon: true }}
        onPageChange={(
          event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
          data: StrictPaginationProps,
        ): void => {
          gotoPage((data.activePage as number) - 1);
        }}
      />
      {totalCount !== 0 && (
        <StyledCurrentCount>{`Tổng: ${totalCount}`}</StyledCurrentCount>
      )}
      <StyledSelect
        margin={totalCount !== 0 ? '8px' : 'auto'}
        value={pageSize}
        options={[10, 20, 30, 40, 50].map((o) => ({
          value: o,
          text: `Hiển thị: ${o}`,
        }))}
        onChange={(
          event: React.SyntheticEvent<HTMLElement>,
          data: StrictDropdownProps,
        ): void => setPageSize(data.value as number)}
      />
    </Wrapper>
  );
};

export default Pagination;
