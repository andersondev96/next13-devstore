import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

async function getProducts(): Promise<Product[]> {
  const response = await api('/products', {
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

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="grid max-h-[860px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        return (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group relative flex flex-col justify-end overflow-hidden rounded-lg border-2 border-zinc-800 bg-zinc-900"
          >
            {product.stock <= 0 && (
              <div className="absolute right-4 top-4 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                ESGOTADO
              </div>
            )}
            <Image
              src={product.image}
              className="transform-gpu transition-transform duration-500 group-hover:scale-105"
              width={480}
              height={480}
              quality={100}
              alt={product.title}
            />

            <div className="absolute bottom-10 right-10 flex h-12 items-center gap-2 rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
              <span className="truncate text-sm">{product.title}</span>
              <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
                {product.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>

            {product.rating && (
              <div className="absolute bottom-20 right-10 flex items-center gap-1 text-xs text-zinc-300">
                <span>⭐</span>
                <span>{product.rating.rate}</span>
                <span className="text-zinc-500">({product.rating.count})</span>
              </div>
            )}
          </Link>
        )
      })}
    </div>
  )
}
