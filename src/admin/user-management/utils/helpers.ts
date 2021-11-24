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
    name: 'Employee - Truy cập',
    code: 'CHIS_EMPLOYEEE',
    types: ['ALL'],
  },
  {
    name: 'Customer - Truy cập',
    code: 'CHIS_CUSTOMER',
    types: ['ALL'],
  },
  {
    name: 'Admin - Truy cập',
    code: 'ADMIN',
    types: ['ALL'],
  },
  {
    name: 'Admin - Tài khoản',
    code: 'ADMIN_USER_MANAGEMENT', 
    types: ['ALL'],
  },
  {
    name: 'Admin - Dịch vụ',
    code: 'ADMIN_SERVICE_MANAGEMENT',
    types: ['ALL'],
  },
  {
    name: 'Admin - Bài viết',
    code: 'ADMIN_NEW_MANAGEMENT',
    types: ['ALL'],
  },
  {
    name: 'Admin - Biểu mẫu đánh giá',
    code: 'ADMIN_QUESTION_MANAGEMENT',
    types: ['ALL'],
  },
  {
    name: 'Facility - Truy cập',
    code: 'CHIS_FACILITY',
    types: ['ALL'],
  }, 
  {
    name: 'Facility - Khách hàng',
    code: 'CSYT_CUSTOMER',
    types: ['ALL'],
  },
  {
    name: 'Facility - Danh mục',
    code: 'CSYT_CATALOG',
    types: ['ALL'],
  },
  {
    name: 'Facility - Lịch làm việc',
    code: 'CSYT_WORKING_SCHEDULE',
    types: ['ALL'],
  },
  {
    name: 'Facility - Lịch hẹn (Tư vấn/Xét nghiệm)',
    code: 'CSYT_EXAMINATION',
    types: ['ALL'],
  },
  {
    name: 'Facility - Thống kê',
    code: 'CSYT_EXAMINATION_STATISTIC',
    types: ['ALL'],
  },
  {
    name: 'PQM - Danh mục',
    code: 'ADMIN_PQM_CATEGORY',
    types: ['ALL'],
  },
  {
    name: 'PQM - Dữ liệu tổng hợp',
    code: 'PQM_AGGREGATED_VALUE',
    types: ['ALL'],
  },
  {
    name: 'PQM - Nhật ký lỗi',
    code: 'ADMIN_PQM_ERROR_LOGGING',
    types: ['ALL'],
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
