import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductManager from '../components/ProductManager';
import api from '../services/api';

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  },
}));

const mockConfirm = jest.spyOn(window, 'confirm');
const mockAlert = jest.spyOn(window, 'alert');

describe('4.2.1 Frontend Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockImplementation(() => true);
    mockAlert.mockImplementation(() => { });
  });

  describe('a) Test ProductList Component Integration', () => {
    test('Hiển thị danh sách sản phẩm sau khi gọi API thành công', async () => {
      const mockData = [
        { id: 1, name: 'MacBook Air M1', quantity: 10, price: 18000000, category: 'Ultrabook' }
      ];
      api.get.mockResolvedValue({ data: mockData });

      render(<ProductManager />);

      await waitFor(() => {
        expect(screen.getByText('MacBook Air M1')).toBeInTheDocument();
      });
    });

    test('Tích hợp List: Bấm nút Xóa sản phẩm thành công', async () => {
      const mockData = [{ id: 1, name: 'Laptop Cũ', quantity: 1, price: 5000000, category: 'Student' }];
      api.get.mockResolvedValue({ data: mockData });

      render(<ProductManager />);
      await waitFor(() => screen.getByText('Laptop Cũ'));

      api.delete.mockResolvedValue({});
      api.get.mockResolvedValue({ data: [] });

      fireEvent.click(screen.getByText('Xóa'));

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/api/products/1');
        expect(mockAlert).toHaveBeenCalledWith("Xóa sản phẩm thành công");
      });
    });

    test('Tích hợp List: Bấm nút Xóa nhưng chọn Cancel', async () => {
      const mockData = [{ id: 2, name: 'Laptop Giữ Lại', quantity: 1, price: 1000, category: 'Student' }];
      api.get.mockResolvedValue({ data: mockData });

      mockConfirm.mockImplementation(() => false);

      render(<ProductManager />);
      await waitFor(() => screen.getByText('Laptop Giữ Lại'));

      fireEvent.click(screen.getByText('Xóa'));

      expect(api.delete).not.toHaveBeenCalled();
    });
  });

  describe('b) Test ProductForm Component Integration', () => {
    test('Create: Điền form và gọi API POST thành công', async () => {
      api.get.mockResolvedValue({ data: [] });
      const { container } = render(<ProductManager />);

      fireEvent.click(screen.getByText('Thêm sản phẩm'));

      fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: 'Asus TUF' } });
      fireEvent.change(container.querySelector('input[name="quantity"]'), { target: { value: '5' } });
      fireEvent.change(container.querySelector('input[name="price"]'), { target: { value: '20000000' } });
      fireEvent.change(container.querySelector('select[name="category"]'), { target: { value: 'Gaming' } });
      fireEvent.change(container.querySelector('textarea[name="description"]'), { target: { value: 'RTX 3050' } });

      api.post.mockResolvedValue({});
      api.get.mockResolvedValue({ data: [] });

      fireEvent.click(screen.getByText('Lưu'));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalled();
        expect(mockAlert).toHaveBeenCalledWith("Thêm sản phẩm thành công");
      });
    });

    test('Edit: Load dữ liệu và gọi API PUT thành công', async () => {
      const mockData = [{ id: 99, name: 'Dell XPS 13', quantity: 2, price: 30000000, category: 'Business' }];
      api.get.mockResolvedValue({ data: mockData });

      const { container } = render(<ProductManager />);
      await waitFor(() => screen.getByText('Dell XPS 13'));

      fireEvent.click(screen.getByText('Sửa'));
      fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: 'Dell XPS 13 Plus' } });

      api.put.mockResolvedValue({});
      api.get.mockResolvedValue({ data: [] });

      fireEvent.click(screen.getByText('Lưu'));

      await waitFor(() => {
        expect(api.put).toHaveBeenCalled();
        expect(mockAlert).toHaveBeenCalledWith("Cập nhật sản phẩm thành công");
      });
    });

    test('Create: Xử lý lỗi từ API', async () => {
      api.get.mockResolvedValue({ data: [] });
      const { container } = render(<ProductManager />);

      fireEvent.click(screen.getByText('Thêm sản phẩm'));

      fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: 'Lỗi' } });
      fireEvent.change(container.querySelector('input[name="quantity"]'), { target: { value: '1' } });
      fireEvent.change(container.querySelector('input[name="price"]'), { target: { value: '100' } });
      fireEvent.change(container.querySelector('select[name="category"]'), { target: { value: 'Gaming' } });

      const errorResponse = { response: { data: 'Tên đã tồn tại' } };
      api.post.mockRejectedValue(errorResponse);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      fireEvent.click(screen.getByText('Lưu'));

      await waitFor(() => {
        expect(screen.getByText('Tên đã tồn tại')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('c) Test ProductDetail Component Integration', () => {
    test('Hiển thị chi tiết khi bấm Xem', async () => {
      const mockData = [{ id: 100, name: 'Lenovo ThinkPad', quantity: 50, price: 25000000, category: 'Business' }];
      api.get.mockResolvedValue({ data: mockData });

      render(<ProductManager />);
      await waitFor(() => screen.getByText('Lenovo ThinkPad'));

      fireEvent.click(screen.getByText('Xem'));

      expect(screen.getByText('Chi tiết sản phẩm')).toBeInTheDocument();
      expect(screen.getByText(/Lenovo ThinkPad/)).toBeInTheDocument();

      fireEvent.click(screen.getByText('Quay lại'));
      expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
    });
  });

  test('Delete: Xử lý lỗi từ API khi xóa thất bại', async () => {
    const mockData = [{ id: 1, name: 'Laptop Lỗi Xóa', quantity: 1, price: 5000000, category: 'Student' }];
    api.get.mockResolvedValue({ data: mockData });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    render(<ProductManager />);
    await waitFor(() => screen.getByText('Laptop Lỗi Xóa'));

    api.delete.mockRejectedValue(new Error('Network Error'));

    fireEvent.click(screen.getByText('Xóa'));

    await waitFor(() => {
      expect(screen.getByText('Đã xảy ra lỗi. Vui lòng thử lại.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('Create: Xử lý lỗi không xác định', async () => {
    api.get.mockResolvedValue({ data: [] });
    const { container } = render(<ProductManager />);

    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: 'Test' } });
    fireEvent.change(container.querySelector('input[name="quantity"]'), { target: { value: '1' } });
    fireEvent.change(container.querySelector('input[name="price"]'), { target: { value: '100' } });
    fireEvent.change(container.querySelector('select[name="category"]'), { target: { value: 'Gaming' } });

    api.post.mockRejectedValue({});

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    fireEvent.click(screen.getByText('Lưu'));

    await waitFor(() => {
      expect(screen.getByText('Đã xảy ra lỗi. Vui lòng thử lại.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });


  test('Load Data - Hiển thị lỗi khi API get danh sách thất bại', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    api.get.mockRejectedValue(new Error('Network Error'));

    render(<ProductManager />);

    await waitFor(() => {
      expect(screen.getByText('Không thể tải danh sách sản phẩm. Vui lòng thử lại.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });


  test('ProductDetail hiển thị thông báo khi không có dữ liệu (product null)', () => {
    const ProductDetail = require('../components/ProductDetail').default;
    render(<ProductDetail product={null} />);

    expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument();
  });


  test('Validation - Chặn gọi API khi dữ liệu form không hợp lệ', async () => {
    api.get.mockResolvedValue({ data: [] });
    const { container } = render(<ProductManager />);

    await waitFor(() => {
      expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
    });

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
    fireEvent.change(priceInput, { target: { value: '-5000' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Giá phải lớn hơn 0')).toBeInTheDocument();

    fireEvent.change(priceInput, { target: { value: '1000000000' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Giá phải nhỏ hơn hoặc bằng 999,999,999')).toBeInTheDocument();

    fireEvent.change(priceInput, { target: { value: '50000' } });
    fireEvent.change(qtyInput, { target: { value: '-1' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Số lượng phải từ 0 đến 99,999')).toBeInTheDocument();

    fireEvent.change(qtyInput, { target: { value: '100001' } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Số lượng phải từ 0 đến 99,999')).toBeInTheDocument();


    fireEvent.change(qtyInput, { target: { value: '10' } });
    fireEvent.change(catSelect, { target: { value: 'Gaming' } });

    const longDesc = 'a'.repeat(501);
    fireEvent.change(descInput, { target: { value: longDesc } });
    fireEvent.click(saveBtn);
    expect(screen.getByText('Mô tả phải nhỏ hơn hoặc bằng 500 ký tự')).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled();
  });

  test('Form: Nút Hủy quay về danh sách', async () => {
    api.get.mockResolvedValue({ data: [] });
    render(<ProductManager />);

    await waitFor(() => screen.getByText('Danh sách sản phẩm'));

    fireEvent.click(screen.getByText('Thêm sản phẩm'));
    expect(screen.getByText('Thêm sản phẩm', { selector: 'h2' })).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hủy'));

    expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
  });
});