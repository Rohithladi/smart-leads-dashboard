import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload, UserRole } from "../types/auth.types.js";

export const signAccessToken = (userId: string, role: UserRole): string => {
  const payload: JwtPayload = {
    sub: userId,
    role
  };
  const expiresIn = env.JWT_EXPIRES_IN as Exclude<SignOptions["expiresIn"], undefined>;

  const options: SignOptions = {
    expiresIn
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.sub !== "string" ||
    (decoded.role !== "admin" && decoded.role !== "sales")
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    role: decoded.role
  };
};
