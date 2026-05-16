import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

const bearerPrefix = "Bearer ";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const header = req.header("Authorization");

    if (!header?.startsWith(bearerPrefix)) {
      throw ApiError.unauthorized();
    }

    const token = header.slice(bearerPrefix.length).trim();

    if (!token) {
      throw ApiError.unauthorized();
    }

    const payload = verifyAccessToken(token);
    req.user = await authService.getCurrentUser(payload.sub);

    next();
  } catch (error) {
    next(error instanceof ApiError ? error : ApiError.unauthorized("Invalid or expired token"));
  }
};
