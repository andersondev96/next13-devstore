'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export function Header() {
    const { data: session, status } = useSession()

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1 style={{ margin: 0 }}>Lumen</h1>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {status === 'loading' && <p>Carregando...</p>}
                {status === 'unauthenticated' && (
                    <>
                        <button onClick={() => signIn('google')}>Login com Google</button>
                        <button onClick={() => signIn('github')}>Login com GitHub</button>
                    </>
                )}
                {status === 'authenticated' && (
                    <>
                        <span>Olá, {session.user?.name}</span>
                        {session.user?.image && <img src={session.user.image} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />}
                        <Link href="/account">Minha Conta</Link>
                        <button onClick={() => signOut()}>Sair</button>
                    </>
                )}
            </nav>
        </header>
    )
}