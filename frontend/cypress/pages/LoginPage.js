// cypress/pages/LoginPage.js
class LoginPage {
    // 1. Selectors
    getUsernameInput() {
        return cy.get('[data-testid="username-input"]');
    }

    getPasswordInput() {
        return cy.get('[data-testid="password-input"]');
    }

    getLoginButton() {
        return cy.get('[data-testid="login-button"]');
    }
    
    getLoginMessage() {
        return cy.get('[data-testid="login-message"]');
    }

    getUsernameError() {
        return cy.get('[data-testid="username-error"]');
    }

    getPasswordError() {
        return cy.get('[data-testid="password-error"]');
    }

    // 2. Actions
    visit() {
        cy.visit('/login'); // Hoặc '/' nếu Login là trang mặc định
    }

    fillLogin(username, password) {
        if (username !== null) {
            this.getUsernameInput().clear().type(username);
        }
        if (password !== null) {
            this.getPasswordInput().clear().type(password);
        }
        this.getLoginButton().click();
    }
}

export default new LoginPage();
