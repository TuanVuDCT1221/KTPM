import React from "react";

export default function ProductDetail({ product, onBack }) {
  if (!product) return <div>Không có dữ liệu</div>;

  return (
    <div>
      <h2>Chi tiết sản phẩm</h2>
      <p>ID: {product.id}</p>
      <p>Tên: {product.name}</p>
      <p>Số lượng: {product.quantity}</p>
      <p>Giá: {product.price}</p>
      <p>Danh mục: {product.category}</p>
      <button onClick={onBack}>Quay lại</button>
    </div>
  );
}