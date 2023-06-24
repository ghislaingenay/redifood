import axios from "axios";

interface IAxiosRequest {
  // authToken?: IAuthContext;
  body: any;
  queryParams: any;
  method: "get" | "post" | "put" | "delete";
  url: string;
}

const returnAxiosCall = (data: IAxiosRequest) => {
  const { body, queryParams, method, url } = data;
  // const userValue = authToken?.authorization;

  const axiosFn = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACK_END}`,
  });
  // const headers = {
  //   Cookie: "session",
  //   authToken: userValue,
  // };
  switch (method) {
    case "get":
      return axiosFn.get(url, {
        withCredentials: true,
        // headers,
        params: { queryParams },
      });
    case "post":
      return axiosFn.post(url, body, {
        withCredentials: true,
        // headers,
        params: { queryParams },
      });
    case "put":
      return axiosFn.put(url, body, {
        withCredentials: true,
        // headers,
        params: { queryParams },
      });
    case "delete":
      return axiosFn.delete(url, {
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
