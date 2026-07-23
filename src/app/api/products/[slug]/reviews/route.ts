import { auth } from '@/auth'
import data from '../../data.json'
import { z } from 'zod'

interface Review {
  id: number
  productId: number
  userId: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

const reviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(500),
})

const reviewsByProductId = new Map<number, Review[]>(
  data.reviews.reduce((map, review) => {
    const current = map.get(review.productId) ?? []

    map.set(review.productId, [...current, review as Review])

    return map
  }, new Map<number, Review[]>()),
)

function getProductBySlug(slug: string) {
  return data.products.find((product) => product.slug === slug)
}

function getNextReviewId() {
  return (
    Array.from(reviewsByProductId.values()).reduce(
      (maxId, reviews) =>
        Math.max(maxId, ...reviews.map((review) => review.id)),
      0,
    ) + 1
  )
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return Response.json({ message: 'Product not found.' }, { status: 404 })
  }

  const reviews = [...(reviewsByProductId.get(product.id) ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return Response.json(reviews)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth()
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return Response.json({ message: 'Product not found.' }, { status: 404 })
  }

  if (!session?.user?.id) {
    return Response.json({ message: 'Não autenticado.' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = reviewInputSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json({ message: 'Avaliação inválida.' }, { status: 400 })
  }

  const nextReview: Review = {
    id: getNextReviewId(),
    productId: product.id,
    userId: session.user.id,
    author: session.user.name ?? 'Cliente Lumen',
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    createdAt: new Date().toISOString(),
  }

  const currentReviews = reviewsByProductId.get(product.id) ?? []
  reviewsByProductId.set(product.id, [nextReview, ...currentReviews])

  return Response.json(nextReview, { status: 201 })
}
