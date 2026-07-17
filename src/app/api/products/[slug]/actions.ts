"use server";

import { z } from "zod";

import data from "../data.json";

const addToCartInputSchema = z.object({
  productId: z.number().int().positive(),
  currentQuantityInCart: z.number().int().min(0),
});

export interface AddToCartResult {
  success: boolean;
  message: string;
  product?: {
    id: number;
    title: string;
    stock: number;
  };
}

/**
 * Server Action responsável por validar a adição de um produto ao carrinho.
 *
 * Regras aplicadas aqui (fonte da verdade fica no servidor):
 * - o produto precisa existir
 * - o produto precisa ter estoque
 * - a quantidade final (quantidade já no carrinho + 1) não pode ultrapassar o estoque
 *
 * O client é responsável apenas por refletir o resultado no estado local
 * (Context) e exibir o feedback visual (toast).
 */
export async function addToCartAction(
  productId: number,
  currentQuantityInCart: number,
): Promise<AddToCartResult> {
  const parsed = addToCartInputSchema.safeParse({
    productId,
    currentQuantityInCart,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Não foi possível adicionar o produto ao carrinho.",
    };
  }

  // Simula latência de rede/banco, mantendo o mesmo padrão do route.ts existente.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const product = data.products.find((p) => p.id === parsed.data.productId);

  if (!product) {
    return {
      success: false,
      message: "Produto não encontrado.",
    };
  }

  if (product.stock <= 0) {
    return {
      success: false,
      message: "Este produto está indisponível no momento.",
    };
  }

  const nextQuantity = parsed.data.currentQuantityInCart + 1;

  if (nextQuantity > product.stock) {
    return {
      success: false,
      message: `Quantidade indisponível. Restam apenas ${product.stock} unidade(s) em estoque.`,
    };
  }

  return {
    success: true,
    message: `${product.title} adicionado ao carrinho.`,
    product: {
      id: product.id,
      title: product.title,
      stock: product.stock,
    },
  };
}
