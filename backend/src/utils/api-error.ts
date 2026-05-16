import { httpStatus } from "./http-status.js";
import type { FieldError } from "../types/api.types.js";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: FieldError[];
  public readonly isOperational = true;

  public constructor(
    statusCode: number,
    message: string,
    details?: FieldError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }

  public static badRequest(message: string, details?: FieldError[]): ApiError {
    return new ApiError(httpStatus.BAD_REQUEST, message, details);
  }

  public static unauthorized(message = "Authentication required"): ApiError {
    return new ApiError(httpStatus.UNAUTHORIZED, message);
  }

  public static forbidden(message = "You do not have permission to perform this action"): ApiError {
    return new ApiError(httpStatus.FORBIDDEN, message);
  }

  public static notFound(resource = "Resource"): ApiError {
    return new ApiError(httpStatus.NOT_FOUND, `${resource} not found`);
  }

  public static conflict(message: string): ApiError {
    return new ApiError(httpStatus.CONFLICT, message);
  }
}
