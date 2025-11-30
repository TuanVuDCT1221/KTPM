package com.flogin.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.entity.Product;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
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
    @DisplayName("a) Test POST /api/products (Create Product)")
    void testAddProduct() throws Exception {
        Product inputProduct = new Product(null, "Cafe Muoi", 10L, 25000.0, "Coffee", "Nhiều muối");
        Product savedProduct = new Product(1L, "Cafe Muoi", 10L, 25000.0, "Coffee", "Nhiều muối");

        given(productService.save(any(Product.class))).willReturn(savedProduct);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Cafe Muoi"))
                .andExpect(jsonPath("$.description").value("Nhiều muối"));
    }

    @Test
    @DisplayName("b) Test GET /api/products (Read All)")
    void testGetAllProducts() throws Exception {
        List<Product> products = Arrays.asList(
                new Product(1L, "Tra Sua", 50L, 30000.0, "Milk", "Full topping")
        );

        given(productService.getAll()).willReturn(products);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))) 
                .andExpect(jsonPath("$[0].name").value("Tra Sua"))
                .andExpect(jsonPath("$[0].description").value("Full topping"));
    }

    @Test
    @DisplayName("c) Test GET /api/products/{id} (Read One)")
    void testGetProductById() throws Exception {
        Product product = new Product(1L, "Sting", 100L, 12000.0, "Drink", "Dâu tây");

        given(productService.getById(1L)).willReturn(product);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sting"))
                .andExpect(jsonPath("$.price").value(12000.0))
                .andExpect(jsonPath("$.description").value("Dâu tây"));
    }

    @Test
    @DisplayName("c2) Test GET /api/products/{id} (Not Found)")
    void testGetProductById_NotFound() throws Exception {

        given(productService.getById(999L)).willReturn(null);

        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("d) Test PUT /api/products/{id} (Update)")
    void testUpdateProduct() throws Exception {
        Product updateInfo = new Product(null, "Sting Dau", 50L, 15000.0, "Drink", "Ngon tuyệt");
        Product updatedProduct = new Product(1L, "Sting Vang", 50L, 15000.0, "Drink", "Ngon tuyệt");

        given(productService.save(any(Product.class))).willReturn(updatedProduct);

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sting Vang"))
                .andExpect(jsonPath("$.description").value("Ngon tuyệt"));
    }
    
    @Test
    @DisplayName("e) Test DELETE /api/products/{id}")
    void testDeleteProduct() throws Exception {
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Đã xóa sản phẩm!"));
    }
}