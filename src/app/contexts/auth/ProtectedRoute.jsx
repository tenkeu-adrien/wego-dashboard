import { Navigate } from 'react-router-dom';
import { useAuthContext } from './context';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
};