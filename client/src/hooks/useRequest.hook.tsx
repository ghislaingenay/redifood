import { IAxiosRequest, IUseRequestHook } from "@interfaces/hook.interface";
import { Alert, Typography } from "antd";
import axios from "axios";
import { useState } from "react";
const { Title } = Typography;

const useRequest = ({ url, method, onSuccess, onFailure, params }: IUseRequestHook) => {
  const [errors, setErrors] = useState(null);

  const errorDisplay = (err) => {
    return (
      <>
        <Title level={5}>...Oops</Title>
        <ul className="my-0">
          {err.response.data.errors.map((err, i) => (
            <li key={i}>{err.message}</li>
          ))}
        </ul>
      </>
    );
  };

  const returnAxiosCall = (data: IAxiosRequest) => {
    const { authContext, body, params: paramsInfo, method, url } = data;
    const params = paramsInfo ? paramsInfo : {};
    const currentUser = authContext?.currentUser;

    const headers = { authorization: currentUser };

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

  const doRequest = async (body: any) => {
    const bodyInfo = body ? body : {};
    try {
      const response = await returnAxiosCall({ authContext, bodyInfo });

      // If onSuccess calback was provided, if yes call the fn and send the data
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      if (onFailure) {
        onFailure(err);
      }
      return setErrors(<Alert type="error" message={errorDisplay(err)} showIcon />);
    }
  };

  return [errors, doRequest as (body: any) => Promise<any>];
};

export default useRequest;
