
class ProductManagementPage {

    visit() {
        cy.visit('/products');
    }


    getAddNewButton() {
        return cy.contains('button', 'Thêm sản phẩm');
    }

    getProductRowByName(name) {
        return cy.contains('tbody tr td', name).parent('tr');
    }

    getViewButton(productName) {
        return this.getProductRowByName(productName).contains('button', 'Xem');
    }

    getEditButton(productName) {
        return this.getProductRowByName(productName).contains('button', 'Sửa');
    }

    getDeleteButton(productName) {
        return this.getProductRowByName(productName).contains('button', 'Xóa');
    }
    
    
    getNameInput() {
        return cy.get('input[name="name"]');
    }

    getQtyInput() {
        return cy.get('input[name="qty"]');
    }
    
    getPriceInput() {
        return cy.get('input[name="price"]');
    }

    getCategorySelect() {
        return cy.get('select[name="category"]');
    }

    getDescriptionTextarea() {
        return cy.get('textarea[name="description"]');
    }

    getSaveButton() {
        return cy.contains('button', 'Lưu');
    }

    getCancelButton() {
        return cy.contains('button', 'Hủy');
    }

    fillProductForm(product) {
        this.getNameInput().clear().type(product.name);
        this.getQtyInput().clear().type(product.qty);
        this.getPriceInput().clear().type(product.price);
        this.getCategorySelect().select(product.category);
        this.getDescriptionTextarea().clear().type(product.description);
    }

    
    getDetailTitle() {
        return cy.contains('h2', 'Chi tiết sản phẩm');
    }

    getDetailField(label) {
        return cy.contains('p', label);
    }

    getBackButton() {
        return cy.contains('button', 'Quay lại');
    }
}

export default new ProductManagementPage();