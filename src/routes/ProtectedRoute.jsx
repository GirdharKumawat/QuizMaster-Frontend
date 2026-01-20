import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { Loader, Card } from "../components/UI/ui";

function ProtectedRoute({ children }) {
  const { checkAuth, authState } = useAuth();
  const { isAuthenticated } = authState;
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    const validateAuth = async () => {
      if (hasChecked.current) return;
      hasChecked.current = true;

      // If already authenticated in Redux, skip API call
      if (isAuthenticated) {
        setIsValid(true);
        setIsChecking(false);
        return;
      }

      try {
        const authResult = await checkAuth();
        if (authResult) {
          setIsValid(true);
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("Error during auth check", err);
        navigate("/login", { replace: true });
      }
      setIsChecking(false);
    };

    validateAuth();
  }, []);

  if (isChecking) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
                <Loader variant="bouncing" size="sm" />
        </div>
    );
  }

  if (!isValid && !isAuthenticated) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
 