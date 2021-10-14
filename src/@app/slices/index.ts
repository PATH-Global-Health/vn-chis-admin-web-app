import auth from '@app/slices/auth';
import global from '@app/slices/global';

import admin from '@admin/reducers';
import category from '@category/reducers';
import news from '@news/reducers';

const slices = {
  auth,
  global,
  admin,
  category,
  news
};

export default slices;
