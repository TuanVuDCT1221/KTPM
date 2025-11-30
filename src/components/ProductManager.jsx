// ===== ProductManager.jsx =====
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";

export default function ProductManager() {
  const [page, setPage] = useState("list");
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  const API = "http://localhost:8080/api/products";

  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setSelected(null);
    setPage("form");
  };

  const handleEdit = (item) => {
    setSelected(item);
    setPage("form");
  };

  const handleView = (item) => {
    setSelected(item);
    setPage("detail");
  };

  const handleSave = async (product) => {
    await fetch(API, {
      method: product.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    loadData();
    setPage("list");
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <>
      {page === "list" && (
        <ProductList
          data={products}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {page === "form" && (
        <ProductForm
          product={selected}
          onSave={handleSave}
          onCancel={() => setPage("list")}
        />
      )}

      {page === "detail" && (
        <ProductDetail
          product={selected}
          onBack={() => setPage("list")}
        />
      )}
    </>
  );
}


