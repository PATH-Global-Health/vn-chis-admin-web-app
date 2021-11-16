// const url = window.location.href;
// const isDev =
//   url.indexOf('abcde') > -1 || process.env.NODE_ENV === 'development';

const authUrl = 'https://user-management.bakco.vn/api';
const unitUrl = 'https://schedule-management.bakco.vn/api';
const postUrl = 'https://mini-cms.bakco.vn';

const apiLinks = {
  admin: {
    userManagement: {
      user: {
        get: `${authUrl}/Users`,
        create: `${authUrl}/Users`,
        enable: (idUser: string): string => `${authUrl}/Users/${idUser}/Enable`,
        disable: (idUser: string): string =>
          `${authUrl}/Users/${idUser}/Disable`,
        sync: (idUser: string): string =>
          `${authUrl}/Users/${idUser}/Sync`,
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
  },
  authentication: {
    token: `${authUrl}/Users/Login`,
    userInfo: `${authUrl}/Users`,
  },
  news: {
    tag: {
      get: `${postUrl}/api/Tag`,
      create: `${postUrl}/api/Tag`,
      update: `${postUrl}/api/Tag`,
      delete: `${postUrl}/api/Tag`,
    },
    category: {
      get: `${postUrl}/api/Category`,
      create: `${postUrl}/api/Category`,
      update: `${postUrl}/api/Category`,
      delete: `${postUrl}/api/Category`,
    },
    part: {
      get: `${postUrl}/api/Part`,
      update: `${postUrl}/api/Part`,
      delete: `${postUrl}/api/Part`,
    },
    post: {
      get: `${postUrl}/api/Post`,
      create: `${postUrl}/api/Post`,
      update: `${postUrl}/api/Post`,
      delete: `${postUrl}/api/Post`,
      addParts: `${postUrl}/api/Post/Parts`,
    },
  },

  form: {
    question: {
      get: `${postUrl}/api/Question`,
      create: `${postUrl}/api/Question`,
      update: `${postUrl}/api/Question`,
      delete: `${postUrl}/api/Question`,
    },
    questionTemplateType: {
      get: `${postUrl}/api/QuestionTemplateType`,
      create: `${postUrl}/api/QuestionTemplateType`,
      update: `${postUrl}/api/QuestionTemplateType`,
      delete: `${postUrl}/api/QuestionTemplateType`,
    },
    questionTemplate: {
      get: `${postUrl}/api/QuestionTemplate/Filter`,
      create: `${postUrl}/api/QuestionTemplate`,
      update: `${postUrl}/api/QuestionTemplate`,
      delete: `${postUrl}/api/QuestionTemplate`,
      addQuestion: `${postUrl}/api/QuestionTemplate/Questions`,
      deleteQuestion: `${postUrl}/api/QuestionTemplate/Questions`,
      addSurveyResult: `${postUrl}/api/QuestionTemplate/SurveyResult`,
      deleteSurveyResult: `${postUrl}/api/QuestionTemplate/SurveyResult`
    },
  },

  unit: {
    createUnitWithUser: (username: string): string => `${unitUrl}/Hospitals/HospitalByAdmin/${username}`,
  },
  service: {
    get: `${unitUrl}/Services`,
    create: `${unitUrl}/Services`,
    update: `${unitUrl}/Services`,
    delete: `${unitUrl}/Services`,
  },
  serviceType: {
    get: `${unitUrl}/ServiceTypes`,
    create: `${unitUrl}/ServiceTypes`,
    update: `${unitUrl}/ServiceTypes`,
    delete: `${unitUrl}/ServiceTypes`,
  },
  unitType: {
    get: `${unitUrl}/UnitTypes`,
  }
};

export default apiLinks;
