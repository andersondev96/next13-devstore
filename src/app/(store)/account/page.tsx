import { AuthActions } from '@/components/auth-actions'
import { Card } from '@/components/ui/card'
import { SectionTitle } from '@/components/ui/section-title'
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
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <Card className="p-6 sm:p-8">
          <SectionTitle
            eyebrow="Acesso"
            title="Entre para acessar sua conta"
            description="Use Google ou GitHub para ver seus dados de perfil e acompanhar o histórico de pedidos da Lumen."
          />
          <div className="mt-8">
            <AuthActions />
          </div>
        </Card>

        <Card className="p-6">
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
    <div className="space-y-6">
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
              <Card key={order.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-white">
                        Pedido {order.id}
                      </h2>
                      <span className="rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-200">
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {dateFormatter.format(new Date(order.date))}
                    </p>
                  </div>

                  <p className="text-xl font-semibold text-white">
                    {currencyFormatter.format(order.total)}
                  </p>
                </div>

                <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-950/40">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.name}`}
                      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-100">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-brand-200">
                        {currencyFormatter.format(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-sm text-slate-300">
              Voce ainda nao possui pedidos vinculados a esta conta.
            </p>
          </Card>
        )}
      </section>
    </div>
  )
}
