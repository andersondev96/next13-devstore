'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Product } from '@/data/types/product'
import { useCart } from '@/context/cart-context'
import { ProductCard } from './product-card'

interface ProductsResponse {
    products: Product[]
    page: number
    totalPages: number
    total: number
}

interface ProductListProps {
    initialProducts: Product[]
    initialPage: number
    totalPages: number
    basePath?: string
}

export function ProductList({
    initialProducts,
    initialPage,
    totalPages,
    basePath = '/',
}: ProductListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { getQuantityInCart } = useCart()

    const [products, setProducts] = useState(initialProducts)
    const [page, setPage] = useState(initialPage)
    const [isLoading, setIsLoading] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const hasMore = page < totalPages

    // Reordena levando em conta o estoque já reservado no carrinho do
    // usuário (persistido no localStorage), e não só o estoque bruto que
    // veio do servidor. Assim, um produto que zerou porque o próprio
    // usuário colocou tudo no carrinho também desce para o fim da lista
    // assim que a Home é (re)carregada — o sort é estável, então a ordem
    // relativa dentro de cada grupo (disponível/indisponível) é preservada.
    const sortedProducts = useMemo(() => {
        function getAvailableStock(product: Product) {
            return product.stock - getQuantityInCart(product.id)
        }

        return [...products].sort(
            (a, b) =>
                (getAvailableStock(b) > 0 ? 1 : 0) -
                (getAvailableStock(a) > 0 ? 1 : 0),
        )
    }, [products, getQuantityInCart])

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)

        const nextPage = page + 1
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(nextPage))

        const response = await fetch(`/api/products?${params.toString()}`)
        const data: ProductsResponse = await response.json()

        // A ordenação final é toda responsabilidade do useMemo acima, então
        // aqui só concatenamos os produtos recém-carregados.
        setProducts((current) => [...current, ...data.products])
        setPage(nextPage)
        setIsLoading(false)

        // Mantém a URL compartilhável, sem recarregar a página nem rolar para o topo
        router.replace(`${basePath}?${params.toString()}`, { scroll: false })
    }, [hasMore, isLoading, page, router, searchParams, basePath])

    // Carrega automaticamente ao rolar até o fim da lista
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel || !hasMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore()
            },
            { rootMargin: '200px' },
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasMore, loadMore])

    if (sortedProducts.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <p className="text-center text-zinc-400">
                    Nenhum produto encontrado para os filtros selecionados.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div ref={sentinelRef} className="flex justify-center py-4">
                {hasMore ? (
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={isLoading}
                        className="rounded-md bg-slate-800 px-6 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 hover:bg-slate-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Carregando...' : 'Carregar mais'}
                    </button>
                ) : (
                    <p className="text-sm text-zinc-500">Você chegou ao fim</p>
                )}
            </div>
        </div>
    )
}