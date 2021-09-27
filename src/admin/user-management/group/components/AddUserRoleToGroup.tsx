import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import { Modal, Form, Button } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import SearchBar from '@app/components/SearchBar';
import { useFetchApi, useDispatch, useSelector } from '@app/hooks';
import groupService from '@admin/user-management/group/group.service';
import { getUsers } from '@admin/user-management/user/user.slice';
import { getRoles } from '@admin/user-management/role/role.slice';

const StyledModalContent = styled(Modal.Content)`
  padding: 0.5rem 1rem !important;
`;
const StyledSearchBar = styled(SearchBar)`
  flex: 1 1 0%;
`;

interface Props {
  isRole?: boolean;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface UserOrRoleType {
  id: string;
  name: string;
  username: string;
  fullName: string;
  description: string;
}

const AddUserRoleToGroup: React.FC<Props> = (props) => {
  const { isRole, open, onClose, onRefresh } = props;
  const {
    selectedGroup,
    getUsersOfGroupLoading,
    getRolesOfGroupLoading,
  } = useSelector((state) => state.admin.userManagement.group);
  const { roleList, getRolesLoading } = useSelector(
    (state) => state.admin.userManagement.role,
  );
  const { user, getUsersLoading } = useSelector(
    (state) => state.admin.userManagement.user,
  );

  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();

  const { totalPages, data: userList } = user;
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>('');
  const [multipleSelect, setMultipleSelect] = useState<UserOrRoleType[]>([]);

  const data = useMemo(() => {
    if (isRole) {
      return roleList;
    }
    return userList;
  }, [isRole, roleList, userList]);

  const getData = useCallback(() => {
    if (isRole) {
      dispatch(getRoles());
    } else {
      dispatch(getUsers({ username: searchValue, pageIndex, pageSize }));
    }
  }, [isRole, searchValue, pageIndex, pageSize, dispatch]);
  const onSubmit = useCallback(async () => {
    if (selectedGroup && multipleSelect.length > 0) {
      try {
        await fetch(
          isRole
            ? groupService.addRolesToGroup(
                (multipleSelect || []).map((o) => o.id),
                selectedGroup.id,
              )
            : groupService.addUsersToGroup(
                (multipleSelect || []).map((o) => o.id),
                selectedGroup.id,
              ),
        );
        onClose();
        onRefresh();
        setMultipleSelect([]);
        // eslint-disable-next-line
      } catch (error) {
      }
    }
  }, [
    isRole,
    selectedGroup,
    multipleSelect,
    fetch,
    onClose,
    onRefresh,
    setMultipleSelect,
  ]);
  useEffect(getData, [getData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{`Thêm ${isRole ? 'vai trò' : 'người dùng'}`}</Modal.Header>
      <StyledModalContent>
        <Form
          loading={fetching || getUsersOfGroupLoading || getRolesOfGroupLoading}
        >
          {!isRole && (
            <StyledSearchBar
              size="small"
              onChange={(value) => setSearchValue(value)}
            />
          )}
          <DataList
            search={isRole}
            selectable
            data={data as UserOrRoleType[]}
            loading={getUsersLoading || getRolesLoading}
            totalCount={isRole ? undefined : totalPages * pageSize}
            onPaginationChange={(p) => {
              setPageIndex(p.pageIndex);
              setPageSize(p.pageSize);
            }}
            selectedRows={multipleSelect}
            onMultipleSelect={(d: UserOrRoleType[]) => {
              setMultipleSelect(d);
            }}
            getRowKey={(d): string => d.id}
            itemHeaderRender={(d): string => (isRole ? d.name : d.username)}
            itemContentRender={(d): string =>
              isRole ? d.description : d.fullName
            }
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

export default AddUserRoleToGroup;
