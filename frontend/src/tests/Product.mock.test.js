import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductManager from '../components/ProductManager';
import ProductDetail from '../components/ProductDetail';

global.fetch = jest.fn();

describe('5.2.1 Frontend Mocking', () => {

  beforeEach(() => {
    fetch.mockClear();
  });

  test('Mock: Gọi API POST khi tạo sản phẩm thành công (create)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Trà Xanh', price: 20000, qty: 10, category: 'Tea', description: 'Thơm ngon' }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: 1, name: 'Trà Xanh', price: 20000, qty: 10, category: 'Tea', description: 'Thơm ngon' }]),
    });

    const { container } = render(<ProductManager />);
    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    const nameInput = container.querySelector('input[name="name"]');
    const priceInput = container.querySelector('input[name="price"]');
    const qtyInput = container.querySelector('input[name="qty"]');
    const descInput = container.querySelector('textarea[name="description"]');

    fireEvent.change(nameInput, { target: { value: 'Trà Xanh' } });
    fireEvent.change(priceInput, { target: { value: '20000' } });
    fireEvent.change(qtyInput, { target: { value: '10' } });
    fireEvent.change(descInput, { target: { value: 'Thơm ngon' } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products'),
        expect.objectContaining({
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining('"description":"Thơm ngon"')
        })
      );
    });
  });

  test('Mock: Gọi API GET và hiển thị danh sách (read)', async () => {
    const mockData = [
      { id: 10, name: 'Cà phê sữa', qty: 5, price: 25000, category: 'Coffee', description: 'Sữa đặc' }
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    render(<ProductManager />);

    await waitFor(() => {
      expect(screen.getByText('Cà phê sữa')).toBeInTheDocument();
      expect(screen.getByText('Sữa đặc')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('Mock: Gọi API PUT khi cập nhật sản phẩm (update)', async () => {
    const mockData = [
      { id: 1, name: 'Sản phẩm Cũ', qty: 5, price: 10000, category: 'Milk', description: 'Mô tả cũ' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Sản phẩm Mới', qty: 5, price: 20000, category: 'Milk', description: 'Mô tả mới' }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: 1, name: 'Sản phẩm Mới', qty: 5, price: 20000, category: 'Milk', description: 'Mô tả mới' }]),
    });

    const { container } = render(<ProductManager />);

    await waitFor(() => screen.getByText('Sản phẩm Cũ'));

    fireEvent.click(screen.getByText('Sửa'));

    const priceInput = container.querySelector('input[name="price"]');
    const descInput = container.querySelector('textarea[name="description"]');

    fireEvent.change(priceInput, { target: { value: '20000' } });
    fireEvent.change(descInput, { target: { value: 'Mô tả mới' } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining('"description":"Mô tả mới"')
        })
      );
    });
  });

  test('Mock: Gọi API DELETE với đúng ID (delete)', async () => {
    const mockData = [
      { id: 99, name: 'Sản phẩm Xóa', qty: 1, price: 1000, category: 'Other', description: 'ngon tuyệt' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ProductManager />);

    await waitFor(() => screen.getByText('Xóa'));
    fireEvent.click(screen.getByText('Xóa'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products/99'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });


  test('Scenario: Success - Tạo sản phẩm thành công', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [], });

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, name: 'Trà Xanh', price: 20000, qty: 10, category: 'Tea', description: 'Tuyệt' }),
    });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1, name: 'Trà Xanh', price: 20000, qty: 10, category: 'Tea', description: 'Tuyệt' }]), });

    const { container } = render(<ProductManager />);
    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    const nameInput = container.querySelector('input[name="name"]');
    const priceInput = container.querySelector('input[name="price"]');
    const qtyInput = container.querySelector('input[name="qty"]');
    const descInput = container.querySelector('textarea[name="description"]');

    fireEvent.change(nameInput, { target: { value: 'Trà Xanh' } });
    fireEvent.change(priceInput, { target: { value: '20000' } });
    fireEvent.change(qtyInput, { target: { value: '10' } });
    fireEvent.change(descInput, { target: { value: 'Tuyệt' } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"description":"Tuyệt"')
        })
      );
    });
  });

  test('Mock: Xử lý khi API trả về lỗi (Failure Scenario)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Lỗi server" })
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { container } = render(<ProductManager />);

    fireEvent.click(screen.getByText('Thêm sản phẩm'));
    const nameInput = container.querySelector('input[name="name"]');
    fireEvent.change(nameInput, { target: { value: 'Coca' } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  test('Mock: Xem chi tiết sản phẩm và quay lại', async () => {
    const mockData = [{ id: 1, name: 'Sản phẩm Xem', qty: 10, price: 5000, category: 'Tea', description: 'Mô tả xem' }];
    fetch.mockResolvedValue({ ok: true, json: async () => mockData });

    render(<ProductManager />);

    await waitFor(() => screen.getByText('Sản phẩm Xem'));

    fireEvent.click(screen.getByText('Xem'));
    expect(screen.getByText('Chi tiết sản phẩm')).toBeInTheDocument();
    expect(screen.getByText(/Mô tả xem/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Quay lại'));
    await waitFor(() => screen.getByText('Danh sách sản phẩm'));
  });


  test('Mock: Hủy bỏ khi đang thêm sản phẩm', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });
    render(<ProductManager />);

    fireEvent.click(screen.getByText('Thêm sản phẩm'));
    expect(screen.getByText('Thêm sản phẩm')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hủy'));

    await waitFor(() => {
      expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
    });
  });

  test('Mock: Hiển thị thông báo khi không có dữ liệu chi tiết', () => {
    render(<ProductDetail product={null} />);
    expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument();
  });
});