package com.flogin.backend.service;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.CategoryType;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
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
    
    private static final double PRICE_40M = 40000000.0;
    private static final double PRICE_30M = 30000000.0;
    private static final double PRICE_18M = 18000000.0;
    private static final double PRICE_25M = 25000000.0;
    private static final double PRICE_100 = 100.0;


    @Test
    @DisplayName("Create Product: Success")
    void testCreateProduct_Success() {
        ProductDTO inputDto = new ProductDTO(null, "Asus TUF Gaming", 5L, 20000000.0, "RTX 3050", "Gaming");
        Product savedEntity = new Product(1L, "Asus TUF Gaming", 5L, 20000000.0, "RTX 3050", CategoryType.GAMING);

        given(productRepository.existsByName("Asus TUF Gaming")).willReturn(false);
        given(productRepository.save(any(Product.class))).willReturn(savedEntity);

        ProductDTO result = productService.createProduct(inputDto);

        assertNotNull(result);
        assertEquals("Asus TUF Gaming", result.getName());
        assertEquals("Gaming", result.getCategory());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Create Product: Fail (Duplicate Name)")
    void testCreateProduct_Fail_DuplicateName() {
        ProductDTO inputDto = new ProductDTO(null, "MacBook Pro", 10L, PRICE_40M, "Desc", "Ultrabook");
        given(productRepository.existsByName("MacBook Pro")).willReturn(true);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> productService.createProduct(inputDto));
        assertEquals("Tên sản phẩm đã tồn tại", exception.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Get Products: Success")
    void testGetProducts() {
        List<Product> entities = Arrays.asList(
                new Product(1L, "MacBook Air", 10L, PRICE_18M, "Desc", CategoryType.ULTRABOOK),
                new Product(2L, "Lenovo", 50L, PRICE_25M, "Desc", CategoryType.BUSINESS)
        );
        given(productRepository.findAll()).willReturn(entities);

        List<ProductDTO> result = productService.getProducts();

        assertEquals(2, result.size());
        assertEquals("Ultrabook", result.get(0).getCategory());
        assertEquals("Business", result.get(1).getCategory());
    }

    @Test
    @DisplayName("Get Product By ID: Success")
    void testGetProduct_Success() {
        Product entity = new Product(1L, "Dell XPS", 5L, PRICE_30M, "Desc", CategoryType.BUSINESS);
        given(productRepository.findById(1L)).willReturn(Optional.of(entity));

        ProductDTO result = productService.getProduct(1L);

        assertEquals("Dell XPS", result.getName());
        assertEquals("Business", result.getCategory());
    }

    @Test
    @DisplayName("Get Product By ID: Fail (Not Found)")
    void testGetProduct_NotFound() {
        given(productRepository.findById(99L)).willReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> productService.getProduct(99L));
    }

    @Test
    @DisplayName("Update Product: Success")
    void testUpdateProduct_Success() {
        Product existing = new Product(1L, "Old Name", 10L, PRICE_100, "Old Desc", CategoryType.BUSINESS);
        ProductDTO updateDto = new ProductDTO(null, "New Name", 20L, 200.0, "New Desc", "Gaming");
        Product updated = new Product(1L, "New Name", 20L, 200.0, "New Desc", CategoryType.GAMING);

        given(productRepository.findById(1L)).willReturn(Optional.of(existing));
        given(productRepository.existsByNameAndIdNot("New Name", 1L)).willReturn(false);
        given(productRepository.save(any(Product.class))).willReturn(updated);

        ProductDTO result = productService.updateProduct(1L, updateDto);

        assertEquals("New Name", result.getName());
        assertEquals("Gaming", result.getCategory());
    }

    @Test
    @DisplayName("Update Product: Fail (Not Found)")
    void testUpdateProduct_NotFound() {
        ProductDTO updateDto = new ProductDTO();
        given(productRepository.findById(99L)).willReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> productService.updateProduct(99L, updateDto));
    }

    @Test
    @DisplayName("Update Product: Fail (Duplicate Name)")
    void testUpdateProduct_DuplicateName() {
        Product existing = new Product(1L, "Old Name", 10L, PRICE_100, "Old", CategoryType.BUSINESS);
        ProductDTO updateDto = new ProductDTO(null, "Duplicate Name", 10L, PRICE_100, "Desc", "Business");

        given(productRepository.findById(1L)).willReturn(Optional.of(existing));
        given(productRepository.existsByNameAndIdNot("Duplicate Name", 1L)).willReturn(true);

        assertThrows(IllegalArgumentException.class, () -> productService.updateProduct(1L, updateDto));
    }

    @Test
    @DisplayName("Delete Product: Success")
    void testDeleteProduct_Success() {
        given(productRepository.existsById(1L)).willReturn(true);
        productService.deleteProduct(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Delete Product: Fail (Not Found)")
    void testDeleteProduct_NotFound() {
        given(productRepository.existsById(99L)).willReturn(false);
        assertThrows(NoSuchElementException.class, () -> productService.deleteProduct(99L));
        verify(productRepository, never()).deleteById(99L);
    }
    
    @Test
    @DisplayName("Update Product: Success (Category set to null)")
    void testUpdateProduct_CategorySetToNull() { 
        Product existing = new Product(1L, "Laptop with Cat", 10L, 100.0, "Desc", CategoryType.BUSINESS);
        
        ProductDTO updateDto = new ProductDTO(null, "Laptop Null Cat", 20L, 200.0, "New Desc", null);
        
        Product updated = new Product(1L, "Laptop Null Cat", 20L, 200.0, "New Desc", null);

        given(productRepository.findById(1L)).willReturn(Optional.of(existing));
        given(productRepository.existsByNameAndIdNot("Laptop Null Cat", 1L)).willReturn(false);
        given(productRepository.save(any(Product.class))).willReturn(updated);

        ProductDTO result = productService.updateProduct(1L, updateDto);

        assertEquals("Laptop Null Cat", result.getName());
        assertNull(result.getCategory()); 
        
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Get Products: Test Get All with Pagination")
    void testGetProducts_WithPagination() {
        Product product = new Product(1L, "Laptop Paginated", 10L, 100.0, "Desc", CategoryType.ULTRABOOK);
        List<Product> content = List.of(product);
        Page<Product> page = new PageImpl<>(content, PageRequest.of(0, 1), content.size());

        given(productRepository.findAll(any(Pageable.class))).willReturn(page);

        Page<ProductDTO> result = productService.getProducts(PageRequest.of(0, 1));

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Laptop Paginated", result.getContent().get(0).getName());

        verify(productRepository).findAll(any(Pageable.class));
    }
}

