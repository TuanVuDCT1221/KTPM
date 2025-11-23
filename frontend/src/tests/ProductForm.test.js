import { render, screen, fireEvent } from "@testing-library/react";
import ProductForm from "../components/ProductForm";
import { jest } from "@jest/globals";

describe("ProductForm", () => {
    it("TCF1: Render form với dữ liệu sản phẩm khi edit", ()=> {
        const product = {
            id: 1,
            name: "Cà phê sữa",
            quantity: 10,
            price: 20000,
            description: "Cà phê sữa ngon lắm",
            category: "Coffee",
        };

        render(<ProductForm product={product} onSave={jest.fn()} onCancel={jest.fn}/>);

        expect(screen.getByLabelText("Tên:")).toHaveValue("Cà phê sữa");
        expect(screen.getByLabelText("Số lượng:")).toHaveValue(10);
        expect(screen.getByLabelText("Giá:")).toHaveValue(20000);
        expect(screen.getByLabelText("Mô tả:")).toHaveValue("Cà phê sữa ngon lắm");
        expect(screen.getByLabelText("Danh mục:")).toHaveValue("Coffee");
    });

    it("TCF2: Submit form với dữ liệu hợp lệ -> gọi onSave với payload đúng", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: {value: "Trà sữa"},
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: {value: "5"},
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: {value: "15000"},
        });
        fireEvent.change(screen.getByLabelText("Mô tả:"), {
            target: {value: "Ngon"},
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: {value: "Tea"},
        });
        
        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Trà sữa",
                quantity: 5,
                price: 15000,
                description: "Ngon",
                category: "Tea",
            })
        );
    });

    it("TCF3: Tên rỗng -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();
        
        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: {value: "1"},
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: {value: "10000"},
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {  
            target: {value: "Coffee"},
        });

        fireEvent.click(screen.getByText("Lưu"));

        // Không gọi onSave
        expect(onSave).not.toHaveBeenCalled();

        // Hiển thị message lỗi từ validateProduct
        expect(screen.getByRole("alert")).toHaveTextContent("Tên sản phẩm không được để trống");

    });

    it("TCF4: Price rỗng -> không gọi onSave và hiển thị lỗi", () =>{
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: {value: "Cà phê sữa"},
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: {value: "2"},
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: {value: "Coffee"},
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByText("Giá không được để trống")).toBeInTheDocument();
    });

    it("TCF5: Category rỗng -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: {value: "Cà phê sữa"},
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: {value: "2"},
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: {value: "30000"},
        });
        
        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByText("Danh mục không được để trống")).toBeInTheDocument();
    });

    it("TCF6: Quantity > 99999 -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: {value: "Cà phê sữa"},
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: {value: "100000"},
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: {value: "30000"},
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: {value: "Coffee"},
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByText("Số lượng phải từ 0 đến 99,999")).toBeInTheDocument();
    });

    it("TCF7: Description > 500 ký tự, -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();
        const longDescription = "a".repeat(501);    

        render(<ProductForm product={null} onSave={onSave} onCancel={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("Tên:"), {
            target: {value: "Cà phê sữa"},
        });
        fireEvent.change(screen.getByLabelText("Số lượng:"), {
            target: {value: "10"},
        });
        fireEvent.change(screen.getByLabelText("Giá:"), {
            target: {value: "30000"},
        });
        fireEvent.change(screen.getByLabelText("Mô tả:"), {
            target: {value: longDescription},
        });
        fireEvent.change(screen.getByLabelText("Danh mục:"), {
            target: {value: "Coffee"},
        });

        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByText("Mô tả phải nhỏ hơn hoặc bằng 500 ký tự")).toBeInTheDocument();
    });

    it("TCF8: Edit sản phẩm với quantity = null -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();
        const product = {
            id: 1,
            name: "Cà phê sữa",
            quantity: null, 
            price: 20000, 
            description: "Cà phê sữa ngon lắm",
            category: "Coffee",
        };   

        render(<ProductForm product={product} onSave={onSave} onCancel={jest.fn()} />);


        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByText("Số lượng không được để trống")).toBeInTheDocument();
    });

    it("TCF9: Edit sản phẩm với price = null -> không gọi onSave và hiển thị lỗi", () => {
        const onSave = jest.fn();
        const product = {
            id: 1,
            name: "Cà phê sữa",
            quantity: 10, 
            price: null, 
            description: "Cà phê sữa ngon lắm",
            category: "Coffee",
        };   

        render(<ProductForm product={product} onSave={onSave} onCancel={jest.fn()} />);


        fireEvent.click(screen.getByText("Lưu"));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByText("Giá không được để trống")).toBeInTheDocument();
    });
});
