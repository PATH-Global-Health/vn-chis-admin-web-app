export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  isDisabled: boolean;
}

export interface UserCM extends Omit<User, 'id'> {
  password: string;
}

export interface UserFilter {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface UserResponse {
  totalPages: number;
  data: User[];
}

export interface AddUsersModel {
  userIds: string[];
}

export interface ChangePasswordModel {
  oldPassword: string;
  newPassword: string;
}
