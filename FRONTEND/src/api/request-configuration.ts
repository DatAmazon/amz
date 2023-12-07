import type { AxiosRequestConfig, Method } from 'axios';
import { message as $message } from 'antd';
import axios from 'axios';
import store from '@/stores';
import { setGlobalState } from '@/stores/systems/global.store';
// import { history } from '@/routes/history';

const generateUrl = () => {
  let port: string;
  let baseUrl: string | undefined;
  if (document.location.port === "8889") return baseUrl = `${import.meta.env.VITE_API}`;
  if (document.location.port != "80" && document.location.port != "445") {
    port = ":" + document.location.port.toString();
    return baseUrl = document.location.protocol + "//" + document.location.hostname + port + "/api";
  }
}

const axiosInstance = axios.create({
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
  baseURL: generateUrl()
});

axiosInstance.interceptors.request.use(
  config => {
    // console.log(store.getState());
    store.dispatch(setGlobalState({ loading: true, }),);
    const authToken = localStorage.getItem('jwt');
    if (authToken && config) config.headers!.Authorization = `Bearer ${authToken}`;
    return config;
  },
  error => {
    store.dispatch(setGlobalState({ loading: false, }),);
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    store.dispatch(setGlobalState({ loading: false, }),);
    return {
      status: true,
      message: null,
      result: config?.data,
    };
  },
  error => {
    store.dispatch(setGlobalState({ loading: false, }),);
    if (error?.response?.status === 401) window.location.replace('/login');

    // if needs to navigate to login page when request exception
    let errorMessage = 'Ngoại lệ hệ thống';
    if (error?.message?.includes('Network Error')) errorMessage = 'Lỗi mạng, vui lòng kiểm tra mạng của bạn';
    else errorMessage = error?.response?.data.message + "\n" + error?.response?.data.errors[0]?.messages;
    error.message && $message.error(errorMessage);

    return {
      status: false,
      message: errorMessage,
      result: null,
    };
  },
);

export type Response<T = any> = {
  status: boolean;
  message: string;
  result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Lowercase<Method>,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  // const prefix = '/api'
  let response = new Promise<Response<T>>(function (resolve, reject) {
    // your logic goes here ..
  });
  const prefix = ''; url = prefix + url;
  switch (method) {
    case 'post':
      response = axiosInstance.post(url, data, config);
      break;
    case 'delete':
      response = axiosInstance.delete(url, { params: data, ...config, });
      break;
    case 'put':
      response = axiosInstance.put(url, data, config);
      break;
    default:
      response = axiosInstance.get(url, { params: data, ...config, });
      break;
  }
  // if (method === 'post')
  //   return axiosInstance.post(url, data, config);
  // else if (method === 'delete')
  //   return axiosInstance.delete(url, { params: data, ...config, });
  // else
  //   return axiosInstance.get(url, { params: data, ...config, });
  return response;
};
