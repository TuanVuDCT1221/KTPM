package com.flogin.backend.dto;


import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    private String name;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải từ 0 đến 99,999")
    @Max(value = 99999, message = "Số lượng phải từ 0 đến 99,999")
    private Long quantity;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.01", message = "Giá phải lớn hơn 0")
    @Digits(integer = 9, fraction = 0, message = "Giá không được vượt quá 999,999,999")
    private Double price;

    @Size(max = 500, message = "Mô tả phải nhỏ hơn hoặc bằng 500 ký tự")
    private String description;

    @NotBlank(message = "Danh mục không được để trống")
    private String category;
}
