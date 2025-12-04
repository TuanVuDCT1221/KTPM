package com.flogin.backend;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.CategoryType;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.lang.reflect.Method;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductDTO productDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        product = Product.builder()
                .id(1L)
                .name("Laptop Dell XPS 13")
                .quantity(10L)
                .price(25_000_000.0)
                .description("Ultrabook 13 inch mỏng nhẹ")
                .category(CategoryType.ULTRABOOK)
                .build();

        productDto = new ProductDTO(
                1L,
                "Laptop Dell XPS 13",
                10L,
                25_000_000.0,
                "Ultrabook 13 inch mỏng nhẹ",
                "Ultrabook"
        );
    }

    @Test
    void getProducts_shouldReturnListOfProductDTO() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<ProductDTO> result = productService.getProducts();

        assertEquals(1, result.size());
        ProductDTO dto = result.get(0);
        assertEquals(product.getId(), dto.getId());
        assertEquals("Laptop Dell XPS 13", dto.getName());
        assertEquals("Ultrabook", dto.getCategory());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getProduct_whenIdExists_shouldReturnProductDTO() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductDTO dto = productService.getProduct(1L);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Laptop Dell XPS 13", dto.getName());
        assertEquals("Ultrabook", dto.getCategory());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getProduct_whenIdNotFound_shouldThrowException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> productService.getProduct(999L));

        verify(productRepository, times(1)).findById(999L);
    }

    @Test
    void testGetProductsWithPagination() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 2);

        Product p1 = Product.builder()
                .id(1L)
                .name("Laptop Dell")
                .price(15_000_000.0)
                .quantity(10L)
                .description("Mô tả")
                .category(CategoryType.ULTRABOOK)
                .build();

        Product p2 = Product.builder()
                .id(2L)
                .name("Asus VivoBook")
                .price(20_000_000.0)
                .quantity(5L)
                .description("Mô tả 2")
                .category(CategoryType.ULTRABOOK)
                .build();

        Page<Product> productPage = new PageImpl<>(List.of(p1, p2), pageable, 2);

        when(productRepository.findAll(pageable)).thenReturn(productPage);

        // Act
        Page<ProductDTO> result = productService.getProducts(pageable);

        // Assert
        assertEquals(2, result.getContent().size());
        assertEquals("Laptop Dell", result.getContent().get(0).getName());
        assertEquals("Asus VivoBook", result.getContent().get(1).getName());
        verify(productRepository).findAll(pageable);
    }

    @Test
    void createProduct_whenNameNotExists_shouldSaveAndReturnDTO() {
        when(productRepository.existsByName("Laptop Dell XPS 13")).thenReturn(false);
        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> {
                    Product p = invocation.getArgument(0);
                    p.setId(1L);
                    return p;
                });

        ProductDTO result = productService.createProduct(productDto);

        assertNotNull(result.getId());
        assertEquals("Laptop Dell XPS 13", result.getName());
        assertEquals("Ultrabook", result.getCategory());
        verify(productRepository, times(1)).existsByName("Laptop Dell XPS 13");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_whenNameExists_shouldThrowException() {
        when(productRepository.existsByName("Laptop Dell XPS 13")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> productService.createProduct(productDto)
        );
        assertEquals("Tên sản phẩm đã tồn tại", ex.getMessage());
        verify(productRepository, times(1)).existsByName("Laptop Dell XPS 13");
        verify(productRepository, never()).save(any(Product.class));
    }

    // 🔒 Security / Input validation: category không hợp lệ
    @Test
    void createProduct_whenCategoryInvalid_shouldThrowException() {
        ProductDTO invalidCategoryDto = new ProductDTO(
                null,
                "Laptop Fake",
                5L,
                10_000_000.0,
                "Test invalid category",
                "ABC"
        );

        when(productRepository.existsByName("Laptop Fake")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> productService.createProduct(invalidCategoryDto)
        );
        assertEquals("Danh mục không hợp lệ", ex.getMessage());
        verify(productRepository, times(1)).existsByName("Laptop Fake");
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateProduct_whenIdExistsAndNameNotDuplicated_shouldUpdateAndReturnDTO() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsByNameAndIdNot("Laptop Dell XPS 13", 1L))
                .thenReturn(false);
        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocationOnMock -> invocationOnMock.getArgument(0));

        ProductDTO updateDTO = new ProductDTO(
                null,
                "Laptop Dell XPS 13",
                20L,
                26_000_000.0,
                "Ultrabook mới 2024",
                "Gaming"
        );

        ProductDTO result = productService.updateProduct(1L, updateDTO);

        assertEquals(1L, result.getId());
        assertEquals(20L, result.getQuantity());
        assertEquals(26_000_000.0, result.getPrice());
        assertEquals("Ultrabook mới 2024", result.getDescription());
        assertEquals("Gaming", result.getCategory());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1))
                .existsByNameAndIdNot("Laptop Dell XPS 13", 1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updateProduct_whenIdNotFound_shouldThrowException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> productService.updateProduct(99L, productDto));
        verify(productRepository, times(1)).findById(99L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateProduct_whenNameDuplicated_shouldThrowException() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsByNameAndIdNot("Laptop Dell XPS 13", 1L))
                .thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> productService.updateProduct(1L, productDto)
        );
        assertEquals("Tên sản phẩm đã tồn tại", ex.getMessage());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1))
                .existsByNameAndIdNot("Laptop Dell XPS 13", 1L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateProduct_whenCategoryNull_shouldSetCategoryNull() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsByNameAndIdNot("Laptop Dell XPS 13", 1L))
                .thenReturn(false);
        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocationOnMock -> invocationOnMock.getArgument(0));

        ProductDTO updateDTO = new ProductDTO(
                null,
                "Laptop Dell XPS 13",
                20L,
                26_000_000.0,
                "Ultrabook mới 2024",
                null        // category null để đi vào nhánh ? null
        );

        // Act
        ProductDTO result = productService.updateProduct(1L, updateDTO);

        // Assert
        assertEquals(1L, result.getId());
        assertEquals(20L, result.getQuantity());
        assertEquals(26_000_000.0, result.getPrice());
        assertEquals("Ultrabook mới 2024", result.getDescription());
        assertNull(result.getCategory());

        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1))
                .existsByNameAndIdNot("Laptop Dell XPS 13", 1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void deleteProduct_whenIdExists_shouldDelete() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).existsById(1L);
        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteProduct_whenIdNotFound_shouldThrowException() {
        when(productRepository.existsById(99L)).thenReturn(false);

        assertThrows(NoSuchElementException.class,
                () -> productService.deleteProduct(99L));
        verify(productRepository, times(1)).existsById(99L);
        verify(productRepository, never()).deleteById(anyLong());
    }

    @Test
    void mapToDto_whenProductNull_shouldReturnNull() throws Exception {
        Method method = ProductService.class
                .getDeclaredMethod("mapToDto", Product.class);
        method.setAccessible(true);

        ProductDTO dto = (ProductDTO) method.invoke(productService, new Object[]{null});

        assertNull(dto);
    }

    @Test
    void mapToEntity_whenDtoNull_shouldReturnNull() throws Exception {
        Method method = ProductService.class
                .getDeclaredMethod("mapToEntity", ProductDTO.class);
        method.setAccessible(true);

        Product result = (Product) method.invoke(productService, new Object[]{null});

        assertNull(result);
    }
}