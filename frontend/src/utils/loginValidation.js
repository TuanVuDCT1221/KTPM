// validate username
export const validateUsername = (username) => {
    if (!username || username.trim() === "") {
        return "Tên đăng nhập không được để trống";
    }

    const u = username.trim();
    if (u.length < 3 || u.length > 50) {
        return "Tên đăng nhập phải từ 3 đến 50 ký tự";
    }

    const usernameRegex = /^[A-Za-z0-9]+$/;
    if (!usernameRegex.test(u)) {
        return "Tên đăng nhập chỉ chứa chữ và số";
    }

    return ""; // hợp lệ
};

// validate password
export const validatePassword = (password) => {
    if (!password || password.trim() === "") {
        return "Mật khẩu không được để trống";
    }

    if (password.length < 6 || password.length > 100) {
        return "Mật khẩu phải từ 6 đến 100 ký tự";
    }

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
        return "Mật khẩu phải có cả chữ và số";
    }

    return ""; // hợp lệ
};