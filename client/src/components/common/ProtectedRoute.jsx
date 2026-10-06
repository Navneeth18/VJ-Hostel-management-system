import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useAdmin } from '../../context/AdminContext';

export const StudentProtectedRoute = ({ children }) => {
    const { user } = useUser();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAdmin();
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
