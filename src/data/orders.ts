export interface OrderItem {
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

export interface Order {
  id: string;
  date: string;
  status: "Entregue" | "Em transporte" | "Processando";
  total: number;
  items: OrderItem[];
}

const demoOrders: Order[] = [
  {
    id: "LM-2048",
    date: "2026-06-18",
    status: "Entregue",
    total: 749,
    items: [
      {
        price: 499,
        quantity: 1,
        product: {
          name: "Jaqueta Lumen Shell",
          image: "/moletom-java.png",
        },
      },
      {
        price: 125,
        quantity: 2,
        product: {
          name: "Camiseta Essential",
          image: "/camiseta-dowhile-2022.png",
        },
      },
    ],
  },
  {
    id: "LM-1987",
    date: "2026-05-02",
    status: "Em transporte",
    total: 319,
    items: [
      {
        price: 319,
        quantity: 1,
        product: {
          name: "Moletom Aurora",
          image: "/moletom-ai-side.png",
        },
      },
    ],
  },
  {
    id: "LM-1903",
    date: "2026-03-27",
    status: "Processando",
    total: 458,
    items: [
      {
        price: 289,
        quantity: 1,
        product: {
          name: "Calca Cargo Flux",
          image: "/moletom-never-stop-learning.png",
        },
      },
      {
        price: 169,
        quantity: 1,
        product: {
          name: "Bone Minimal",
          image: "/moletom-ia-p-devs.png",
        },
      },
    ],
  },
];

export async function getOrdersByUserId(userId: string) {
  if (!userId) {
    return [];
  }

  return demoOrders;
}
