'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const query = searchParams.get('q')

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)

    const query = data.q

    if (!query) {
      return null
    }

    router.push(`/search?q=${query}`)
  }

  if (pathname !== '/') {
    return null
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full items-center gap-3 rounded-full border border-white/10 px-5 py-3 shadow-inner shadow-slate-950/40 transition-shadow duration-150 focus-within:border-white/20 focus-within:shadow-none focus-within:ring-2 focus-within:ring-cyan-400/30 focus-within:shadow-[0_8px_30px_rgba(56,189,248,0.08)]"
    >
      <Search className="h-5 w-5 shrink-0 text-slate-500" />

      <input
        name="q"
        defaultValue={query ?? ''}
        placeholder="Buscar produtos..."
        className="flex-1 appearance-none border-none bg-transparent text-base text-white shadow-none placeholder:text-slate-500 focus:outline-none focus:ring-0"
        style={{
          backgroundColor: 'transparent',
          WebkitBoxShadow: '0 0 0 1000px transparent inset, 0 0 0 0 transparent',
          boxShadow: '0 0 0 1000px transparent inset, 0 0 0 0 transparent',
          outline: 'none',
          border: 'none',
          WebkitAppearance: 'none'
        }}
        autoComplete="off"
        required
      />
    </form>
  )
}