export interface User {
  userId: number;
  personId: number;
  username: string;
  password: string;
}

export interface CreateUserDto {
  // personId: number;
  username: string;
  password: string;
}

export enum UserType {
  CUSTOMER = "customer",
  EMPLOYEE = "employee",
  GUEST = "guest",
}

export type SignInResponseUser = {
  id: number;
  rootPath: string;
  routes: string[];
  username: string;
  userType: UserType;
};
