import axios from "axios";

interface IAxiosRequest {
  body: any;
  queryParams: any;
  method: "get" | "post" | "put" | "delete";
  url: string;
}

const returnAxiosCall = (data: IAxiosRequest) => {
  const { body, queryParams, method, url } = data;

  switch (method) {
    case "get":
      return axios.get(url, {
        withCredentials: true,
        // headers,
        params: queryParams,
      });
    case "post":
      return axios.post(url, body, {
        withCredentials: true,
        // headers,
        params: queryParams,
      });
    case "put":
      return axios.put(url, body, {
        withCredentials: true,
        // headers,
        params: queryParams,
      });
    case "delete":
      return axios.delete(url, {
        withCredentials: true,
        // headers,
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
