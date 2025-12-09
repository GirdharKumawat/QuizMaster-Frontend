import React, { useEffect ,useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

function ProtectedRoute({ children }) {
    const { checkAuth ,authState } = useAuth();
    const { isAuthenticated } = authState;
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const validateAuth = async () => {
            if (!isAuthenticated) {
                try {
                    const isValid = await checkAuth();
                    if (!isValid) {
                        navigate("/login");
                    }
                } catch (error) {
                    navigate("/login");
                }
            }
            setIsChecking(false);
        };

        validateAuth();
    }, [isAuthenticated, checkAuth, navigate]);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
}



export default ProtectedRoute;
