import { IAuthContext } from "@interfaces/auth.interface";
import axios from "axios";

interface IAxiosRequest {
  authToken?: IAuthContext;
  body: any;
  paramsInfo: any;
  method: "get" | "post" | "put" | "delete";
  url: string;
}

const returnAxiosCall = (data: IAxiosRequest) => {
  const { authToken, body, paramsInfo, method, url } = data;
  const userValue = authToken?.authorization;

  const headers = {
    Cookie: "session",
    authToken: userValue,
  };
  switch (method) {
    case "get":
      return axios.get(url, {
        withCredentials: true,
        headers,
        params: { paramsInfo },
      });
    case "post":
      return axios.post(url, body, {
        withCredentials: true,
        headers,
      });
    case "put":
      return axios.put(url, body, {
        withCredentials: true,
        headers,
      });
    case "delete":
      return axios.delete(url, {
        withCredentials: true,
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
