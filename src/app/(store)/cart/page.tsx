import { Metadata } from 'next'
import { CartPageContent } from './cart-page-content-client'

export const metadata: Metadata = {
    title: 'Carrinho',
}

export default function CartPage() {
    return <CartPageContent />
}