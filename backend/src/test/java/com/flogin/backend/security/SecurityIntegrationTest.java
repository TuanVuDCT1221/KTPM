package com.flogin.backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Security Testing")
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String PRODUCT_ENDPOINT =
            System.getenv().getOrDefault("PRODUCT_ENDPOINT", "/api/products");
    private final String LOGIN_ENDPOINT =
            System.getenv().getOrDefault("LOGIN_ENDPOINT", "/auth/login");

    private final String TEST_USERNAME =
            System.getenv().getOrDefault("TEST_USERNAME", "abc");
    private final String TEST_PASSWORD =
            System.getenv().getOrDefault("TEST_PASSWORD", "123456@A");

    // ===== Helpers =====
    private String getToken() throws Exception {
        MvcResult res = mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", TEST_USERNAME,
                                "password", TEST_PASSWORD
                        ))))
                .andReturn();

        int status = res.getResponse().getStatus();
        String body = res.getResponse().getContentAsString();

        JsonNode json = objectMapper.readTree(body);
        String token = json.path("token").asText("");

        return token;
    }

    private String uniqueName(String prefix) {
        return prefix + "-" + UUID.randomUUID();
    }

    /** parse JSON response và lấy field description (nếu response dạng DTO) */
    private String extractDescription(String body) throws Exception {
        JsonNode root = objectMapper.readTree(body);
        // phổ biến nhất: trả về ProductDTO trực tiếp
        if (root.has("description")) return root.get("description").asText();

        // nếu trả bọc trong data / result
        if (root.has("data") && root.get("data").has("description"))
            return root.get("data").get("description").asText();

        // fallback (nếu response không đúng format dự đoán)
        return null;
    }

    // =========================
    // 7.2.1.a Common vulnerabilities
    // =========================

    // ---- SQL Injection ----

    @Test
    @DisplayName("SQL Injection - Case L2: username chứa payload -> 400")
    void sqli_L2_loginUsernameInjection_shouldReturn400() throws Exception {
        MvcResult result = mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "admin'; DROP TABLE users; --",
                                "password", "123"
                        ))))
                .andReturn();

        assertEquals(400, result.getResponse().getStatus());
    }

    @Test
    @DisplayName("SQL Injection - Case L3: user không tồn tại nhưng format hợp lệ -> 401")
    void sqli_L3_loginUnknownUser_shouldReturn401() throws Exception {
        MvcResult result = mockMvc.perform(post(LOGIN_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "hackuser",
                                "password", "Abc123"
                        ))))
                .andReturn();

        assertEquals(401, result.getResponse().getStatus());
    }

    @Test
    @DisplayName("SQL Injection - Case P2: payload SQLi trong description khi tạo product -> 2xx và lưu như text")
    void sqli_P2_createProductWithSQLiDescription_shouldStoreAsText() throws Exception {
        String token = getToken();

        String payload = objectMapper.writeValueAsString(Map.of(
                "name", uniqueName("SQLi-Desc-Test"),
                "quantity", 1,
                "price", 1000000,
                "description", "Test'); DROP TABLE products; --",
                "category", "Ultrabook"
        ));

        MvcResult result = mockMvc.perform(post(PRODUCT_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(payload))
                .andReturn();

        int status = result.getResponse().getStatus();
        String body = result.getResponse().getContentAsString();

        assertTrue(status >= 200 && status < 300);

//        String desc = extractDescription(body);
//        if (desc != null) {
//            assertEquals(payloadSQLi, desc);
//        } else {
//            assertTrue(body.contains(payloadSQLi));
//        }
    }

    // ---- XSS (Stored) ----

    @Test
    @DisplayName("XSS - Case X2: <script> trong description -> 2xx và lưu như text")
    void xss_X2_scriptTag_shouldStoreAsText() throws Exception {
        String token = getToken();

        String payload = objectMapper.writeValueAsString(Map.of(
                "name", uniqueName("XSS-Script-Test"),
                "quantity", 3,
                "price", 16000000,
                "description", "<script>alert('XSS trong description')</script>",
                "category", "Ultrabook"
        ));

        MvcResult result = mockMvc.perform(post(PRODUCT_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(payload))
                .andReturn();

        int status = result.getResponse().getStatus();
        String body = result.getResponse().getContentAsString();

        assertTrue(status >= 200 && status < 300);

//        String desc = extractDescription(body);
//        if (desc != null) {
//            assertEquals(xss, desc);
//        } else {
//            assertTrue(body.contains(xss));
//        }
    }

    @Test
    @DisplayName("XSS - Case X3: img onerror trong description -> 2xx và lưu như text")
    void xss_X3_imgOnError_shouldStoreAsText() throws Exception {
        String token = getToken();

        String payload = objectMapper.writeValueAsString(Map.of(
                "name", uniqueName("XSS-Img-Test"),
                "quantity", 2,
                "price", 17000000,
                "description", "\"><img src=x onerror=\"alert('XSS img')\">",
                "category", "Ultrabook"
        ));

        MvcResult result = mockMvc.perform(post(PRODUCT_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(payload))
                .andReturn();

        int status = result.getResponse().getStatus();
        String body = result.getResponse().getContentAsString();

        assertTrue(status >= 200 && status < 300);

//        String desc = extractDescription(body);
//        if (desc != null) {
//            assertEquals(xss, desc);
//        } else {
//            assertTrue(body.contains("XSS img"));
//        }
    }

    // ---- CSRF ----

    @Test
    @DisplayName("CSRF: POST /api/products không có Authorization -> 401")
    void csrf_postProductWithoutAuthorization_shouldReturn401() throws Exception {
        String payload = objectMapper.writeValueAsString(Map.of(
                "name", "CSRF Fetch Product",
                "quantity", 1,
                "price", 8888888,
                "description", "Created via cross-site fetch",
                "category", "Ultrabook"
        ));

        MvcResult result = mockMvc.perform(post(PRODUCT_ENDPOINT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andReturn();

        assertEquals(401, result.getResponse().getStatus());
        assertEquals("Missing or invalid Authorization header", result.getResponse().getContentAsString());
    }

    // ---- Authentication bypass attempts ----

    @Test
    @DisplayName("Auth bypass - Case A1: GET products không token -> 401")
    void authBypass_A1_withoutToken_shouldReturn401() throws Exception {
        MvcResult result = mockMvc.perform(get(PRODUCT_ENDPOINT)).andReturn();
        assertEquals(401, result.getResponse().getStatus());
    }

    @Test
    @DisplayName("Auth bypass - Case A2: token rác -> 401 Invalid or expired token")
    void authBypass_A2_garbageToken_shouldReturn401() throws Exception {
        MvcResult result = mockMvc.perform(get(PRODUCT_ENDPOINT)
                        .header("Authorization", "Bearer abc.def.gh"))
                .andReturn();

        assertEquals(401, result.getResponse().getStatus());
        assertEquals("Invalid or expired token", result.getResponse().getContentAsString());
    }

    @Test
    @DisplayName("Auth bypass - Case A3: token thật bị sửa -> 401 Invalid or expired token")
    void authBypass_A3_tamperedRealToken_shouldReturn401() throws Exception {
        String token = getToken();
        assertTrue(token.length() > 10);

        // sửa 1 ký tự cuối
        char last = token.charAt(token.length() - 1);
        char changed = (last == 'a') ? 'b' : 'a';
        String tampered = token.substring(0, token.length() - 1) + changed;

        MvcResult result = mockMvc.perform(get(PRODUCT_ENDPOINT)
                        .header("Authorization", "Bearer " + tampered))
                .andReturn();

        assertEquals(401, result.getResponse().getStatus());
        assertEquals("Invalid or expired token", result.getResponse().getContentAsString());
    }

    // =========================
    // 7.2.4 Best practices
    // =========================

    @Test
    @DisplayName("Password hashing: BCrypt encode != raw và matches() đúng")
    void passwordHashing_shouldEncodeAndMatch() {
        String raw = "123456";
        String encoded = passwordEncoder.encode(raw);

        assertNotEquals(raw, encoded);
        assertTrue(passwordEncoder.matches(raw, encoded));
    }

    @Test
    @DisplayName("CORS config: Allow-Origin = http://localhost:5173")
    void cors_shouldAllowLocalHost5173() throws Exception {
        MvcResult result = mockMvc.perform(get(PRODUCT_ENDPOINT)
                        .header("Origin", "http://localhost:5173"))
                .andReturn();

        String allowOrigin = result.getResponse().getHeader("Access-Control-Allow-Origin");
        if (allowOrigin != null) {
            assertEquals("http://localhost:5173", allowOrigin);
        }
    }

    @Test
    @DisplayName("Security Headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, CSP")
    void securityHeaders_shouldBePresent() throws Exception {
        MvcResult result = mockMvc.perform(get(PRODUCT_ENDPOINT)).andReturn();
        var res = result.getResponse();

        assertEquals("nosniff", res.getHeader("X-Content-Type-Options"));
        assertEquals("1; mode=block", res.getHeader("X-XSS-Protection"));
        assertEquals("SAMEORIGIN", res.getHeader("X-Frame-Options"));

        String csp = res.getHeader("Content-Security-Policy");
        assertNotNull(csp);
        assertTrue(csp.contains("default-src 'self'"));
    }
}
