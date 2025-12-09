import axiosAPI from "../../axios";
import axios from "axios";
import { API_ENDPOINT } from "../../key";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setIsAuthenticated, setUser } from "./authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for authentication operations
 * Use this hook in components that need authentication functionality
 */
export function useAuth() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkAuth = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axiosAPI.get("user/isauthenticated/");
      const isAuth = res.data.authenticated;
      dispatch(setIsAuthenticated(isAuth));
      return isAuth;
    } catch (err) {
      dispatch(setIsAuthenticated(false));
        return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Function to login a user
   * @param {Object} credentials - The user's login credentials
   * @returns {Promise<Object>} The login response data
   */
  const loginUser = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosAPI.post("user/login/", credentials);
      const data = res.data;

      // Dispatch actions to update state
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(true));
      // Store user data if available
      if (data) {
        dispatch(
          setUser({
            id: data.id,
            username: data.username,
            email: data.email,
          })
        );
      }

      // toast notification for successful login
      toast.success("Login successful", {
        description: "You have successfully logged in.",
        duration: 3000,
      });
      navigate("/"); // Redirect to home or desired page after login
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      // toast notification for login failure
      toast.error("Login failed ", {
        description: "Invalid credentials",
        duration: 3000,
      });
    }
  };

  /**
   * Function to register a new user
   * @param {Object} credentials - The user's registration data
   * @returns {Promise<Object>} The signup response data
   */
  const signupUser = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosAPI.post("user/signup/", credentials);
      const data = res.data;
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(true));
      dispatch(
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
        })
      );

      // toast notification for successful signup
      toast.success("Sign up successful", {
        description: "Your account has been created successfully.",
        duration: 3000,
      });
      navigate("/"); // Redirect to home or desired page after signup
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      console.error("Signup error:", err);
      // toast notification for signup failure
      toast.error("Sign up failed", {
        description: err.response.data?.error,
        duration: 3000,
      });
    }
  };

  // Refresh token logic can be added here

  const refreshUser = async () => {
    try {
      // Call refresh endpoint with raw axios to avoid interceptor loops
      await axios.post(`${API_ENDPOINT}api/v1/user/refresh-token/`, null, {
        withCredentials: true,
      });
      // If refresh is successful, update auth state
      dispatch(setIsAuthenticated(true));
      return true;
    } catch (err) {
      dispatch(setIsAuthenticated(false));
      toast.error("Failed to refresh user", {
        description: err.response?.data?.message || err.message,
        duration: 3000,
      });
      return false;
    }
  };

  // logout function can be added here if needed
  const logoutUser = async () => {
    try {
      await axiosAPI.post("user/logout/");

      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      dispatch(setUser({ id: null, username: "", email: "" }));

      // toast notification for successful logout
      toast.success("Logout successful", {
        description: "You have successfully logged out.",
        duration: 3000,
      });
      navigate("/login");
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      dispatch(setUser({ id: null, username: "", email: "" }));

      // toast notification for logout failure
      toast.error("Logout failed", {
        description: "An error occurred while logging out.",
        duration: 3000,
      });
    }
  };

  const fetchUser = async () => {
    try {
      dispatch(setLoading(true));

      // ensure trailing slash to match backend routes
      const res = await axiosAPI.get("user/profile/");
      dispatch(setLoading(false));
      dispatch(setUser(res.data));
      dispatch(setIsAuthenticated(true));
    } catch (error) {
      // If token expired (401 error), try to refresh
      if (error.response?.status === 401) {
        const refreshed = await refreshUser();
        if (refreshed) {
          // Retry fetching user data after successful refresh
          try {
            const res = await axiosAPI.get("user/profile");
            dispatch(setLoading(false));
            dispatch(setUser(res.data.data));
            dispatch(setIsAuthenticated(true));
          } catch (retryError) {
            dispatch(setLoading(false));
            logoutUser(); // Logout if retry also failed
          }
        } else {
          dispatch(setLoading(false));
          logoutUser(); // Logout if refresh failed
        }
      } else {
        dispatch(setLoading(false));
        toast.error("Failed to fetch user data", {
          description: error.response?.data?.message || error.message,
          duration: 3000,
        });
      }
    }
  };

  return {
    authState,
    checkAuth,
    loginUser,
    signupUser,
    refreshUser,
    logoutUser,
    fetchUser,
  };
}
