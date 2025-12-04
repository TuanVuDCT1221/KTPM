import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductManager from '../components/ProductManager';
import api from '../services/api';

jest.mock('../services/api');

const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => { });
const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => true);

describe('5.2.1 Frontend Mocking (Product Service/API)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  test('Mock: Create Product thành công (POST)', async () => {
    const newProduct = {
      name: 'Laptop Gaming',
      price: 20000000,
      quantity: 5,
      category: 'Gaming',
      description: 'RTX 4060'
    };

    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({ data: { id: 1, ...newProduct } });

    const { container } = render(<ProductManager />);

    await waitFor(() => screen.getByText('Danh sách sản phẩm'));

    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    const nameInput = container.querySelector('input[name="name"]');
    const priceInput = container.querySelector('input[name="price"]');
    const qtyInput = container.querySelector('input[name="quantity"]');
    const catSelect = container.querySelector('select[name="category"]');
    const descInput = container.querySelector('textarea[name="description"]');

    fireEvent.change(nameInput, { target: { value: newProduct.name } });
    fireEvent.change(priceInput, { target: { value: newProduct.price } });
    fireEvent.change(qtyInput, { target: { value: newProduct.quantity } });
    fireEvent.change(catSelect, { target: { value: newProduct.category } });
    fireEvent.change(descInput, { target: { value: newProduct.description } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        '/api/products',
        expect.objectContaining({
          name: 'Laptop Gaming',
          category: 'Gaming'
        })
      );
      expect(mockAlert).toHaveBeenCalledWith('Thêm sản phẩm thành công');
    });
  });

  test('Mock: Get Products hiển thị danh sách (GET)', async () => {
    const mockData = [
      { id: 1, name: 'MacBook Air', quantity: 10, price: 18000000, category: 'Ultrabook' }
    ];

    api.get.mockResolvedValue({ data: mockData });

    render(<ProductManager />);

    await waitFor(() => {
      expect(screen.getByText('MacBook Air')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith('/api/products');
  });

  test('Mock: Update Product thành công (PUT)', async () => {
    const mockData = [
      { id: 99, name: 'Chuột cũ', quantity: 2, price: 100000, category: 'Gaming' }
    ];

    api.get.mockResolvedValue({ data: mockData });
    api.put.mockResolvedValue({ data: {} });

    const { container } = render(<ProductManager />);

    await waitFor(() => screen.getByText('Chuột cũ'));
    fireEvent.click(screen.getByText('Sửa'));

    const nameInput = container.querySelector('input[name="name"]');
    fireEvent.change(nameInput, { target: { value: 'Chuột mới' } });

    api.get.mockResolvedValueOnce({ data: [] });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledTimes(1);
      expect(api.put).toHaveBeenCalledWith(
        '/api/products/99',
        expect.objectContaining({ name: 'Chuột mới', id: 99 })
      );
      expect(mockAlert).toHaveBeenCalledWith('Cập nhật sản phẩm thành công');
    });
  });

  test('Mock: Delete Product thành công (DELETE)', async () => {
    const mockData = [
      { id: 100, name: 'Sản phẩm xóa', quantity: 1, price: 5000, category: 'Other' }
    ];

    api.get.mockResolvedValue({ data: mockData });
    api.delete.mockResolvedValue({ data: {} });

    render(<ProductManager />);

    await waitFor(() => screen.getByText('Sản phẩm xóa'));

    api.get.mockResolvedValueOnce({ data: [] });

    fireEvent.click(screen.getByText('Xóa'));

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledTimes(1);
      expect(api.delete).toHaveBeenCalledWith('/api/products/100');
      expect(mockAlert).toHaveBeenCalledWith('Xóa sản phẩm thành công');
    });
  });

  test('TC_Create_Success: Tạo sản phẩm iPhone 16 Pro Max thành công', async () => {
    const newProductData = {
      name: 'iPhone 16 Pro Max',
      price: 34990000,
      quantity: 50,
      category: 'Business',
      description: 'Màu Titan Sa Mạc'
    };

    api.get.mockResolvedValue({ data: [] });

    api.post.mockResolvedValue({
      data: { id: 2025, ...newProductData }
    });

    const { container } = render(<ProductManager />);

    await waitFor(() => screen.getByText('Danh sách sản phẩm'));

    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: newProductData.name } });
    fireEvent.change(container.querySelector('input[name="price"]'), { target: { value: newProductData.price } });
    fireEvent.change(container.querySelector('input[name="quantity"]'), { target: { value: newProductData.quantity } });
    fireEvent.change(container.querySelector('select[name="category"]'), { target: { value: newProductData.category } });
    fireEvent.change(container.querySelector('textarea[name="description"]'), { target: { value: newProductData.description } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        '/api/products',
        expect.objectContaining({
          name: 'iPhone 16 Pro Max',
          price: 34990000,
          category: 'Business'
        })
      );
      expect(mockAlert).toHaveBeenCalledWith('Thêm sản phẩm thành công');
    });
  });

  test('Mock: Failure Scenario - Hiển thị lỗi khi Load API thất bại', async () => {
    const errorMessage = 'Network Error';
    api.get.mockRejectedValue(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    render(<ProductManager />);

    await waitFor(() => {
      expect(screen.getByText('Không thể tải danh sách sản phẩm. Vui lòng thử lại.')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  test('Mock: Failure Scenario - Hiển thị lỗi từ Backend khi Tạo thất bại', async () => {
    api.get.mockResolvedValue({ data: [] });

    const errorResponse = {
      response: {
        data: 'Tên sản phẩm đã tồn tại'
      }
    };
    api.post.mockRejectedValue(errorResponse);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    const { container } = render(<ProductManager />);

    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    const nameInput = container.querySelector('input[name="name"]');
    const priceInput = container.querySelector('input[name="price"]');
    const qtyInput = container.querySelector('input[name="quantity"]');
    const catSelect = container.querySelector('select[name="category"]');

    fireEvent.change(nameInput, { target: { value: 'Bị trùng' } });
    fireEvent.change(priceInput, { target: { value: '100000' } });
    fireEvent.change(qtyInput, { target: { value: '10' } });
    fireEvent.change(catSelect, { target: { value: 'Gaming' } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Tên sản phẩm đã tồn tại')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('Mock: View Detail Product (Xem chi tiết)', async () => {
    const mockData = [
      { id: 999, name: 'Sản phẩm Test View', quantity: 5, price: 100000, category: 'Student' }
    ];
    api.get.mockResolvedValue({ data: mockData });

    render(<ProductManager />);

    await waitFor(() => screen.getByText('Sản phẩm Test View'));

    fireEvent.click(screen.getByText('Xem'));

    expect(screen.getByText('Chi tiết sản phẩm')).toBeInTheDocument();
    expect(screen.getByText('Tên: Sản phẩm Test View')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Quay lại'));

    expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
  });


  test(' ProductDetail hiển thị "Không có dữ liệu" khi product null', () => {
    const ProductDetail = require('../components/ProductDetail').default;
    render(<ProductDetail product={null} />);
    expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument();
  });

  test('Delete Product - Người dùng chọn Hủy (Cancel)', async () => {
    const mockData = [{ id: 101, name: 'Sản phẩm Hủy Xóa', quantity: 1, price: 5000, category: 'Other' }];
    api.get.mockResolvedValue({ data: mockData });

    mockConfirm.mockReturnValueOnce(false);

    render(<ProductManager />);
    await waitFor(() => screen.getByText('Sản phẩm Hủy Xóa'));

    fireEvent.click(screen.getByText('Xóa'));

    expect(api.delete).not.toHaveBeenCalled();
    expect(mockConfirm).toHaveBeenCalled();
  });

  test('Delete Product - API bị lỗi khi xóa', async () => {
    const mockData = [{ id: 102, name: 'Sản phẩm Xóa Lỗi', quantity: 1, price: 5000, category: 'Other' }];
    api.get.mockResolvedValue({ data: mockData });

    api.delete.mockRejectedValue(new Error("Lỗi mạng khi xóa"));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    render(<ProductManager />);
    await waitFor(() => screen.getByText('Sản phẩm Xóa Lỗi'));

    fireEvent.click(screen.getByText('Xóa'));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalled();
      expect(screen.getByText('Đã xảy ra lỗi. Vui lòng thử lại.')).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  test('Hiển thị lỗi chung khi API trả về lỗi không đúng định dạng message', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockRejectedValue({ response: { data: null } });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    const { container } = render(<ProductManager />);

    await waitFor(() => screen.getByText('Danh sách sản phẩm'));

    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: 'Test Error' } });
    fireEvent.change(container.querySelector('input[name="price"]'), { target: { value: '1000' } });
    fireEvent.change(container.querySelector('input[name="quantity"]'), { target: { value: '10' } });
    fireEvent.change(container.querySelector('select[name="category"]'), { target: { value: 'Gaming' } });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(screen.getByText('Đã xảy ra lỗi. Vui lòng thử lại.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });


  test('Nút Hủy (Cancel) trong Form quay về danh sách', async () => {
    api.get.mockResolvedValue({ data: [] });
    render(<ProductManager />);

    await waitFor(() => screen.getByText('Danh sách sản phẩm'));

    fireEvent.click(screen.getByText('Thêm sản phẩm'));
    expect(screen.getByText('Thêm sản phẩm', { selector: 'h2' })).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hủy'));
    expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
  });

  test('Validation - Kiểm tra tất cả các lỗi input form', async () => {
    api.get.mockResolvedValue({ data: [] });
    const { container } = render(<ProductManager />);

    await waitFor(() => screen.getByText('Danh sách sản phẩm'));

    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    const saveBtn = screen.getByText('Lưu');
    const nameInput = container.querySelector('input[name="name"]');
    const priceInput = container.querySelector('input[name="price"]');
    const qtyInput = container.querySelector('input[name="quantity"]');
    const catSelect = container.querySelector('select[name="category"]');
    const descInput = container.querySelector('textarea[name="description"]');

    fireEvent.click(saveBtn);
    expect(screen.getByText('Tên sản phẩm không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Giá không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Số lượng không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Danh mục không được để trống')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();

    fireEvent.change(nameInput, { target: { value: 'AB' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Tên sản phẩm phải từ 3 đến 100 ký tự')).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Valid Name' } });
    fireEvent.change(priceInput, { target: { value: '0' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Giá phải lớn hơn 0')).toBeInTheDocument();

    fireEvent.change(priceInput, { target: { value: '1000000000' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Giá phải nhỏ hơn hoặc bằng 999,999,999')).toBeInTheDocument();

    fireEvent.change(priceInput, { target: { value: '50000' } });
    fireEvent.change(qtyInput, { target: { value: '-1' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Số lượng phải từ 0 đến 99,999')).toBeInTheDocument();

    fireEvent.change(qtyInput, { target: { value: '100000' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Số lượng phải từ 0 đến 99,999')).toBeInTheDocument();

    fireEvent.change(qtyInput, { target: { value: '10' } });
    fireEvent.change(catSelect, { target: { value: 'Gaming' } });
    const longText = 'a'.repeat(501);
    fireEvent.change(descInput, { target: { value: longText } });

    fireEvent.click(saveBtn);
    expect(screen.getByText('Mô tả phải nhỏ hơn hoặc bằng 500 ký tự')).toBeInTheDocument();
  });
});