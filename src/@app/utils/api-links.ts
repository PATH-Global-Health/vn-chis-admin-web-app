// const isDev = process.env.NODE_ENV === 'development';
const gatewayUrl = 'https://api.chis.vn/v1';

const authUrl = `${gatewayUrl}/auth`;
const unitUrl = `${gatewayUrl}/schedule`;
const postUrl = `${gatewayUrl}/mini-cms`;
const pqmUrl =
  process.env?.REACT_APP_PQM_ENDPOINT ?? 'https://pqm-core.hcdc.vn';

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
        changePassword: `${authUrl}/Users/ChangePassword`,
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
    getPermission: `${authUrl}/Users/Permissions/Ui`,
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
    answer: {
      get: `${postUrl}/api/Answer`,
      create: `${postUrl}/api/Answer`,
      update: `${postUrl}/api/Answer`,
      delete: `${postUrl}/api/Answer`,
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
  pqm: {
    category: {
      categoryAlias: {
        get: `${pqmUrl}/api/CategoryAliases`,
        getAliasesOfCategory: (categoryId: string): string =>
          `${pqmUrl}/api/CategoryAliases${
            categoryId ? `?categoryId=${categoryId}` : ''
          }`,
        create: `${pqmUrl}/api/CategoryAliases/`,
        update: `${pqmUrl}/api/CategoryAliases/`,
        delete: `${pqmUrl}/api/CategoryAliases/`,
      },
      indicator: {
        get: `${pqmUrl}/api/Indicators`,
        create: `${pqmUrl}/api/Indicators/`,
        update: `${pqmUrl}/api/Indicators/`,
        delete: `${pqmUrl}/api/Indicators/`,
      },
      indicatorGroup: {
        get: `${pqmUrl}/api/IndicatorGroups`,
        create: `${pqmUrl}/api/IndicatorGroups/`,
        update: `${pqmUrl}/api/IndicatorGroups/`,
        delete: `${pqmUrl}/api/IndicatorGroups/`,
      },
      gender: {
        get: `${pqmUrl}/api/Genders/`,
        create: `${pqmUrl}/api/Genders/`,
        update: `${pqmUrl}/api/Genders/`,
        delete: `${pqmUrl}/api/Genders/`,
      },
      ageGroup: {
        get: `${pqmUrl}/api/AgeGroups/`,
        create: `${pqmUrl}/api/AgeGroups/`,
        update: `${pqmUrl}/api/AgeGroups/`,
        delete: `${pqmUrl}/api/AgeGroups/`,
      },
      keyPopulation: {
        get: `${pqmUrl}/api/KeyPopulations/`,
        create: `${pqmUrl}/api/KeyPopulations/`,
        update: `${pqmUrl}/api/KeyPopulations/`,
        delete: `${pqmUrl}/api/KeyPopulations/`,
      },
      siteType: {
        get: `${pqmUrl}/api/SiteTypes`,
        create: `${pqmUrl}/api/SiteTypes/`,
        update: `${pqmUrl}/api/SiteTypes/`,
        delete: `${pqmUrl}/api/SiteTypes/`,
      },
      province: {
        get: `${pqmUrl}/api/Locations/Provinces/`,
        create: `${pqmUrl}/api/Locations/Provinces/`,
        update: `${pqmUrl}/api/Locations/Provinces/`,
        delete: `${pqmUrl}/api/Locations/Provinces/`,
      },
      district: {
        get: (code: string): string =>
          `${pqmUrl}/api/Locations/Districts?provinceCode=${code}`,
        create: `${pqmUrl}/api/Locations/Districts/`,
        update: `${pqmUrl}/api/Locations/Districts/`,
        delete: `${pqmUrl}/api/Locations/Districts/`,
      },
      site: {
        get: (districtId: string): string =>
          `${pqmUrl}/api/Locations/Sites?districtId=${districtId}`,
        getByCode: (
          pageIndex = 0,
          pageSize = 10,
          siteTypeId = '',
          provinceCode = '',
          districtCode = '',
        ): string =>
          `${pqmUrl}/api/Locations/Sites/ByCode?pageIndex=${pageIndex}&pageSize=${pageSize}&siteTypeId=${siteTypeId}&provinceCode=${provinceCode}&districtCode=${districtCode}`,
        create: `${pqmUrl}/api/Locations/Sites/`,
        update: `${pqmUrl}/api/Locations/Sites/`,
        delete: `${pqmUrl}/api/Locations/Sites/`,
      },
    },
    aggregatedValue: {
      get: `${pqmUrl}/api/AggregatedValues`,
      create: `${pqmUrl}/api/AggregatedValues/`,
      update: `${pqmUrl}/api/AggregatedValues/`,
      delete: `${pqmUrl}/api/AggregatedValues/`,
      upload: `${pqmUrl}/api/AggregatedValues/ImportByExcel`,
      populateData: `${pqmUrl}/api/AggregatedValues/PopulateData?all=true&makeDeletion=true`,
      clearAllData: `${pqmUrl}/api/AggregatedValues/ClearAll`,
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
    errorLogging: {
      get: `${pqmUrl}/api/ErrorLoggings`,
    },
  },
  unit: {
    createUnitWithUser: (username: string): string => `${unitUrl}/Hospitals/HospitalByAdmin/${username}`,
    get: `${unitUrl}/Hospitals`,
    getLogo: `${unitUrl}/Hospitals/Logo`,
    updateLogo: `${unitUrl}/Hospitals/Logo`,
    create: `${unitUrl}/Hospitals/CreateOrganization`,
    update: `${unitUrl}/Hospitals`,
    delete: `${unitUrl}/Hospitals/`,
    setTesting: `${unitUrl}/Hospitals/SetTestingFacility`,
    setPrEP: `${unitUrl}/Hospitals/SetPrEPFacility`,
    setARV: `${unitUrl}/Hospitals/SetARTFacility`,
    unitTypes: `${unitUrl}/UnitTypes`,
    hospitals: `${unitUrl}/Hospitals/`,
    referHospitals: `${unitUrl}/Hospitals/FilterByFunctionFacility`,
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
