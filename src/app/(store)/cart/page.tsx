import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cart',
}

export default async function Cart() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900/70 p-4 text-white">
            <h1 className="text-3xl font-bold">Cart</h1>
        </div>
    )
}