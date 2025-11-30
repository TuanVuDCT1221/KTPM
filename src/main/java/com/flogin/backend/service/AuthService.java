package com.flogin.backend.service;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // Dùng constructor injection (best practice)
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Login logic:
     - Tìm username
     - Nếu không có -> return false
     - Nếu password match -> true
     - Ngược lại -> false
     */
    public boolean login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .map(user -> user.getPassword().equals(request.getPassword()))
                .orElse(false);
    }
}
