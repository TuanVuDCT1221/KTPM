import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css"; // import CSS file

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const text = await response.text();
            console.log("Server response:", text);

            if (!response.ok) {
                throw new Error(text || "Đăng nhập thất bại!");
            }

            // ✅ Lưu flag login vào sessionStorage
            sessionStorage.setItem("token", "login_success"); // hoặc text nếu backend trả token

            alert("Đăng nhập thành công!");
            navigate("/products");
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };


  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="loginForm">
        <h1 className="title">LOGIN</h1>
        {error && <p className="error">{error}</p>}

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
