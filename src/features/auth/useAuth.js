import { useDispatch, useSelector } from "react-redux";
import { setLoading, setIsAuthenticated, setUser } from "./authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";  

/**
 * Custom hook for authentication operations
 */
export function useAuth() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkAuth = async () => {
    dispatch(setLoading(true));
    try {
      const res = await authApi.checkAuth();
      const isAuth = res.data.authenticated;
      dispatch(setIsAuthenticated(isAuth));
      return isAuth;
    } catch (err) {
      console.error("Auth check failed", err);
      dispatch(setIsAuthenticated(false));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginUser = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.login(credentials);
      const data = res.data;
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(true));
      
      if (data) {
        dispatch(setUser(data)); // Reducer now handles id/_id
      }

      toast.success("Login successful");
      navigate("/"); 
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const signupUser = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.signup(credentials);
      const data = res.data;


      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(true));
      
      if (data) {
        dispatch(setUser(data));
      }

      toast.success("Sign up successful");
      navigate("/"); 
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      toast.error(err.response?.data?.error || "Sign up failed");
    }
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
      dispatch(setIsAuthenticated(false));
      dispatch(setUser({ id: null, username: "", email: "" }));
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      dispatch(setIsAuthenticated(false));
      toast.error("Logout failed");
    } finally {
        dispatch(setLoading(false));
    }
  };

  const fetchUser = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.getProfile();
      dispatch(setLoading(false));
  
      dispatch(setUser(res.data.data || res.data)); 
      dispatch(setIsAuthenticated(true));
    } catch (error) {
      dispatch(setLoading(false));
  
      console.error("Fetch user failed", error);
    }
  };

  return {
    authState,
    checkAuth,
    loginUser,
    signupUser,
    logoutUser,
    fetchUser,
  };
}