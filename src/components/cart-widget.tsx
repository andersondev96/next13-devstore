'use client'

import { useCart } from '@/context/cart-context'
import { ShoppingBag } from 'lucide-react'

export function CartWidget() {
  const { items } = useCart()
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
      <ShoppingBag className="h-4 w-4 text-brand-300" />
      <span className="text-sm font-medium text-slate-100">Carrinho ({items.length})</span>
    </div>
  )
}
