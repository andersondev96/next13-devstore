'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSession } from 'next-auth/react'

// Carrinho de convidado: guardado sob uma chave própria (não "cart:items")
// para nunca ser confundido com o carrinho de um usuário autenticado.
const GUEST_CART_STORAGE_KEY = 'cart:guest'

export interface CartItem {
  productId: number
  title: string
  price: number
  image: string
  quantity: number
  stock: number
  // Variação selecionada (ex: tamanho). Produtos sem variação não usam este campo.
  size?: string
}

interface AddOrUpdateItemInput {
  productId: number
  title: string
  price: number
  image: string
  stock: number
  size?: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  getQuantityInCart: (productId: number, size?: string) => number
  addOrUpdateItem: (item: AddOrUpdateItemInput) => void
  updateQuantity: (productId: number, quantity: number, size?: string) => void
  removeItem: (productId: number, size?: string) => void
}

const CartContext = createContext({} as CartContextType)

// Duas linhas do carrinho são "a mesma linha" quando têm o mesmo produto
// E a mesma variação (tamanho). `undefined` e `undefined` também contam
// como iguais (produto sem variação).
function isSameLine(item: CartItem, productId: number, size?: string) {
  return item.productId === productId && (item.size ?? null) === (size ?? null)
}

function lineKey(productId: number, size?: string) {
  return `${productId}::${size ?? ''}`
}

function readGuestCart(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(GUEST_CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Não foi possível carregar o carrinho salvo.', error)
    return []
  }
}

function writeGuestCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Não foi possível salvar o carrinho.', error)
  }
}

function clearGuestCart() {
  try {
    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY)
  } catch (error) {
    console.error('Não foi possível limpar o carrinho local.', error)
  }
}

// Mescla o carrinho salvo do usuário com o carrinho de convidado (se
// houver), somando quantidades de produtos repetidos em vez de duplicar
// o item, e sempre respeitando o estoque disponível.
function mergeCarts(serverItems: CartItem[], guestItems: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>()

  for (const item of serverItems) {
    merged.set(lineKey(item.productId, item.size), item)
  }

  for (const guestItem of guestItems) {
    const key = lineKey(guestItem.productId, guestItem.size)
    const existing = merged.get(key)

    if (existing) {
      merged.set(key, {
        ...existing,
        quantity: Math.min(existing.quantity + guestItem.quantity, existing.stock),
      })
    } else {
      merged.set(key, {
        ...guestItem,
        quantity: Math.min(guestItem.quantity, guestItem.stock),
      })
    }
  }

  return Array.from(merged.values())
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const previousUserId = useRef<string | null>(null)

  const persistServerCart = useCallback(async (nextItems: CartItem[]) => {
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: nextItems }),
      })
    } catch (error) {
      console.error('Não foi possível sincronizar o carrinho.', error)
    }
  }, [])

  // Reage a mudanças no estado de autenticação:
  // - visitante -> lê do localStorage ("cart:guest")
  // - acabou de logar -> busca o carrinho salvo no servidor, mescla com um
  //   eventual carrinho de convidado e limpa o localStorage (para não
  //   deixar dados "soltos" no navegador)
  // - deslogou -> some com o carrinho do usuário e volta ao carrinho de
  //   convidado, que já não deve conter itens de outra conta
  useEffect(() => {
    if (status === 'loading') return

    const userId = session?.user?.id ?? null

    async function syncCart() {
      setIsLoading(true)

      if (userId) {
        const isNewLogin = previousUserId.current !== userId

        try {
          const response = await fetch('/api/cart')
          const serverItems: CartItem[] = response.ok
            ? ((await response.json()).items ?? [])
            : []

          if (isNewLogin) {
            const guestItems = readGuestCart()
            const mergedItems = mergeCarts(serverItems, guestItems)

            setItems(mergedItems)
            clearGuestCart()

            if (guestItems.length > 0) {
              await persistServerCart(mergedItems)
            }
          } else {
            setItems(serverItems)
          }
        } catch (error) {
          console.error('Não foi possível carregar o carrinho salvo.', error)
        }
      } else {
        setItems(readGuestCart())
      }

      previousUserId.current = userId
      setIsLoading(false)
    }

    syncCart()
  }, [session?.user?.id, status, persistServerCart])

  // Persiste toda alteração: localStorage para visitante, API/"banco"
  // para usuário logado.
  useEffect(() => {
    if (isLoading) return

    if (session?.user?.id) {
      persistServerCart(items)
    } else {
      writeGuestCart(items)
    }
  }, [items, isLoading, session?.user?.id, persistServerCart])

  // Sem `size`: soma a quantidade de TODAS as variações do produto (usado
  // para checar o estoque total, já que o estoque é do produto, não do
  // tamanho). Com `size`: retorna a quantidade daquela linha específica.
  function getQuantityInCart(productId: number, size?: string) {
    if (size !== undefined) {
      return items.find((item) => isSameLine(item, productId, size))?.quantity ?? 0
    }

    return items
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0)
  }

  // Chamado depois que a Server Action confirma que a operação é válida.
  // Cada variação (tamanho) vira uma linha própria no carrinho, mas todas
  // dividem o mesmo estoque do produto.
  function addOrUpdateItem({ productId, title, price, image, stock, size }: AddOrUpdateItemInput) {
    setItems((state) => {
      const otherLinesQuantity = state.reduce(
        (sum, item) =>
          item.productId === productId && !isSameLine(item, productId, size)
            ? sum + item.quantity
            : sum,
        0,
      )
      const maxForThisLine = Math.max(stock - otherLinesQuantity, 0)

      const existingIndex = state.findIndex((item) => isSameLine(item, productId, size))

      if (existingIndex >= 0) {
        return state.map((item, index) =>
          index === existingIndex
            ? {
              ...item,
              title,
              price,
              image,
              stock,
              quantity: Math.min(item.quantity + 1, maxForThisLine),
            }
            : item,
        )
      }

      if (maxForThisLine <= 0) return state

      return [
        ...state,
        { productId, title, price, image, stock, size, quantity: Math.min(1, maxForThisLine) },
      ]
    })
  }

  // `quantity` já deve vir validada contra o estoque (ex: retorno de uma
  // Server Action). Aqui fazemos apenas uma trava de segurança extra,
  // respeitando o estoque já usado por outras variações do mesmo produto,
  // e removemos a linha se a quantidade final for zero.
  function updateQuantity(productId: number, quantity: number, size?: string) {
    setItems((state) => {
      const otherLinesQuantity = state.reduce(
        (sum, item) =>
          item.productId === productId && !isSameLine(item, productId, size)
            ? sum + item.quantity
            : sum,
        0,
      )

      return state
        .map((item) => {
          if (!isSameLine(item, productId, size)) return item

          const maxForThisLine = Math.max(item.stock - otherLinesQuantity, 0)
          const safeQuantity = Math.min(Math.max(quantity, 0), maxForThisLine)
          return { ...item, quantity: safeQuantity }
        })
        .filter((item) => item.quantity > 0)
    })
  }

  function removeItem(productId: number, size?: string) {
    setItems((state) => state.filter((item) => !isSameLine(item, productId, size)))
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoading,
        getQuantityInCart,
        addOrUpdateItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)