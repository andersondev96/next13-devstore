import { z } from 'zod'
import data from '../data.json'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const { slug: productSlug } = await params
  const slug = z.string().parse(productSlug)
  const product = data.products.find((product) => product.slug === slug)

  if (!product) {
    return Response.json({ message: 'Product not found.' }, { status: 404 })
  }

  return Response.json(product)
}
