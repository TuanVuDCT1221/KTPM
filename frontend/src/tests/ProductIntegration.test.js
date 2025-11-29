import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductManager from '../components/ProductManager';

global.fetch = jest.fn();

describe('4.2.1 Frontend Component Integration', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('a) Test ProductList Component Integration', () => {
    test('Hiển thị danh sách sản phẩm sau khi gọi API thành công', async () => {
      const mockData = [
        { id: 1, name: 'Trà Đào', qty: 10, price: 30000, category: 'Tea', description: 'Trà đào ngâm sả' }
      ];
      fetch.mockResolvedValueOnce({
        json: async () => mockData,
      });

      render(<ProductManager />);

      await waitFor(() => {
        expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
        expect(screen.getByText('Trà Đào')).toBeInTheDocument();
        expect(screen.getByText('Tea')).toBeInTheDocument();
        expect(screen.getByText('Trà đào ngâm sả')).toBeInTheDocument();
      });
    });
  });

  describe('b) Test ProductForm Component Integration', () => {
    test('Create: Điền form và gọi API POST', async () => {
      fetch.mockResolvedValueOnce({ json: async () => [] });

      const { container } = render(<ProductManager />);

      fireEvent.click(screen.getByText('Thêm sản phẩm'));

      expect(screen.getByText('Thêm sản phẩm')).toBeInTheDocument();

      const nameInput = container.querySelector('input[name="name"]');
      const priceInput = container.querySelector('input[name="price"]');
      const descInput = container.querySelector('textarea[name="description"]');

      fireEvent.change(nameInput, { target: { value: 'Bạc Xỉu' } });
      fireEvent.change(priceInput, { target: { value: '25000' } });
      fireEvent.change(descInput, { target: { value: 'Nhiều sữa' } });

      fetch.mockResolvedValueOnce({ ok: true });
      fetch.mockResolvedValueOnce({ json: async () => [] });

      fireEvent.click(screen.getByText('Lưu'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/products'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Nhiều sữa')
          })
        );
      });
    });

    test('Edit: Load dữ liệu vào form và gọi API PUT', async () => {
      const mockData = [{ id: 1, name: 'Cũ', qty: 1, price: 10, category: 'Milk', description: 'Milo' }];
      fetch.mockResolvedValueOnce({ json: async () => mockData });

      const { container } = render(<ProductManager />);

      await waitFor(() => screen.getByText('Cũ'));
      fireEvent.click(screen.getByText('Sửa'));

      expect(screen.getByDisplayValue('Cũ')).toBeInTheDocument();
      expect(screen.getByText('Sửa sản phẩm')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Milo')).toBeInTheDocument();

      const nameInput = container.querySelector('input[name="name"]');
      const descInput = container.querySelector('textarea[name="description"]');

      fireEvent.change(nameInput, { target: { value: 'Mới' } });
      fireEvent.change(descInput, { target: { value: 'THTrueMilk' } });

      fetch.mockResolvedValueOnce({ ok: true });
      fetch.mockResolvedValueOnce({ json: async () => [] });

      fireEvent.click(screen.getByText('Lưu'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/products'),
          expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('THTrueMilk')
          })
        );
      });
    });
  });

  describe('c) Test ProductDetail Component Integration', () => {
    test('Hiển thị chi tiết khi bấm Xem', async () => {
      const mockData = [{ id: 99, name: 'Sản phẩm Test', qty: 5, price: 100, category: 'Coffee', description: 'Nhiều sữa ít cà phê' }];
      fetch.mockResolvedValueOnce({ json: async () => mockData });

      render(<ProductManager />);

      await waitFor(() => screen.getByText('Sản phẩm Test'));

      fireEvent.click(screen.getByText('Xem'));

      expect(screen.getByText('Chi tiết sản phẩm')).toBeInTheDocument();
      expect(screen.getByText(/ID: 99/)).toBeInTheDocument();
      expect(screen.getByText(/Tên: Sản phẩm Test/)).toBeInTheDocument();
      expect(screen.getByText(/Mô tả: Nhiều sữa ít cà phê/)).toBeInTheDocument();

      fireEvent.click(screen.getByText('Quay lại'));
      expect(screen.getByText('Danh sách sản phẩm')).toBeInTheDocument();
    });
  });
});