import { toast } from 'react-toastify';
import { httpClient, apiLinks } from '@app/utils';
import { getResponseError } from '@app/utils/helpers';

import { Permission } from '../permission/permission.model';
import { User } from '../user/user.model';
import { Role, RoleCM } from './role.model';
// import { Permission } from '../permission/permission.model';

const getRoles = async (): Promise<Role[]> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.admin.userManagement.role.get,
    });
    return result.data as Role[];
  } catch (error) {
    return [];
  }
};

const addUsersToRole = async (
  userIds: string[],
  roleId: string,
): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.admin.userManagement.role.addUser}/${roleId}/Users`,
    data: {
      userIds,
    },
  });
};

const removeUserToRole = async (
  userId: string,
  roleId: string,
): Promise<void> => {
  await httpClient.delete({
    url: `${apiLinks.admin.userManagement.role.removeUser}/${roleId}/Users/${userId}`,
  });
};

const createRole = async (data: RoleCM): Promise<void> => {
  try {
    await httpClient.post({
      url: apiLinks.admin.userManagement.role.create,
      data,
    });
    toast.success('Tạo thành công');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    toast.warn(getResponseError(error.response?.data));
  }
};

const updateRole = async (data: Role): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.admin.userManagement.role.update,
      data,
    });
    toast.success('Cập nhật thành công');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    toast.warn(getResponseError(error.response?.data));
  }
};

const deleteRole = async (id: string): Promise<void> => {
  try {
    await httpClient.delete({
      url: `${apiLinks.admin.userManagement.role.delete}/${id}`,
    });
    toast.success('Xoá thành công');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    toast.warn(getResponseError(error.response?.data));
  }
};

const getUsersOfRole = async (roleId: string): Promise<User[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.role.getUsers}/${roleId}/Users`,
    });
    return result.data as User[];
  } catch (error) {
    return [];
  }
};

const getPermissionsUIOfRole = async (
  permissionId: string,
): Promise<Permission[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.role.getPermissionsUI}/${permissionId}/Permissions/Ui`,
    });
    return result.data as Permission[];
  } catch (error) {
    return [];
  }
};

const getPermissionsResourceOfRole = async (
  permissionId: string,
): Promise<Permission[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.role.getPermissionsResource}/${permissionId}/Permissions/Resource`,
    });
    return result.data as Permission[];
  } catch (error) {
    return [];
  }
};

const addRoleToPermissionUI = async (
  roleId: string,
  permissionIds: string[],
): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.admin.userManagement.role.addPermissionsUI}/${roleId}/Permission/Ui`,
    data: {
      permissionIds,
    },
  });
};

const addRoleToPermissionResource = async (
  roleId: string,
  permissionIds: string[],
): Promise<void> => {
  await httpClient.put({
    url: `${apiLinks.admin.userManagement.role.addPermissionsResource}/${roleId}/Permission/Resource`,
    data: {
      permissionIds,
    },
  });
};

const roleService = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getUsersOfRole,
  getPermissionsUIOfRole,
  getPermissionsResourceOfRole,
  addUsersToRole,
  removeUserToRole,
  addRoleToPermissionUI,
  addRoleToPermissionResource,
};

export default roleService;