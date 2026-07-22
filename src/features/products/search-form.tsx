'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState, useEffect } from 'react'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('q')

  const [query, setQuery] = useState(urlQuery ?? '')

  useEffect(() => {
    setQuery(urlQuery ?? '')
  }, [urlQuery])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== urlQuery) {
        const trimmedQuery = query.trim()

        if (trimmedQuery) {
          router.push(`/search?q=${trimmedQuery}`)
        } else if (urlQuery) {
          router.push('/')
        }
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [query, urlQuery, router])

  function handleClearSearch() {
    setQuery('')
    router.push('/')
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="relative flex w-full items-center gap-3 rounded-full border border-white/10 px-5 py-3 shadow-inner shadow-slate-950/40 transition-shadow duration-150 focus-within:border-white/20 focus-within:shadow-none focus-within:ring-2 focus-within:ring-cyan-400/30 focus-within:shadow-[0_8px_30px_rgba(56,189,248,0.08)]"
    >
      <Search className="h-5 w-5 shrink-0 text-slate-500" />

      <input
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar produtos..."
        className="flex-1 appearance-none border-none bg-transparent pr-8 text-base text-white shadow-none placeholder:text-slate-500 focus:outline-none focus:ring-0"
        style={{
          backgroundColor: 'transparent',
          WebkitBoxShadow: '0 0 0 1000px transparent inset, 0 0 0 0 transparent',
          boxShadow: '0 0 0 1000px transparent inset, 0 0 0 0 transparent',
          outline: 'none',
          border: 'none',
          WebkitAppearance: 'none'
        }}
        autoComplete="off"
      />

      {query && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </form>
  )
}