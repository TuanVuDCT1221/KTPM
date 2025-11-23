import {validateProduct} from "../utils/productValidation.js";

const baseProduct = {
    name: "Cà phê sữa",
    price: 20000,
    quantity: 10,
    description: "Cà phê sữa siêu ngon",
    category: "Coffee",
};

describe("Validate Product", () => {
    it("TC1: Name rỗng -> báo lỗi name", () => {
        const product = {
            ...baseProduct,
            name: "",
        };

        const errors = validateProduct(product);
        
        expect(errors.name).toBe("Tên sản phẩm không được để trống");
    });

    it("TC2: Name < 3 ký tự -> báo lỗi name", () => {
        const product = {
            ...baseProduct,
            name: "ab",
        };

        const errors = validateProduct(product);

        expect(errors.name).toBe("Tên sản phẩm phải từ 3 đến 100 ký tự");
    });

    it("TC3: Name > 100 ký tự -> báo lỗi name", () => {
        const longName = "a".repeat(101);
        const product = {
            ...baseProduct,
            name: longName,
        };

        const errors = validateProduct(product);

        expect(errors.name).toBe("Tên sản phẩm phải từ 3 đến 100 ký tự");
    });

    it("TC4: Price rỗng -> báo lỗi price", () => {
        const product = {
            ...baseProduct,
            price: "",
        };

        const errors = validateProduct(product);

        expect(errors.price).toBe("Giá không được để trống");
    });

    it("TC5: Price <= 0 -> báo lỗi price", () => {
        const product = {
            ...baseProduct,
            price: 0,
        };

        const errors = validateProduct(product);

        expect(errors.price).toBe("Giá phải lớn hơn 0");
    });

    it("TC6: Quantity rỗng -> báo lỗi quantity", () => {
        const product = {
            ...baseProduct,
            quantity: "",
        };

        const errors = validateProduct(product);

        expect(errors.quantity).toBe("Số lượng không được để trống");
    });

    it("TC7: Quantity < 0 -> báo lỗi quantity", () => {
        const product = {
            ...baseProduct,
            quantity: -1,
        };

        const errors = validateProduct(product);
        expect(errors.quantity).toBe("Số lượng phải từ 0 đến 99,999");
    });

    it("TC8: Quantity > 99999 -> báo lỗi quantity", () => {
        const product = {
            ...baseProduct,
            quantity: 100000,
        };

        const errors = validateProduct(product);
        
        expect(errors.quantity).toBe("Số lượng phải từ 0 đến 99,999");
    });

    it("TC9: Description > 500 ký tự -> báo lỗi description", () => {
        const longDescription = "a".repeat(501);
        const product = {
            ...baseProduct,
            description: longDescription,
        };

        const errors = validateProduct(product);

        expect(errors.description).toBe("Mô tả phải nhỏ hơn hoặc bằng 500 ký tự");
    });

    it("TC10: Category rỗng -> báo lỗi category", () => {
        const product = {
            ...baseProduct,
            category: "",
        };

        const errors = validateProduct(product);

        expect(errors.category).toBe("Danh mục không được để trống");
    });

    it("TC11: Dữ liệu hợp lệ -> không báo lỗi", () => {
        const errors = validateProduct(baseProduct);

        expect(Object.keys(errors).length).toBe(0);
    });
});


