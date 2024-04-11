import { UserType } from "./user.entity";

export const userRoutesMap: Record<UserType, string[]> = {
  [UserType.CUSTOMER]: ["/home", "/products", "/shopping"],
  [UserType.EMPLOYEE]: ["/sale", "/empsignup", "/form", "/order"],
  [UserType.GUEST]: ["/home", "/signup", "/login"],
};

export const userRootPathMap: Record<UserType, string> = {
  [UserType.CUSTOMER]: "/store",
  [UserType.EMPLOYEE]: "/admin",
  [UserType.GUEST]: "/store",
};
