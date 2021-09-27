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
    name: 'Hệ thống CDS',
    code: 'CDS_SYSTEM',
    types: [],
  },
  {
    name: 'CDS - Dashboard',
    code: 'CDS_DASHBOARD',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Hồ sơ',
    code: 'CDS_PROFILE',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Điều tra chuỗi',
    code: 'CDS_CHAIN',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Điều tra cá nhân đã xác minh',
    code: 'CDS_SUBJECT',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Điều tra cá nhân chưa xác minh',
    code: 'CDS_UNVERIFIED_SUBJECT',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Điều tra địa điểm',
    code: 'CDS_ESTATE',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Điều tra máy bay',
    code: 'CDS_AIRPLANE',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Điều tra các phương tiện khác',
    code: 'CDS_VEHICLE',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Quản lý cơ sở',
    code: 'CDS_UNIT',
    types: ['READ_ONLY', 'EXECUTE', 'CREATE_UNIT', 'WATTAGE_ALL_UNIT'],
  },
  {
    name: 'CDS - Quản lý mã xét nghiệm',
    code: 'CDS_CODE',
    types: ['READ_ONLY', 'EXECUTE', 'CREATE_CODE', 'PUBLISH_CODE'],
  },
  {
    name: 'CDS - Quản lý mẫu xét nghiệm',
    code: 'CDS_EXAMINATION',
    types: [
      'READ_ONLY',
      'EXECUTE',
      'EXPORT_ALL_EXAM',
      'CHANGE_PROFILE_BY_EXAM',
      'UPDATE_EXAM_RESULT',
    ],
  },
  {
    name: 'CDS - Quản lý phiên lấy mẫu',
    code: 'CDS_ASSIGN',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Quản lý chuyển mẫu',
    code: 'CDS_TRANSPORT',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Quản lý phiên xét nghiệm',
    code: 'CDS_TEST_SESSION',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Danh sách khu cách ly',
    code: 'CDS_FACILITIES',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Danh sách chờ cách ly tại khu cách ly',
    code: 'CDS_FACILITIES_WAITING_LIST',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Danh sách đang cách ly tại khu cách ly',
    code: 'CDS_FACILITIES_IN_QUARANTINE',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Danh sách kết thúc cách ly tại khu cách ly',
    code: 'CDS_FACILITIES_COMPLETED',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Danh sách chờ cách ly tại nhà',
    code: 'CDS_HOME_WAITING_LIST',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Danh sách đang cách ly tại nhà',
    code: 'CDS_HOME_IN_QUARANTINE',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Danh sách kết thúc cách ly tại nhà',
    code: 'CDS_HOME_COMPLETED',
    types: ['READ_ONLY', 'EXECUTE'],
  },
  {
    name: 'CDS - Thống kê (mockup) cách ly',
    code: 'CDS_FACILITY_STATISTIC',
    types: ['READ_ONLY', 'EXECUTE'],
  },
];

const permissionTypeList = [
  { value: PermissionType.ALLOW, text: 'Cho phép' },
  { value: PermissionType.DENY, text: 'Từ chối' },
];

const permissionUITypeList = [
  { value: PermissionUIType.READ_ONLY, text: 'Chỉ xem' },
  { value: PermissionUIType.EXECUTE, text: 'Thực thi' },
  { value: PermissionUIType.CREATE_CHAIN, text: 'Xác nhận F0 và tạo chuỗi' },
  {
    value: PermissionUIType.EDIT_PROFILE_POSITIVE,
    text: 'Sửa thông tin hồ sơ dương tính',
  },
  { value: PermissionUIType.CREATE_UNIT, text: 'Tạo cơ sở xét nghiệm' },
  {
    value: PermissionUIType.WATTAGE_ALL_UNIT,
    text: 'Điều chỉnh suất cho tất cả cơ sở',
  },
  { value: PermissionUIType.CREATE_CODE, text: 'Tạo mã xét nghiệm' },
  { value: PermissionUIType.PUBLISH_CODE, text: 'Cấp mã xét nghiệm' },
  {
    value: PermissionUIType.CHANGE_PROFILE_BY_EXAM,
    text: 'Sửa hồ sở của mẫu xét nghiệm',
  },
  {
    value: PermissionUIType.UPDATE_EXAM_RESULT,
    text: 'Cập nhật kết quả mẫu xét nghiệm',
  },
  {
    value: PermissionUIType.EXPORT_ALL_EXAM,
    text: 'Xuất dữ liệu xét nghiệm tổng',
  },
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
