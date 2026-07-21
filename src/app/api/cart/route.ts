import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getServerCart, saveServerCart } from "@/lib/cart-store";

const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  title: z.string(),
  price: z.number(),
  image: z.string(),
  stock: z.number().int().min(0),
  quantity: z.number().int().min(1),
  size: z.string().optional(),
});

const cartCouponSchema = z
  .object({
    code: z.string(),
    type: z.enum(["percentage", "fixed"]),
    value: z.number(),
  })
  .nullable();

const cartPayloadSchema = z.object({
  items: z.array(cartItemSchema),
  coupon: cartCouponSchema.optional().default(null),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Não autenticado." }, { status: 401 });
  }

  const cart = getServerCart(session.user.id);
  return Response.json(cart);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ message: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = cartPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ message: "Payload inválido." }, { status: 400 });
  }

  // Trava de segurança extra no servidor: nunca salva quantidade acima
  // do estoque informado, mesmo que o client tenha enviado algo inválido.
  const safeItems = parsed.data.items.map((item) => ({
    ...item,
    quantity: Math.min(item.quantity, item.stock),
  }));

  const cart = { items: safeItems, coupon: parsed.data.coupon };
  saveServerCart(session.user.id, cart);

  return Response.json(cart);
}
