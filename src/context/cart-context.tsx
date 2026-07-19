'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

const CART_STORAGE_KEY = 'cart:items'

export interface CartItem {
  productId: number
  title: string
  quantity: number
  stock: number
  price: number
  image: string
}

interface AddOrUpdateItemInput {
  productId: number
  title: string
  stock: number
  price: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  cartTotal: number
  getQuantityInCart: (productId: number) => number
  addOrUpdateItem: (item: AddOrUpdateItemInput) => void
  removeItem: (productId: number) => void
  changeItemQuantity: (productId: number, quantity: number) => void
}

const CartContext = createContext({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // O valor inicial do useState precisa ser igual no server e no client
  // (senão o Next.js acusa erro de hydration), então o carrinho salvo só
  // pode ser lido depois que o componente já montou no browser.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY)

      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Não foi possível carregar o carrinho salvo.', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Persiste toda alteração do carrinho no localStorage. O guard de
  // `isHydrated` evita que o array vazio do primeiro render sobrescreva
  // o carrinho que acabamos de carregar do storage.
  useEffect(() => {
    if (!isHydrated) return

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Não foi possível salvar o carrinho.', error)
    }
  }, [items, isHydrated])

  function getQuantityInCart(productId: number) {
    return items.find((item) => item.productId === productId)?.quantity ?? 0
  }

  // Chamado SOMENTE depois que a Server Action confirma que a operação é
  // válida (produto existe e há estoque disponível). Aqui só refletimos o
  // resultado no estado local do carrinho.
  function addOrUpdateItem({
    productId,
    title,
    stock,
    price,
    image,
  }: AddOrUpdateItemInput) {
    setItems((state) => {
      const productInCart = state.some((item) => item.productId === productId)

      if (productInCart) {
        return state.map((item) => {
          if (item.productId !== productId) return item

          return {
            ...item,
            title,
            stock,
            price,
            image,
            // trava de segurança extra no client: nunca passa do estoque
            quantity: Math.min(item.quantity + 1, stock),
          }
        })
      }

      return [...state, { productId, title, stock, quantity: 1, price, image }]
    })
  }

  function removeItem(productId: number) {
    setItems((state) => state.filter((item) => item.productId !== productId))
  }

  function changeItemQuantity(productId: number, quantity: number) {
    setItems((state) =>
      state.map((item) => {
        if (item.productId === productId) {
          const newQuantity = Math.max(1, Math.min(quantity, item.stock))
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        cartTotal,
        getQuantityInCart,
        addOrUpdateItem,
        removeItem,
        changeItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)