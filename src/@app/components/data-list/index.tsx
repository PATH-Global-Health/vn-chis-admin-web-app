import React, {
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
} from 'react';

import {
  SemanticCOLORS,
  Dimmer,
  Loader,
  Button,
  List,
  Header,
} from 'semantic-ui-react';
import styled from 'styled-components';
import SearchBar from '@app/components/SearchBar';
import Pagination from '@app/components/data-list/Pagination';
import RowCheckbox from '@app/components/data-list/RowCheckBox';

import { deburr } from '@app/utils/helpers';

const Wrapper = styled.div`
  position: relative;
`;
const StyledHeader = styled(Header)`
  margin-top: 0;
  margin-bottom: 8px;
  margin-right: auto;
`;
const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;
const ListActionButton = styled(Button)`
  display: ${(props): string => (props.hidden ? 'none' : 'flex')} !important;
  padding: 9px !important;
  margin-right: 0 !important;
  margin-left: 9px !important;
  height: ${(props: { search: string }): string =>
    props.search === 'true' ? 'auto' : '36px'};
`;
const StyledSearchBar = styled(SearchBar)`
  flex: 1 1 0%;
`;
const IconButton = styled(Button)`
  display: ${(props): string => (props.hidden ? 'none' : 'block')} !important;
  line-height: 0 !important;
  margin-left: 0.25rem !important;
  margin-top: 2px !important;
  margin-right: 0 !important;
  padding: 10px !important;
`;
const BorderedList = styled(List)`
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 5px;
  margin: 8px 0 !important;
`;
const ItemWrapper = styled(List.Item)`
  display: flex !important;
  align-items: center !important;
`;
const ActionWrapper = styled(List.Content)`
  display: inherit !important;
  margin-left: auto;
`;
const CheckBoxWrapper = styled(List.Content)`
  padding: 0.625em !important;
  padding-left: 0.125em !important;
  margin-right: 0 !important;
`;

interface Action<T> {
  title: string;
  icon: JSX.Element;
  color: SemanticCOLORS;
  hidden?: boolean | ((d: T) => boolean);
}

interface ListAction<T> extends Action<T> {
  onClick: (data: T[]) => void;
}

interface ItemAction<T> extends Action<T> {
  onClick: (data: T) => void;
}

interface Props<T extends object> {
  data: T[];
  loading?: boolean;
  search?: boolean;
  toggle?: boolean;
  selectable?: boolean;
  selectedRows?: T[];
  title?: string | JSX.Element;
  listActions?: ListAction<T>[];
  itemActions?: ItemAction<T>[];
  getRowKey: (data: T) => string | number;
  itemHeaderRender: (d: T) => string | JSX.Element;
  itemContentRender?: (d: T) => string | JSX.Element;
  onSearch?: (value: string) => void;
  onRowClick?: (data: T) => void;
  onRowSelect?: (data: T) => void;
  onMultipleSelect?: (data: T[]) => void;

  noPaging?: boolean;
  totalPages?: number;
  totalCount?: number;
  onPaginationChange?: (param: { pageIndex: number; pageSize: number }) => void;
}

