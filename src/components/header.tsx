import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { CartWidget } from './cart-widget'
import { SearchForm } from './search-form'

export function Header() {
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
              <p className="text-lg font-semibold tracking-tight text-white">Lumen</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                collection 2026
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <CartWidget />
            <Link href="/" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2">
              <Image
                src="https://github.com/andersondev96.png"
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
                alt=""
              />
            </Link>
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
            <Link href="/" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 transition hover:bg-white/10">
              <Image
                src="https://github.com/andersondev96.png"
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
                alt=""
              />
              <span className="pr-2 text-sm font-medium text-slate-200">Conta</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
