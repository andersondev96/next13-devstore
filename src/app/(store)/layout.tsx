import { Header } from '@/components/header'
import { CartProvider } from '@/context/cart-context'
import { ReactNode } from 'react'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <Header />
        <main className="flex-1 rounded-[32px] border border-white/10 bg-slate-900/60 p-4 shadow-card backdrop-blur-xl sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </CartProvider>
  )
}
