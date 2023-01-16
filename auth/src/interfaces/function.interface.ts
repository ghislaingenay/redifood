export interface IErrorsSend {
  status: number;
  errorMessage: { message: string; field?: string }[];
}
