package com.flogin.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Username bắt buộc")
    @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username chỉ chứa chữ cái và số")
    private String username;

    @NotBlank(message = "Password bắt buộc")
    @Size(min = 6, max = 100, message = "Password phải từ 6-100 ký tự")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Password phải chứa ít nhất một chữ cái và một số")
    private String password;
}