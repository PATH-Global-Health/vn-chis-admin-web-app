import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import AddGroupRoleModal from '@admin/user-management/user/components/AddGroupRoleToUserModal';
import AddPermissionUIToUserModal from '@admin/user-management/user/components/AddPermissionUIToUserModal';
import EditPermissionUIOfUserModal from '@admin/user-management/user/components/EditPermissionUIOfUserModal';
import AddPermissionResourceToUserModal from '@admin/user-management/user/components/AddPermissionResourceToUserModal';

import { useConfirm, useFetchApi, useDispatch, useSelector } from '@app/hooks';
import { Permission } from '@admin/user-management/permission/permission.model';
import {
  getGroupsOfUser,
  getRolesOfUser,
  getPermissionsUIOfUser,
  getPermissionsResourceOfUser,
} from '@admin/user-management/user/user.slice';

import groupService from '@admin/user-management/group/group.service';
import roleService from '@admin/user-management/role/role.service';
import permissionService from '@admin/user-management/permission/permission.service';
import { HolderType } from '@admin/user-management/utils/constants';
import { permissionUIList } from '@admin/user-management/utils/helpers';

interface Props {
  isGroup?: boolean;
  isRole?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
  isPermissionData?: boolean;
}
interface GroupRolePermission {
  id: string;
  name: string;
  description: string;
  username?: string;
  fullName?: string;
  // Permission UI
  code?: string;
  // Permision API
  url?: string;
  method?: string;
  permissionType?: number;
  // Permission Data
  provinceId?: string;
  indicatorId?: string;
  type?: number;
}

