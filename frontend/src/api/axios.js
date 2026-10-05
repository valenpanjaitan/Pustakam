import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
)

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await refreshClient.post(
        "/api/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;

      localStorage.setItem("access_token", newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      if (logoutCallback) {
        logoutCallback();
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;