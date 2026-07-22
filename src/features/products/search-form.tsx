'use client'

import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState, useEffect, useRef } from 'react'
import { Product } from '@/data/types/product'
import Link from 'next/link'
import Image from 'next/image'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const urlQuery = searchParams.get('q')

  const [query, setQuery] = useState(urlQuery ?? '')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Sincroniza o input com a URL. Na página de busca, exibe a query.
    // Em outras páginas, o campo é limpo. Isso evita que o termo de busca
    // persista ao navegar para outras páginas, como a de um produto.
    setQuery(pathname === '/search' ? urlQuery ?? '' : '')
  }, [pathname, urlQuery])

  // Debounced effect for fetching suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 3) {
        setSuggestions([])
        setIsSuggestionsOpen(false)
        return
      }

      const response = await fetch(`/api/products?q=${query}&limit=5`)
      const data = await response.json()

      setSuggestions(data.products)
      setIsSuggestionsOpen(data.products.length > 0)
      setHighlightedIndex(-1)
    }

    const timeoutId = setTimeout(fetchSuggestions, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return
    }

    router.push(`/search?q=${trimmedQuery}`)
    setIsSuggestionsOpen(false)
  }

  function handleClearSearch() {
    setQuery('')
    setSuggestions([])
    setIsSuggestionsOpen(false)
    // Se estiver na página de busca, limpar a busca leva para a home.
    // Caso contrário, apenas limpa o campo sem navegar.
    if (pathname === '/search') {
      router.push('/')
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isSuggestionsOpen || suggestions.length === 0) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setHighlightedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length,
        )
        break
      case 'Enter':
        if (highlightedIndex > -1) {
          event.preventDefault()
          router.push(`/product/${suggestions[highlightedIndex].slug}`)
          setIsSuggestionsOpen(false)
        }
        break
      case 'Escape':
        setIsSuggestionsOpen(false)
        break
    }
  }

  return (
    <div ref={formRef} className="relative">
      <form
        onSubmit={handleSearch}
        className="relative flex w-full items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-5 py-3 shadow-inner shadow-slate-950/40 transition-shadow duration-150 focus-within:border-white/20 focus-within:shadow-none focus-within:ring-2 focus-within:ring-cyan-400/30 focus-within:shadow-[0_8px_30px_rgba(56,189,248,0.08)]"
      >
        <Search className="h-5 w-5 shrink-0 text-slate-500" />

        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query.length >= 3 &&
            suggestions.length > 0 &&
            setIsSuggestionsOpen(true)
          }
          placeholder="Buscar produtos..."
          className="flex-1 appearance-none border-none bg-transparent pr-8 text-base text-white shadow-none placeholder:text-slate-500 focus:outline-none focus:ring-0"
          style={{
            backgroundColor: 'transparent',
            WebkitBoxShadow:
              '0 0 0 1000px transparent inset, 0 0 0 0 transparent',
            boxShadow: '0 0 0 1000px transparent inset, 0 0 0 0 transparent',
            outline: 'none',
            border: 'none',
            WebkitAppearance: 'none',
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

      {isSuggestionsOpen && suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-800 shadow-lg">
          <ul role="listbox">
            {suggestions.map((product, index) => (
              <li
                key={product.id}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className={`flex items-center gap-4 p-3 transition-colors ${highlightedIndex === index
                    ? 'bg-slate-700'
                    : 'hover:bg-slate-700/50'
                    }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => setIsSuggestionsOpen(false)}
                >
                  <Image
                    src={product.image}
                    width={48}
                    height={48}
                    quality={100}
                    alt={product.title}
                    className="rounded-md"
                  />
                  <span className="text-sm">{product.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}