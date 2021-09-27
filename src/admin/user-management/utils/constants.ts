const HolderType = {
  USER: 0,
  ROLE: 1,
  GROUP: 2,
};

const PermissionType = {
  DENY: 0,
  ALLOW: 1,
};

const PermissionUIType = {
  READ_ONLY: 'READ_ONLY',
  EXECUTE: 'EXECUTE',
  CREATE_CHAIN: 'CREATE_CHAIN',
  EDIT_PROFILE_POSITIVE: 'EDIT_PROFILE_POSITIVE',
  CREATE_UNIT: 'CREATE_UNIT',
  WATTAGE_ALL_UNIT: 'WATTAGE_ALL_UNIT',
  CREATE_CODE: 'CREATE_CODE',
  PUBLISH_CODE: 'PUBLISH_CODE',
  CHANGE_PROFILE_BY_EXAM: 'CHANGE_PROFILE_BY_EXAM',
  UPDATE_EXAM_RESULT: 'UPDATE_EXAM_RESULT',
  EXPORT_ALL_EXAM: 'EXPORT_ALL_EXAM',
};

const PermissionDataType = {
  READ: 0,
  WRITE: 1,
};

const PermissionResourceType = {
  DENY: 0,
  ALLOW: 1,
};

export {
  HolderType,
  PermissionType,
  PermissionUIType,
  PermissionDataType,
  PermissionResourceType,
};
