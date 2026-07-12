import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ProductFilters } from './product-filters'

interface HomeProps {
  searchParams: Promise<{
    categoria?: string
    preco_max?: string
    preco_min?: string
    rating_min?: string
    marca?: string
    disponibilidade?: string
  }>
}

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams

  const params = new URLSearchParams()
  if (resolvedSearchParams.categoria) params.set('categoria', resolvedSearchParams.categoria)
  if (resolvedSearchParams.preco_max) params.set('preco_max', resolvedSearchParams.preco_max)
  if (resolvedSearchParams.preco_min) params.set('preco_min', resolvedSearchParams.preco_min)
  if (resolvedSearchParams.rating_min) params.set('rating_min', resolvedSearchParams.rating_min)
  if (resolvedSearchParams.marca) params.set('marca', resolvedSearchParams.marca)
  if (resolvedSearchParams.disponibilidade)
    params.set('disponibilidade', resolvedSearchParams.disponibilidade)

  const response = await api(`/products?${params.toString()}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })

  const products: Product[] = await response.json()

  const filterLabels: Record<string, string> = {
    categoria: 'Categoria',
    marca: 'Marca',
    disponibilidade: 'Disponibilidade',
    preco_min: 'Preço mín.',
    preco_max: 'Preço máx.',
    rating_min: 'Nota mín.',
  }

  const appliedFilters = Object.entries(resolvedSearchParams)
    .filter(([, value]) => value)
    .map(([key, value]) => ({
      key,
      label: filterLabels[key] ?? key,
      value: value as string,
    }))

  return (
    <div className="flex flex-col gap-8">
      <ProductFilters />

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-sm font-semibold text-violet-300 ring-1 ring-inset ring-violet-500/30">
          {products.length} produto{products.length === 1 ? '' : 's'}
        </span>

        {appliedFilters.map((filter) => (
          <span
            key={filter.key}
            className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-white/10"
          >
            <span className="text-zinc-500">{filter.label}:</span>
            <span className="text-white">{filter.value}</span>
          </span>
        ))}
      </div>

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
