import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { validateUsername, validatePassword } from "../utils/LoginValidation";
import api from "../services/api";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setServerError("");

        // --- validate username ---
        const uError = validateUsername(username);
        if (uError) {
            setUsernameError(uError);
            return;
        } else {
            setUsernameError("");
        }

        // --- validate password ---
        const pError = validatePassword(password);
        if (pError) {
            setPasswordError(pError);
            return;
        } else {
            setPasswordError("");
        }

        try {
            // Gọi backend: /auth/login
            const res = await api.post("/auth/login", { username, password });
            const data = res.data;

            console.log("Login response data:", data);

            // data phải có dạng { success, message, username, token }
            if (!data || data.success !== true) {
                setServerError(data?.message || "Đăng nhập thất bại!");
                return;
            }

            // lưu token + username
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);

            alert(data.message || "Đăng nhập thành công!");
            navigate("/products");
        } catch (err) {
            console.error("Login error:", err);

            if (err.response) {
                // lỗi từ server (400/401,...)
                const respData = err.response.data;
                if (err.response.status === 401 && respData === "Invalid or expired token") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                }

                if (typeof respData === "string") {
                    setServerError(respData);
                } else if (respData && respData.message) {
                    setServerError(respData.message);
                } else {
                    setServerError("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
                }
            } else {
                // lỗi network / axios
                setServerError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
            }
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
                </div>
                {usernameError && <p className="error">{usernameError}</p>}

                <div>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {passwordError && <p className="error">{passwordError}</p>}

                <button type="submit">Đăng nhập</button>

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