import axios, { AxiosError } from "axios";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: "https://ticket-service-964914219323.asia-northeast3.run.app/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers.Authorization = "Bearer " + token.access;  // for Spring Boot back-end
      //config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        if (originalConfig.url === "/profile") {
          return Promise.reject('Unauthorized: Please log in again.');
        }

        try {
          const token = TokenService.getLocalAccessToken();
          const user = TokenService.getUser();
          // const rs = await axios.post("https://ticketing-service-964914219323.asia-northeast3.run.app/api/v1/refresh-token", { refresh_token: token.refresh_token });
          const rs = await axios.post("https://ticket-service-964914219323.asia-northeast3.run.app/api/v1/auth/refresh-token", { id: user.id, refresh_token: token.refresh });
          
          const accessToken = rs.data.token;
          TokenService.updateLocalAccessToken(accessToken);
          const updatedToken = TokenService.getLocalAccessToken();
          originalConfig.headers.Authorization = "Bearer " + updatedToken.access;

          return instance(originalConfig);
        } catch (_error) {
          TokenService.removeUser();
          const err = _error as AxiosError;
          if (err.config?.url === "https://ticket-service-964914219323.asia-northeast3.run.app/api/v1/auth/refresh-token" && err.status === 401) {
            window.location.href = "https://localhost:5173/";
          }
          //return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;