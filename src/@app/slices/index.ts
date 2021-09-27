import auth from '@app/slices/auth';
import global from '@app/slices/global';

import admin from '@admin/reducers';
import category from '@category/reducers';

const slices = {
  auth,
  global,
  admin,
  category,  
};

export default slices;
