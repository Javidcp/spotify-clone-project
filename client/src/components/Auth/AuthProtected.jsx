import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AuthProtected = ({children}) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
        }
        return <Navigate to="/" />;
    }

    return children;
}

export default AuthProtected