import { AddToCartButton } from '@/components/add-to-cart-button'
import { Card } from '@/components/ui/card'
import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { Metadata } from 'next'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface ProductProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60,
    },
  })

  const product = await response.json()

  return product
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return {
    title: product.title,
  }
}

export default async function ProductPage({ params }: ProductProps) {
  const product = await getProduct(params.slug)

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="overflow-hidden border-white/10 p-3 sm:p-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            quality={100}
            className="object-cover"
          />
        </div>
      </Card>

      <Card className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Produto selecionado
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-4 leading-7 text-slate-300">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-500/90 px-5 py-2.5 text-lg font-semibold text-slate-950">
              {product.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="text-sm text-slate-400">
              Em até 12x s/juros de{' '}
              {(product.price / 12).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Tamanhos
            </span>

            <div className="flex flex-wrap gap-2">
              {['P', 'M', 'G', 'GG'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className="flex h-11 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-sm font-semibold text-slate-100 transition hover:border-brand-400/60 hover:text-brand-300"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AddToCartButton productId={product.id} />
      </Card>
    </div>
  )
}
