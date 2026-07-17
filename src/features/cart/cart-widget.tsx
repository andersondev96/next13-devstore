'use client'

import { useCart } from '@/context/cart-context'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function CartWidget() {
  const { totalItems } = useCart()
  return (
    <Link
      href="/cart"
      className="flex h-10 flex-nowrap items-center gap-2 whitespace-nowrap rounded-full bg-white/5 px-3 text-sm font-medium leading-none text-slate-100 transition-colors hover:bg-white/10"
    >
      <ShoppingBag className="h-5 w-5 shrink-0 text-brand-300" />
      <span className="hidden sm:inline">Carrinho</span>
      <span className="font-mono text-xs text-slate-400">({totalItems})</span>
    </Link>
  )
}