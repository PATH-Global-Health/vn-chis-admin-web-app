import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import naturalCompare from 'natural-compare';
import { v4 as uuidv4 } from 'uuid';

import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Popup, Label, Icon } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import AddGroupRoleModal from '@admin/user-management/user/components/AddGroupRoleToUserModal';
import AddPermissionUIToUserModal from '@admin/user-management/user/components/AddPermissionUIToUserModal';
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
import { PermissionType } from '@admin/user-management/utils/constants';
import { permissionUIList, permissionTypeColorList } from '@admin/user-management/utils/helpers';

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
  // Permission Resource
  method?: string;
  normalizedMethod?: string;
  url?: string;
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

  const [addGroupRoleModal, setAddGroupRoleModal] = useState(false);
  const [addPermissionModal, setAddPermissionModal] = useState(false);

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
    getPermissionsResourceOfUserLoading,
  } = useSelector((state) => state.admin.userManagement.user);

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
            permission?.code && permission.code === p.code,
          );

          if (permissionCode?.code &&
            array.find((p) => p?.code && p.code === permissionCode.code)
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
        // remove permission UI from role
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedUser.id,
            HolderType.USER,
            true,
            false,
          ),
        );
      }
      if (isPermissionResource) {
        // remove permission Resource from role
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedUser.id,
            HolderType.GROUP,
            false,
            true,
          ),
        );
      }
      getData();
    }
  };

  const sortByAlphabet = (d: GroupRolePermission[]): GroupRolePermission[] => {
    const result = d.slice(0);
    return result.sort((a: GroupRolePermission, b: GroupRolePermission) =>
      naturalCompare(a.name, b.name),
    );
  };

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
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        title={title}
        data={sortByAlphabet(data as GroupRolePermission[])}
        loading={
          fetching ||
          getUsersLoading ||
          getGroupsOfUserLoading ||
          getRolesOfUserLoading ||
          getPermissionUIOfUserLoading ||
          getPermissionsResourceOfUserLoading
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
          }
        ]}
        getRowKey={(d): string => d.id ?? uuidv4()}
        itemHeaderRender={(d): JSX.Element => {
          if (isPermissionUI) {
            return (
              <>
                <Popup
                  size="mini"
                  inverted
                  position="top left"
                  content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'Từ chối' : 'Cho phép'}
                  trigger={
                    <Label color={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'red' : 'green'} basic horizontal>
                      Tất cả
                    </Label>
                  }
                />
                {d?.name ?? ''}
              </>
            );
          }
          if (isPermissionResource) {
            const permissionTypeColor = permissionTypeColorList.find((p) => d?.normalizedMethod && p.name.includes(d?.normalizedMethod ?? ''))
            return (
              <>
                {d?.normalizedMethod ? (
                  <Popup
                    size="mini"
                    inverted
                    position="top left"
                    content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'Từ chối' : 'Cho phép'}
                    trigger={
                      <Label color={(permissionTypeColor?.color ?? 'black') as SemanticCOLORS} basic horizontal>
                        <Icon name={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'x' : 'check'} /> 
                        {d?.normalizedMethod ?? ''}
                      </Label>
                    }
                  />
                ) : null}
     
                {d?.url ?? ''}
              </>
            )
          }
          return (
            <>
              {d?.name ?? ''}
            </>
          );
        }}
        itemContentRender={(d): string =>
          isPermissionUI
          ? `Mã ${d?.code ?? ''}`
          : !isPermissionResource
            ? (d?.description ?? '')
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

      <AddPermissionResourceToUserModal
        open={addPermissionModal && (isPermissionResource || false)}
        onClose={(): void => setAddPermissionModal(false)}
        onRefresh={getData}
      />
    </>
  );
};

export default GroupRolePermissionOfUser;
