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

export type CouponType = 'percentage' | 'fixed'

export interface AppliedCoupon {
  code: string
  type: CouponType
  /** Percentual (0-100) quando type = "percentage", valor em R$ quando type = "fixed". */
  value: number
}

interface AddOrUpdateItemInput {
  productId: number
  title: string
  price: number
  image: string
  stock: number
  size?: string
}

interface GuestCartData {
  items: CartItem[]
  coupon: AppliedCoupon | null
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  /** Soma dos itens, sem desconto. */
  totalPrice: number
  /** Cupom atualmente aplicado, ou null. */
  coupon: AppliedCoupon | null
  /** Valor do desconto do cupom atual sobre o `totalPrice` (0 se não houver cupom). */
  discount: number
  /** `totalPrice - discount`, nunca negativo. */
  totalWithDiscount: number
  isLoading: boolean
  getQuantityInCart: (productId: number, size?: string) => number
  addOrUpdateItem: (item: AddOrUpdateItemInput) => void
  updateQuantity: (productId: number, quantity: number, size?: string) => void
  removeItem: (productId: number, size?: string) => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
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

function calculateDiscount(totalPrice: number, coupon: AppliedCoupon | null) {
  if (!coupon) return 0

  const discount =
    coupon.type === 'percentage' ? (totalPrice * coupon.value) / 100 : coupon.value

  return Math.min(discount, totalPrice)
}

function readGuestCart(): GuestCartData {
  try {
    const stored = window.localStorage.getItem(GUEST_CART_STORAGE_KEY)
    if (!stored) return { items: [], coupon: null }

    const parsed = JSON.parse(stored)

    // Compatibilidade com o formato antigo, em que a chave guardava
    // diretamente um array de itens (sem cupom).
    if (Array.isArray(parsed)) return { items: parsed, coupon: null }

    return { items: parsed.items ?? [], coupon: parsed.coupon ?? null }
  } catch (error) {
    console.error('Não foi possível carregar o carrinho salvo.', error)
    return { items: [], coupon: null }
  }
}

function writeGuestCart(data: GuestCartData) {
  try {
    window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(data))
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
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const previousUserId = useRef<string | null>(null)

  const persistServerCart = useCallback(
    async (nextItems: CartItem[], nextCoupon: AppliedCoupon | null) => {
      try {
        await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: nextItems, coupon: nextCoupon }),
        })
      } catch (error) {
        console.error('Não foi possível sincronizar o carrinho.', error)
      }
    },
    [],
  )

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
          const serverCart = response.ok
            ? await response.json()
            : { items: [], coupon: null }
          const serverItems: CartItem[] = serverCart.items ?? []
          const serverCoupon: AppliedCoupon | null = serverCart.coupon ?? null

          if (isNewLogin) {
            const guest = readGuestCart()
            const mergedItems = mergeCarts(serverItems, guest.items)
            // Prioriza o cupom que já estava salvo na conta; se não houver,
            // aproveita o que o visitante tinha aplicado localmente.
            const mergedCoupon = serverCoupon ?? guest.coupon

            setItems(mergedItems)
            setCoupon(mergedCoupon)
            clearGuestCart()

            if (guest.items.length > 0 || guest.coupon) {
              await persistServerCart(mergedItems, mergedCoupon)
            }
          } else {
            setItems(serverItems)
            setCoupon(serverCoupon)
          }
        } catch (error) {
          console.error('Não foi possível carregar o carrinho salvo.', error)
        }
      } else {
        const guest = readGuestCart()
        setItems(guest.items)
        setCoupon(guest.coupon)
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
      persistServerCart(items, coupon)
    } else {
      writeGuestCart({ items, coupon })
    }
  }, [items, coupon, isLoading, session?.user?.id, persistServerCart])

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

  // Apenas um cupom pode estar ativo por vez: aplicar um novo sempre
  // substitui o anterior.
  function applyCoupon(nextCoupon: AppliedCoupon) {
    setCoupon(nextCoupon)
  }

  function removeCoupon() {
    setCoupon(null)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const discount = calculateDiscount(totalPrice, coupon)
  const totalWithDiscount = Math.max(totalPrice - discount, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        coupon,
        discount,
        totalWithDiscount,
        isLoading,
        getQuantityInCart,
        addOrUpdateItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)