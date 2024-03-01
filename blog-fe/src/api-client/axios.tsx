import Axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

import { baseApiURL } from "@/utils/consts/baseImageUrl";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "@/utils/consts/token.const";
import { deleteCookie, setCookie } from "cookies-next";

export type ApiBase<T = unknown, D = unknown> =
  | AxiosResponse<T, D>
  | AxiosError<T, D>;

export function isAxiosResponse<T = any>(args: any): args is AxiosResponse<T> {
  return args.data !== undefined;
}

export function isAxiosError<T = any>(args: any): args is AxiosError<T> {
  return !(args.status === 200 || args.status === 201);
}

const axios: AxiosInstance = Axios.create({
  baseURL: baseApiURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
axios.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage after a successful login
    const token = localStorage.getItem(ACCESS_TOKEN_NAME);

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
axios.interceptors.response.use(
  async (response) => {
    if (response.config.responseType === "blob") {
      return response;
    }
    return {
      ...response,
      data: response.data.data,
      status: response.data.statusCode,
      message: response.data.message,
    };
  },
  async (error) => {
    const originalRequest = error.config;
    const errorResponse = {
      data: error.response.data,
      message: error.response.data.message,
      status: error.response.data.statusCode,
    };

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshAxiosInstance = Axios.create({
          baseURL: baseApiURL,
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const refreshResponse = await refreshAxiosInstance.get("auth/refresh");
        if (
          isAxiosResponse(refreshResponse) &&
          refreshResponse.data?.data &&
          refreshResponse.status === 200
        ) {
          setCookie(ACCESS_TOKEN_NAME, refreshResponse.data.data.accessToken);
        }

        return axios(originalRequest);
      } catch (error) {
        deleteCookie(ACCESS_TOKEN_NAME);
        deleteCookie(REFRESH_TOKEN_NAME);
        if (
          typeof window !== "undefined" &&
          !window.location?.pathname.includes("login")
        ) {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject({
      ...error,
      response: errorResponse,
    });
  },
);
export default axios;
