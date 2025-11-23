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

  useEffect(() => {
    if (product) {
      // merge để tránh thiếu field description / quantity...
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
      const errors = validateProduct(form);
      if(Object.keys(errors).length > 0) {
          console.log("Validation errors: ", errors);
          return;
      }

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
        <label>Tên:</label>
        <input
          name="name"
          value={form.name || ""}
          onChange={change}
        />
      </div>

      <div>
        <label>Số lượng:</label>
        <input
          name="quantity"
          type="number"
          value={form.quantity ?? ""}
          onChange={change}
        />
      </div>

      <div>
        <label>Giá:</label>
        <input
          name="price"
          type="number"
          value={form.price ?? ""}
          onChange={change}
        />
      </div>

      <div>
        <label>Mô tả:</label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={change}
        />
      </div>

      <div>
        <label>Danh mục:</label>
        <select
          name="category"
          value={form.category || ""}
          onChange={change}
        >
          <option value="">--Chọn--</option>
          <option value="Coffee">Coffee</option>
          <option value="Tea">Tea</option>
          <option value="Milk">Milk</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Lưu</button>
      <button onClick={onCancel}>Hủy</button>
    </div>
  );
}