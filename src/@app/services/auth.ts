import { httpClient, apiLinks } from '@app/utils';
import axios from 'axios';

import { Token } from '@app/models/token';
import { Permission } from '@app/models/permission';
import { UserInfo } from '@app/models/user-info';

const login = async (username: string, password: string): Promise<Token> => {
  const response = await httpClient.post({
    url: apiLinks.authentication.token,
    data: {
      username,
      password,
    },
  });
  return response.data as Token;
};

const getUserInfo = async (): Promise<UserInfo> => {
  const response = await httpClient.get({
    url: apiLinks.authentication.userInfo,
  });
  return response.data as UserInfo;
};

const getPermission = async (token: string): Promise<Permission[]> => {
  const headerToken = token ? { Authorization: `bearer ${token}` } : null;
  const response = await axios({
    url: apiLinks.authentication.getPermission,
    headers: { ...headerToken },
  });

  return response.data as Permission[];
}

const authService = {
  login,
  getUserInfo,
  getPermission,
};

export default authService;
