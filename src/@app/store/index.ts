import {
  AnyAction,
  configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import appReducers from '@app/slices';

const combinedReducer = combineReducers({
  ...appReducers,
})

const rootReducer = (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const middleware = getDefaultMiddleware({
  serializableCheck: false,
});

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;

export default store;
