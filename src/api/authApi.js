import axiosAPI from "./axios";

export const authApi = {
    // URL: api/v1/user/isauthenticated/
    checkAuth: () => axiosAPI.get("user/isauthenticated/"),

    // URL: api/v1/user/login/
    login: (credentials) => axiosAPI.post("user/login/", credentials),

    // URL: api/v1/user/signup/
    signup: (credentials) => axiosAPI.post("user/signup/", credentials),

    // URL: api/v1/user/logout/
    logout: () => axiosAPI.post("user/logout/"),

     // URL: api/v1/user/profile/
    getProfile: () => axiosAPI.get("user/profile/"),
};