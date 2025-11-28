package com.flogin.backend.controller;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.authenticate(request.getUsername(), request.getPassword());

            LoginResponse successResponse = new LoginResponse(
                    true,
                    "Đăng nhập thành công!", 
                    token,
                    null 
            );
            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            LoginResponse errorResponse = new LoginResponse(
                    false,
                    e.getMessage(), 
                    null,
                    null);
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}