import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { getServerSession } from 'next-auth/next'
import { AuthActions } from './auth-actions'
import { CartWidget } from './cart-widget'
import { SearchForm } from './search-form'
import { authOptions } from '@/lib/auth'

export async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-4 z-20 rounded-[28px] border border-white/10 bg-slate-900/70 px-4 py-4 shadow-card backdrop-blur-xl sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] border border-cyan-400/20 bg-slate-950/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_45px_rgba(56,189,248,0.18)]">
              <Image
                src="/lumen-mark.svg"
                alt="Lumen"
                width={48}
                height={48}
                priority
              />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">
                Lumen
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                collection 2026
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <CartWidget />
            <AuthActions compact user={session?.user} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-end lg:gap-4">
          <div className="w-full lg:max-w-[420px]">
            <Suspense fallback={null}>
              <SearchForm />
            </Suspense>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <CartWidget />
            <div className="h-8 w-px bg-white/10" />
            <AuthActions user={session?.user} />
          </div>
        </div>
      </div>
    </header>
  )
}
