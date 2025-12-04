package com.flogin.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.CategoryType;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductDTO> getProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Page<ProductDTO> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    public ProductDTO getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại"));
        return mapToDto(product);
    }

    public ProductDTO createProduct(ProductDTO dto) {
        if(productRepository.existsByName(dto.getName()))
            throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");

        Product product = mapToEntity(dto);
        product.setId(null);
        Product saved = productRepository.save(product);
        return mapToDto(saved);
    }

    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại"));
        if(productRepository.existsByNameAndIdNot(dto.getName(), id))
            throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");

        existing.setName(dto.getName());
        existing.setQuantity(dto.getQuantity());
        existing.setPrice(dto.getPrice());
        existing.setDescription(dto.getDescription());
        existing.setCategory(
                dto.getCategory() == null
                        ? null
                        : CategoryType.fromDisplayName(dto.getCategory())
        );

        Product saved = productRepository.save(existing);
        return mapToDto(saved);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NoSuchElementException("Sản phẩm không tồn tại");
        }

        productRepository.deleteById(id);
    }

    protected ProductDTO mapToDto(Product product) {
        if(product == null)
            return null;

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setQuantity(product.getQuantity());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setCategory(
                product.getCategory() != null
                        ? product.getCategory().getDisplayName()
                        : null
        );

        return dto;
    }

    protected Product mapToEntity(ProductDTO dto) {
        if(dto == null)
            return null;

        return Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .quantity(dto.getQuantity())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .category(CategoryType.fromDisplayName(dto.getCategory()))
                .build();
    }

}