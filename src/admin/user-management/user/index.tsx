import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

import { FiPlus, FiPocket, FiKey } from 'react-icons/fi';
import { Grid, Tab, Label } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import SearchBar from '@app/components/SearchBar';
import UserModal from '@admin/user-management/user/components/UserModal';
import CreateUnitWithUserModal from '@unit/components/CreateUnitWithUserModal';
import PermissionOfUser from '@admin/user-management/user/components/PermissionOfUser';
import GroupRolePermissionOfUser from '@admin/user-management/user/components/GroupRolePermissionOfUser';

import {
  useDispatch,
  useSelector,
  useConfirm,
  useFetchApi,
  useRefreshCallback,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { User } from '@admin/user-management/user/user.model';
import userService from '@admin/user-management/user/user.service';
import { getUsers, selectUser } from '@admin/user-management/user/user.slice';

const SearchBarWrapper = styled.div`
  padding-bottom: 6px;
`;
const StyledPane = styled(Tab.Pane)`
  padding-top: 0 !important;
`;

const panes = [
  {
    menuItem: 'Nhóm',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <GroupRolePermissionOfUser isGroup />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Vai trò',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <GroupRolePermissionOfUser isRole />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Phân quyền',
    render: (): JSX.Element => (
      <StyledPane attached={false}>
        <PermissionOfUser />
      </StyledPane>
    ),
  },
];

const UserPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const [userModal, setUserModal] = useState<boolean>(false);
  const [createUnitWithUserModal, setCreateUnitWithUserModal] = useState<User | undefined>(undefined);

  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();
  const { user, selectedUser, getUsersLoading } = useSelector(
    (state) => state.admin.userManagement.user,
  );

  const { data, totalPages } = user;

  const getData = useCallback(() => {
    dispatch(getUsers({ keyword: searchValue, pageIndex, pageSize }));
  }, [dispatch, searchValue, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  useRefreshCallback(
    GroupKey.ADMIN_USER_MANAGEMENT,
    ComponentKey.ADMIN_USER,
    getData,
  );

  return (
    <Grid>
      <Grid.Column width={selectedUser?.id ? 8 : 16}>
        <SearchBarWrapper>
          <SearchBar
            size="small"
            onChange={(value) => {
              setSearchValue(value);
            }}
          />
        </SearchBarWrapper>
        <DataList
          toggle
          title="Danh sách người dùng"
          data={data}
          loading={fetching || getUsersLoading}
          totalPages={totalPages}
          onPaginationChange={(p): void => {
            setPageIndex(p.pageIndex);
            setPageSize(p.pageSize);
          }}
          listActions={[
            {
              title: 'Tạo người dùng',
              color: 'green',
              icon: <FiPlus />,
              onClick: (): void => setUserModal(true),
            },
          ]}
          itemActions={[
            {
              title: 'Gán cơ sở',
              color: 'purple',
              icon: <FiPocket />,
              onClick: (row): void => setCreateUnitWithUserModal(row),
            },
            {
              title: 'Đổi mật khẩu',
              color: 'yellow',
              icon: <FiKey />,
              onClick: (row): void => {
                confirm('Reset mật khẩu?', () => {
                  fetch(userService.resetPassword(row.username));
                });
              },
            },
          ]}
          onRowClick={(row: User): void => {
            if (selectedUser?.id === row?.id) {
              dispatch(selectUser(undefined));
            } else {
              dispatch(selectUser(row));
            }
          }}
          getRowKey={(d): string => d.id}
          itemHeaderRender={(d): JSX.Element => (
            <>
              {d.isElasticSynced && (
                <Label color="green" basic horizontal>
                  Đồng bộ
                </Label>
              )}
              {d.username}
            </>
          )}
          itemContentRender={
            (d): string => (d?.email ? `Email: ${d.email}` : '')
          }
        />
      </Grid.Column>
      {selectedUser?.id && (
        <Grid.Column width={8}>
          <Tab
            panes={panes}
            renderActiveOnly
            menu={{ secondary: true, pointing: true }}
          />
        </Grid.Column>
      )}

      <UserModal
        open={userModal}
        onClose={(): void => setUserModal(false)}
        onRefresh={getData}
      />
      <CreateUnitWithUserModal
        data={createUnitWithUserModal}
        onClose={(): void => setCreateUnitWithUserModal(undefined)}
      />
    </Grid>
  );
};

export default UserPage;
