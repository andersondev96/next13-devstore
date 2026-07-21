'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Tag, Trash2, X } from 'lucide-react'
import { FormEvent, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useCart } from '@/context/cart-context'
import {
    changeCartItemQuantityAction,
    removeFromCartAction,
} from '@/app/api/products/[slug]/actions'
import { applyCouponAction } from '@/app/api/cart/actions'

function formatBRL(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Identifica uma linha do carrinho por produto + variação (tamanho).
function lineKey(productId: number, size?: string) {
    return `${productId}::${size ?? ''}`
}

interface ItemToRemove {
    productId: number
    title: string
    size?: string
}

export function CartPageContent() {
    const {
        items,
        totalPrice,
        coupon,
        discount,
        totalWithDiscount,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        isLoading,
    } = useCart()

    const [pendingKey, setPendingKey] = useState<string | null>(null)
    const [itemToRemove, setItemToRemove] = useState<ItemToRemove | null>(null)
    const [isPending, startTransition] = useTransition()

    const [couponInput, setCouponInput] = useState('')
    const [couponError, setCouponError] = useState<string | null>(null)
    const [isCouponPending, startCouponTransition] = useTransition()

    // Alteração de quantidade sempre revalida o estoque atual no servidor.
    // Como o estoque é do produto (não do tamanho), somamos a quantidade
    // das OUTRAS variações do mesmo produto para validar o total contra o
    // estoque, e só então convertemos de volta para a quantidade desta linha.
    function handleChangeQuantity(productId: number, size: string | undefined, nextQuantity: number) {
        const key = lineKey(productId, size)
        setPendingKey(key)

        const otherLinesQuantity = items
            .filter((item) => item.productId === productId && lineKey(item.productId, item.size) !== key)
            .reduce((sum, item) => sum + item.quantity, 0)

        startTransition(async () => {
            const proposedTotal = otherLinesQuantity + nextQuantity
            const result = await changeCartItemQuantityAction(productId, proposedTotal)

            if (!result.success) {
                toast.error(result.message)
                setPendingKey(null)
                return
            }

            const safeLineQuantity = Math.max(result.quantity - otherLinesQuantity, 0)
            updateQuantity(productId, safeLineQuantity, size)
            setPendingKey(null)
        })
    }

    function handleRequestRemove(productId: number, title: string, size?: string) {
        setItemToRemove({ productId, title, size })
    }

    function handleCancelRemove() {
        setItemToRemove(null)
    }

    function handleConfirmRemove() {
        if (!itemToRemove) return

        const { productId, size } = itemToRemove
        setPendingKey(lineKey(productId, size))
        setItemToRemove(null)

        startTransition(async () => {
            await removeFromCartAction(productId)
            removeItem(productId, size)
            setPendingKey(null)
            toast.success('Item removido do carrinho.')
        })
    }

    function handleApplyCoupon(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const code = couponInput.trim()
        if (!code) return

        setCouponError(null)

        startCouponTransition(async () => {
            const result = await applyCouponAction(
                code,
                items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
            )

            if (!result.success || !result.coupon) {
                setCouponError(result.message)
                return
            }

            applyCoupon(result.coupon)
            setCouponInput('')
            toast.success(result.message)
        })
    }

    function handleRemoveCoupon() {
        removeCoupon()
        setCouponError(null)
        toast.success('Cupom removido.')
    }

    useEffect(() => {
        if (!itemToRemove) return

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') setItemToRemove(null)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [itemToRemove])

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-slate-400">Carregando carrinho...</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 p-4 text-center">
                <h1 className="text-2xl font-bold text-white">
                    Seu carrinho está vazio
                </h1>
                <p className="text-slate-400">
                    Que tal explorar nossos produtos e encontrar algo que você goste?
                </p>
                <Link
                    href="/"
                    className="mt-4 inline-block rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold uppercase text-slate-950 transition-colors hover:bg-cyan-400"
                >
                    Ver produtos
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h1 className="text-2xl font-bold text-white">Carrinho de compras</h1>

                    <div className="mt-6 flex flex-col gap-6 border-t border-white/10 pt-6">
                        {items.map((item) => {
                            const key = lineKey(item.productId, item.size)
                            const isItemPending = isPending && pendingKey === key
                            const subtotal = item.price * item.quantity
                            const reachedStockLimit = item.quantity >= item.stock

                            return (
                                <div key={key} className="flex items-start gap-4">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-800">
                                        <Image
                                            src={item.image}
                                            width={80}
                                            height={80}
                                            quality={100}
                                            alt={item.title}
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col">
                                        <p className="font-medium text-white">{item.title}</p>
                                        {item.size && (
                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                Tamanho: {item.size}
                                            </p>
                                        )}
                                        <p className="text-sm text-slate-400">
                                            Preço: {formatBRL(item.price)}
                                        </p>

                                        <div className="mt-3 flex items-center gap-3">
                                            <button
                                                type="button"
                                                disabled={isItemPending || item.quantity <= 1}
                                                onClick={() =>
                                                    handleChangeQuantity(item.productId, item.size, item.quantity - 1)
                                                }
                                                className="rounded-full bg-slate-800 p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-medium text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={isItemPending || reachedStockLimit}
                                                onClick={() =>
                                                    handleChangeQuantity(item.productId, item.size, item.quantity + 1)
                                                }
                                                className="rounded-full bg-slate-800 p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {reachedStockLimit && (
                                            <p className="mt-1 text-xs text-amber-400">
                                                Limite de estoque atingido.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex h-full flex-col items-end justify-between">
                                        <span className="font-medium text-white">
                                            {formatBRL(subtotal)}
                                        </span>
                                        <button
                                            type="button"
                                            title="Remover item"
                                            disabled={isItemPending}
                                            onClick={() => handleRequestRemove(item.productId, item.title, item.size)}
                                            className="text-sm font-medium text-red-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <aside className="lg:col-span-1">
                    <div className="sticky top-24 rounded-lg border border-white/10 bg-slate-800/50 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-white">Resumo da compra</h2>

                        <div className="mt-6">
                            <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                                <Tag className="h-4 w-4" />
                                Cupom de desconto
                            </span>

                            {coupon ? (
                                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-300">
                                            {coupon.code}
                                        </p>
                                        <p className="text-xs text-emerald-400/80">
                                            {coupon.type === 'percentage'
                                                ? `${coupon.value}% de desconto`
                                                : `${formatBRL(coupon.value)} de desconto`}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        title="Remover cupom"
                                        className="rounded-full p-1.5 text-emerald-300 transition-colors hover:bg-emerald-500/20 hover:text-emerald-200"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponInput}
                                        onChange={(event) => {
                                            setCouponInput(event.target.value)
                                            if (couponError) setCouponError(null)
                                        }}
                                        placeholder="Ex: BEMVINDO10"
                                        disabled={isCouponPending}
                                        className="w-full min-w-0 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm uppercase text-white placeholder:normal-case placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isCouponPending || !couponInput.trim()}
                                        className="shrink-0 rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isCouponPending ? 'Aplicando...' : 'Aplicar'}
                                    </button>
                                </form>
                            )}

                            {couponError && (
                                <p className="mt-2 text-xs text-red-400">{couponError}</p>
                            )}
                        </div>

                        <div className="mt-6 space-y-3 text-slate-300">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Subtotal</span>
                                <span>{formatBRL(totalPrice)}</span>
                            </div>

                            {coupon && (
                                <div className="flex items-center justify-between text-emerald-400">
                                    <span className="text-sm">Desconto ({coupon.code})</span>
                                    <span>-{formatBRL(discount)}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-sm">Entrega</span>
                                <span className="uppercase">Grátis</span>
                            </div>

                            <div className="h-px w-full bg-white/10"></div>

                            <div className="flex items-center justify-between text-base font-semibold text-white">
                                <span>Total</span>
                                <span>{formatBRL(totalWithDiscount)}</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full rounded-full bg-cyan-500 py-3 text-sm font-semibold uppercase text-slate-950 transition-colors hover:bg-cyan-400">
                            Finalizar compra
                        </button>
                    </div>
                </aside>
            </div>

            {itemToRemove && (
                <div
                    role="presentation"
                    onClick={handleCancelRemove}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="remove-item-title"
                        aria-describedby="remove-item-description"
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl"
                    >
                        <h2 id="remove-item-title" className="text-lg font-semibold text-white">
                            Remover item do carrinho
                        </h2>
                        <p id="remove-item-description" className="mt-2 text-sm text-slate-400">
                            Tem certeza que deseja remover{' '}
                            <span className="font-medium text-slate-200">
                                &quot;{itemToRemove.title}&quot;
                            </span>
                            {itemToRemove.size && (
                                <>
                                    {' '}
                                    <span className="text-slate-400">(Tamanho: {itemToRemove.size})</span>
                                </>
                            )}{' '}
                            do seu carrinho?
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelRemove}
                                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRemove}
                                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-400"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}