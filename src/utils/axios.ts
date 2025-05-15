import axios from "axios";
import API_CONSTANTS from "./apiConstants";

const createAxiosInstance = () => {
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const instance = axios.create({
    baseURL: API_CONSTANTS.BASE_URL
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
