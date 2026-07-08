import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

async function getOrderHistory(userId: string) {
    // Em uma aplicação real, você buscaria estes dados do seu banco de dados.
    console.log('Buscando histórico de pedidos para o usuário:', userId)
    return [
        {
            id: '1',
            date: '2024-01-15',
            total: 129.0,
            items: ['Moletom Never Stop Learning'],
        },
        { id: '2', date: '2024-02-20', total: 99.0, items: ['Moletom AI Side'] },
    ]
}

export default async function AccountPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect('/api/auth/signin')
    }

    const userId = session.user.id
    const orders = await getOrderHistory(userId)

    return (
        <div>
            <h1>Minha Conta</h1>
            <p>Bem-vindo, {session.user.name}!</p>
            <p>Email: {session.user.email}</p>

            <h2 style={{ marginTop: '2rem' }}>Histórico de Pedidos</h2>
            {orders.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {orders.map((order) => (
                        <li key={order.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                            <p><strong>Pedido #{order.id}</strong></p>
                            <p>Data: {order.date}</p>
                            <p>Total: R$ {order.total.toFixed(2)}</p>
                            <p>Itens: {order.items.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Você ainda não fez nenhum pedido.</p>
            )}
        </div>
    )
}