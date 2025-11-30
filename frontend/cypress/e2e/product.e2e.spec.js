import ProductManagementPage from '../pages/ProductManagementPage';
import { faker } from '@faker-js/faker';

describe('Product E2E Tests (CRUD Operations)', () => {
    const productPage = ProductManagementPage;
    
    const newProduct = {
        name: `Cafe_${faker.string.alphanumeric(5)}`,
        qty: '10',
        price: '50000',
        category: 'Coffee',
        description: 'Mô tả cà phê mới'
    };

    const updatedProduct = {
        name: newProduct.name,
        qty: '25',
        price: '55000',
        category: 'Tea',
        description: 'Mô tả đã cập nhật'
    };

    beforeEach(() => {
        cy.login('testuser', 'Test123'); 
        productPage.visit();
    });

    it('1. Tạo sản phẩm mới thành công (CREATE)', () => {
        productPage.getAddNewButton().click();
        productPage.fillProductForm(newProduct);
        productPage.getSaveButton().click();
        productPage.getProductRowByName(newProduct.name)
            .should('exist')
            .and('contain', newProduct.price);
    });

    it('2. Đọc (READ): Kiểm tra danh sách và chi tiết sản phẩm', () => {
        cy.contains('h2', 'Danh sách sản phẩm').should('be.visible');
        productPage.getProductRowByName(newProduct.name).should('be.visible');
        productPage.getViewButton(newProduct.name).click();
        productPage.getDetailTitle().should('be.visible');
        productPage.getDetailField('Tên:').should('contain', newProduct.name);
        productPage.getDetailField('Giá:').should('contain', newProduct.price);
        productPage.getDetailField('Mô tả:').should('contain', newProduct.description);
        productPage.getBackButton().click();
        cy.contains('h2', 'Danh sách sản phẩm').should('be.visible');
    });

    it('3. Cập nhật sản phẩm thành công (UPDATE)', () => {
        const originalName = newProduct.name;
        productPage.getEditButton(originalName).click();
        productPage.fillProductForm(updatedProduct);
        productPage.getSaveButton().click();
        productPage.getProductRowByName(originalName)
            .should('exist')
            .and('contain', updatedProduct.qty)
            .and('contain', updatedProduct.price);
    });

    it('4. Xóa sản phẩm thành công (DELETE)', () => {
        productPage.getDeleteButton(updatedProduct.name).click();
        productPage.getProductRowByName(updatedProduct.name)
            .should('not.exist');
    });
});
