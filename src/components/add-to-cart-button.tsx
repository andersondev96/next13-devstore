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
  productPrice: number
  productImage: string
  productSize?: string
  stock: number
}

export function AddToCartButton({
  productId,
  productTitle,
  productPrice,
  productImage,
  productSize,
  stock,
  disabled,
  className,
  ...props
}: AddToCartButtonProps) {
  const { getQuantityInCart, addOrUpdateItem } = useCart()
  const [isPending, startTransition] = useTransition()

  // Soma across todas as variações do produto: o estoque é do produto,
  // não do tamanho, então o limite considera tudo que já está no carrinho.
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

      const title = result.product?.title ?? productTitle

      addOrUpdateItem({
        productId,
        title,
        price: result.product?.price ?? productPrice,
        image: result.product?.image ?? productImage,
        stock: result.product?.stock ?? stock,
        size: productSize,
      })

      toast.success(
        productSize
          ? `${title} (Tamanho: ${productSize}) adicionado ao carrinho.`
          : `${title} adicionado ao carrinho.`,
      )
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