import { Router } from "express";
import { leadController } from "../controllers/lead.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validate-request.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createLeadSchema,
  exportLeadsSchema,
  leadIdSchema,
  listLeadsSchema,
  updateLeadSchema
} from "../validators/lead.validator.js";

export const leadRouter = Router();

leadRouter.use(authenticate);

leadRouter.get(
  "/export.csv",
  requireRole("admin"),
  validateRequest(exportLeadsSchema),
  asyncHandler(leadController.exportCsv)
);

leadRouter
  .route("/")
  .get(validateRequest(listLeadsSchema), asyncHandler(leadController.list))
  .post(
    requireRole("admin"),
    validateRequest(createLeadSchema),
    asyncHandler(leadController.create)
  );

leadRouter
  .route("/:id")
  .get(validateRequest(leadIdSchema), asyncHandler(leadController.getById))
  .patch(validateRequest(updateLeadSchema), asyncHandler(leadController.update))
  .delete(
    requireRole("admin"),
    validateRequest(leadIdSchema),
    asyncHandler(leadController.delete)
  );
