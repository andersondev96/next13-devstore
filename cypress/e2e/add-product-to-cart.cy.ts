import {
  PRODUCT_LOW_STOCK,
  PRODUCT_OUT_OF_STOCK,
  PRODUCT_SEARCHABLE,
  PRODUCT_WITH_STOCK,
} from "../fixtures/products";

describe("add product to cart", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be able to navigate to the product page and add it to the cart", () => {
    cy.get('a[href^="/product"]').first().click();

    cy.location("pathname").should("include", "/product");
    cy.contains("button", "Adicionar ao carrinho").click();

    cy.get('[data-testid="cart-count"]').should("contain", "1");
  });

  it("should increase the cart quantity when adding the same product again", () => {
    cy.addProductToCart(PRODUCT_WITH_STOCK.slug);
    cy.get('[data-testid="cart-count"]').should("contain", "1");

    cy.contains("button", "Adicionar ao carrinho").click();
    cy.get('[data-testid="cart-count"]').should("contain", "2");
  });

  it("should disable the button and stop adding once the stock is exhausted", () => {
    // Estoque = 1: um clique já deve consumir toda a disponibilidade.
    cy.addProductToCart(PRODUCT_LOW_STOCK.slug);

    cy.get('[data-testid="cart-count"]').should("contain", "1");
    cy.contains("button", "Fora de estoque").should("be.disabled");
  });

  it("should render the button as disabled for a product with no stock", () => {
    // Estoque = 0: o botão já deve nascer desabilitado, sem precisar de clique.
    cy.visitProduct(PRODUCT_OUT_OF_STOCK.slug);

    cy.contains("button", "Fora de estoque").should("be.disabled");
    cy.get('[data-testid="cart-count"]').should("contain", "0");
  });

  it("should be able to search for a product and add it to the cart", () => {
    cy.searchByQuery(PRODUCT_SEARCHABLE.query);

    cy.get(`a[href="/product/${PRODUCT_SEARCHABLE.slug}"]`).click();
    cy.location("pathname").should("include", PRODUCT_SEARCHABLE.slug);

    cy.contains("button", "Adicionar ao carrinho").click();
    cy.get('[data-testid="cart-count"]').should("contain", "1");
  });
});
