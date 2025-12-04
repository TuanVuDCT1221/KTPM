
export const validateProduct = (product) => {
    const errors = {};

    const name = product.name ? product.name.trim() : "";
    if(!name) {
        errors.name = "Tên sản phẩm không được để trống";
    } else if (name.length < 3 || name.length > 100) {
        errors.name = "Tên sản phẩm phải từ 3 đến 100 ký tự";
    }

    const rawPrice = product.price;
    const MAX_PRICE = 999999999;
    if (rawPrice === null || rawPrice === "") {
        errors.price = "Giá không được để trống";
    } else {
        const price = Number(rawPrice);

        if (price <= 0) {
            errors.price = "Giá phải lớn hơn 0";
        } else if (price > MAX_PRICE) {
            errors.price = "Giá phải nhỏ hơn hoặc bằng 999,999,999";
        }
    }

    const rawQuantity = product.quantity;
    if(rawQuantity === null || rawQuantity === "") {
        errors.quantity = "Số lượng không được để trống";
    } else {
        const quantity = Number(rawQuantity);
        if(Number.isNaN(quantity) || quantity < 0 || quantity > 99999) {
            errors.quantity = "Số lượng phải từ 0 đến 99,999";
        }
    }

    if(product.description && String(product.description).length > 500) {
        errors.description = "Mô tả phải nhỏ hơn hoặc bằng 500 ký tự";
    }

    const category = product.category ? product.category.trim() : "";
    if(!category) {
        errors.category = "Danh mục không được để trống";
    }

    return errors;
}