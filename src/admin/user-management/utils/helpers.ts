import { Option } from '@app/models/utility';
import { deburr } from '@app/utils/helpers';
import {
  PermissionType,
  PermissionUIType,
  PermissionDataType,
} from '@admin/user-management/utils/constants';

const methodList = [
  { value: 'GET', text: 'GET', color: 'blue' },
  { value: 'POST', text: 'POST', color: 'green' },
  { value: 'PUT', text: 'PUT', color: 'yellow' },
  { value: 'DELETE', text: 'DELETE', color: 'red' },
];

const permissionUIList = [
  {
    name: 'Employee - Truy cập',
    code: 'CHIS_EMPLOYEE',
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
    code: 'ADMIN_PQM_AGGREGATED_VALUE',
    types: ['ALL'],
  },
  {
    name: 'PQM - Nhật ký lỗi',
    code: 'ADMIN_PQM_ERROR_LOGGING',
    types: ['ALL'],
  },
  {
    name: 'SMD - Dashboard',
    code: 'SMD_DASHBOARD',
    types: ['ALL'],
  },
  {
    name: 'SMD - Quản lý',
    code: 'SMD_MANAGEMENT',
    types: ['ALL'],
  },
  {
    name: 'SMD - Chỉ số',
    code: 'SMD_INDICATOR',
    types: ['ALL'],
  },
  {
    name: 'SMD - Đóng gói',
    code: 'SMD_PACKAGE',
    types: ['ALL'],
  },
  {
    name: 'SMD - KPI',
    code: 'SMD_KPI',
    types: ['ALL'],
  },
  {
    name: 'SMD - Dự án',
    code: 'SMD_PROJECT',
    types: ['ALL'],
  },
  {
    name: 'SMD - Báo cáo',
    code: 'SMD_REPORT',
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

const permissionTypeColorList = [
  { name: 'GET', color: 'blue' },
  { name: 'POST', color: 'green' },
  { name: 'PUT', color: 'orange' },
  { name: 'DELETE', color: 'red' },
]

const searchWithDeburr = (options: Option[], query: string): Option[] => {
  return (options || []).filter((option: Option) =>
    deburr(option?.text ?? '').includes(deburr(query)),
  );
};

const getFunctionFromPermission = (code = ''): Option | undefined => {
  if (code && code.includes('_')) {
    const splitIndex = code.lastIndexOf('_');
    const name = code.substring(0, splitIndex);
    const permission = permissionUIList.find((p) => p.code === name);
    if (permission) {
      const type = code.substring(splitIndex);
      const permissionUIType = permissionUITypeList.find((p) => p.value === type);
      if (permissionUIType) {
        return permissionUIType;
      }
    }
  }
  return undefined;
}

export {
  methodList,
  permissionUIList,
  permissionTypeList,
  permissionUITypeList,
  permissionDataTypeList,
  permissionTypeColorList,
  searchWithDeburr,
  getFunctionFromPermission,
};
