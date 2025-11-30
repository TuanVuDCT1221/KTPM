import React, { useState, useEffect } from "react";

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({ id: "", name: "", qty: "", price: "", category: "" });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>{product ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>

      <div>
        <label>Tên:</label>
        <input name="name" value={form.name} onChange={change} />
      </div>

      <div>
        <label>Số lượng:</label>
        <input name="qty" value={form.qty} onChange={change} />
      </div>

      <div>
        <label>Giá:</label>
        <input name="price" value={form.price} onChange={change} />
      </div>

      <div>
        <label>Danh mục:</label>
        <select name="category" value={form.category} onChange={change}>
          <option value="">--Chọn--</option>
          <option value="Coffee">Coffee</option>
          <option value="Tea">Tea</option>
          <option value="Milk">Milk</option>
        </select>
      </div>

      <button onClick={() => onSave(form)}>Lưu</button>
      <button onClick={onCancel}>Hủy</button>
    </div>
  );
}