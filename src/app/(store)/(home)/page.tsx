import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ProductFilters } from './product-filters'

interface HomeProps {
  searchParams: {
    categoria?: string
    preco_max?: string
    preco_min?: string
    rating_min?: string
  }
}

async function getProducts({
  categoria,
  preco_max,
  preco_min,
  rating_min,
}: HomeProps['searchParams']): Promise<Product[]> {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  if (preco_max) params.set('preco_max', preco_max)
  if (preco_min) params.set('preco_min', preco_min)
  if (rating_min) params.set('rating_min', rating_min)

  const response = await api(`/products?${params.toString()}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })

  const products = await response.json()

  return products
}

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams)

  return (
    <div className="flex flex-col gap-8">
      <ProductFilters />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 text-white shadow-card"
              >
                {product.stock <= 0 && (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-red-500/80 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                    ESGOTADO
                  </div>
                )}
                <Image
                  src={product.image}
                  className="h-full w-full transform-gpu object-cover transition-transform duration-300 group-hover:scale-105"
                  width={480}
                  height={480}
                  quality={100}
                  alt={product.title}
                />

                <div className="absolute bottom-0 w-full space-y-2 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8 sm:p-5 sm:pt-10">
                  {product.rating && (
                    <div className="flex items-center justify-end gap-1 text-xs text-zinc-300">
                      <span>⭐</span>
                      <span>{product.rating.rate}</span>
                      <span className="text-zinc-500">({product.rating.count})</span>
                    </div>
                  )}
                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 p-1 pl-4 backdrop-blur-xl">
                      <span className="truncate text-sm">{product.title}</span>
                      <span className="flex items-center justify-center rounded-full bg-violet-500 px-4 py-2 font-semibold">
                        {product.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex h-96 items-center justify-center">
          <p className="text-center text-zinc-400">
            Nenhum produto encontrado para os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  )
}
