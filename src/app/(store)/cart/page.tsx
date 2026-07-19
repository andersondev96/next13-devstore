'use client'

import { useState } from 'react'
import { useCart } from '@/context/cart-context'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmationDialog } from '@/components/confirmation-dialog'

export default function CartPage() {
    const [productToRemove, setProductToRemove] = useState<null | { productId: number; title: string }>(null)

    const { items, removeItem, changeItemQuantity, cartTotal } = useCart()

    const subTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(cartTotal)

    const total = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(cartTotal)

    function handleConfirmRemove() {
        if (productToRemove) {
            removeItem(productToRemove.productId)
            toast.success(`"${productToRemove.title}" removido do carrinho.`)
            setProductToRemove(null)
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 p-4 text-center">
                <h1 className="text-2xl font-bold text-white">Seu carrinho está vazio</h1>
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
            <ConfirmationDialog
                isOpen={!!productToRemove}
                onClose={() => setProductToRemove(null)}
                onConfirm={handleConfirmRemove}
                title="Confirmar Remoção"
                confirmButtonText="Remover"
            >
                <p>
                    Tem certeza que deseja remover "{productToRemove?.title}" do
                    carrinho?
                </p>
            </ConfirmationDialog>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h1 className="text-2xl font-bold text-white">Carrinho de compras</h1>

                    <div className="mt-6 flex flex-col gap-6 border-t border-white/10 pt-6">
                        {items.map((item) => {
                            const price = new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(item.price)

                            const itemTotal = new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(item.price * item.quantity)

                            return (
                                <div key={item.productId} className="flex items-start gap-4">
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
                                        <p className="text-sm text-slate-400">Preço: {price}</p>

                                        <div className="mt-3 flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    changeItemQuantity(item.productId, item.quantity - 1)
                                                }
                                                disabled={item.quantity <= 1}
                                                className="rounded-full bg-slate-800 p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-medium text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    changeItemQuantity(item.productId, item.quantity + 1)
                                                }
                                                disabled={item.quantity >= item.stock}
                                                className="rounded-full bg-slate-800 p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex h-full flex-col items-end justify-between">
                                        <span className="font-medium text-white">{itemTotal}</span>
                                        <button
                                            title="Remover item"
                                            onClick={() =>
                                                setProductToRemove({ productId: item.productId, title: item.title })
                                            }
                                            className="text-sm font-medium text-red-400 transition-colors hover:text-red-500"
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

                        <div className="mt-6 space-y-3 text-slate-300">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Subtotal</span>
                                <span>{subTotal}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Entrega</span>
                                <span className="uppercase">Grátis</span>
                            </div>

                            <div className="h-px w-full bg-white/10"></div>

                            <div className="flex items-center justify-between text-base font-semibold text-white">
                                <span>Total</span>
                                <span>{total}</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full rounded-full bg-cyan-500 py-3 text-sm font-semibold uppercase text-slate-950 transition-colors hover:bg-cyan-400">
                            Finalizar compra
                        </button>
                    </div>
                </aside>
            </div>
        </>
    )
}