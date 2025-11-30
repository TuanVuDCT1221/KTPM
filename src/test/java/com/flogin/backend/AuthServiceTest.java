// package com.flogin.backend;

package com.flogin.backend;

import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginSuccess() {
        // Arrange
        LoginRequest request = new LoginRequest("user123", "pass123");
        User user = User.builder().username("user123").password("pass123").build();
        when(userRepository.findByUsername("user123")).thenReturn(Optional.of(user));

        // Act
        boolean result = authService.login(request);

        // Assert
        assertTrue(result);
    }

    @Test
    void testLoginWrongPassword() {
        LoginRequest request = new LoginRequest("user123", "wrongpass");
        User user = User.builder().username("user123").password("pass123").build();
        when(userRepository.findByUsername("user123")).thenReturn(Optional.of(user));

        boolean result = authService.login(request);

        assertFalse(result);
    }

    @Test
    void testLoginUserNotFound() {
        LoginRequest request = new LoginRequest("nonexistent", "pass123");
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        boolean result = authService.login(request);

        assertFalse(result);
    }


    // Test method authenticate() với các scenarios

    private AuthService authServiceRefactored;

    @BeforeEach
    void setUpRefactored() {
        authServiceRefactored = new AuthService(userRepository);
    }

    @Test
    void login_Success_Refactored() {
        LoginRequest request = new LoginRequest("john", "123");
        User user = new User();
        user.setUsername("john");
        user.setPassword("123");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        boolean result = authServiceRefactored.login(request);

        assertTrue(result);
    }

    @Test
    void login_UserNotFound_Refactored() {
        LoginRequest request = new LoginRequest("unknown", "123");

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        boolean result = authServiceRefactored.login(request);

        assertFalse(result);
    }

    @Test
    void login_WrongPassword_Refactored() {
        LoginRequest request = new LoginRequest("john", "wrong");
        User user = new User();
        user.setUsername("john");
        user.setPassword("123");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        boolean result = authServiceRefactored.login(request);

        assertFalse(result);
    }
}
