import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { Modal, Form, Button } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import SearchBar from '@app/components/SearchBar';
import { useFetchApi, useDispatch, useSelector } from '@app/hooks';
import roleService from '@admin/user-management/role/role.service';
import { getUsers } from '@admin/user-management/user/user.slice';

const StyledModalContent = styled(Modal.Content)`
  padding: 0.5rem 1rem !important;
`;
const StyledSearchBar = styled(SearchBar)`
  flex: 1 1 0%;
`;

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface UserOrRoleType {
  id: string;
  username: string;
  fullName: string;
}

const AddUserToRoleModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;
  const { selectedRole, getUserOfRoleLoading } = useSelector(
    (state) => state.admin.userManagement.role,
  );
  const { user, getUsersLoading } = useSelector(
    (state) => state.admin.userManagement.user,
  );

  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();

  const { totalPages: totalCount, data } = user;
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>('');
  const [multipleSelect, setMultipleSelect] = useState<UserOrRoleType[]>([]);

  const getData = useCallback(() => {
    dispatch(getUsers({ keyword: searchValue, pageIndex, pageSize }));
  }, [searchValue, pageIndex, pageSize, dispatch]);
  const onSubmit = useCallback(async () => {
    if (selectedRole && multipleSelect.length > 0) {
      try {
        await fetch(
          roleService.addUsersToRole(
            (multipleSelect || []).map((o) => o.id),
            selectedRole.id,
          ),
        );
        onClose();
        onRefresh();
        setMultipleSelect([]);
        // eslint-disable-next-line
      } catch (error) { }
    }
  }, [
    selectedRole,
    multipleSelect,
    fetch,
    onClose,
    onRefresh,
    setMultipleSelect,
  ]);
  useEffect(getData, [getData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Thêm người dùng</Modal.Header>
      <StyledModalContent>
        <Form loading={fetching || getUserOfRoleLoading}>
          <StyledSearchBar
            size="small"
            onChange={(value) => setSearchValue(value)}
          />
          <DataList
            selectable
            data={data as UserOrRoleType[]}
            loading={getUsersLoading}
            totalCount={totalCount}
            onPaginationChange={(p) => {
              setPageIndex(p.pageIndex);
              setPageSize(p.pageSize);
            }}
            selectedRows={multipleSelect}
            onMultipleSelect={(d: UserOrRoleType[]) => {
              setMultipleSelect(d);
            }}
            getRowKey={(d): string => d.id}
            itemHeaderRender={(d): string => d.username}
            itemContentRender={(d): string => d.fullName}
          />
          <Button
            primary
            content="Xác nhận"
            onClick={() => {
              onSubmit();
            }}
          />
        </Form>
      </StyledModalContent>
    </Modal>
  );
};

export default AddUserToRoleModal;
