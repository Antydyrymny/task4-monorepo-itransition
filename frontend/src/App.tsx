import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes></Routes>
        </Suspense>
    );
}

export default App;
