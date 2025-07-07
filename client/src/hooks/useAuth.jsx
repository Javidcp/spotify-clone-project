import { useSelector } from 'react-redux';

const useAuth = () => {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return { 
        isAuthenticated, 
        isAdmin: user?.role === 'admin',
        user 
    };
};

export default useAuth;