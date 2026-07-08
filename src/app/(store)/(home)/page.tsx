import { Card } from '@/shared/ui/components/card'
import { SectionTitle } from '@/shared/ui/components/section-title'
import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api('/products/featured', {
    next: {
      revalidate: 60 * 60,
    },
  })

  const products = await response.json()

  return products
}

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  const [highlightedProduct, ...otherProducts] = await getFeaturedProducts()

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-white/15 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow="Nova coleção"
            title="Estilo premium para o dia a dia"
            description="Uma experiência visual mais refinada, pensada para destacar o seu produto com clareza e impacto."
          />
          <Link
            href={`/product/${highlightedProduct.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-brand-400/40 bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-200 transition hover:bg-brand-500/20"
          >
            Ver destaque
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <Link
            href={`/product/${highlightedProduct.slug}`}
            className="group relative flex min-h-[420px] items-end overflow-hidden rounded-[28px] border border-white/10 bg-slate-950"
          >
            <Image
              src={highlightedProduct.image}
              className="object-cover transition duration-500 group-hover:scale-105"
              fill
              quality={100}
              alt={highlightedProduct.title}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            <div className="relative z-10 flex w-full items-center justify-between gap-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                  Destaque da semana
                </p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {highlightedProduct.title}
                </p>
              </div>
              <span className="rounded-full bg-brand-500/90 px-4 py-2 text-sm font-semibold text-slate-950">
                {highlightedProduct.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </Link>

          <div className="grid gap-4">
            {otherProducts.slice(0, 2).map((product) => {
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group relative flex min-h-[190px] items-end overflow-hidden rounded-[24px] border border-white/10 bg-slate-950"
                >
                  <Image
                    src={product.image}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    fill
                    quality={100}
                    alt={product.title}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                  <div className="relative z-10 flex w-full items-center justify-between gap-4 p-4">
                    <p className="max-w-[180px] text-sm font-medium text-white">
                      {product.title}
                    </p>
                    <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-brand-200">
                      {product.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Entrega rápida
          </p>
          <p className="mt-2 text-lg font-semibold text-white">Envios em até 24h</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Garantia
          </p>
          <p className="mt-2 text-lg font-semibold text-white">Trocas simples e sem burocracia</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Atendimento
          </p>
          <p className="mt-2 text-lg font-semibold text-white">Suporte humanizado e ágil</p>
        </Card>
      </div>
    </div>
  )
}
