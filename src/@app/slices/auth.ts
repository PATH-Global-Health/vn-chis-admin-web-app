import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import { Token } from '@app/models/token';
import { UserInfo } from '@app/models/user-info';
import { Permission } from '@app/models/permission';

import authService from '@app/services/auth';

interface State {
  token: Token | null;
  tokenExpiredTime: Date | null;
  loginLoading: boolean;
  userInfo: UserInfo | null;
  getUserInfoLoading: boolean;
  permissionList: Permission[];
  getPermissionsOfUserLoading: boolean;
}

const initialState: State = {
  token: null,
  tokenExpiredTime: null,
  loginLoading: false,
  userInfo: null,
  getUserInfoLoading: false,
  permissionList: [],
  getPermissionsOfUserLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const login = createAsyncThunk<Token, { username: string; password: string }>(
  'auth/login',
  async (arg: { username: string; password: string }) => {
    const { username, password } = arg;
    const result = await authService.login(username, password);
    return result;
  },
);

const setTokenCR: CR<{
  token: Token;
  tokenExpiredTime: Date;
}> = (state, action) => ({
  ...state,
  token: action.payload.token,
  tokenExpiredTime: action.payload.tokenExpiredTime,
});

const getUserInfo = createAsyncThunk('auth/getUserInfo', async () => {
  const result = await authService.getUserInfo();
  return result;
});

const getPermission = createAsyncThunk<Permission[], string>(
  'auth/getPermission',
  async (token: string) => {
    const result = await authService.getPermission(token);
    return result;
  },
);

const logoutCR: CR<void> = () => ({
  ...initialState,
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: setTokenCR,
    logout: logoutCR,
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => ({
      ...state,
      loginLoading: true,
    }));
    builder.addCase(login.fulfilled, (state, { payload }) => ({
      ...state,
      loginLoading: false,
      token: payload,
      tokenExpiredTime: new Date(
        new Date().getTime() + payload.expires_in * 1000,
      ),
    }));
    builder.addCase(login.rejected, (state) => ({
      ...state,
      loginLoading: false,
    }));

    // get user info
    builder.addCase(getUserInfo.pending, (state) => ({
      ...state,
      getUserInfoLoading: true,
    }));
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => ({
      ...state,
      userInfo: payload,
      getUserInfoLoading: false,
    }));
    builder.addCase(getUserInfo.rejected, (state) => ({
      ...state,
      getUserInfoLoading: false,
    }));

    // get permission of user
    builder.addCase(getPermission.pending, (state) => ({
      ...state,
      getPermissionLoading: true,
    }));
    builder.addCase(getPermission.fulfilled, (state, { payload }) => ({
      ...state,
      permissionList: payload,
      getPermissionLoading: false,
    }));
    builder.addCase(getPermission.rejected, (state) => ({
      ...state,
      getPermissionLoading: false,
    }));
  },
});

export { login, getUserInfo, getPermission };
export const { setToken, logout } = slice.actions;

export default slice.reducer;
