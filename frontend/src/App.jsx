import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProductManager from './components/ProductManager';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <ProductManager />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <ProtectedRoute>
                        <Navigate to="/products" />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
