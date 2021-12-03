import { httpClient, apiLinks } from '@app/utils';
import { HolderType } from '@admin/user-management/utils/constants';
import {
  Permission,
  PermissionCM,
  PermissionForSubjectCM,
  PermissionForSubjectListCM,
  PermissionForSubjectByIdListCM
} from '@admin/user-management/permission/permission.model';

interface ExtendPermissionCM {
  permission: PermissionCM;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
  isPermissionData?: boolean;
}

interface ExtendPermissionListCM {
  permissions: PermissionCM[];
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
  isPermissionData?: boolean;
}


const getPermissionsUI = async (): Promise<Permission[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.permission.get}/Ui`,
    });
    return result.data as Permission[];
  } catch (error) {
    return [];
  }
};

const getPermissionsResource = async (): Promise<Permission[]> => {
  try {
    const result = await httpClient.get({
      url: `${apiLinks.admin.userManagement.permission.get}/Resource`,
    });
    return result.data as Permission[];
  } catch (error) {
    return [];
  }
};

const createPermission = async ({
  permission,
  isPermissionUI = false,
  isPermissionResource = false,
  isPermissionData = false,
}: ExtendPermissionCM): Promise<void> => {
  let url = apiLinks.admin.userManagement.permission.create;
  let data = permission;
  if (isPermissionUI) {
    url += '/Ui';
    data = permission;
  }
  if (isPermissionResource) {
    url += '/Resource';
  }
  await httpClient.post({
    url,
    data,
  });
};

const createPermissionList = async ({
  permissions,
  isPermissionUI = false,
  isPermissionResource = false,
  isPermissionData = false,
}: ExtendPermissionListCM): Promise<void> => {
  let url = apiLinks.admin.userManagement.permission.create;
  let data = permissions;
  if (isPermissionUI) {
    url += '/Ui/Batch';
  }
  if (isPermissionResource) {
    url += '/Resource/Batch';
  }
  await httpClient.put({
    url,
    data,
  });
};

const createPermissionForSubject = async ({
  permission,
  holderId = '',
  isGroup = false,
  isRole = false,
  isUser = false,
  isPermissionUI = false,
  isPermissionResource = false,
}: PermissionForSubjectCM): Promise<void> => {
  let url = apiLinks.admin.userManagement.permission.create;
  let data = {};
  let holderType = 0;
  if (isGroup) {
    holderType = HolderType.GROUP;
  }
  if (isRole) {
    holderType = HolderType.ROLE;
  }
  if (isUser) {
    holderType = HolderType.USER;
  }
  if (isPermissionUI) {
    url += '/Ui';
    data = {
      permission,
      holderId,
      holderType,
    };
  }
  if (isPermissionResource) {
    url += '/Resource';
    data = {
      permission,
      holderId,
      holderType,
    };
  }
  await httpClient.post({
    url,
    data,
  });
};

const createPermissionForSubjectList = async ({
  permissions,
  holderId = '',
  isGroup = false,
  isRole = false,
  isUser = false,
  isPermissionUI = false,
  isPermissionResource = false,
}: PermissionForSubjectListCM): Promise<void> => {
  let url = apiLinks.admin.userManagement.permission.create;
  let data = {};
  let holderType = 0;
  if (isGroup) {
    holderType = HolderType.GROUP;
  }
  if (isRole) {
    holderType = HolderType.ROLE;
  }
  if (isUser) {
    holderType = HolderType.USER;
  }
  if (isPermissionUI) {
    url += '/Ui/Batch';
    data = {
      permissions,
      holderId,
      holderType,
    };
  }
  if (isPermissionResource) {
    url += '/Resource/Batch';
    data = {
      permissions,
      holderId,
      holderType,
    };
  }
  await httpClient.post({
    url,
    data,
  });
};

const createPermissionForSubjectByIdList = async ({
  ids,
  holderId = '',
  isGroup = false,
  isRole = false,
  isUser = false,
  isPermissionUI = false,
  isPermissionResource = false,
}: PermissionForSubjectByIdListCM): Promise<void> => {
  let url = apiLinks.admin.userManagement.permission.create;
  let data = {};
  let holderType = 0;
  if (isGroup) {
    holderType = HolderType.GROUP;
  }
  if (isRole) {
    holderType = HolderType.ROLE;
  }
  if (isUser) {
    holderType = HolderType.USER;
  }
  if (isPermissionUI) {
    url += '/Ui/BatchIds';
    data = {
      ids,
      holderId,
      holderType,
    };
  }
  if (isPermissionResource) {
    url += '/Resource/BatchIds';
    data = {
      ids,
      holderId,
      holderType,
    };
  }
  await httpClient.post({
    url,
    data,
  });
};

const deletePermission = async (
  id: string,
  holderId: string,
  holderType: number,
  isPermissionUI: boolean,
  isPermissionResource: boolean,
): Promise<void> => {
  let url = apiLinks.admin.userManagement.permission.delete;
  if (isPermissionUI) {
    url += `/Ui/${id}`;
  }
  if (isPermissionResource) {
    url += `/Resource/${id}`;
  }
  await httpClient.delete({
    url,
    params: { holderId, holderType },
  });
};


const permissionService = {
  getPermissionsUI,
  getPermissionsResource,
  createPermission,
  createPermissionList,
  createPermissionForSubject,
  createPermissionForSubjectList,
  createPermissionForSubjectByIdList,
  deletePermission,
};

export default permissionService;