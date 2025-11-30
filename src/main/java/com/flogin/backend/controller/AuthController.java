package com.flogin.backend.controller;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            BindingResult bindingResult) {

        // --- Kiểm tra request null ---
        if (request == null) {
            return ResponseEntity.badRequest().body("Request không được null");
        }

        // --- Xử lý validation error ---
        if (bindingResult.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.badRequest().body(errors.toString());
        }

        // --- Kiểm tra username rỗng hoặc chỉ khoảng trắng ---
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên đăng nhập không được để trống");
        }

        // --- Kiểm tra password rỗng ---
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
        }

        // --- Gọi service ---
        boolean success = authService.login(request);
        if (success) {
            return ResponseEntity.ok("Đăng nhập thành công!");
        } else {
            return ResponseEntity.status(401).body("Username hoặc mật khẩu sai!");
        }
    }
}
