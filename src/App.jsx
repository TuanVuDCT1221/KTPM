import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProductManager from './components/ProductManager';

function App() {
  const token = sessionStorage.getItem("token");

  return (
    <>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Trang quản lý sản phẩm */}
        <Route
          path="/products"
          element={token ? <ProductManager /> : <Navigate to="/login" />}
        />

        {/* Redirect tất cả route không hợp lệ */}
        <Route
          path="*"
          element={<Navigate to={token ? "/products" : "/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;
