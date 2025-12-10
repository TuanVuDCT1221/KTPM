package com.flogin.backend;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.security.JwtUtil;
import com.flogin.backend.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("authenticate() - Đăng nhập thành công -> success=true, có token, username đúng")
    void authenticate_Success() {
        // GIVEN
        String username = "nhuan";
        String rawPassword = "abc123";
        String encodedPassword = "$2a$10$abcdef...."; //giả
        String fakeToken = "jwt-token-123";

        LoginRequest request = LoginRequest.builder()
                .username(username)
                .password(rawPassword)
                .build();

        User user = User.builder()
                .id(1L)
                .username(username)
                .password(encodedPassword)
                .build();

        when(userRepository.findByUsername(username))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(rawPassword, encodedPassword))
                .thenReturn(true);

        when(jwtUtil.generateToken(user))
                .thenReturn(fakeToken);

        // WHEN
        LoginResponse response = authService.authenticate(request);

        // THEN
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Đăng nhập thành công!", response.getMessage());
        assertEquals(username, response.getUsername());
        assertEquals(fakeToken, response.getToken());

        // login() bọc authenticate() nên cũng phải trả true
        assertTrue(authService.login(request));
    }

    @Test
    @DisplayName("authenticate() - User không tồn tại -> thất bại")
    void authenticate_UserNotFound() {
        // GIVEN
        LoginRequest request = LoginRequest.builder()
                .username("khong_ton_tai")
                .password("abc123")
                .build();

        when(userRepository.findByUsername(request.getUsername()))
                .thenReturn(Optional.empty());

        // WHEN
        LoginResponse response = authService.authenticate(request);

        // THEN
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Username hoặc mật khẩu sai!", response.getMessage());
        assertNull(response.getUsername());
        assertNull(response.getToken());

        assertFalse(authService.login(request));
    }

    @Test
    @DisplayName("authenticate() - Sai password -> thất bại")
    void authenticate_WrongPassword() {
        // GIVEN
        String username = "nhuan";
        String rawPassword = "sai_pass";
        String encodedPassword = "$2a$10$abcdef....";

        LoginRequest request = LoginRequest.builder()
                .username(username)
                .password(rawPassword)
                .build();

        User user = User.builder()
                .id(1L)
                .username(username)
                .password(encodedPassword)
                .build();

        when(userRepository.findByUsername(username))
                .thenReturn(Optional.of(user));

        // passwordEncoder.matches -> false
        when(passwordEncoder.matches(rawPassword, encodedPassword))
                .thenReturn(false);

        // WHEN
        LoginResponse response = authService.authenticate(request);

        // THEN
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Username hoặc mật khẩu sai!", response.getMessage());
        assertNull(response.getUsername());
        assertNull(response.getToken());

        assertFalse(authService.login(request));

        // Đảm bảo không generate token khi sai password
        verify(jwtUtil, never()).generateToken(any(User.class));
    }

    @Test
    @DisplayName("authenticate() - Request null -> thất bại, message rõ ràng")
    void authenticate_NullRequest() {
        // WHEN
        LoginResponse response = authService.authenticate(null);

        // THEN
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Request không được null", response.getMessage());
        assertNull(response.getUsername());
        assertNull(response.getToken());

        assertFalse(authService.login(null));

        // Không chạm DB / JwtUtil
        verifyNoInteractions(userRepository, jwtUtil, passwordEncoder);
    }
}
