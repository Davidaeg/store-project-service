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
}
