import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import { validateUsername, validatePassword } from "../test/LoginValidation";

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset server error
    setServerError('');

    // Validate username
    const uError = validateUsername(username);
    if (uError) {
      setUsernameError(uError);
      return;
    } else {
      setUsernameError('');
    }

    // Validate password
    const pError = validatePassword(password);
    if (pError) {
      setPasswordError(pError);
      return;
    } else {
      setPasswordError('');
    }

    // =======================
    // CALL BACKEND
    // =======================
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      console.log("Server response:", text);

      if (!response.ok) {
        throw new Error(text || "Đăng nhập thất bại!");
      }

      // Lưu flag token
      sessionStorage.setItem("token", "login_success");

      alert("Đăng nhập thành công!");
      navigate("/products");

    } catch (err) {
      console.error("Error:", err);
      setServerError(err.message);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="loginForm">
        <h1 className="title">LOGIN</h1>

        {serverError && <p className="error">{serverError}</p>}

        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Nhập username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p className="error">{usernameError}</p>}
        </div>

        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error">{passwordError}</p>}
        </div>

        <button type="submit">Đăng nhập</button>

        <p>
          Chưa có tài khoản?{' '}
          <a href="/register" className="link">
            Đăng ký ngay
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
