import axios, { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../src/contexts/auth.context";

interface IAxiosReq {
  body: any;
  queryParams: any;
  method: "get" | "post" | "put" | "delete";
  url: string;
}

interface IUseRequestRes<T = any> {
  response: T;
  loading: boolean;
  doRequest: () => Promise<any>;
}

interface IGetServerSideData<T = any, K = any> {
  results: T | null;
  message: string;
  params?: K;
}

const useRequest = (data: IAxiosReq) => {
  const { body, queryParams, method, url } = data;
  const { verifyUser } = useAuth();

  const [response, setResponse] = useState<IUseRequestRes["response"]>(null);
  const [loading, setLoading] = useState<IUseRequestRes["loading"]>(false);

  const getAxios = () => {
    const userValue = verifyUser();
    if (!userValue.currentUser) {
      throw new Error("useRequest must be used within an AuthProvider");
    }

    const headers = {
      Cookie: "session",
      authToken: userValue,
    };
    switch (method) {
      case "get":
        return axios.get(url, {
          withCredentials: true,
          headers,
          params: { queryParams },
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

  const doRequest = useCallback(async <T, K>(): Promise<any> => {
    console.log("data", data);
    setLoading(true);
    getAxios()!
      .then((res: AxiosResponse<IGetServerSideData<T, K>>) => {
        const {
          data: { results, message },
        } = res;
        setResponse(results);
        toast.success(message);
        setLoading(false);
      })
      .catch((err: AxiosError<IGetServerSideData<T, K>>) => {
        const { response } = err;
        const {
          data: { message },
        } = response as AxiosResponse<IGetServerSideData<T, K>>;
        toast.error(message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!verifyUser) {
      throw new Error("useRequest must be used within an AuthProvider");
    }
  }, [response]);

  return [
    response as IUseRequestRes["response"],
    doRequest as IUseRequestRes["doRequest"],
    loading as IUseRequestRes["loading"],
  ];
};

export default useRequest;
