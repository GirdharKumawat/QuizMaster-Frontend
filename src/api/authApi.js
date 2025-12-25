import axiosAPI from "./axios";

export const authApi = {
    // URL: api/user/isauthenticated/
    checkAuth: () => axiosAPI.get("user/isauthenticated/"),

    // URL: api/user/login/
    login: (credentials) => axiosAPI.post("user/login/", credentials),

    // URL: api/user/signup/
    signup: (credentials) => axiosAPI.post("user/signup/", credentials),

    // URL: api/user/logout/
    logout: () => axiosAPI.post("user/logout/"),

    // URL: api/user/profile/
    getProfile: () => axiosAPI.get("user/profile/"),
};