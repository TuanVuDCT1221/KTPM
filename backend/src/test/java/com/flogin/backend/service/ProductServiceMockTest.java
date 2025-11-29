package com.flogin.backend.service;

import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;


    @Test
    @DisplayName("Test Save Product: Verify Repository Interaction (Create / Update)")
    void testSaveProduct() {
        Product inputProduct = new Product(null, "Pepsi", 24L, 10000.0, "Drink", "Ngon");
        Product savedEntity = new Product(10L, "Pepsi", 24L, 10000.0, "Drink", "Ngon");

        given(productRepository.save(any(Product.class))).willReturn(savedEntity);

        Product result = productService.save(inputProduct);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Pepsi", result.getName());
        assertEquals("Ngon", result.getDescription());
        
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Test Get By ID: Return Entity correctly (read)")
    void testGetById() {
        Product mockProduct = new Product(1L, "Sting", 100L, 12000.0, "Drink", "Dâu đỏ");
        
        given(productRepository.findById(1L)).willReturn(Optional.of(mockProduct));

        Product result = productService.getById(1L);

        assertNotNull(result);
        assertEquals("Sting", result.getName());
        assertEquals(12000.0, result.getPrice());
        assertEquals("Dâu đỏ", result.getDescription());

        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Test Get All: Return list of products (read all)")
    void testGetAll() {
        Product p1 = new Product(1L, "Coke", 10L, 10000.0, "Drink", "Có gas");
        Product p2 = new Product(2L, "Pepsi", 20L, 10000.0, "Drink", "Không calo");
        List<Product> mockList = Arrays.asList(p1, p2);
        
        given(productRepository.findAll()).willReturn(mockList);

        List<Product> result = productService.getAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Coke", result.get(0).getName());
        assertEquals("Có gas", result.get(0).getDescription());

        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Test Delete: Verify deleteById is called (delete)")
    void testDeleteProduct() {
        Long productId = 99L;
        productService.delete(productId);

        verify(productRepository, times(1)).deleteById(productId);
    }
}