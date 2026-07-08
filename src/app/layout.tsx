import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    template: '%s | Lumen',
    default: 'Lumen',
  },
  description: 'Uma loja virtual moderna, premium e elegante com identidade Lumen.',
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
    <html className={inter.variable} lang="pt">
      <body className="bg-slate-950 text-slate-50 antialiased">{children}</body>
    </html>
  )
}
