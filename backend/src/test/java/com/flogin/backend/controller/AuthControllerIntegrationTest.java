package com.flogin.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("Login API Integration Tests (MockMvc)")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private static final String LOGIN_ENDPOINT = "/auth/login";

    @Test
    @DisplayName("POST /login - Thành công: 200 + token + response structure")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        final String mockToken = "mock-jwt-token";

        when(authService.authenticate(request.getUsername(), request.getPassword()))
                .thenReturn(mockToken);

        mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công!"))
                .andExpect(jsonPath("$.token").value(mockToken));

        verify(authService, times(1)).authenticate(request.getUsername(), request.getPassword());
    }

    @Test
    @DisplayName("POST /login - Thất bại: 401 + error message")
    void testLoginFailure() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "WrongPass");
        final String errorMessage = "Invalid password";

        when(authService.authenticate(request.getUsername(), request.getPassword()))
                .thenThrow(new RuntimeException(errorMessage));

        mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(errorMessage))
                .andExpect(jsonPath("$.token").doesNotExist());

        verify(authService, times(1)).authenticate(request.getUsername(), request.getPassword());
    }

    @Test
    @DisplayName("POST /login - CORS headers")
    void testLoginCORSHeaders() throws Exception {
        LoginRequest request = new LoginRequest("corsuser", "pass");
        final String mockToken = "cors-token";
        final String allowedOrigin = "http://localhost:5173";

        when(authService.authenticate(anyString(), anyString())).thenReturn(mockToken);

        mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("Origin", allowedOrigin))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", allowedOrigin));
    }

    @Test
    @DisplayName("OPTIONS /login - Preflight CORS")
    void testCORSPreflight() throws Exception {
        final String allowedOrigin = "http://localhost:5173";

        mockMvc.perform(options(LOGIN_ENDPOINT)
                        .header("Origin", allowedOrigin)
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", allowedOrigin));
    }
}
