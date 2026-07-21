import "server-only";

export interface ServerCartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  size?: string;
}

export interface ServerCartCoupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
}

export interface ServerCart {
  items: ServerCartItem[];
  coupon: ServerCartCoupon | null;
}

/**
 * ATENÇÃO: isto é um mock em memória para viabilizar a US 3.3/3.4 sem
 * exigir um banco de dados no projeto. Ele funciona apenas dentro de uma
 * mesma instância do servidor (some ao reiniciar / não escala para
 * múltiplas instâncias). Para produção, substitua `cartsByUser` por uma
 * tabela real (ex: Prisma + Postgres) com uma chave única por `userId`.
 */
const cartsByUser = new Map<string, ServerCart>();

export function getServerCart(userId: string): ServerCart {
  return cartsByUser.get(userId) ?? { items: [], coupon: null };
}

export function saveServerCart(userId: string, cart: ServerCart): void {
  cartsByUser.set(userId, cart);
}
