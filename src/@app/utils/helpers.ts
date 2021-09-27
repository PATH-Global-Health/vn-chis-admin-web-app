/* eslint-disable no-useless-escape */
/* eslint-disable import/prefer-default-export */
const defaultPaging = {
  data: [],
  totalPages: 0,
};

const examinationPaging = {
  data: [],
  pageCount: 0,
};

const deburr = (s: string): string => {
  let result = s ?? '';
  result = result.toLowerCase();
  result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  result = result.replace(/đ/g, 'd');
  result = result.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  result = result.replace(/ + /g, ' ');
  result = result.trim();
  return result;
};

const filterArray = <T>(arr: T[], searchValue: string): T[] => {
  const result = arr.filter((e) =>
    deburr(JSON.stringify(e))
      .toLowerCase()
      .includes(deburr(searchValue.toLowerCase().trim())),
  );

  return result;
};

const toVND = (amount: number): string =>
  `${amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} ₫`;

const toSlug = (content: string): string => {
  let result = deburr(content) ?? '';
  result = result.replace(/[^a-z0-9 -]/g, '');
  result = result.replace(/\s+/g, '-');
  result = result.replace(/-+/g, '-');
  return result;
};

const getResponseError = (error = ''): string => {
  if (error && error.includes('\n')) {
    return error.substring(0, error.indexOf('\n') + 1);
  }
  return 'Đã có lỗi xảy ra';
};

export {
  defaultPaging,
  examinationPaging,
  deburr,
  filterArray,
  toVND,
  toSlug,
  getResponseError,
};
