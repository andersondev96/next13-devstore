import { Card } from '@/shared/ui/components/card'
import { SectionTitle } from '@/shared/ui/components/section-title'
import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface SearchProps {
  searchParams: {
    q: string
  }
}

async function searchProducts(query: string): Promise<Product[]> {
  const response = await api(`/products/search?q=${query}`, {
    next: {
      revalidate: 60 * 60,
    },
  })

  const products = await response.json()

  return products
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  const products = await searchProducts(query)

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Busca"
        title={`Resultados para “${query}”`}
        description="Os produtos abaixo foram selecionados com base na sua busca."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          return (
            <Card key={product.id} className="overflow-hidden p-3">
              <Link
                href={`/product/${product.slug}`}
                className="group relative flex min-h-[320px] items-end overflow-hidden rounded-[24px]"
              >
                <Image
                  src={product.image}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  fill
                  quality={100}
                  alt={product.title}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

                <div className="relative z-10 flex w-full items-center justify-between gap-3 p-4">
                  <p className="max-w-[170px] text-sm font-medium text-white">
                    {product.title}
                  </p>
                  <span className="rounded-full bg-brand-500/90 px-3 py-2 text-xs font-semibold text-slate-950">
                    {product.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
