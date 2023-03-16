import { IAuthContext } from "./auth.interface";

export interface IAxiosRequest {
  authContext: IAuthContext;
  body: any;
  params: any;
  method: "get" | "post" | "put" | "delete";
  url: string;
  // onSuccess?: (data: any) => void;
  // onFailure?: (data: any) => void;
}
