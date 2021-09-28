import { deburr } from '@app/utils/helpers';
import {
  PermissionType,
  PermissionUIType,
  PermissionDataType,
} from './constants';

interface Option {
  value: string;
  text: string;
}

const methodList = [
  { value: 'GET', text: 'GET', color: 'blue' },
  { value: 'POST', text: 'POST', color: 'green' },
  { value: 'PUT', text: 'PUT', color: 'yellow' },
  { value: 'DELETE', text: 'DELETE', color: 'red' },
];

const permissionUIList = [
  {
    name: 'Facility - Khách hàng',
    code: 'CSYT_CUSTOMER',
    types: [],
  },
  {
    name: 'Facility - Danh mục', 
    code: 'CSYT_CATALOG',
    types: [],
  },
  {
    name: 'Facility - Lịch làm việc',
    code: 'CSYT_WORKING_SCHEDULE',
    types: [],
  },
  {
    name: 'Facility - Lịch hẹn (Tư vấn/Xét nghiệm)',
    code: 'CSYT_EXAMINATION',
    types: [],
  },
  {
    name: 'Facility - Thống kê',
    code: 'CSYT_EXAMINATION_STATISTIC',
    types: [],
  },
];

const permissionTypeList = [
  { value: PermissionType.ALLOW, text: 'Cho phép' },
  { value: PermissionType.DENY, text: 'Từ chối' },
];

const permissionUITypeList = [
  { value: PermissionUIType.ALL, text: 'Tất cả' },
];

const permissionDataTypeList = [
  { value: PermissionDataType.READ, text: 'Đọc' },
  { value: PermissionDataType.WRITE, text: 'Ghi' },
];

const searchWithDeburr = (options: Option[], query: string): Option[] => {
  return (options || []).filter((option: Option) =>
    deburr(option?.text ?? '').includes(deburr(query)),
  );
};

const parseTypeFromPermissionUI = (permission = ''): string => {
  if (permission) {
    return (
      Object.keys(PermissionUIType).find((type) => permission.includes(type)) ||
      ''
    );
  }
  return permission;
};

const parseCodeFromPermissionUI = (permission = ''): string => {
  if (permission) {
    const permissionUIType = parseTypeFromPermissionUI(permission);
    return permissionUIType
      ? permission.substr(0, permission.indexOf(permissionUIType) - 1)
      : '';
  }
  return permission;
};

export {
  methodList,
  permissionUIList,
  permissionTypeList,
  permissionUITypeList,
  permissionDataTypeList,
  searchWithDeburr,
  parseTypeFromPermissionUI,
  parseCodeFromPermissionUI,
};
