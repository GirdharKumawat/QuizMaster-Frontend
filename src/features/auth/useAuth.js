import { useDispatch, useSelector } from "react-redux";
import { setLoading, setIsAuthenticated, setUser } from "./authSlice";
import { authApi } from "../../api/authApi";  
import { toast } from "../../components/UI/ui";
/**
 * Custom hook for authentication operations
 */
export function useAuth() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const checkAuth = async () => {
    dispatch(setLoading(true));
    try {
      const res = await authApi.checkAuth();
      const isAuth = res.data.authenticated;
      dispatch(setIsAuthenticated(isAuth));
      return isAuth;
    } catch (err) {
      dispatch(setIsAuthenticated(false));
      console.log("Auth check failed", err);
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
      globalThis.location.href = "/home";
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      console.error("Login failed", err);
      toast.error({ 
        title: "Login Failed", 
        detail: err.response?.data?.message || "Please check your credentials" 
      });
    }
  };

  const signupUser = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const res = await authApi.signup(credentials);
      const data = res.data;
      dispatch(setIsAuthenticated(true));
      
      if (data) {
        dispatch(setUser(data));
      }

      toast.success({ title: "Success", detail: "Account created successfully" });
      globalThis.location.href = "/home";
    } catch (err) {
      dispatch(setIsAuthenticated(false));
      toast.error({ 
        title: "Sign Up Failed", 
        detail: err.response?.data?.error || "Unable to create account" 
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
      dispatch(setIsAuthenticated(false));
      dispatch(setUser({ _id: null, username: "", email: "", role: "" }));
      toast.success({ title: "Success", detail: "Logged out successfully" });
      globalThis.location.href = "/login";
    } catch (error) {
      dispatch(setIsAuthenticated(false));
      console.error("Logout failed", error);
      toast.error({ title: "Error", detail: "Failed to logout" });
    } finally {
        dispatch(setLoading(false));
    }
  };

  const fetchUser = async () => {
    try {
    
      dispatch(setLoading(true));
      const res = await authApi.getProfile();
      dispatch(setLoading(false));
      dispatch(setUser( res.data)); 
      dispatch(setIsAuthenticated(true));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticated(false));
      console.error("Fetch user failed", error);
    }
  };

  const loginAsGuest = async () => {
    dispatch(setIsAuthenticated(true));
    dispatch(
      setUser({
        _id: "guest_123",
        username: "Guest",
        role: "guest",
      })
    );
  };

  return {
    authState,
    checkAuth,
    loginUser,
    signupUser,
    logoutUser,
    fetchUser,
    loginAsGuest,
  };
}