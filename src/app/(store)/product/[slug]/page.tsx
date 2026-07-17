import { api } from '@/data/api'
import { Product } from '@/data/types/products'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductReviews } from './product-reviews.client'
import { ProductPageContent } from './product-page-content-client'

export const dynamic = 'force-dynamic'

interface ProductProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60,
    },
  })

  if (!response.ok) {
    notFound()
  }

  const product = await response.json()

  return product
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  // NOTA: Para produção, você deve usar uma URL absoluta para a imagem.
  // Isso pode ser alcançado usando uma variável de ambiente ou `metadataBase`.
  const imageUrl = product.image

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.title }],
      locale: 'pt_BR',
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: ProductProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  return (
    <ProductPageContent product={product}>
      <ProductReviews productSlug={product.slug} />
    </ProductPageContent>
  )
}