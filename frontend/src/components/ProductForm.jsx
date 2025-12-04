import React, { useState, useEffect } from "react";
import { validateProduct } from "../utils/productValidation";

const emptyForm = {
    id: null,
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
};

export default function ProductForm({ product, onSave, onCancel }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setForm({
                ...emptyForm,
                ...product,
                quantity:
                    product.quantity === null || product.quantity === undefined
                        ? ""
                        : product.quantity,
                price:
                    product.price === null || product.price === undefined
                        ? ""
                        : product.price,
            });
        } else {
            setForm(emptyForm);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const validationErrors = validateProduct(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const payload = {
            ...form,
            quantity:
                form.quantity === "" || form.quantity === null
                    ? null
                    : Number(form.quantity),
            price:
                form.price === "" || form.price === null
                    ? null
                    : Number(form.price),
        };

        onSave(payload);
    };

    return (
        <div>
            <h2>{form.id == null ? "Thêm sản phẩm" : "Sửa sản phẩm"}</h2>

            <div>
                <label htmlFor="name">Tên:</label>
                <input
                    id="name"
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                />
                {errors.name && <p role="alert">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="quantity">Số lượng:</label>
                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={form.quantity ?? ""}
                    onChange={handleChange}
                />
                {errors.quantity && <p role="alert">{errors.quantity}</p>}
            </div>

            <div>
                <label htmlFor="price">Giá:</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price ?? ""}
                    onChange={handleChange}
                />
                {errors.price && <p role="alert">{errors.price}</p>}
            </div>

            <div>
                <label htmlFor="description">Mô tả:</label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                />
                {errors.description && <p role="alert">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category">Danh mục:</label>
                <select
                    id="category"
                    name="category"
                    value={form.category || ""}
                    onChange={handleChange}
                >
                    <option value="">--Chọn--</option>
                    <option value="Ultrabook">Ultrabook</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Business">Business</option>
                    <option value="Student">Student</option>
                </select>
                {errors.category && <p role="alert">{errors.category}</p>}
            </div>

            <button type="button" onClick={handleSubmit}>
                Lưu
            </button>
            <button type="button" onClick={onCancel}>
                Hủy
            </button>
        </div>
    );
}