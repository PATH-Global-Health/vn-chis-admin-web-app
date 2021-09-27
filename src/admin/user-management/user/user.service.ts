import { httpClient, apiLinks } from '@app/utils';

import { Role } from '@admin/user-management/role/role.model';
import { Group } from '@admin/user-management/group/group.model';
import { Permission } from '@admin/user-management/permission/permission.model';
import { User, UserFilter, UserResponse, UserCM } from './user.model';

const getUsers = async (params: UserFilter): Promise<UserResponse> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.admin.userManagement.user.get,
      params,
    });
    if (Array.isArray && Array.isArray(result.data)) {
      return {
        data: result.data as User[],
        totalPages: result.data.length,
      };
    }
    return result.data as UserResponse;
  } catch (error) {
    return {
      data: [],
      totalPages: 0,
    };
  }
};

const getGroupsOfUser = async (userId: string): Promise<Group[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.user.get}/${userId}/Groups`,
    });
    return result.data as Group[];
  } catch (error) {
    return [];
  }
};

const getRolesOfUser = async (userId: string): Promise<Role[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.user.get}/${userId}/Roles`,
    });
    return result.data as Role[];
  } catch (error) {
    return [];
  }
};

const getPermissionsUIOfUser = async (
  userId: string,
): Promise<Permission[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.user.get}/${userId}/Permissions/Ui`,
    });
    return result.data as Permission[];
  } catch (error) {
    return [];
  }
};

const getPermissionsResourceOfUser = async (
  userId: string,
): Promise<Permission[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.user.get}/${userId}/Permissions/Resource`,
    });
    return result.data as Permission[];
  } catch (error) {
    return [];
  }
};

const createUser = async (data: UserCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.admin.userManagement.user.get,
    data: {
      ...data,
      securityQuestion: {
        id: '',
        answer: '',
      },
    },
  });
};

const resetPassword = async (username: string): Promise<void> => {
  try {
    await httpClient.get({
      url: apiLinks.admin.userManagement.user.resetPassword,
      params: {
        username,
      },
    });
    // eslint-disable-next-line
  } catch (error) {}
};

const userService = {
  getUsers,
  createUser,
  resetPassword,
  getGroupsOfUser,
  getRolesOfUser,
  getPermissionsUIOfUser,
  getPermissionsResourceOfUser,
};

export default userService;
