import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

function ProtectedRoute({ children }) {
    const { checkAuth, authState } = useAuth();
    const { isAuthenticated } = authState;
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const hasChecked = useRef(false);

    useEffect(() => {
        const validateAuth = async () => {
            if (hasChecked.current) return;
            hasChecked.current = true;

            if (!isAuthenticated) {
                try {
                    const isValid = await checkAuth();
                    if (!isValid) {
                        navigate("/login", { replace: true });
                    }
                } catch (err) {
                    console.error("Error during auth check", err);
                    navigate("/login", { replace: true });
                }
            }
            setIsChecking(false);
        };

        validateAuth();
    }, []);  

    if (isChecking && !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
}

export default ProtectedRoute;