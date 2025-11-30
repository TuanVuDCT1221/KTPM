import React from "react";

export default function ProductList({ data, onCreate, onEdit, onDelete, onView }) {
  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <button onClick={onCreate}>Thêm sản phẩm</button>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.qty}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>
                <button onClick={() => onView(p)}>Xem</button>
                <button onClick={() => onEdit(p)}>Sửa</button>
                <button onClick={() => onDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}