    import { useEffect } from "react";
    import { Navigate, useNavigate } from "react-router-dom";

    const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
    
        const syncLogout = (event) => {
        if (event.key === "authToken" && !event.newValue) {
            navigate("/login", { replace: true });
        }
        };

        window.addEventListener("storage", syncLogout);

        return () => {
        window.removeEventListener("storage", syncLogout);
        };
    }, [navigate]);

    if (!token) return <Navigate to="/login" replace />;

    return children;
    };

    export default ProtectedRoutes;
