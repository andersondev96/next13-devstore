import "server-only";

export type CouponType = "percentage" | "fixed";

export interface Coupon {
  code: string;
  type: CouponType;
  /** Percentual (0-100) quando type = "percentage", valor em R$ quando type = "fixed". */
  value: number;
  /** Data de expiração (inclusive), formato ISO. Ausente = sem expiração. */
  expiresAt?: string;
  /** Subtotal mínimo do carrinho para o cupom ser aceito. */
  minPurchase?: number;
}

/**
 * ATENÇÃO: mock em memória para viabilizar a US 3.4 sem exigir um banco de
 * dados no projeto. Para produção, substituir por uma tabela real (com
 * controle de uso, limite por cliente/pedido, cupons de uso único, etc).
 */
const COUPONS: Coupon[] = [
  { code: "BEMVINDO10", type: "percentage", value: 10 },
  { code: "LUMEN20", type: "percentage", value: 20, minPurchase: 200 },
  { code: "FRETE30", type: "fixed", value: 30, minPurchase: 100 },
  {
    code: "PROMOANTIGA",
    type: "percentage",
    value: 15,
    expiresAt: "2025-01-01",
  },
];

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
}

export interface ValidateCouponResult {
  success: boolean;
  message: string;
  coupon?: AppliedCoupon;
  discount?: number;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Valida um código de cupom contra o subtotal ATUAL do carrinho (calculado
 * no servidor a partir dos preços reais, nunca confiando no total enviado
 * pelo client) e retorna o desconto correspondente.
 */
export function validateCoupon(
  rawCode: string,
  subtotal: number,
): ValidateCouponResult {
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return { success: false, message: "Informe um código de cupom." };
  }

  const coupon = COUPONS.find((c) => c.code === code);

  if (!coupon) {
    return { success: false, message: "Cupom inválido." };
  }

  if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
    return { success: false, message: "Este cupom expirou." };
  }

  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return {
      success: false,
      message: `Este cupom exige um subtotal mínimo de ${formatBRL(coupon.minPurchase)}.`,
    };
  }

  const discount =
    coupon.type === "percentage"
      ? Number(((subtotal * coupon.value) / 100).toFixed(2))
      : Math.min(coupon.value, subtotal);

  return {
    success: true,
    message: "Cupom aplicado com sucesso!",
    coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
    discount,
  };
}
