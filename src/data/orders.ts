export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  date: string
  status: 'Entregue' | 'Em transporte' | 'Processando'
  total: number
  items: OrderItem[]
}

const demoOrders: Order[] = [
  {
    id: 'LM-2048',
    date: '2026-06-18',
    status: 'Entregue',
    total: 749,
    items: [
      { name: 'Jaqueta Lumen Shell', quantity: 1, price: 499 },
      { name: 'Camiseta Essential', quantity: 2, price: 125 },
    ],
  },
  {
    id: 'LM-1987',
    date: '2026-05-02',
    status: 'Em transporte',
    total: 319,
    items: [{ name: 'Moletom Aurora', quantity: 1, price: 319 }],
  },
  {
    id: 'LM-1903',
    date: '2026-03-27',
    status: 'Processando',
    total: 458,
    items: [
      { name: 'Calca Cargo Flux', quantity: 1, price: 289 },
      { name: 'Bone Minimal', quantity: 1, price: 169 },
    ],
  },
]

export async function getOrdersByUserId(userId: string) {
  if (!userId) {
    return []
  }

  return demoOrders
}
