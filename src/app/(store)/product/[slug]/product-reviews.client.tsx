'use client'

import { auth } from '@/auth'
import { api } from '@/data/api'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Review {
    id: number
    author: string
    rating: number
    comment: string
    createdAt: string
}

interface ProductReviewsProps {
    productSlug: string
}

// Mock useSession for demonstration purposes, as Auth.js setup is not in context.
// It uses the mock `auth()` function to simulate a session.
const useMockSession = () => {
    const [session, setSession] =
        useState<Awaited<ReturnType<typeof auth>> | null>(null)
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

    useEffect(() => {
        async function fetchSession() {
            const sessionData = await auth()
            setSession(sessionData)
            setStatus(sessionData ? 'authenticated' : 'unauthenticated')
        }
        fetchSession()
    }, [])

    return { data: session, status }
}

export function ProductReviews({ productSlug }: ProductReviewsProps) {
    const { data: session, status } = useMockSession()

    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [newRating, setNewRating] = useState(0)
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const fetchReviews = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await api(`/products/${productSlug}/reviews`)
            if (!response.ok) throw new Error()
            const data = await response.json()
            setReviews(data)
        } catch (err) {
            setError('Falha ao carregar as avaliações.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productSlug])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError(null)

        if (newRating === 0) {
            setSubmitError('Por favor, selecione uma nota de 1 a 5 estrelas.')
            return
        }

        setIsSubmitting(true)
        try {
            const response = await api(`/products/${productSlug}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: newRating, comment: newComment }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Falha ao enviar avaliação.')
            }

            const newReview = await response.json()
            setReviews((prev) => [newReview, ...prev]) // Optimistic update
            setNewComment('')
            setNewRating(0)
        } catch (err: any) {
            setSubmitError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const canReview = status === 'authenticated'

    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-bold text-white">Avaliações de Clientes</h2>

            {canReview && (
                <form onSubmit={handleSubmit} className="rounded-lg bg-slate-900/50 p-6 sm:p-8">
                    <h3 className="font-semibold text-white">Deixe sua avaliação</h3>
                    <p className="text-sm text-slate-400">
                        Comprou este produto? Compartilhe sua experiência!
                    </p>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-300">Sua nota</label>
                        <div className="mt-1 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button type="button" key={star} onClick={() => setNewRating(star)} aria-label={`Avaliar com ${star} estrelas`}>
                                    <Star className={`h-7 w-7 transition-colors ${newRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-slate-300">Seu comentário</label>
                        <textarea id="comment" name="comment" rows={4} value={newComment} onChange={(e) => setNewComment(e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                            placeholder="O que você achou do produto?" required minLength={3} maxLength={500} />
                    </div>

                    {submitError && <p className="mt-2 text-sm text-red-400">{submitError}</p>}

                    <button type="submit" disabled={isSubmitting} className="mt-6 flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-violet-600 font-semibold text-white transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">
                        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                </form>
            )}

            <div className="space-y-6">
                {isLoading && <p className="text-slate-400">Carregando avaliações...</p>}
                {error && <p className="text-red-400">{error}</p>}
                {!isLoading && !error && (
                    <>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="border-b border-white/10 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (<Star key={i} className={`h-5 w-5 ${review.rating > i ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />))}
                                        </div>
                                        <p className="font-bold text-white">{review.author}</p>
                                        <p className="ml-auto text-sm text-slate-500">em {new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <p className="mt-3 text-slate-300">{review.comment}</p>
                                </div>
                            ))
                        ) : (<p className="text-slate-400">Este produto ainda não tem avaliações. Seja o primeiro a avaliar!</p>)}
                    </>
                )}
            </div>
        </div>
    )
}