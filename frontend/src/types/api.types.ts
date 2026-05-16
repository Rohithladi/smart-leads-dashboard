export type ApiSuccess<TData> = {
  success: true;
  data: TData;
};

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: ApiFieldError[];
};
