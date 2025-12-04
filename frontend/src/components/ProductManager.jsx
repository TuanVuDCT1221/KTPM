import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";
import api from "../services/api";

export default function ProductManager() {
    const [page, setPage] = useState("list");
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            const res = await api.get("/api/products"); // GET http://localhost:8080/api/products
            setProducts(res.data);
        } catch (err) {
            console.error("Load products error:", err);
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const showErrorFromApi = (err) => {
        console.error("API error:", err);
        const apiMessage = err?.response?.data;

        if (typeof apiMessage === "string" && apiMessage.trim() !== "") {
            // Ví dụ: "Tên sản phẩm đã tồn tại", "Loại sản phẩm không hợp lệ", "Sản phẩm không tồn tại"
            setError(apiMessage);
        } else {
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    const handleCreate = () => {
        setSelected(null);
        setError("");
        setPage("form");
    };

    const handleEdit = (item) => {
        setSelected(item);
        setError("");
        setPage("form");
    };

    const handleView = (item) => {
        setSelected(item);
        setError("");
        setPage("detail");
    };

    const handleSave = async (product) => {
        try {
            setError("");

            if (product.id == null) {
                // Tạo mới
                await api.post("/api/products", product);
                window.alert("Thêm sản phẩm thành công");
            } else {
                // Cập nhật
                await api.put(`/api/products/${product.id}`, product);
                window.alert("Cập nhật sản phẩm thành công");
            }

            await loadData();
            setPage("list");
        } catch (err) {
            // Hiển thị "Tên sản phẩm đã tồn tại" / "Loại sản phẩm không hợp lệ" / ...
            showErrorFromApi(err);
        }
    };

    const handleDelete = async (id) => {
        // Dialog xác nhận YES/NO
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa sản phẩm này không?"
        );
        if (!confirmed) {
            return; // Người dùng chọn Hủy
        }

        try {
            setError("");

            await api.delete(`/api/products/${id}`);

            await loadData();
            window.alert("Xóa sản phẩm thành công");
        } catch (err) {
            showErrorFromApi(err);
        }
    };

    const handleCancel = () => {
        setError("");
        setPage("list");
    };

    const handleBack = () => {
        setError("");
        setPage("list");
    };

    return (
        <div>
            {/* Thông báo lỗi chung */}
            {error && <p style={{ color: "red" }}>{error}</p>}

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
                    onCancel={handleCancel}
                />
            )}

            {page === "detail" && (
                <ProductDetail product={selected} onBack={handleBack} />
            )}
        </div>
    );
}