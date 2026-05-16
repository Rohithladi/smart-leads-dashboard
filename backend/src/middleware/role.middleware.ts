import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../types/auth.types.js";
import { ApiError } from "../utils/api-error.js";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(ApiError.forbidden());
      return;
    }

    next();
  };
};
