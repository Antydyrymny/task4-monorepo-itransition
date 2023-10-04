import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/storeHooks';
import { selectCurrentUser } from '../features/auth/authSlice';

/**
 * Redirects to target page when user is authenticated
 * @param target route to navigate to
 */
export default function useRedirectAuthenticated(target: string) {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectCurrentUser);

    useEffect(() => {
        if (isAuthenticated) navigate(target, { replace: true });
    }, [isAuthenticated, navigate, target]);
}
