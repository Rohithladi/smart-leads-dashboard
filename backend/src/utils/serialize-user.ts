import type { UserDocument } from "../models/user.model.js";
import type { AuthUser } from "../types/auth.types.js";

export const serializeUser = (user: UserDocument): AuthUser => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
};
