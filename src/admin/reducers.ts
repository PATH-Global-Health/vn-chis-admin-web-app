import { combineReducers } from '@reduxjs/toolkit';

import userManagement from './user-management';
import manageAccount from './manage-account/slices';

export default combineReducers({
  userManagement: combineReducers(userManagement),
  account: combineReducers(manageAccount),
});
