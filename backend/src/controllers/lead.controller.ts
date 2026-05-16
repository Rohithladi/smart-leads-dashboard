import type { Request, Response } from "express";
import { csvService } from "../services/csv.service.js";
import { leadService } from "../services/lead.service.js";
import { ApiError } from "../utils/api-error.js";
import { httpStatus } from "../utils/http-status.js";
import { sendSuccess } from "../utils/response.js";
import type {
  CreateLeadInput,
  ExportLeadsQuery,
  LeadIdParams,
  ListLeadsQuery,
  UpdateLeadInput
} from "../validators/lead.validator.js";

export const leadController = {
  async create(req: Request, res: Response): Promise<void> {
    const lead = await leadService.create(req.body as CreateLeadInput);

    sendSuccess(res, httpStatus.CREATED, { lead });
  },

  async list(req: Request, res: Response): Promise<void> {
    const result = await leadService.list(req.query as unknown as ListLeadsQuery);

    sendSuccess(res, httpStatus.OK, result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const params = req.params as LeadIdParams;
    const lead = await leadService.getById(params.id);

    sendSuccess(res, httpStatus.OK, { lead });
  },

  async update(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const params = req.params as LeadIdParams;
    const lead = await leadService.update(params.id, req.body as UpdateLeadInput, req.user);

    sendSuccess(res, httpStatus.OK, { lead });
  },

  async delete(req: Request, res: Response): Promise<void> {
    const params = req.params as LeadIdParams;
    await leadService.delete(params.id);

    sendSuccess(res, httpStatus.OK, { deleted: true });
  },

  async exportCsv(req: Request, res: Response): Promise<void> {
    const leads = await leadService.listForExport(req.query as unknown as ExportLeadsQuery);
    const csv = csvService.buildLeadsCsv(leads);

    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    res.status(httpStatus.OK).send(csv);
  }
};
