'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut } from 'next-auth/react'
import { LogOut, UserRound } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface AuthActionsProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  className?: string
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0 0 12 23z" fill="#34A853" />
      <path d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.06H2.18A10.99 10.99 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.05 8.21 11.68.6.11.82-.27.82-.6 0-.29-.01-1.06-.02-2.08-3.34.74-4.04-1.65-4.04-1.65-.55-1.42-1.34-1.8-1.34-1.8-1.09-.77.08-.75.08-.75 1.2.09 1.84 1.26 1.84 1.26 1.07 1.87 2.81 1.33 3.5 1.02.11-.79.42-1.33.76-1.64-2.66-.31-5.47-1.37-5.47-6.08 0-1.34.46-2.44 1.22-3.3-.12-.31-.53-1.55.12-3.24 0 0 1-.33 3.3 1.26a11.2 11.2 0 0 1 6 0c2.28-1.59 3.29-1.26 3.29-1.26.65 1.69.24 2.93.12 3.24.76.86 1.22 1.96 1.22 3.3 0 4.72-2.81 5.76-5.49 6.07.43.38.81 1.13.81 2.29 0 1.65-.02 2.98-.02 3.39 0 .33.22.72.83.6C20.57 22.34 24 17.73 24 12.3 24 5.5 18.63 0 12 0z" />
    </svg>
  )
}

export function AuthActions({ user, className }: AuthActionsProps) {
  if (user) {
    const label = user.name?.split(' ')[0] ?? 'Conta'

    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Link
          href="/account"
          className="flex items-center gap-2 hover:text-white"
          title="Minha conta"
          aria-label="Minha conta"
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
              <UserRound className="h-5 w-5" />
            </span>
          )}

          <span className="hidden text-sm font-medium sm:block">{label}</span>
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Sair"
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      <span className="text-xs text-slate-400">Entre ou cadastre com:</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/account' })}
          className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white/5 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          aria-label="Entrar com Google"
          title="Entrar com Google"
        >
          <GoogleIcon className="h-5 w-5 shrink-0" />
          <span className="leading-none">Google</span>
        </button>

        <button
          type="button"
          onClick={() => signIn('github', { callbackUrl: '/account' })}
          className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white/5 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          aria-label="Entrar com GitHub"
          title="Entrar com GitHub"
        >
          <GithubIcon className="h-5 w-5 shrink-0" />
          <span className="leading-none">GitHub</span>
        </button>
      </div>
    </div>
  )
}