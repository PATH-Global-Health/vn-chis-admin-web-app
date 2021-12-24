import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import moment from 'moment';

import { useDispatch, useSelector } from '@app/hooks';
import { TOKEN, USER_ID, ACCESS_PERMISSION, EXPIRED_TIME } from '@app/utils/constants';
import { Token } from '@app/models/token';
import { Permission } from '@app/models/permission';
import {
  login as li,
  logout as lo,
  setToken,
  getPermission,
  getUserInfo,
} from '@app/slices/auth';
import authService from '@app/services/auth';

type UseAuth = {
  isAuthenticated: () => boolean;
  login: (
    username: string,
    password: string,
    remember: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (code: string) => boolean;
};

const getStorage = (key: string): string =>
  (localStorage.getItem(key) || sessionStorage.getItem(key)) ?? 'null';

const useAuth = (): UseAuth => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { permissionList } = useSelector((state) => state.auth);

  const isAuthenticated = useCallback((): boolean => {
    const token = JSON.parse(getStorage(TOKEN)) as Token;
    const tokenExpiredTime: Date = new Date(getStorage(EXPIRED_TIME));

    if (token && tokenExpiredTime > new Date()) {
      dispatch<any>(getPermission(token.access_token))
        .then((action: any) => {
          const { payload: permissionList } = action;
            const authorized = permissionList?.find((p: any) => p?.code && p.code === ACCESS_PERMISSION);
            if (!authorized) {
              toast.warning('Phiên đăng nhập đã hết, vui lòng đăng nhập lại', {
                toastId: 'token-expired',
              });
  
              localStorage.removeItem(TOKEN);
              localStorage.removeItem(USER_ID);
              localStorage.removeItem(EXPIRED_TIME);
              sessionStorage.removeItem(TOKEN);
              sessionStorage.removeItem(USER_ID);
              sessionStorage.removeItem(EXPIRED_TIME);

              dispatch(lo());
              history.push('/login');
            }
        });

      dispatch(setToken({ token, tokenExpiredTime }));
      dispatch(getPermission(token.access_token));
      dispatch(getUserInfo());
      return true;
    }

    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(USER_ID);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
    return false;
  }, [dispatch, history]);

  const login = async (
    username: string,
    password: string,
    remember: boolean,
  ): Promise<void> => {
    // eslint-disable-next-line
    const token = unwrapResult(await dispatch<any>(li({ username, password }))) as Token;
    const permissionList = unwrapResult(await dispatch<any>(getPermission(token.access_token))) as Permission[];
    const authorized = permissionList.find((p) => p?.code && p.code === ACCESS_PERMISSION);
    if (authorized) {
      if (remember) {
        localStorage.setItem(TOKEN, JSON.stringify(token));
        localStorage.setItem(USER_ID, token.userId);
        localStorage.setItem(
          EXPIRED_TIME,
          moment()
            .add(token.expires_in * 1000, 'seconds')
            .toString(),
        );
      } else {
        sessionStorage.setItem(TOKEN, JSON.stringify(token));
        sessionStorage.setItem(USER_ID, token.userId);
        sessionStorage.setItem(
          EXPIRED_TIME,
          moment()
            .add(token.expires_in * 1000, 'seconds')
            .toString(),
        );
      }
    } else {
      throw new Error('Tài khoản không có quyền truy cập');
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    // Call api to disable token
    await authService.logout();
    // Clear token
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(USER_ID);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
  }, [dispatch]);

  const hasPermission = useCallback(
    (code: string): boolean => {
      return (
        permissionList.map((p) => p.code).includes('ALL') ||
        permissionList.map((p) => p.code).includes(code)
      );
    },
    [permissionList],
  );

  return {
    isAuthenticated,
    login,
    logout,
    hasPermission,
  };
};

export default useAuth;
