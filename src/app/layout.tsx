import type { Metadata } from 'next'
import { Providers } from '../../providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Lumen',
    default: 'Lumen',
  },
  description:
    'Uma loja virtual moderna, premium e elegante com identidade Lumen.',
  icons: {
    icon: '/lumen-mark.svg',
    shortcut: '/lumen-mark.svg',
    apple: '/lumen-mark.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
