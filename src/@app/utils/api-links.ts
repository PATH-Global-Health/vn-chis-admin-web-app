// const url = window.location.href;
// const isDev =
//   url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development';

const authUrl = 'https://user-management.bakco.vn/api';
const unitUrl = 'http://202.78.227.174:30111/api';

const apiLinks = {
  admin: {
    userManagement: {
      user: {
        get: `${authUrl}/Users`,
        create: `${authUrl}/Users`,
        resetPassword: `${authUrl}/Users/Tools/ResetDefaultPassword`,
        getGroups: `${authUrl}/Users/Groups`,
        getRoles: `${authUrl}/Users/Roles`,
        getPermissionsUI: `${authUrl}/api/Users/Permissions/Ui`,
        getPermissionsResource: `${authUrl}/api/Users/Permissions/Resource`,
      },
      group: {
        get: `${authUrl}/Groups`,
        create: `${authUrl}/Groups`,
        update: `${authUrl}/Groups`,
        delete: `${authUrl}/Groups`,
        getUsers: `${authUrl}/Groups`,
        getRoles: `${authUrl}/Groups`,
        getPermissionsUI: `${authUrl}/Groups`,
        getPermissionsResource: `${authUrl}/Groups`,
        addUser: `${authUrl}/Groups`,
        removeUser: `${authUrl}/Groups`,
        addRoles: `${authUrl}/Groups`,
        removeRole: `${authUrl}/Groups`,
        addPermissionsUI: `${authUrl}/Groups`,
        addPermissionsResource: `${authUrl}/Groups`,
      },
      role: {
        get: `${authUrl}/Roles`,
        create: `${authUrl}/Roles`,
        update: `${authUrl}/Roles`,
        delete: `${authUrl}/Roles`,
        addUser: `${authUrl}/Roles`,
        removeUser: `${authUrl}/Roles`,
        addPermissionsUI: `${authUrl}/Roles`,
        addPermissionsResource: `${authUrl}/Roles`,
        getUsers: `${authUrl}/Roles`,
        getPermissionsUI: `${authUrl}/Roles`,
        getPermissionsResource: `${authUrl}/Roles`,
      },
      permission: {
        get: `${authUrl}/Permissions`,
        create: `${authUrl}/Permissions`,
        update: `${authUrl}/Permissions`,
        delete: `${authUrl}/Permissions`,
        addUser: `${authUrl}/Permissions`,
      },
    },
    moduleManagement: {
      get: `${authUrl}/Modules`,
      create: `${authUrl}/Modules`,
    },
  },
  authentication: {
    token: `${authUrl}/Users/Login`,
    userInfo: `${authUrl}/Users`,
  },
  unit: {
    createUnitWithUser: (username: string): string => `${unitUrl}/Hospitals/HospitalByAdmin/${username}`,
  },
  unitType: {
    get: `${unitUrl}/UnitTypes`,
  }
};

export default apiLinks;
