import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate-request.js";
import { asyncHandler } from "../utils/async-handler.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(authController.register)
);

authRouter.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(authController.login)
);

authRouter.get("/me", authenticate, asyncHandler(authController.me));
