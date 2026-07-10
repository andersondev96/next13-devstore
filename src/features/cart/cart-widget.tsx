'use client'

import { useCart } from '@/context/cart-context'
import { ShoppingBag } from 'lucide-react'

export function CartWidget() {
  const { items } = useCart()
  return (
    <div className="flex h-10 flex-nowrap items-center gap-2 whitespace-nowrap rounded-full bg-white/5 px-3">
      <ShoppingBag className="h-4 w-4 shrink-0 text-brand-300" />
      <span className="text-sm font-medium leading-none text-slate-100">
        Carrinho ({items.length})
      </span>
    </div>
  )
}