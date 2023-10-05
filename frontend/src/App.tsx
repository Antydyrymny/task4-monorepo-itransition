import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ProtectedRoute from './features/auth/ProtectedRoute';
import usePreservedState from './hooks/usePreservedState';
import { useAppDispatch } from './app/storeHooks';
import { authStorageKey, storeAuth, Authenticated } from './features/auth/authSlice';

const LazyUserTable = React.lazy(() => import('./pages/userTable/UserTable'));
const LazyLogin = React.lazy(() => import('./pages/login/Login'));
const LazyRegister = React.lazy(() => import('./pages/register/Register'));

function App() {
    const dispatch = useAppDispatch();
    usePreservedState(authStorageKey, (state: Authenticated) =>
        dispatch(storeAuth(state))
    );

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path='/' element={<ProtectedRoute Component={LazyUserTable} />} />
                <Route path='/login' element={<LazyLogin />} />
                <Route path='/register' element={<LazyRegister />} />
            </Routes>
        </Suspense>
    );
}

export default App;
