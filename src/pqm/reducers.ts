import { combineReducers } from '@reduxjs/toolkit';

import category from '@pqm/category/reducers';
import aggregatedValue from '@pqm/aggregated-value/slices';
import errorLogging from '@pqm/error-logging/slices';

export default combineReducers({
  category: combineReducers(category),
  aggregatedValue,
  errorLogging,
});
