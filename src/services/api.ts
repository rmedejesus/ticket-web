import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: "https://ticket-service-964914219323.asia-northeast3.run.app/api/v1/",
  //baseURL: "http://localhost:5000/api/v1/",
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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void; config: any }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    // if (originalConfig.url !== "/login" && err.response) {
      
    // }

    // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        //originalConfig._retry = true;

        // if (originalConfig.url === "/profile") {
        //   return Promise.reject('Unauthorized: Please log in again.');
        // }

        if (isRefreshing) {
          // If a token refresh is already in progress, queue the failed request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalConfig });
          }).then((token) => {
            originalConfig.headers.Authorization = `Bearer ${token}`;
            return instance(originalConfig);
          });
        }

        originalConfig._retry = true; // Mark the request as retried
        isRefreshing = true;

        const token = TokenService.getLocalAccessToken(); // Get your stored refresh token
        const user = TokenService.getUser();

        if (!token.refresh) {
          TokenService.removeUser(); // Clear tokens and potentially redirect to login
          //window.location.href = "http://localhost:4200/login";
          window.location.href = "https://ticket-web-wu7p.onrender.com/";
          return Promise.reject(err);
        }

        try {
          //const token = TokenService.getLocalAccessToken();
          //const user = TokenService.getUser();
          //const rs = await axios.post("http://localhost:5000/api/v1/auth/refresh-token", { id: user.id, refresh_token: token.refresh });
          const rs = await axios.post("https://ticket-service-964914219323.asia-northeast3.run.app/api/v1/auth/refresh-token", { id: user.id, refresh_token: token.refresh });

          const accessToken = rs.data.token;
          //TokenService.updateLocalAccessToken(accessToken);
          localStorage.setItem("token", JSON.stringify(accessToken));
          //const updatedToken = TokenService.getLocalAccessToken();

          instance.defaults.headers.common.Authorization = "Bearer " + accessToken.access;
          originalConfig.headers.Authorization = "Bearer " + accessToken.access;

          isRefreshing = false;
          processQueue(null, accessToken.access);

          return instance(originalConfig);
        } catch (_error) {
          TokenService.removeUser();
          window.location.href = "https://ticket-web-wu7p.onrender.com/";
          //window.location.href = "http://localhost:4200/login";
          isRefreshing = false;
          processQueue(_error);
          // const err = _error as AxiosError;
          // if (err.config?.url === "https://ticket-service-964914219323.asia-northeast3.run.app/api/v1/auth/refresh-token" && err.status === 401) {
          //   window.location.href = "https://ticket-web-wu7p.onrender.com/";
          // }
          return Promise.reject(_error);
        }
      }

    return Promise.reject(err);
  }
);

export default instance;