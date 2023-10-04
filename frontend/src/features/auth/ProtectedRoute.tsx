import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from './authSlice';

type ProtectedRouteProps = {
    Component: React.FunctionComponent;
    redirectRoute?: string;
};

function ProtectedRoute({ Component, redirectRoute = '/login' }: ProtectedRouteProps) {
    const isAuthenticated = useAppSelector(selectCurrentUser);

    return isAuthenticated ? <Component /> : <Navigate to={redirectRoute} replace />;
}

export default ProtectedRoute;
