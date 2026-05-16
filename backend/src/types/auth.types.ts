export const userRoles = ["admin", "sales"] as const;

export type UserRole = (typeof userRoles)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type JwtPayload = {
  sub: string;
  role: UserRole;
};