const DataList: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {
  const {
    data,
    loading,
    search,
    toggle,
    selectable,
    selectedRows,
    title,
    listActions,
    itemActions,
    getRowKey,
    itemHeaderRender,
    itemContentRender,
    onRowClick,
    onMultipleSelect,
    noPaging,
    totalPages,
    totalCount,
    onPaginationChange,
  } = props;

  const [searchValue, setSearchValue] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [selecting, setSelecting] = useState<string | number>();
  const [multipleSelect, setMultipleSelect] = useState<T[]>([]);

  type T = typeof data[0];
  const filteredData: T[] = useMemo(() => {
    if (searchValue) {
      const result = data.filter((r) => {
        // eslint-disable-next-line
        const found = Object.values(r).find((v) =>
          // eslint-disable-next-line
          deburr(`${v}`).toLowerCase().includes(searchValue.toLowerCase()),
        );
        return found;
      });
      if (!noPaging) {
        setPageCount(Math.ceil((result || []).length / pageSize));
        return result.length > pageSize
          ? result.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
          : result;
      }
      return result;
    }
    if (!noPaging) {
      setPageCount(Math.ceil((totalCount || data.length) / pageSize));
      return data.length > pageSize
        ? data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
        : data;
    }
    return data;
    // eslint-disable-next-line
  }, [data, searchValue, noPaging, pageIndex, pageSize, totalCount]);

  // #region search
  const searchBar = useMemo(() => {
    if (search) {
      return (
        <StyledSearchBar
          size="small"
          onChange={(value: string) => {
            setSearchValue(value);
          }}
        />
      );
    }
    return null;
  }, [search, setSearchValue]);
  // #endregion

  // #region pagination
  const gotoPage = useCallback(
    (page: number): void => {
      setPageIndex(page);
      if (onPaginationChange) {
        onPaginationChange({ pageIndex: page, pageSize: pageSize || 10 });
      }
    },
    [pageSize, onPaginationChange],
  );
  const changePageSize = useCallback(
    (size: number): void => {
      setPageSize(size);
      if (onPaginationChange) {
        onPaginationChange({ pageIndex: pageIndex || 0, pageSize: size });
      }
    },
    [pageIndex, onPaginationChange],
  );
  const paginationNode = useMemo(
    () =>
      !noPaging && (
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={totalPages || pageCount}
          totalCount={totalPages ? 0 : totalCount || data.length}
          gotoPage={gotoPage}
          setPageSize={changePageSize}
        />
      ),
    [
      data,
      noPaging,
      pageIndex,
      pageSize,
      totalPages,
      pageCount,
      totalCount,
      gotoPage,
      changePageSize,
    ],
  );
  // #endregion

  // #region select & multiple select
  const multipleSelecting = useCallback(
    (d: T, b: boolean) => {
      const key = getRowKey(d);
      const selectedList = multipleSelect;
      if (b) {
        selectedList.push(d);
      } else {
        selectedList.filter((o) => getRowKey(o) !== key);
      }
      setMultipleSelect(selectedList);
      onMultipleSelect?.(selectedList);
      // eslint-disable-next-line
    }, [getRowKey, onMultipleSelect]);
  // #endregion

  return (
    <Wrapper>
      <Dimmer inverted active={loading}>
        <Loader />
      </Dimmer>

      {search && <StyledHeader as="h3">{title}</StyledHeader>}
      <FlexWrapper>
        {search && searchBar}
        {!search && <StyledHeader as="h3">{title}</StyledHeader>}
        {listActions?.map((action) => (
          <ListActionButton
            icon
            basic
            // eslint-disable-next-line
            search={`${search}`}
            key={`${action.title}-${action.color}`}
            title={action.title}
            color={action.color}
            content={action.icon}
            disabled={loading}
            onClick={action.onClick}
          />
        ))}
      </FlexWrapper>

      <BorderedList selection celled verticalAlign="middle">
        {filteredData.map((d) => (
          <ItemWrapper
            key={getRowKey(d)}
            active={selecting === getRowKey(d)}
            onClick={(): void => {
              onRowClick?.(d);
              if (toggle) {
                if (selecting === getRowKey(d)) {
                  setSelecting(undefined);
                } else {
                  setSelecting?.(getRowKey(d));
                }
              }
            }}
          >
            {selectable && (
              <CheckBoxWrapper floated="left">
                <RowCheckbox
                  checked={Boolean(
                    (selectedRows || []).find(
                      (o: T) => getRowKey(o) === getRowKey(d),
                    ),
                  )}
                  onChange={(b: boolean) => multipleSelecting(d, b)}
                />
              </CheckBoxWrapper>
            )}
            <List.Content>
              <List.Header>{itemHeaderRender(d)}</List.Header>
              {itemContentRender?.(d)}
            </List.Content>
            <ActionWrapper>
              {itemActions?.map((action) => {
                const hidden =
                  typeof action.hidden === 'function'
                    ? action.hidden(d)
                    : action?.hidden ?? false;
                return (
                  <IconButton
                    icon
                    basic
                    key={`${action.title}-${action.color}`}
                    color={action.color}
                    title={action.title}
                    content={action.icon}
                    disabled={loading}
                    hidden={hidden}
                    onClick={(e: MouseEvent): void => {
                      e.stopPropagation();
                      action.onClick(d);
                    }}
                  />
                );
              })}
            </ActionWrapper>
          </ItemWrapper>
        ))}
      </BorderedList>
      {paginationNode}
    </Wrapper>
  );
};

export default DataList;
