'use client'

import { addToCartAction } from '@/app/api/products/[slug]/actions'
import { useCart } from '@/context/cart-context'
import { Button } from '@/shared/ui/components/button'
import { ComponentProps, useTransition } from 'react'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'

interface AddToCartButtonProps extends ComponentProps<'button'> {
  productId: number
  productTitle: string
  stock: number
  price: number
  image: string
}

export function AddToCartButton({
  productId,
  productTitle,
  stock,
  price,
  image,
  disabled,
  className,
  ...props
}: AddToCartButtonProps) {
  const { getQuantityInCart, addOrUpdateItem } = useCart()
  const [isPending, startTransition] = useTransition()

  const currentQuantityInCart = getQuantityInCart(productId)
  const isOutOfStock = currentQuantityInCart >= stock
  const isDisabled = disabled || isPending || isOutOfStock

  function handleAddProductToCart() {
    startTransition(async () => {
      const result = await addToCartAction(productId, currentQuantityInCart)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      addOrUpdateItem({
        productId,
        title: result.product?.title ?? productTitle,
        stock: result.product?.stock ?? stock,
        price,
        image,
      })

      toast.success(result.message)
    })
  }

  return (
    <Button
      type="button"
      onClick={handleAddProductToCart}
      disabled={isDisabled}
      className={twMerge(
        className,
        isDisabled && 'cursor-not-allowed bg-slate-800 opacity-50 hover:bg-slate-800',
      )}
      {...props}
    >
      {isPending
        ? 'Adicionando...'
        : isOutOfStock
          ? 'Fora de estoque'
          : 'Adicionar ao carrinho'}
    </Button>
  )
}