import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProductFilters } from '../(home)/product-filters'
import { ProductList } from '../(home)/product-list'
import { ProductSort } from '../(home)/product-sort'

interface ResolvedSearchParams {
  q?: string
  categoria?: string
  preco_max?: string
  preco_min?: string
  rating_min?: string
  sort?: string
  page?: string
}

interface SearchProps {
  searchParams: Promise<ResolvedSearchParams>
}

interface ProductsResponse {
  products: Product[]
  page: number
  totalPages: number
  total: number
}

export async function generateMetadata({
  searchParams,
}: SearchProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q

  return {
    title: query ? `Resultados para "${query}"` : 'Busca',
  }
}

// Monta a query da API a partir dos filtros/ordenação da URL + a página desejada
function buildProductsQuery(searchParams: ResolvedSearchParams, page: number) {
  const params = new URLSearchParams()

  if (searchParams.q) params.set('q', searchParams.q)
  if (searchParams.categoria) params.set('categoria', searchParams.categoria)
  if (searchParams.preco_max) params.set('preco_max', searchParams.preco_max)
  if (searchParams.preco_min) params.set('preco_min', searchParams.preco_min)
  if (searchParams.rating_min) params.set('rating_min', searchParams.rating_min)
  if (searchParams.sort) params.set('sort', searchParams.sort)
  params.set('page', String(page))

  return params
}

async function fetchProductsPage(
  searchParams: ResolvedSearchParams,
  page: number,
) {
  const query = buildProductsQuery(searchParams, page)
  const response = await api(`/products?${query.toString()}`, {
    next: { revalidate: 60 * 60 }, // 1 hour
  })

  return response.json() as Promise<ProductsResponse>
}

export default async function SearchPage({ searchParams }: SearchProps) {
  const resolvedSearchParams = await searchParams
  const { q: query } = resolvedSearchParams

  if (!query) {
    redirect('/')
  }

  const requestedPage = Number(resolvedSearchParams.page) || 1

  const firstPage = await fetchProductsPage(resolvedSearchParams, 1)

  // Evita disparar N requisições à toa se alguém editar a URL para uma página inexistente
  const currentPage = Math.min(Math.max(requestedPage, 1), firstPage.totalPages)

  // Busca em paralelo as páginas intermediárias
  const remainingPages = Array.from(
    { length: currentPage - 1 },
    (_, index) => index + 2, // [2, 3, ..., currentPage]
  )
  const remainingResponses = await Promise.all(
    remainingPages.map((page) => fetchProductsPage(resolvedSearchParams, page)),
  )

  const products = [
    ...firstPage.products,
    ...remainingResponses.flatMap((response) => response.products),
  ]

  const filterLabels: Record<string, string> = {
    categoria: 'Categoria',
    preco_min: 'Preço mín.',
    preco_max: 'Preço máx.',
    rating_min: 'Nota mín.',
  }

  const appliedFilters = Object.entries(resolvedSearchParams)
    .filter(([key, value]) => value && key in filterLabels)
    .map(([key, value]) => ({
      key,
      label: filterLabels[key],
      value: value as string,
    }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-400">
          Resultados para: <span className="font-semibold">{query}</span>
        </p>
        <ProductFilters basePath="/search" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-sm font-semibold text-violet-300 ring-1 ring-inset ring-violet-500/30">
            {firstPage.total} produto{firstPage.total === 1 ? '' : 's'}
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

        <ProductSort basePath="/search" />
      </div>

      {firstPage.total > 0 ? (
        <ProductList
          key={buildProductsQuery(resolvedSearchParams, 1).toString()}
          initialProducts={products}
          initialPage={currentPage}
          totalPages={firstPage.totalPages}
          basePath="/search"
        />
      ) : (
        <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
          <p className="text-slate-400">
            Nenhum resultado encontrado para sua busca.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-300 ring-1 ring-inset ring-violet-500/30 transition-colors hover:bg-violet-500/20"
          >
            Ver todos os produtos
          </Link>
        </div>
      )}
    </div>
  )
}
