import { describe, it, expect } from 'vitest';
import { validateUsername, validatePassword } from './LoginValidation';

describe("Unit tests cho validateUsername()", () => {

  it("username rỗng", () => {
    expect(validateUsername("")).toBe("Tên đăng nhập không được để trống");
  });

  it("username quá ngắn", () => {
    expect(validateUsername("ab")).toBe("Tên đăng nhập phải từ 3 đến 50 ký tự");
  });

  it("username quá dài", () => {
    const longUsername = "a".repeat(51);
    expect(validateUsername(longUsername)).toBe("Tên đăng nhập phải từ 3 đến 50 ký tự");
  });

  it("username có ký tự đặc biệt", () => {
    expect(validateUsername("user@123")).toBe("Tên đăng nhập chỉ chứa chữ và số");
  });

  it("username hợp lệ", () => {
    expect(validateUsername("user123")).toBe("");
  });

});

describe("Unit tests cho validatePassword()", () => {

  it("password rỗng", () => {
    expect(validatePassword("")).toBe("Mật khẩu không được để trống");
  });

  it("password quá ngắn", () => {
    expect(validatePassword("Pass1")).toBe("Mật khẩu phải từ 6 đến 100 ký tự");
  });

  it("password không có số", () => {
    expect(validatePassword("Password")).toBe("Mật khẩu phải có cả chữ và số");
  });

  it("password không có chữ", () => {
    expect(validatePassword("123456")).toBe("Mật khẩu phải có cả chữ và số");
  });

  it("password hợp lệ", () => {
    expect(validatePassword("Pass123")).toBe("");
  });

});
