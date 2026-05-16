import type { Response } from "express";

type SuccessResponse<TData> = {
  success: true;
  data: TData;
};

export const sendSuccess = <TData>(
  res: Response,
  statusCode: number,
  data: TData
): Response<SuccessResponse<TData>> => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};
