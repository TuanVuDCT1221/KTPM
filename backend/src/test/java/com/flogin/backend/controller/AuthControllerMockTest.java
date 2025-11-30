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

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(AuthController.class)
@DisplayName("5.1.2 Backend Mocking Test")
class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private static final String LOGIN_ENDPOINT = "/auth/login";

    @Test
    @DisplayName("1. Mock: Login thành công (Status 200)")
    void testLoginSuccessWithMockedService() throws Exception {
        String mockToken = "mock-jwt-token-123";
        LoginRequest request = new LoginRequest("testuser", "Pass123");

        when(authService.authenticate(request.getUsername(), request.getPassword()))
                .thenReturn(mockToken);

        mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value(mockToken));

        verify(authService, times(1))
                .authenticate(request.getUsername(), request.getPassword());
    }

    @Test
    @DisplayName("2. Mock: Login thất bại (Status 401)")
    void testLoginFailureWithMockedService() throws Exception {
        LoginRequest request = new LoginRequest("wronguser", "WrongPass");
        String errorMessage = "Mật khẩu không chính xác";

        when(authService.authenticate(request.getUsername(), request.getPassword()))
                .thenThrow(new RuntimeException(errorMessage));

        mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(errorMessage));

        verify(authService, times(1))
                .authenticate(request.getUsername(), request.getPassword());
    }
}
