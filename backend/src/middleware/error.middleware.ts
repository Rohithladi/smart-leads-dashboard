import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import type { FieldError } from "../types/api.types.js";
import { ApiError } from "../utils/api-error.js";
import { httpStatus } from "../utils/http-status.js";

type ErrorBody = {
  success: false;
  message: string;
  errors?: FieldError[];
  stack?: string;
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));

    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  if (error instanceof ApiError) {
    const body: ErrorBody = {
      success: false,
      message: error.message
    };

    if (error.details) {
      body.errors = error.details;
    }

    if (env.NODE_ENV === "development" && error.stack) {
      body.stack = error.stack;
    }

    return res.status(error.statusCode).json(body);
  }

  const body: ErrorBody = {
    success: false,
    message: "Internal server error"
  };

  if (env.NODE_ENV === "development" && error instanceof Error && error.stack) {
    body.stack = error.stack;
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(body);
};
