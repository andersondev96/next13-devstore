'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

interface AddToCartButtonProps {
  productId: number
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  function handleAddProductToCart() {
    addToCart(productId)
  }

  return (
    <Button type="button" onClick={handleAddProductToCart} className="mt-8 w-full">
      Adicionar ao carrinho
    </Button>
  )
}
