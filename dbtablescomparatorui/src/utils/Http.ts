import axios from "axios";
import { BASE_API } from "./Constant";

const axiosInstance = axios.create({
  baseURL: BASE_API,
  maxBodyLength: Infinity,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
