import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { httpStatus } from "../utils/http-status.js";
import { sendSuccess } from "../utils/response.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body as RegisterInput);

    sendSuccess(res, httpStatus.CREATED, result);
  },

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body as LoginInput);

    sendSuccess(res, httpStatus.OK, result);
  },

  async me(req: Request, res: Response): Promise<void> {
    const currentUser = req.user;

    if (!currentUser) {
      throw new Error("Authenticated route reached without a user");
    }

    const user = await authService.getCurrentUser(currentUser.id);

    sendSuccess(res, httpStatus.OK, { user });
  }
};
