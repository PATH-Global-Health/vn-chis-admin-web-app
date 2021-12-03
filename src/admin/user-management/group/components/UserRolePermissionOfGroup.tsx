import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import naturalCompare from 'natural-compare';

import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Popup, Label, Icon } from 'semantic-ui-react';

import DataList from '@app/components/data-list';
import AddUserRoleToGroup from '@admin/user-management/group/components/AddUserRoleToGroup';
import AddPermissionUIToGroup from '@admin/user-management/group/components/AddPermissionUIToGroup';
import AddPermissionResourceToGroup from '@admin/user-management/group/components/AddPermissionResourceToGroup';

import { useConfirm, useDispatch, useFetchApi, useSelector } from '@app/hooks';
import { Permission } from '@admin/user-management/permission/permission.model';
import { getRoles } from '@admin/user-management/role/role.slice';
import {
  getUsersOfGroup,
  getRolesOfGroup,
  getPermissionsUIOfGroup,
  getPermissionsResourceOfGroup,
} from '@admin/user-management/group/group.slice';
import groupService from '@admin/user-management/group/group.service';
import permissionService from '@admin/user-management/permission/permission.service';
import { HolderType, PermissionType } from '@admin/user-management/utils/constants';
import { permissionUIList, permissionTypeColorList } from '@admin/user-management/utils/helpers';

interface Props {
  isUser?: boolean;
  isRole?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}
interface UserOrRoleType {
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
}
const UserRolePermissionOfGroup: React.FC<Props> = (props) => {
  const { isUser, isRole, isPermissionUI, isPermissionResource } = props;
  const [addUserRoleModal, setAddUserRoleModal] = useState(false);
  const [addPermissionModal, setAddPermissionModal] = useState(false);
  // eslint-disable-next-line
  const [editPermissionUIModal, setEditPermssionUIModal] = 
    useState<Permission | undefined>(undefined);

  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const {
    selectedGroup,
    roleOfGroupList,
    userOfGroupList,
    permissionUIOfGroupList,
    permissionResourceOfGroupList,
    getRolesOfGroupLoading,
    getUsersOfGroupLoading,
    getPermissionUIOfGroupLoading,
    getPermissionsResourceOfGroupLoading,
  } = useSelector((state) => state.admin.userManagement.group);

  const title = useMemo(() => {
    if (selectedGroup) {
      if (isUser) {
        return `Người dùng của ${selectedGroup.name}`;
      }
      if (isRole) {
        return `Vai trò của ${selectedGroup.name}`;
      }
      if (isPermissionUI) {
        return `Quyền UI của ${selectedGroup.name}`;
      }
      if (isPermissionResource) {
        return `Quyền Resource của ${selectedGroup.name}`;
      }
    }
    return '';
  }, [selectedGroup, isUser, isRole, isPermissionUI, isPermissionResource]);

  const data = useMemo(() => {
    if (isUser) {
      return userOfGroupList;
    }
    if (isRole) {
      return roleOfGroupList;
    }
    if (isPermissionUI) {
      return permissionUIOfGroupList.reduce<Permission[]>(
        (array, permission) => {
          const permissionCode = permissionUIList.find((p) =>
            permission?.code && permission.code === p.code,
          );
          if (array.find((p) =>
              p?.code && permissionCode?.code && p.code === permissionCode.code,
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
      return permissionResourceOfGroupList;
    }
    return [];
  }, [
    userOfGroupList,
    roleOfGroupList,
    permissionUIOfGroupList,
    permissionResourceOfGroupList,
    isPermissionUI,
    isPermissionResource,
    isRole,
    isUser,
  ]);

  const handleRemove = async (row: UserOrRoleType) => {
    if (selectedGroup) {
      if (isUser) {
        // remove user from group
        await fetch(groupService.removeUserToGroup(row.id, selectedGroup.id));
      }
      if (isRole) {
        // remove role from group
        await fetch(groupService.removeRoleToGroup(row.id, selectedGroup.id));
      }
      if (isPermissionUI) {
        // remove permission UI from role
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedGroup.id,
            HolderType.GROUP,
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
            selectedGroup.id,
            HolderType.GROUP,
            false,
            true,
          ),
        );
      }
    }
  };

  const sortByAlphabet = (d: UserOrRoleType[]): UserOrRoleType[] => {
    const result = d.slice(0);
    return result.sort((a: UserOrRoleType, b: UserOrRoleType) =>
      naturalCompare(a.name, b.name),
    );
  };

  const getData = useCallback(() => {
    if (selectedGroup) {
      if (isUser) {
        dispatch(getUsersOfGroup(selectedGroup.id));
      }
      if (isRole) {
        dispatch(getRoles());
        dispatch(getRolesOfGroup(selectedGroup.id));
      }
      if (isPermissionUI) {
        dispatch(getPermissionsUIOfGroup(selectedGroup.id));
      }
      if (isPermissionResource) {
        dispatch(getPermissionsResourceOfGroup(selectedGroup.id));
      }
    }
  }, [
    isUser,
    isRole,
    isPermissionUI,
    isPermissionResource,
    selectedGroup,
    dispatch,
  ]);
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        title={title}
        data={sortByAlphabet(data as UserOrRoleType[])}
        loading={
          fetching ||
          getUsersOfGroupLoading ||
          getRolesOfGroupLoading ||
          getPermissionUIOfGroupLoading ||
          getPermissionsResourceOfGroupLoading
        }
        listActions={[
          {
            title: 'Thêm',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              if (isUser || isRole) {
                setAddUserRoleModal(true);
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
            onClick: (row) => confirm('Xác nhận xóa?', () => {
              handleRemove(row);
              getData();
            }),
          }
        ]}
        getRowKey={(d): string => d.id}
        itemHeaderRender={(d): JSX.Element => {
          if (isUser) {
            return (
              <>
                {d?.username ?? ''}
              </>
            );
          }
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
          : !isUser && !isPermissionResource
            ? (d?.description ?? '')
            : ''
        }
      />

      <AddUserRoleToGroup
        isRole={isRole}
        open={addUserRoleModal}
        onRefresh={getData}
        onClose={(): void => setAddUserRoleModal(false)}
      />

      <AddPermissionUIToGroup
        open={addPermissionModal && (isPermissionUI || false)}
        onClose={(): void => setAddPermissionModal(false)}
        onRefresh={getData}
      />

      <AddPermissionResourceToGroup
        open={addPermissionModal && (isPermissionResource || false)}
        onClose={(): void => setAddPermissionModal(false)}
        onRefresh={getData}
      />
    </>
  );
};

export default UserRolePermissionOfGroup;
