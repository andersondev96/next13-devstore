'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut } from 'next-auth/react'
import { LogIn, LogOut, UserRound } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface AuthActionsProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  compact?: boolean
}

export function AuthActions({ user, compact = false }: AuthActionsProps) {
  if (user) {
    const label = user.name?.split(' ')[0] ?? 'Conta'

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/account"
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-slate-100 transition hover:bg-white/10',
            compact ? 'p-2' : 'px-2 py-2',
          )}
        >
          {user.image ? (
            <Image
              src={user.image}
              className="h-8 w-8 rounded-full object-cover"
              width={32}
              height={32}
              alt={user.name ?? 'Avatar da conta'}
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-brand-200">
              <UserRound className="h-4 w-4" />
            </span>
          )}
          {!compact ? <span className="pr-2">{label}</span> : null}
        </Link>

        {!compact ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', compact && 'justify-end')}>
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/account' })}
        className={cn(
          'inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-100 transition hover:bg-white/10',
          compact ? 'h-10 w-10' : 'h-10 px-4',
        )}
        aria-label="Entrar com Google"
        title="Entrar com Google"
      >
        {compact ? <LogIn className="h-4 w-4" /> : 'Google'}
      </button>

      {!compact ? (
        <button
          type="button"
          onClick={() => signIn('github', { callbackUrl: '/account' })}
          className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
        >
          GitHub
        </button>
      ) : null}
    </div>
  )
}
