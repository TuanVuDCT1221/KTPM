package com.flogin.backend;

import com.flogin.backend.controller.AuthController;
import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthService authService;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- Test Username chứa ký tự đặc biệt ---
    @Test
    void testUsernameWithSpecialCharacters() {
        LoginRequest request = new LoginRequest("user@123", "Pass123");

        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getAllErrors()).thenReturn(
                List.of(new ObjectError("username", "Username chỉ chứa chữ cái và số"))
        );

        ResponseEntity<?> response = authController.login(request, bindingResult);

        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Username chỉ chứa chữ cái và số"));

        verify(authService, never()).login(any());
    }

    // --- Test Password không có số hoặc không có chữ ---
    @Test
    void testPasswordWithoutLetterOrNumber() {
        // Password chỉ có chữ
        LoginRequest request1 = new LoginRequest("user123", "Password");
        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getAllErrors()).thenReturn(
                List.of(new ObjectError("password", "Password phải chứa ít nhất một chữ cái và một số"))
        );

        ResponseEntity<?> response1 = authController.login(request1, bindingResult);
        assertEquals(400, response1.getStatusCodeValue());
        assertTrue(response1.getBody().toString().contains("Password phải chứa ít nhất một chữ cái và một số"));

        verify(authService, never()).login(any());

        // Password chỉ có số
        LoginRequest request2 = new LoginRequest("user123", "123456");
        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getAllErrors()).thenReturn(
                List.of(new ObjectError("password", "Password phải chứa ít nhất một chữ cái và một số"))
        );

        ResponseEntity<?> response2 = authController.login(request2, bindingResult);
        assertEquals(400, response2.getStatusCodeValue());
        assertTrue(response2.getBody().toString().contains("Password phải chứa ít nhất một chữ cái và một số"));

        verify(authService, never()).login(any());
    }
}
