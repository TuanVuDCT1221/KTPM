package com.flogin.backend.service;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Hàm cũ: login trả về boolean
     *
     */
    public boolean login(LoginRequest request) {
        LoginResponse response = authenticate(request);
        return response != null && response.isSuccess();
    }

    /**
     * Hàm mới: dùng cho module unit test / security:
     * - Tìm username
     * - Nếu không có -> failure
     * - Nếu password sai -> failure
     * - Nếu đúng -> sinh JWT + trả LoginResponse success
     */
    public LoginResponse authenticate(LoginRequest request) {
        if (request == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Request không được null")
                    .username(null)
                    .token(null)
                    .build();
        }

        return userRepository.findByUsername(request.getUsername())
                .map(user -> buildResponseForUser(user, request.getPassword()))
                .orElseGet(() -> LoginResponse.builder()
                        .success(false)
                        .message("Username hoặc mật khẩu sai!")
                        .username(null)
                        .token(null)
                        .build()
                );
    }

    private LoginResponse buildResponseForUser(User user, String rawPassword) {
        // So sánh password bằng BCrypt (hash)
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Username hoặc mật khẩu sai!")
                    .username(null)
                    .token(null)
                    .build();
        }

        // Sinh JWT bằng JwtUtil
        String token = jwtUtil.generateToken(user);

        return LoginResponse.builder()
                .success(true)
                .message("Đăng nhập thành công!")
                .username(user.getUsername())
                .token(token)
                .build();
    }
}