const GroupRolePermissionOfUser: React.FC<Props> = (props) => {
  const {
    isGroup = false,
    isRole = false,
    isPermissionUI = false,
    isPermissionResource = false,
  } = props;

  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();

  const {
    selectedUser,
    getUsersLoading,
    groupsOfUserList,
    getGroupsOfUserLoading,
    rolesOfUserList,
    getRolesOfUserLoading,
    permissionUIOfUserList,
    getPermissionUIOfUserLoading,
    permissionsResourceOfUserList,
    getPermissionResourceOfUserLoading,
  } = useSelector((state) => state.admin.userManagement.user);

  const [addGroupRoleModal, setAddGroupRoleModal] = useState(false);
  const [addPermissionModal, setAddPermissionModal] = useState(false);
  // eslint-disable-next-line
  const [editPermissionUIModal, setEditPermssionUIModal] = 
    useState<Permission | undefined>(undefined);

  const getData = useCallback(() => {
    if (selectedUser) {
      if (isGroup) {
        dispatch(getGroupsOfUser(selectedUser.id));
      }
      if (isRole) {
        dispatch(getRolesOfUser(selectedUser.id));
      }
      if (isPermissionUI) {
        dispatch(getPermissionsUIOfUser(selectedUser.id));
      }
      if (isPermissionResource) {
        dispatch(getPermissionsResourceOfUser(selectedUser.id));
      }
    }
  }, [
    dispatch,
    selectedUser,
    isGroup,
    isRole,
    isPermissionUI,
    isPermissionResource,
  ]);
  const handleRemove = async (row: GroupRolePermission) => {
    if (selectedUser) {
      if (isGroup) {
        // remove user from role
        await fetch(groupService.removeUserToGroup(selectedUser.id, row.id));
      }
      if (isRole) {
        // remove user from role
        await fetch(roleService.removeUserToRole(selectedUser.id, row.id));
      }
      if (isPermissionUI) {
        // remove permission ui from user
        const permission = permissionUIList.find((p) =>
          (row?.code ?? '').includes(p.code),
        );
        if (permission) {
          if (permission.types.length > 0) {
            const deletePromises = (permissionUIOfUserList || [])
              .filter((p) => (p?.code ?? '').includes(permission.code))
              .map((p) => {
                return fetch(
                  permissionService.deletePermission(
                    p.id,
                    selectedUser.id,
                    HolderType.USER,
                    true,
                    false,
                  ),
                );
              });
            await Promise.all(deletePromises);
          } else {
            // eslint-disable-next-line
            const _permission = (permissionUIOfUserList || []).find((p) =>
              (p?.code ?? '').includes(permission.code),
            );
            if (_permission?.id) {
              await fetch(
                permissionService.deletePermission(
                  _permission.id,
                  selectedUser.id,
                  HolderType.USER,
                  true,
                  false,
                ),
              );
            }
          }
        }
      }
      if (isPermissionResource) {
        // remove permission resource from user
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedUser.id,
            HolderType.USER,
            false,
            true,
          ),
        );
      }
      getData();
    }
  };

  const title = useMemo(() => {
    if (selectedUser) {
      if (isGroup) {
        return `Nhóm của ${selectedUser.fullName}`;
      }
      if (isRole) {
        return `Vai trò của ${selectedUser.fullName}`;
      }
    }
    return '';
  }, [isGroup, isRole, selectedUser]);
  const data = useMemo(() => {
    if (isGroup) {
      return groupsOfUserList;
    }
    if (isRole) {
      return rolesOfUserList;
    }
    if (isPermissionUI) {
      return permissionUIOfUserList.reduce<Permission[]>(
        (array, permission) => {
          const permissionCode = permissionUIList.find((p) =>
            (permission?.code ?? '').includes(p.code),
          );
          if (
            array.find((p) =>
              (p?.code ?? '').includes(permissionCode?.code ?? ''),
            )
          ) {
            return array;
          }
          return [...array, permission];
        },
        [],
      );
    }
    if (isPermissionResource) {
      return permissionsResourceOfUserList;
    }
    return [];
  }, [
    isGroup,
    isRole,
    isPermissionUI,
    isPermissionResource,
    groupsOfUserList,
    rolesOfUserList,
    permissionUIOfUserList,
    permissionsResourceOfUserList,
  ]);

  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        title={title}
        data={data as GroupRolePermission[]}
        loading={
          fetching ||
          getUsersLoading ||
          getGroupsOfUserLoading ||
          getRolesOfUserLoading ||
          getPermissionUIOfUserLoading ||
          getPermissionResourceOfUserLoading
        }
        listActions={[
          {
            title: 'Thêm',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              if (isGroup || isRole) {
                setAddGroupRoleModal(true);
              } else {
                setAddPermissionModal(true);
              }
            },
          },
        ]}
        itemActions={[
          {
            title: 'Xoá',
            color: 'red',
            icon: <FiTrash2 />,
            onClick: (row) => confirm('Xác nhận xóa?', () => handleRemove(row)),
          },
          {
            title: 'Sửa',
            color: 'violet',
            icon: <FiEdit2 />,
            hidden: isGroup || isRole || isPermissionResource,
            onClick: (row): void => setEditPermssionUIModal(row),
          },
        ]}
        getRowKey={(d): string => d.id ?? uuidv4()}
        itemHeaderRender={(d): string => d?.name}
        itemContentRender={(d): string =>
          // eslint-disable-next-line
          isGroup || isRole
            ? d?.description ?? ''
            : isPermissionResource
            ? `${d?.method ?? ''} - ${d?.url ?? ''}`
            : ''
        }
      />

      <AddGroupRoleModal
        open={addGroupRoleModal}
        isGroup={isGroup}
        isRole={isRole}
        onRefresh={getData}
        onClose={(): void => setAddGroupRoleModal(false)}
      />

      <AddPermissionUIToUserModal
        open={addPermissionModal && (isPermissionUI || false)}
        onClose={(): void => setAddPermissionModal(false)}
        onRefresh={getData}
      />

      <EditPermissionUIOfUserModal
        data={editPermissionUIModal}
        onClose={(): void => setEditPermssionUIModal(undefined)}
        onRefresh={getData}
      />
      <AddPermissionResourceToUserModal
        open={addPermissionModal && (isPermissionResource || false)}
        onClose={(): void => setAddPermissionModal(false)}
        onRefresh={getData}
      />
    </>
  );
};

export default GroupRolePermissionOfUser;
