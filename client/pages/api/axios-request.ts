import axios from "axios";
import { IAuthContext } from "../../src/interfaces/auth.interface";

interface IAxiosRequest {
  authToken?: IAuthContext;
  body: any;
  queryParams: any;
  method: "get" | "post" | "put" | "delete";
  url: string;
}

const returnAxiosCall = (data: IAxiosRequest) => {
  const { authToken, body, queryParams, method, url } = data;
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

// import axios from 'axios'
// import config from './config'
// -
// +import { getUserToken } from './contexts/Auth'
// const { restfulService } = config

// interface IAuthContext {
// }

// interface IAxiosRequest {
// -  authContext: IAuthContext
//   body: any
// -  params: any
// -  method: 'get' | 'post' | 'put' | 'delete'
// +  queryParams: any
// +  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
//   url: string
// }

// -const returnAxiosCall = (data: IAxiosRequest) => {
// -  const { authContext, body, params: paramsInfo, method, url } = data
// -  const userToken = authContext?.userLoggedIn?.userToken
// -  const params = paramsInfo ? paramsInfo : {}
// +const accessToken = getUserToken()

// -  const headers = {
// -    authorization: userToken,
// -  }
// -  switch (method) {
// -    case 'get':
// -      return axios.get(`${restfulService.URL}${url}`, {
// -        headers,
// -        params,
// -      })
// -    case 'post':
// -      return axios.post(`${restfulService.URL}${url}`, body, {
// -        headers,
// -      })
// -    case 'put':
// -      return axios.put(`${restfulService.URL}${url}`, body, {
// -        headers,
// -      })
// -    case 'delete':
// -      return axios.delete(`${restfulService.URL}${url}`, {
// -        headers,
// -      })
// -    default:
// -      return
// +const axiosfn = axios.create({
// +  baseURL: `${restfulService.URL}`,
// +  headers: {
// +    Authorization: accessToken || undefined,
// +  },
// +})

// +export async function AxiosFunction<T = any>(data: IAxiosRequest): Promise<T> {
// +  const accessToken = getUserToken()
// +  const axiosfn = axios.create({
// +    baseURL: `${restfulService.URL}`,
// +    headers: {
// +      Authorization: accessToken || undefined,
// +    },
// +  })
// +
// +  const { body, queryParams, method, url } = data
// +  const params = queryParams ? queryParams : {}
// +
// +  const axiosConfig: any = []
// +
// +  if (method === 'get') {
// +    axiosConfig.push({ params })
// +  } else if (method === 'post') {
// +    axiosConfig.push(body)
// +  } else if (method === 'put') {
// +    axiosConfig.push(body)
// +  } else if (method === 'patch') {
// +    axiosConfig.push(body)
//   }
// -}
// +  console.log('axiosConfig', axiosfn)

// -export async function AxiosFunction(data: IAxiosRequest): Promise<any> {
//   return new Promise((resolve, reject) => {
// -    returnAxiosCall(data)!
// +    axiosfn[method]<T>(url, ...axiosConfig)
//       .then((response) => {
//         const { data } = response
//         if (data) {
//           resolve(data)
//         } else {
//           reject(data)
//         }
//       })
//       .catch((error) => {
//         reject(error)
//       })
//   })
// }
