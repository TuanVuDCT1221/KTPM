import { validateUsername, validatePassword } from "../utils/loginValidation.js";

describe("Unit tests cho validateUsername()", () => {
    test("username rỗng", () => {
        expect(validateUsername("")).toBe("Tên đăng nhập không được để trống");
    });

    test("username quá ngắn", () => {
        expect(validateUsername("ab")).toBe(
            "Tên đăng nhập phải từ 3 đến 50 ký tự"
        );
    });

    test("username quá dài", () => {
        const longUsername = "a".repeat(51);
        expect(validateUsername(longUsername)).toBe(
            "Tên đăng nhập phải từ 3 đến 50 ký tự"
        );
    });

    test("username có ký tự đặc biệt", () => {
        expect(validateUsername("user@123")).toBe(
            "Tên đăng nhập chỉ chứa chữ và số"
        );
    });

    test("username hợp lệ", () => {
        expect(validateUsername("user123")).toBe("");
    });
});

describe("Unit tests cho validatePassword()", () => {
    test("password rỗng", () => {
        expect(validatePassword("")).toBe("Mật khẩu không được để trống");
    });

    test("password quá ngắn", () => {
        expect(validatePassword("Pass1")).toBe(
            "Mật khẩu phải từ 6 đến 100 ký tự"
        );
    });

    test("password không có số", () => {
        expect(validatePassword("Password")).toBe(
            "Mật khẩu phải có cả chữ và số"
        );
    });

    test("password không có chữ", () => {
        expect(validatePassword("123456")).toBe(
            "Mật khẩu phải có cả chữ và số"
        );
    });

    test("password hợp lệ", () => {
        expect(validatePassword("Pass123")).toBe("");
    });
});