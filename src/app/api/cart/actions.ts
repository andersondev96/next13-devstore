"use server";

import { z } from "zod";

import data from "../products/data.json";
import { validateCoupon, type ValidateCouponResult } from "@/lib/coupons";

const applyCouponInputSchema = z.object({
  code: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    }),
  ),
});

/**
 * Valida um cupom para o carrinho atual. O subtotal usado na validação
 * (ex: para checar `minPurchase`) é recalculado aqui a partir dos preços
 * reais dos produtos, e não a partir do total que o client informou —
 * evita que um subtotal adulterado no localStorage libere um cupom que
 * não deveria ser aceito.
 */
export async function applyCouponAction(
  code: string,
  items: { productId: number; quantity: number }[],
): Promise<ValidateCouponResult> {
  const parsed = applyCouponInputSchema.safeParse({ code, items });

  if (!parsed.success) {
    return { success: false, message: "Não foi possível validar o cupom." };
  }

  // Simula latência de rede/banco, mantendo o padrão do restante do projeto.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const subtotal = parsed.data.items.reduce((sum, item) => {
    const product = data.products.find((p) => p.id === item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  return validateCoupon(parsed.data.code, subtotal);
}
