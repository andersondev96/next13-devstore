// Produtos de referência usados nos testes E2E, escolhidos por terem um
// estoque conhecido em data.json. Se os dados mockados mudarem, ajuste
// apenas aqui.

export const PRODUCT_WITH_STOCK = {
  slug: "camiseta-build-the-future",
  title: "Camiseta Build the Future",
  stock: 20,
};

export const PRODUCT_LOW_STOCK = {
  slug: "tenis-coderunner",
  title: "Tênis CodeRunner",
  stock: 1,
};

export const PRODUCT_OUT_OF_STOCK = {
  slug: "camiseta-night-mode",
  title: "Camiseta Night Mode",
  stock: 0,
};

export const PRODUCT_SEARCHABLE = {
  slug: "while-alive",
  title: "Moletom While Alive",
  query: "moletom",
};
