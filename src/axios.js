import axios from "axios";
import { API_ENDPOINT } from "./key";

// Minimal axios instance used across the app
const axiosAPI = axios.create({
    baseURL: API_ENDPOINT+"api/v1/",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Simple refresh-on-401 interceptor. If refresh fails, redirect to login.
axiosAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest?._retry) {
            // Don't attempt to refresh if the failing request is the refresh endpoint itself
            if (originalRequest.url?.includes("refresh-token") || originalRequest.url?.includes("user/refresh/")) {
                // window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            try {
                // Call refresh endpoint using raw axios (bypass axiosAPI interceptors)
                await axios.post(`${API_ENDPOINT}api/v1/user/refresh-token/`, null, { withCredentials: true });
                // Retry original request
                return axiosAPI(originalRequest);
            } catch (refreshError) {
                // window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosAPI;