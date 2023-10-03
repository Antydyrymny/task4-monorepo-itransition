import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

const LazyTable = React.lazy(() => import('./pages/table/Table'));
const LazyLogin = React.lazy(() => import('./pages/login/Login'));
const LazyRegister = React.lazy(() => import('./pages/register/Register'));

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path='/' element={<LazyTable />} />
                <Route path='/login' element={<LazyLogin />} />
                <Route path='/register' element={<LazyRegister />} />
            </Routes>
        </Suspense>
    );
}

export default App;
