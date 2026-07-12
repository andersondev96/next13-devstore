'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent } from 'react'

const sortOptions = [
    { value: 'relevancia', label: 'Relevância' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'rating_desc', label: 'Melhor avaliação' },
]

export function ProductSort() {
    const router = useRouter()
    const searchParams = useSearchParams()

    function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
        const sort = event.target.value
        const params = new URLSearchParams(searchParams.toString())

        if (sort && sort !== 'relevancia') params.set('sort', sort)
        else params.delete('sort')

        router.push(`/?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-zinc-400">
                Ordenar por
            </label>
            <select
                id="sort"
                name="sort"
                value={searchParams.get('sort') ?? 'relevancia'}
                onChange={handleSortChange}
                className="rounded-md border-gray-600 bg-slate-800 p-2 text-sm text-white"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}