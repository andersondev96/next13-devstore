import "server-only";

export interface ServerCartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
}

/**
 * ATENÇÃO: isto é um mock em memória para viabilizar a US 3.3 sem exigir
 * um banco de dados no projeto. Ele funciona apenas dentro de uma mesma
 * instância do servidor (some ao reiniciar / não escala para múltiplas
 * instâncias). Para produção, substitua `cartsByUser` por uma tabela real
 * (ex: Prisma + Postgres) com uma chave única por `userId`.
 */
const cartsByUser = new Map<string, ServerCartItem[]>();

export function getServerCart(userId: string): ServerCartItem[] {
  return cartsByUser.get(userId) ?? [];
}

export function saveServerCart(userId: string, items: ServerCartItem[]): void {
  cartsByUser.set(userId, items);
}
