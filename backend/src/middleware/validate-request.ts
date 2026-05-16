import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny, z } from "zod";

type RequestSources = {
  body: Request["body"];
  query: Request["query"];
  params: Request["params"];
};

export const validateRequest = <TSchema extends ZodTypeAny>(schema: TSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    }) as z.infer<TSchema> & Partial<RequestSources>;

    if (parsed.body) {
      req.body = parsed.body;
    }

    if (parsed.query) {
      req.query = parsed.query;
    }

    if (parsed.params) {
      req.params = parsed.params;
    }

    next();
  };
};
