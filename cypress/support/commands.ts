/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    searchByQuery(query: string): Chainable<void>;
    /**
     * Navega até a página do primeiro produto listado e clica em
     * "Adicionar ao carrinho". Usado quando o teste não precisa de um
     * produto específico (ex: só validar o fluxo de busca).
     */
    addFirstProductToCart(): Chainable<void>;
    /** Visita a página de um produto específico pelo slug. */
    visitProduct(slug: string): Chainable<void>;
    /**
     * Visita a página de um produto específico e clica em
     * "Adicionar ao carrinho". Use quando o teste depende de um estoque
     * conhecido (ver cypress/fixtures/products.ts).
     */
    addProductToCart(slug: string): Chainable<void>;
  }
}

Cypress.Commands.add("searchByQuery", (query: string) => {
  cy.visit("/");

  cy.get("input[name=q]").type(query).parent("form").submit();
});

Cypress.Commands.add("addFirstProductToCart", () => {
  cy.get('a[href^="/product"]').first().click();

  cy.location("pathname").should("include", "/product");
  cy.contains("button", "Adicionar ao carrinho").click();
});

Cypress.Commands.add("visitProduct", (slug: string) => {
  cy.visit(`/product/${slug}`);
});

Cypress.Commands.add("addProductToCart", (slug: string) => {
  cy.visitProduct(slug);
  cy.contains("button", "Adicionar ao carrinho").click();
});
