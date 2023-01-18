describe("Auth", () => {
  it("User logged in and logout", () => {
    cy.clearAllCookies();
    cy.visit("https://redifood.com");
    cy.findByRole("textbox", { name: /username/i })
      .type("test")
      .should("have.value", "test");
    cy.findByLabelText(/password/i)
      .type("123Fu_9mo*")
      .should("have.value", "123Fu_9mo*");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait(1000)
      .findByRole("heading", { name: /Successfully logged in/i })
      .should("exist");
    cy.wait(2000)
      .findByRole("textbox", { name: /username/i })
      .should("not.exist");
    cy.findByRole("menuitem", { name: /settings/i }).should("exist");
    cy.findByRole("menuitem", { name: /analytics/i }).should("exist");
    cy.findByRole("menuitem", { name: /food/i }).should("exist");
    cy.findByRole("menuitem", { name: /sign out/i }).click();
    cy.wait(1000).findByRole("menuitem", { name: /food/i }).should("exist");
    cy.findByRole("menuitem", { name: /settings/i }).should("not.exist");
    cy.findByRole("textbox", { name: /username/i }).should("exist");
  });
});
