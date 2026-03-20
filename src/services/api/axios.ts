import { LOCAL_STORAGE_CONSTANTS } from "../../helpers/constants";
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL,
  timeout: 15000,
});

const requestHandler = (config: InternalAxiosRequestConfig) => {
  if (!window.navigator.onLine) {
    return Promise.reject(new Error("Network Error"));
  }

  let token = localStorage.getItem(LOCAL_STORAGE_CONSTANTS.AUTH_TOKEN);

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
};

const responseHandler = (response: AxiosResponse) => {
  return Promise.resolve(response);
};

Axios.interceptors.request.use(
  async (config) => {
    return requestHandler(config);
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return responseHandler(response);
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_CONSTANTS.AUTH_TOKEN);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: status || 500,
      errors: error.response?.data?.errors || null,
    });
  },
);

export default Axios;
