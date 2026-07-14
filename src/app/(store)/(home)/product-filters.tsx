'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

const categories = ['eletronicos', 'roupas', 'acessorios', 'sapatos']

interface PriceRange {
    value: string
    label: string
    min?: number
    max?: number
}

const priceRanges: PriceRange[] = [
    { value: '', label: 'Todos' },
    { value: 'ate-50', label: 'Abaixo de R$ 50', max: 50 },
    { value: '50-100', label: 'R$ 50 - R$ 100', min: 50, max: 100 },
    { value: '100-150', label: 'R$ 100 - R$ 150', min: 100, max: 150 },
    { value: '150-200', label: 'R$ 150 - R$ 200', min: 150, max: 200 },
    { value: 'acima-200', label: 'Acima de R$ 200', min: 200 },
]

// Descobre qual faixa está selecionada com base no preco_min/preco_max atuais da URL
function getSelectedPriceRange(searchParams: URLSearchParams): string {
    const min = searchParams.get('preco_min')
    const max = searchParams.get('preco_max')
    const minNum = min ? Number(min) : undefined
    const maxNum = max ? Number(max) : undefined

    const match = priceRanges.find((range) => range.min === minNum && range.max === maxNum)
    return match?.value ?? ''
}

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    function handleFilter(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const params = new URLSearchParams(searchParams.toString())

        const categoria = formData.get('categoria') as string
        const faixaPreco = formData.get('faixa_preco') as string
        const rating_min = formData.get('rating_min') as string

        if (categoria) params.set('categoria', categoria)
        else params.delete('categoria')

        const selectedRange = priceRanges.find((range) => range.value === faixaPreco)
        if (selectedRange?.min !== undefined) params.set('preco_min', String(selectedRange.min))
        else params.delete('preco_min')

        if (selectedRange?.max !== undefined) params.set('preco_max', String(selectedRange.max))
        else params.delete('preco_max')

        if (rating_min) params.set('rating_min', rating_min)
        else params.delete('rating_min')

        params.delete('page') // todo novo filtro reinicia a paginação

        router.push(`/?${params.toString()}`)
    }

    function handleClearFilters() {
        router.push('/')
    }

    return (
        <form
            key={searchParams.toString()}
            onSubmit={handleFilter}
            className="flex flex-wrap items-end gap-4 rounded-lg border border-white/10 bg-slate-900/70 p-4"
        >
            <div className="flex min-w-[140px] flex-1 flex-col gap-2">
                <label htmlFor="categoria" className="text-sm font-medium">
                    Categoria
                </label>
                <select
                    id="categoria"
                    name="categoria"
                    defaultValue={searchParams.get('categoria') ?? ''}
                    className="w-full rounded-md border-gray-600 bg-slate-800 p-2 text-white"
                >
                    <option value="">Todas</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex min-w-[160px] flex-1 flex-col gap-2">
                <label htmlFor="faixa_preco" className="text-sm font-medium">
                    Preço
                </label>
                <select
                    id="faixa_preco"
                    name="faixa_preco"
                    defaultValue={getSelectedPriceRange(searchParams)}
                    className="w-full rounded-md border-gray-600 bg-slate-800 p-2 text-white"
                >
                    {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex min-w-[110px] flex-1 flex-col gap-2">
                <label htmlFor="rating_min" className="text-sm font-medium">
                    Nota Mín.
                </label>
                <input
                    type="number"
                    id="rating_min"
                    name="rating_min"
                    min="0"
                    max="5"
                    step="0.5"
                    defaultValue={searchParams.get('rating_min') ?? ''}
                    className="w-full rounded-md border-gray-600 bg-slate-800 p-2 text-white"
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="rounded-md bg-violet-500 px-6 py-2 font-semibold text-white hover:bg-violet-600"
                >
                    Filtrar
                </button>
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="rounded-md bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
                >
                    Limpar
                </button>
            </div>
        </form>
    )
}