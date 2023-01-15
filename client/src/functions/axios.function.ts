import { IAuthContext } from "@interfaces/auth.interface";
import axios from "axios";

interface IAxiosRequest {
  authContext?: IAuthContext;
  body: any;
  params: any;
  method: "get" | "post" | "put" | "delete";
  url: string;
}

const returnAxiosCall = (data: IAxiosRequest) => {
  const { authContext, body, params: paramsInfo, method, url } = data;
  const userValue = authContext?.currentUser;
  const params = paramsInfo ? paramsInfo : {};

  const headers = {
    authorization: userValue,
  };
  switch (method) {
    case "get":
      return axios.get(url, {
        headers,
        params,
      });
    case "post":
      return axios.post(url, body, {
        headers,
      });
    case "put":
      return axios.put(url, body, {
        headers,
      });
    case "delete":
      return axios.delete(url, {
        headers,
      });
    default:
      return;
  }
};

export async function AxiosFunction(data: IAxiosRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    returnAxiosCall(data)!
      .then((response) => {
        const { data } = response;
        if (data) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
