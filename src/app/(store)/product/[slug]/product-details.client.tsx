'use client'

import { AddToCartButton } from '@/components/add-to-cart-button'
import { Card } from '@/shared/ui/components/card'
import { Product } from '@/data/types/products'
import { useState } from 'react'

interface ProductDetailsClientProps {
    product: Product
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(
        product.sizes?.[0] ?? null,
    )

    function handleSelectSize(size: string) {
        setSelectedSize((prev) => (prev === size ? null : size))
    }

    const hasSizes = product.sizes && product.sizes.length > 0
    const canAddToCart = !hasSizes || (hasSizes && selectedSize !== null)

    return (
        <div className="lg:sticky lg:top-24">
            <Card className="flex h-full flex-col p-6 sm:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
                        Produto selecionado
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                        {product.title}
                    </h1>

                    <p className="mt-4 leading-7 text-slate-300">{product.description}</p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        {typeof product.price === 'number' && (
                            <>
                                <span className="rounded-full bg-brand-500/90 px-5 py-2.5 text-lg font-semibold text-slate-950">
                                    {product.price.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </span>
                                <span className="text-sm text-slate-400">
                                    Em até 12x s/juros de{' '}
                                    {(product.price / 12).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </span>
                            </>
                        )}
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                                {product.category === 'sapatos' ? 'Numeração' : 'Tamanhos'}
                            </span>

                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSelectSize(size)}
                                        className={`flex h-11 w-14 items-center justify-center rounded-full border text-sm font-semibold transition ${selectedSize === size
                                            ? 'border-transparent bg-brand-500 text-white'
                                            : 'border-white/10 bg-slate-950/70 text-slate-100 hover:border-brand-400/60 hover:text-brand-300'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    {product.stock > 0 ? (
                        canAddToCart ? (
                            <AddToCartButton
                                productId={product.id}
                                className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-brand-500 font-semibold text-white transition-all hover:bg-brand-400 hover:brightness-110"
                            />
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="mt-8 flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-800 font-semibold text-white opacity-50"
                            >
                                Selecione um tamanho
                            </button>
                        )
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="mt-8 flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-800 font-semibold text-white opacity-50"
                        >
                            Indisponível
                        </button>
                    )}
                </div>
            </Card>
        </div>
    )
}