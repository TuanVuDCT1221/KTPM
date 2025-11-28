import LoginPage from '../pages/LoginPage'; 

describe('Login E2E Tests (Sử dụng POM)', () => {

    beforeEach(() => {
        LoginPage.visit();
    });

    it('1. Hiển thị form login và kiểm tra tương tác cơ bản', () => {
        LoginPage.getUsernameInput().should('be.visible');
        LoginPage.getPasswordInput().should('be.visible');
        LoginPage.getLoginButton().should('be.visible');

        LoginPage.getUsernameInput().type('interaction-test')
            .should('have.value', 'interaction-test');
    });

    it('2. Login thành công với credentials hợp lệ và điều hướng đến trang products', () => {
        const validUsername = 'validUser';
        const validPassword = 'ValidPass123';
        
        LoginPage.fillLogin(validUsername, validPassword);

        LoginPage.getLoginMessage()
            .should('be.visible')
            .and('contain', 'thành công');

        cy.url().should('include', '/products');
    });

    it('3. Hiển thị lỗi với credentials không hợp lệ', () => {
        const invalidUsername = 'wrongUser';
        const invalidPassword = 'WrongPass';

        LoginPage.fillLogin(invalidUsername, invalidPassword);

        LoginPage.getLoginMessage()
            .should('be.visible')
            .and('contain', 'Mật khẩu không chính xác');

        cy.url().should('include', '/login');
        cy.url().should('not.include', '/products');
    });

    it('4. Hiển thị lỗi validation khi username bị bỏ trống', () => {

        LoginPage.getPasswordInput().type('anypass');
        LoginPage.getLoginButton().click();

        LoginPage.getUsernameError()
            .should('be.visible')
            .and('contain', 'Username không được để trống');
    });

    it('5. Hiển thị lỗi validation khi password bị bỏ trống', () => {
        LoginPage.getUsernameInput().type('anyuser');
        LoginPage.getLoginButton().click();

        LoginPage.getPasswordError()
            .should('be.visible')
            .and('contain', 'Password không được để trống');
    });
});
