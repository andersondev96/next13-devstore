import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { getServerSession } from 'next-auth/next'
import { AuthActions } from '@/features/auth/auth-actions'
import { CartWidget } from '@/features/cart/cart-widget'
import { SearchForm } from '@/features/products/search-form'
import { authOptions } from '@/lib/auth'

export async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-4 z-50 rounded-[28px] border border-white/10 bg-slate-900/70 px-4 py-3 shadow-card backdrop-blur-xl sm:px-6">
      <div className="flex flex-nowrap items-center gap-3 sm:gap-4 lg:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[18px] bg-slate-950/90 shadow-[0_18px_45px_rgba(56,189,248,0.18)]">
            <Image
              src="/lumen-mark.svg"
              alt="Lumen"
              width={44}
              height={44}
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-tight text-white">
              Lumen
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              collection 2026
            </p>
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </div>

        <div className="flex shrink-0 flex-nowrap items-center gap-3 sm:gap-4">
          <CartWidget />
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          <AuthActions user={session?.user} />
        </div>
      </div>
    </header>
  )
}