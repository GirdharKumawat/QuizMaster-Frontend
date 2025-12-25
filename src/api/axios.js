import axios from "axios";
import { API_ENDPOINT } from "../key";

const axiosAPI = axios.create({
    baseURL: API_ENDPOINT + "api/", 
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

axiosAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
    
        if (error.response?.status === 401 && !originalRequest?._retry) {
        
        if (originalRequest.url?.includes("refresh-token")) {
                throw error;
            }

            originalRequest._retry = true;

            await axios.post(`${API_ENDPOINT}api/user/refresh-token/`, null, { withCredentials: true });
            return axiosAPI(originalRequest);
        }
        
    
        throw error;
    }
);

export default axiosAPI;