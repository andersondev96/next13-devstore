import { describe, it, expect } from "vitest";

describe("Exemplo de teste simples", () => {
  it("deve somar dois números corretamente", () => {
    const resultado = 2 + 3;
    expect(resultado).toBe(5);
  });

  it("deve verificar se uma string contém uma substring", () => {
    const frase = "Vitest é ótimo para testes";
    expect(frase).toContain("ótimo");
  });
});
