import { render, screen, fireEvent } from "@testing-library/react";
import ProductForm from "../components/ProductForm";
import { jest } from "@jest/globals";

describe("ProductForm", () => {
    it("TCF1: Render form với dữ liệu sản phẩm khi edit", () => {
        const product = {
            id: 1,
            name: "Laptop Dell XPS 13",
            quantity: 10,
            price: 25000000,
            description: "Ultrabook 13 inch mỏng nhẹ",
            category: "Ultrabook",
        };

        render(
            <ProductForm
                product={product}
                onSave={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(screen.getByLabelText("Tên:")).toHaveValue("Laptop Dell XPS 13");
        expect(screen.getByLabelText("Số lượng:")).toHaveValue(10);
        expect(screen.getByLabelText("Giá:")).toHaveValue(25000000);
        expect(screen.getByLabelText("Mô tả:")).toHaveValue(
            "Ultrabook 13 inch mỏng nhẹ"
        );
        expect(screen.getByLabelText("Danh mục:")).toHaveValue("Ultrabook");
    });

    it("TCF2: Submit form với dữ liệu hợp lệ -> gọi onSave với payload đúng", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: { value: "Laptop Gaming ASUS" },
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: { value: "5" },
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: { value: "35000000" },
        });
        fireEvent.change(screen.getByLabelText("Mô tả:"), {
            target: { value: "Laptop gaming RTX 4060" },
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: { value: "Gaming" },
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Laptop Gaming ASUS",
                quantity: 5,
                price: 35000000,
                description: "Laptop gaming RTX 4060",
                category: "Gaming",
            })
        );
    });

    it("TCF3: Tên rỗng -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: { value: "1" },
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: { value: "15000000" },
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: { value: "Ultrabook" },
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByRole("alert")).toHaveTextContent(
            "Tên sản phẩm không được để trống"
        );
    });

    it("TCF4: Price rỗng -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: { value: "Laptop Dell Inspiron 15" },
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: { value: "2" },
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: { value: "Business" },
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByText("Giá không được để trống")).toBeInTheDocument();
    });

    it("TCF5: Category rỗng -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: { value: "Laptop Acer Aspire 7" },
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: { value: "2" },
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: { value: "22000000" },
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(
            screen.getByText("Danh mục không được để trống")
        ).toBeInTheDocument();
    });

    it("TCF6: Quantity > 99999 -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: { value: "Laptop Acer Nitro 5" },
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: { value: "100000" },
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: { value: "25000000" },
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: { value: "Gaming" },
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(
            screen.getByText("Số lượng phải từ 0 đến 99,999")
        ).toBeInTheDocument();
    });

    it("TCF7: Description > 500 ký tự -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();
        const longDescription = "a".repeat(501);

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: { value: "Laptop Lenovo ThinkPad" },
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: { value: "10" },
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: { value: "30000000" },
        });
        fireEvent.change(screen.getByLabelText("Mô tả:"), {
            target: { value: longDescription },
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: { value: "Business" },
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(
            screen.getByText("Mô tả phải nhỏ hơn hoặc bằng 500 ký tự")
        ).toBeInTheDocument();
    });

    it("TCF8: Edit sản phẩm với quantity = null -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();
        const product = {
            id: 1,
            name: "Laptop Dell Vostro",
            quantity: null,
            price: 18000000,
            description: "Laptop văn phòng cơ bản",
            category: "Business",
        };

        render(
            <ProductForm
                product={product}
                onSave={onSave}
                onCancel={jest.fn()}
            />
        );

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(
            screen.getByText("Số lượng không được để trống")
        ).toBeInTheDocument();
    });

    it("TCF9: Edit sản phẩm với price = null -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();
        const product = {
            id: 1,
            name: "Laptop HP Pavilion",
            quantity: 10,
            price: null,
            description: "Laptop học tập giải trí nhẹ",
            category: "Student",
        };

        render(
            <ProductForm
                product={product}
                onSave={onSave}
                onCancel={jest.fn()}
            />
        );

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(
            screen.getByText("Giá không được để trống")
        ).toBeInTheDocument();
    });
});
