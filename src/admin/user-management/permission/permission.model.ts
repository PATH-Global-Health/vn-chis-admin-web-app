export interface Permission {
  id: string;
  name: string;
  description: string;
  // Permission UI
  code?: string;
  // Permission Resource
  method?: string;
  normalizedMethod?: string;
  url?: string;
  permissionType?: number;
  // Permission Data
  username?: string;
  provinceId?: string;
  indicatorId?: string;
  type?: number;
}

export interface PermissionCM {
  name?: string;
  description?: string;
  // Permission UI
  code?: string;
  function?: string;
  // Permision Resource
  url?: string;
  method?: string;
  permissionType?: number;
  // Permission Data
  username?: string;
  provinceId?: string;
  indicatorId?: string;
  type?: number;
}

export interface PermissionForSubjectCM {
  permission?: PermissionCM;
  holderId: string;
  isGroup?: boolean;
  isRole?: boolean;
  isUser?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
  isPermissionData?: boolean;
}

export interface PermissionForSubjectListCM {
  permissions?: PermissionCM[];
  holderId: string;
  isGroup?: boolean;
  isRole?: boolean;
  isUser?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
  isPermissionData?: boolean;
}

export interface PermissionForSubjectByIdListCM {
  ids: string[];
  holderId: string;
  isGroup?: boolean;
  isRole?: boolean;
  isUser?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
  isPermissionData?: boolean;
}
