'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    function handleFilter(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const params = new URLSearchParams(searchParams.toString())

        const categoria = formData.get('categoria') as string
        const preco_min = formData.get('preco_min') as string
        const preco_max = formData.get('preco_max') as string
        const rating_min = formData.get('rating_min') as string

        if (categoria) params.set('categoria', categoria)
        else params.delete('categoria')

        if (preco_min) params.set('preco_min', preco_min)
        else params.delete('preco_min')

        if (preco_max) params.set('preco_max', preco_max)
        else params.delete('preco_max')

        if (rating_min) params.set('rating_min', rating_min)
        else params.delete('rating_min')

        router.push(`/?${params.toString()}`)
    }

    function handleClearFilters() {
        router.push('/')
    }

    const categories = ['eletronicos', 'roupas', 'acessorios', 'sapatos'] // Example categories

    return (
        <form
            onSubmit={handleFilter}
            className="flex flex-col gap-4 rounded-lg border border-white/10 bg-slate-900/70 p-4"
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                    <label htmlFor="preco_min" className="text-sm font-medium">
                        Preço Mín.
                    </label>
                    <input
                        type="number"
                        id="preco_min"
                        name="preco_min"
                        defaultValue={searchParams.get('preco_min') ?? ''}
                        className="w-full rounded-md border-gray-600 bg-slate-800 p-2 text-white"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="preco_max" className="text-sm font-medium">
                        Preço Máx.
                    </label>
                    <input
                        type="number"
                        id="preco_max"
                        name="preco_max"
                        defaultValue={searchParams.get('preco_max') ?? ''}
                        className="w-full rounded-md border-gray-600 bg-slate-800 p-2 text-white"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="rating_min" className="text-sm font-medium">
                        Nota Mín.
                    </label>
                    <input
                        type="number"
                        id="rating_min"
                        name="rating_min"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={searchParams.get('rating_min') ?? ''}
                        className="w-full rounded-md border-gray-600 bg-slate-800 p-2 text-white"
                    />
                </div>
                <div className="flex items-end gap-4">
                    <button
                        type="submit"
                        className="flex-1 rounded-md bg-violet-500 px-4 py-2 font-semibold text-white hover:bg-violet-600"
                    >
                        Filtrar
                    </button>
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                    >
                        Limpar
                    </button>
                </div>
            </div>
        </form>
    )
}