import { Option } from '@app/models/utility';
import { ErrorType } from '@pqm/error-logging/models';

export const errorTypeList: ErrorType[] = [
  {
    code: '01',
    message: 'Năm sinh không đúng định dạng',
  },
  {
    code: '02',
    message: 'Tháng không đúng định dạng',
  },
  {
    code: '03',
    message: 'Không có dữ liệu gửi lên',
  },
  {
    code: '04',
    message: 'Không tìm thấy mã cơ sở theo mã đã gửi lên',
  },
  {
    code: '05',
    message: 'Trường data.value không hợp lệ',
  },
  {
    code: '06',
    message: 'Trường optional_data.value không hợp lệ',
  },
  {
    code: '07',
    message: 'Trường type.value không hợp lệ',
  },
  {
    code: '08',
    message: 'Không tìm thấy nhóm tuổi theo mã đã gửi lên',
  },
  {
    code: '09',
    message: 'Không tìm thấy nhóm nguy cơ theo mã đã gửi lên',
  },
  {
    code: '10',
    message: 'Không tìm thấy giới tính theo mã đã gửi lên',
  },
];

export const errorOptions: Option[] = errorTypeList.map((error) => ({
  value: error.code,
  text: `${error.code} - ${error.message}`,
}));
