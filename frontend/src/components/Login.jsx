import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

import { loginUser } from "../services/authService";

const LoginForm = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const result = await loginUser(username, password); // gửi username thay vì email

    if (result.success) {
      sessionStorage.setItem("token", result.token || "login_success");

      setMessage("Đăng nhập thành công!");

      // Điều hướng
      navigate("/products");
    } else {
      setMessage(result.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="loginForm">
        <h1 className="title">LOGIN</h1>

        {/* message */}
        {message && (
          <p data-testid="login-message" className="error">
            {message}
          </p>
        )}

        <div>
          <label htmlFor="username">Username:</label>
          <input
            data-testid="username-input"
            type="text"
            id="username"
            placeholder="Nhập username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            data-testid="password-input"
            type="password"
            id="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button data-testid="login-button" type="submit">
          Đăng nhập
        </button>

        <p>
          Chưa có tài khoản?{" "}
          <a href="/register" className="link">
            Đăng ký ngay
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
