import { AuthActions } from '@/features/auth/auth-actions'
import { Card } from '@/shared/ui/components/card'
import { SectionTitle } from '@/shared/ui/components/section-title'
import { authOptions } from '@/lib/auth'
import { getOrdersByUserId } from '@/data/orders'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Minha Conta',
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <Card className="p-6 sm:p-8">
          <SectionTitle
            eyebrow="Acesso"
            title="Entre para acessar sua conta"
            description="Use Google ou GitHub para ver seus dados de perfil e acompanhar o histórico de pedidos da Lumen."
          />
          <AuthActions className="mt-8" />
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Minha Conta
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Depois do login, esta area mostra seu perfil, pedidos recentes,
            status, itens e totais.
          </p>
        </Card>
      </div>
    )
  }

  const orders = await getOrdersByUserId(session.user.id)

  return (
    <div className="space-y-8">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                className="h-16 w-16 rounded-full object-cover"
                width={64}
                height={64}
                alt={session.user.name ?? 'Avatar da conta'}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/20 text-xl font-semibold text-brand-200">
                {session.user.name?.charAt(0) ?? 'L'}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
                Minha Conta
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white">
                {session.user.name ?? 'Cliente Lumen'}
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                {session.user.email}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Pedidos
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {orders.length}
            </p>
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <SectionTitle
          eyebrow="Historico"
          title="Pedidos recentes"
          description="Acompanhe status, itens comprados e totais dos pedidos vinculados a sua conta."
        />

        {orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-semibold text-white">
                      Pedido #{order.id}
                    </h2>
                    <p className="text-sm text-slate-400">
                      Realizado em {dateFormatter.format(new Date(order.date))}
                    </p>
                  </div>
                  <div className="space-y-1.5 text-left sm:text-right">
                    <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
                      {order.status}
                    </span>
                    <p className="text-sm text-slate-300">
                      Total: {currencyFormatter.format(order.total)}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-950/40">
                  {order.items.map((item) => (
                    <li
                      key={`${order.id}-${item.product.name}`}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex items-start gap-4">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-lg object-cover"
                            alt={item.product.name}
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800">
                            <svg
                              className="h-5 w-5 text-slate-600"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-100">
                            {item.product.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-right font-semibold text-white">
                        {currencyFormatter.format(item.price)}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-sm text-slate-300">
              Você ainda não possui pedidos vinculados a esta conta.
            </p>
          </Card>
        )}
      </section>
    </div>
  )
}
