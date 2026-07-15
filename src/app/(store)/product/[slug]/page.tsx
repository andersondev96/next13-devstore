import { Card } from '@/shared/ui/components/card'
import { api } from '@/data/api'
import { Product } from '@/data/types/products'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ProductDetailsClient } from './product-details.client'

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

  return {
    title: product.title,
  }
}

export default async function ProductPage({ params }: ProductProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  return (
    <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="overflow-hidden rounded-[28px] border-white/10 lg:col-span-2">
        <div className="relative h-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            quality={100}
            className="object-contain"
          />
        </div>
      </Card>

      <ProductDetailsClient product={product} />
    </main>
  )
}
