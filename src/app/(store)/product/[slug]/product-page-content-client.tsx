'use client'

import { Card } from '@/shared/ui/components/card'
import { Product } from '@/data/types/products'
import { useCart } from '@/context/cart-context'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { ReactNode } from 'react'
import { ProductDetailsClient } from './product-details.client'

interface ProductPageContentProps {
    product: Product
    children: ReactNode
}

export function ProductPageContent({ product, children }: ProductPageContentProps) {
    const { items } = useCart()
    const quantityInCart =
        items.find((item) => item.productId === product.id)?.quantity ?? 0
    const displayStock = Math.max(product.stock - quantityInCart, 0)
    const isOutOfStock = displayStock <= 0

    return (
        <main
            className={twMerge('flex flex-col gap-12', isOutOfStock && 'grayscale')}
        >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                <Card className="relative h-80 overflow-hidden rounded-[28px] border-white/10 sm:h-96 lg:col-span-3 lg:h-auto">
                    {isOutOfStock && (
                        <div className="absolute right-4 top-4 z-10 rounded-full bg-red-500/80 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                            INDISPONÍVEL
                        </div>
                    )}
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

                <div className="lg:col-span-2">
                    <ProductDetailsClient product={product} />
                </div>
            </div>

            {children}
        </main>
    )
}