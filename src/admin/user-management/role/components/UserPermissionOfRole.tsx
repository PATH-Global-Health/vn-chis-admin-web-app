/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Popup, Label, Icon } from 'semantic-ui-react';

import DataList from '@app/components/data-list';
import AddUserToRole from '@admin/user-management/role/components/AddUserToRole';
import AddPermissionUIToRoleModal from '@admin/user-management/role/components/AddPermissionUIToRoleModal';
import AddPermissionResourceToRoleModal from '@admin/user-management/role/components/AddPermissionResourceToRoleModal';

import {
  useConfirm,
  useDispatch,
  useFetchApi,
  useSelector
} from '@app/hooks';
import {
  getUsersOfRole,
  getPermissionsUIOfRole,
  getPermissionsResourceOfRole,
} from '@admin/user-management/role/role.slice';
import roleService from '@admin/user-management/role/role.service';
import permissionService from '@admin/user-management/permission/permission.service';
import { HolderType, PermissionType } from '@admin/user-management/utils/constants';
import { permissionTypeColorList } from '@admin/user-management/utils/helpers';

interface Props {
  isUser?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}
interface UserOrPermissionType {
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

const UserPermissionOfRole: React.FC<Props> = (props) => {
  const { isUser, isPermissionUI, isPermissionResource } = props;

  const [addUserModal, setAddUserModal] = useState(false);
  const [addPermissionModal, setAddPermissionModal] = useState(false);

  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();

  const {
    selectedRole,
    getRolesLoading,
    userOfRoleList,
    getUserOfRoleLoading,
    permissionUIOfRoleList,
    getPermissionUIOfRoleLoading,
    permissionResourceOfRoleList,
    getPermissionResourceOfRoleLoading,
  } = useSelector((state) => state.admin.userManagement.role);

  const title = useMemo(() => {
    if (selectedRole) {
      if (isUser) {
        return `Ng?????i d??ng c???a ${selectedRole.name}`;
      }
    }
    return '';
  }, [isUser, selectedRole]);
  const data = useMemo(() => {
    if (isUser) {
      return userOfRoleList;
    }
    if (isPermissionUI) {
      return permissionUIOfRoleList;
    }
    if (isPermissionResource) {
      return permissionResourceOfRoleList;
    }
    return [];
  }, [
    isUser,
    userOfRoleList,
    isPermissionUI,
    permissionUIOfRoleList,
    isPermissionResource,
    permissionResourceOfRoleList,
  ]);

  const handleRemove = async (row: UserOrPermissionType) => {
    if (selectedRole) {
      if (isUser) {
        // remove user from role
        await fetch(roleService.removeUserToRole(row.id, selectedRole.id));
      }
      if (isPermissionUI) {
        // remove permission UI from role
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedRole.id,
            HolderType.ROLE,
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
            selectedRole.id,
            HolderType.ROLE,
            false,
            true,
          ),
        );
      }
    }
  };

  const getData = useCallback(() => {
    if (selectedRole) {
      if (isUser) {
        dispatch(getUsersOfRole(selectedRole.id));
      }
      if (isPermissionUI) {
        dispatch(getPermissionsUIOfRole(selectedRole.id));
      }
      if (isPermissionResource) {
        dispatch(getPermissionsResourceOfRole(selectedRole.id));
      }
    }
  }, [isUser, isPermissionUI, isPermissionResource, selectedRole, dispatch]);
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        title={title}
        data={data as UserOrPermissionType[]}
        loading={
          fetching ||
          getRolesLoading ||
          getUserOfRoleLoading ||
          getPermissionUIOfRoleLoading ||
          getPermissionResourceOfRoleLoading
        }
        listActions={[
          {
            title: 'Th??m',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              if (isUser) {
                setAddUserModal(true);
              } else {
                setAddPermissionModal(true);
              }
            },
          },
        ]}
        itemActions={[
          {
            title: 'Xo??',
            color: 'red',
            icon: <FiTrash2 />,
            onClick: (row) => confirm('X??c nh???n x??a?', () => {
              handleRemove(row);
              getData();
            }),
          },
        ]}
        getRowKey={(d): string => d?.id ?? ''}
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
                  content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'T??? ch???i' : 'Cho ph??p'}
                  trigger={
                    <Label color={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'red' : 'green'} basic horizontal>
                      T???t c???
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
                    content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'T??? ch???i' : 'Cho ph??p'}
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
          ? `M?? ${d?.code ?? ''}`
          : !isUser && !isPermissionResource
            ? (d?.description ?? '')
            : ''
        }
      />
      <AddUserToRole
        open={addUserModal}
        onClose={() => setAddUserModal(false)}
        onRefresh={getData}
      />
      <AddPermissionUIToRoleModal
        open={addPermissionModal}
        onClose={() => setAddPermissionModal(false)}
        onRefresh={getData}
      />
      <AddPermissionResourceToRoleModal
        open={addPermissionModal && (isPermissionResource || false)}
        onClose={(): void => setAddPermissionModal(false)}
        onRefresh={getData}
      />
    </>
  );
};

export default UserPermissionOfRole;
