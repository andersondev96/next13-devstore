"use server";

import { z } from "zod";

import data from "../data.json";

const changeQuantityInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(0),
});

export interface ChangeCartItemQuantityResult {
  success: boolean;
  message: string;
  product?: {
    id: number;
    title: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

/**
 * Fonte única de verdade para validar quantidade de um item do carrinho
 * contra o estoque ATUAL do produto no servidor.
 *
 * Usada tanto para adicionar (quantity = quantidade atual + 1) quanto
 * para alterar/remover (quantity = quantidade desejada, 0 = remover)
 * um item já presente no carrinho.
 */
export async function changeCartItemQuantityAction(
  productId: number,
  quantity: number,
): Promise<ChangeCartItemQuantityResult> {
  const parsed = changeQuantityInputSchema.safeParse({ productId, quantity });

  if (!parsed.success) {
    return {
      success: false,
      message: "Quantidade inválida.",
      quantity: 0,
    };
  }

  // Simula latência de rede/banco.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const product = data.products.find((p) => p.id === parsed.data.productId);

  if (!product) {
    return {
      success: false,
      message: "Produto não encontrado.",
      quantity: 0,
    };
  }

  if (parsed.data.quantity > product.stock) {
    return {
      success: false,
      message: `Quantidade indisponível. Restam apenas ${product.stock} unidade(s) em estoque.`,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        stock: product.stock,
      },
      quantity: product.stock,
    };
  }

  return {
    success: true,
    message:
      parsed.data.quantity === 0
        ? "Produto removido do carrinho."
        : "Carrinho atualizado.",
    product: {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
    },
    quantity: parsed.data.quantity,
  };
}

/**
 * Mantida por compatibilidade com o botão "Adicionar ao carrinho": soma
 * 1 à quantidade já presente no carrinho e revalida contra o estoque.
 */
export async function addToCartAction(
  productId: number,
  currentQuantityInCart: number,
): Promise<ChangeCartItemQuantityResult> {
  return changeCartItemQuantityAction(productId, currentQuantityInCart + 1);
}

/**
 * Remove um item do carrinho (equivale a definir a quantidade como 0),
 * também passando pela validação do servidor.
 */
export async function removeFromCartAction(
  productId: number,
): Promise<ChangeCartItemQuantityResult> {
  return changeCartItemQuantityAction(productId, 0);
}
