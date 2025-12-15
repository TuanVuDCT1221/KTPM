package com.flogin.backend.security;

import com.flogin.backend.config.SecurityHeadersFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("SecurityHeadersFilter")
class SecurityHeadersFilterTest {

    private SecurityHeadersFilter filter;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        filter = new SecurityHeadersFilter();
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    @DisplayName("doFilter: add security headers")
    void doFilter_shouldAddSecurityHeaders() throws ServletException, IOException {
        // Arrange
        FilterChain chain = mock(FilterChain.class);

        // Act
        filter.doFilter(request, response, chain);

        // Assert
        assertAll(
                () -> assertEquals("nosniff", response.getHeader("X-Content-Type-Options")),
                () -> assertEquals("1; mode=block", response.getHeader("X-XSS-Protection")),
                () -> assertEquals("SAMEORIGIN", response.getHeader("X-Frame-Options")),
                () -> {
                    String csp = response.getHeader("Content-Security-Policy");
                    assertNotNull(csp);
                    assertTrue(csp.contains("default-src 'self'"));
                }
        );

        verify(chain).doFilter(request, response);
    }
}
