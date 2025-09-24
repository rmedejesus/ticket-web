import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: "https://192.168.1.57:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();

    if (token) {
      config.headers["Authorization"] = token.token_type + ' ' + token.token;  // for Spring Boot back-end
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
          const rs = await axios.post("https://192.168.1.57:8080/api/v1/refresh-token", { refresh_token: token.refresh_token });

          const accessToken = rs.data;
          TokenService.updateLocalAccessToken(accessToken);

          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;