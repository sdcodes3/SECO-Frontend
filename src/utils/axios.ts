import axios from "axios";
import API_CONSTANTS from "./apiConstants";

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_CONSTANTS.BASE_URL,
    withCredentials: true,
  });
  return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;