import axios from "axios";
import { BASE_API } from "./Constant";

export const axiosClient = axios.create({
  baseURL: BASE_API,
});

/* axiosClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");

  config.headers.Authorization = accessToken && `Bearer ${accessToken}`;
  return config;
}); */

const ApiService = {
  get: async (url: string, data?: any) => {
    const resp = await axiosClient.get(url, data);
    return resp;
  },
  post: async (url: string, data?: any) => {
    const resp = await axiosClient.post(url, data);
    return resp;
  },
  put: async (url: string, data?: any) => {
    const resp = await axiosClient.put(url, data);
    return resp;
  },
  patch: async (url: string, data?: any) => {
    const resp = await axiosClient.patch(url, data);
    return resp;
  },
  delete: async (url: string, data?: any) => {
    const resp = await axiosClient.delete(url, data);
    return resp;
  },
};

export default ApiService;
