package com.flogin.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("a) Test POST /api/products (Success)")
    void testCreateProduct() throws Exception {
        ProductDTO inputDto = new ProductDTO(null, "Asus TUF Gaming", 5L, 20000000.0, "RTX 3050", "Gaming");
        ProductDTO savedDto = new ProductDTO(1L, "Asus TUF Gaming", 5L, 20000000.0, "RTX 3050", "Gaming");

        given(productService.createProduct(any(ProductDTO.class))).willReturn(savedDto);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("Test POST /api/products (Fail - 400 Bad Request)")
    void testCreateProduct_Fail() throws Exception {
        ProductDTO inputDto = new ProductDTO(null, "Asus TUF", 5L, 20000000.0, "RTX 3050", "Gaming");
        
        given(productService.createProduct(any(ProductDTO.class)))
                .willThrow(new IllegalArgumentException("Tên sản phẩm đã tồn tại"));

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Tên sản phẩm đã tồn tại"));
    }

    @Test
    @DisplayName("b) Test GET /api/products (Success)")
    void testGetProducts() throws Exception {
        List<ProductDTO> productList = Arrays.asList(
                new ProductDTO(1L, "MacBook Air M1", 10L, 18000000.0, "Mỏng nhẹ", "Ultrabook"),
                new ProductDTO(2L, "Lenovo ThinkPad", 50L, 25000000.0, "Bền bỉ", "Business")
        );

        given(productService.getProducts()).willReturn(productList);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @DisplayName("c) Test GET /api/products/{id} (Success)")
    void testGetProductById() throws Exception {
        ProductDTO productDto = new ProductDTO(1L, "Dell XPS 13", 5L, 30000000.0, "Màn hình vô cực", "Business");

        given(productService.getProduct(1L)).willReturn(productDto);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dell XPS 13"));
    }

    @Test
    @DisplayName("Test GET /api/products/{id} (Fail - 404 Not Found)")
    void testGetProductById_NotFound() throws Exception {
        given(productService.getProduct(99L))
                .willThrow(new NoSuchElementException("Sản phẩm không tồn tại"));

        mockMvc.perform(get("/api/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Sản phẩm không tồn tại"));
    }

    @Test
    @DisplayName("d) Test PUT /api/products/{id} (Success)")
    void testUpdateProduct() throws Exception {
        ProductDTO updateInfo = new ProductDTO(null, "Dell XPS 13 Plus", 5L, 35000000.0, "Bản nâng cấp", "Business");
        ProductDTO updatedResult = new ProductDTO(1L, "Dell XPS 13 Plus", 5L, 35000000.0, "Bản nâng cấp", "Business");

        given(productService.updateProduct(eq(1L), any(ProductDTO.class))).willReturn(updatedResult);

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dell XPS 13 Plus"));
    }

    @Test
    @DisplayName("e) Test DELETE /api/products/{id} (Success)")
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Product was deleted"));
    }

    @Test
    @DisplayName("Test DELETE /api/products/{id} (Fail - 404 Not Found)")
    void testDeleteProduct_NotFound() throws Exception {
        doThrow(new NoSuchElementException("Sản phẩm không tồn tại"))
                .when(productService).deleteProduct(99L);

        mockMvc.perform(delete("/api/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Sản phẩm không tồn tại"));
    }

    @Test
    @DisplayName("Test PUT /api/products/{id} (Fail - 404 Not Found)")
    void testUpdateProduct_NotFound() throws Exception {
        ProductDTO updateInfo = new ProductDTO(null, "Dell XPS 13 Plus", 5L, 35000000.0, "Bản nâng cấp", "Business");

        doThrow(new NoSuchElementException("Sản phẩm không tồn tại"))
                .when(productService).updateProduct(eq(99L), any(ProductDTO.class));

        mockMvc.perform(put("/api/products/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Sản phẩm không tồn tại"));
    }

    @Test
    @DisplayName("Test PUT /api/products/{id} (Fail - 400 Duplicate Name)")
    void testUpdateProduct_DuplicateName() throws Exception {
        ProductDTO updateInfo = new ProductDTO(null, "Tên Bị Trùng", 5L, 35000000.0, "Bản nâng cấp", "Business");

        doThrow(new IllegalArgumentException("Tên sản phẩm đã tồn tại"))
                .when(productService).updateProduct(eq(1L), any(ProductDTO.class));

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Tên sản phẩm đã tồn tại"));
    }
}
