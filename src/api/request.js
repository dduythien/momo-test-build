import axios from "axios";

import { getStore } from "../utils/utils";
import { COOKIE_NAMES } from "../utils/constant";

const request = axios.create({
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = (error) => {
  throw error;
};


request.interceptors.request.use(async (config) => {
  const accessToken = await getStore(COOKIE_NAMES.ACCESS_TOKEN);

  config.headers = {
    ...config.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  return config;
});

request.interceptors.response.use((response) => {
  return response?.data;
}, handleError);

export default request;
