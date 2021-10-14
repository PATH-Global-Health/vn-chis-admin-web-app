import { combineReducers } from '@reduxjs/toolkit';
import unitType from '@category/unit-type/unit-type.slice';
import service from '@category/service/service.slice';
import serviceType from '@category/service-type/service-type.slice';

export default combineReducers({
  unitType,
  service,
  serviceType
});
