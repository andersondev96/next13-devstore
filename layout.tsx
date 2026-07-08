import type { Metadata } from 'next'
import { Providers } from './providers'
import { Header } from './Header'

export const metadata: Metadata = {
  title: 'Lumen',
  description:
    'Projeto de e-commerce utilizando o Next.js com o Server Components.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Header />
          <main style={{ padding: '1rem' }}>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
