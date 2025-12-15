

describe("Security Testing", () => {
    const API = "http://localhost:8080";

    it("Auth bypass", () => {
        cy.request({
            method: "GET",
            url: `${API}/api/products`,
            failOnStatusCode: false,
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });


});