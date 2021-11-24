import auth from '@app/slices/auth';
import global from '@app/slices/global';

import admin from '@admin/reducers';
import category from '@category/reducers';
import news from '@news/reducers';
import formAssessment from '@form-assessment/reducers';
import pqm from '@pqm/reducers';

const slices = {
  auth,
  global,
  admin,
  category,
  news,
  formAssessment,
  pqm
};

export default slices;
