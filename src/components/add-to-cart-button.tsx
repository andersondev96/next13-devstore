'use client'

import { useCart } from '@/context/cart-context'
import { Button } from '@/shared/ui/components/button'
import { ComponentProps } from 'react'

interface AddToCartButtonProps extends ComponentProps<'button'> {
  productId: number
}

export function AddToCartButton({ productId, ...props }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  function handleAddProductToCart() {
    addToCart(productId)
  }

  return (
    <Button type="button" onClick={handleAddProductToCart} {...props}>
      Adicionar ao carrinho
    </Button>
  )
}
