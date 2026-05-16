import { Router } from "express";
import { httpStatus } from "../utils/http-status.js";
import { sendSuccess } from "../utils/response.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  sendSuccess(res, httpStatus.OK, {
    service: "smart-leads-api",
    status: "ok"
  });
});
