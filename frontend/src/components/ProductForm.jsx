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
      // merge cho chắc đủ field
      setForm({ ...emptyForm, ...product });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // 1. Gọi validateProduct
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);

    // 2. Nếu có lỗi thì không gọi onSave
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // 3. Chuẩn hóa dữ liệu trước khi gửi
    const payload = {
      ...form,
      quantity:
        form.quantity === "" || form.quantity == null
          ? null
          : Number(form.quantity),
      price:
        form.price === "" || form.price == null ? null : Number(form.price),
    };

    onSave(payload);
  };

  return (
    <div>
      <h2>{product ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>

      <div>
        <label htmlFor="name">Tên:</label>
        <input
          id="name"
          name="name"
          value={form.name || ""}
          onChange={change}
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
          onChange={change}
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
          onChange={change}
        />
        {errors.price && <p role="alert">{errors.price}</p>}
      </div>

      <div>
        <label htmlFor="description">Mô tả:</label>
        <textarea
          id="description"
          name="description"
          value={form.description || ""}
          onChange={change}
        />
        {errors.description && <p role="alert">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category">Danh mục:</label>
        <select
          id="category"
          name="category"
          value={form.category || ""}
          onChange={change}
        >
          <option value="">--Chọn--</option>
          <option value="Coffee">Coffee</option>
          <option value="Tea">Tea</option>
          <option value="Milk">Milk</option>
        </select>
        {errors.category && <p role="alert">{errors.category}</p>}
      </div>

      <button onClick={handleSubmit}>Lưu</button>
      <button onClick={onCancel}>Hủy</button>
    </div>
  );
}
