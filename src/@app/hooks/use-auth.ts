import { useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';

import { useDispatch, useSelector } from '@app/hooks';
import { TOKEN, USER_ID, EXPIRED_TIME } from '@app/utils/constants';
import { Token } from '@app/models/token';
import {
  login as li,
  logout as lo,
  getUserInfo,
  getPermissionsOfUser,
  setToken,
} from '@app/slices/auth';

type UseAuth = {
  isAuthenticated: () => boolean;
  login: (
    username: string,
    password: string,
    remember: boolean,
  ) => Promise<void>;
  logout: () => void;
  hasPermission: (code: string) => boolean;
};

const getStorage = (key: string): string =>
  (localStorage.getItem(key) || sessionStorage.getItem(key)) ?? 'null';

const useAuth = (): UseAuth => {
  const dispatch = useDispatch();

  const isAuthenticated = useCallback((): boolean => {
    const token = JSON.parse(getStorage(TOKEN)) as Token;
    const userId = getStorage(USER_ID);
    const tokenExpiredTime: Date = new Date(getStorage(EXPIRED_TIME));
    if (token && tokenExpiredTime > new Date()) {
      dispatch(setToken({ token, tokenExpiredTime }));
      dispatch(getPermissionsOfUser(userId));
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
  }, [dispatch]);

  const login = async (
    username: string,
    password: string,
    remember: boolean,
  ): Promise<void> => {
    // eslint-disable-next-line
    const token = unwrapResult(await dispatch<any>(li({ username, password }))) as Token;
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
    dispatch(getUserInfo());
    dispatch(getPermissionsOfUser(token.userId));
  };

  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(USER_ID);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
  }, [dispatch]);

  const { permissionList } = useSelector((state) => state.auth);
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
