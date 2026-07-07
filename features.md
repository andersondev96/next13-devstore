### Features — Visão geral e prioridades

⚠️ Nota importante
Remova o React Router: o Next.js já fornece roteamento com o App Router e Server Components; manter ambos gera redundância e pode confundir recrutadores. Prefira o roteamento nativo do Next.

Resumo rápido
Este documento lista melhorias e diferenciais recomendados para transformar este repositório em um projeto de portfólio completo e profissional, com foco em e-commerce, qualidade de engenharia e apresentação para entrevistas.

Principais funcionalidades (prioridade alta)

- **Checkout completo:** integração com Stripe (modo test) + simulação de webhooks.
- **Autenticação:** NextAuth/Auth.js com login social (Google/GitHub) e área `Minha Conta` com histórico de pedidos.
- **Persistência do carrinho:** localStorage para visitantes e persistência em banco por usuário, com sincronização ao logar.
- **CRUD admin:** painel simples para gerenciar produtos (papéis e autorização: admin vs cliente).

Funcionalidades valiosas (prioridade média)

- **Wishlist** e **avaliações/comentários** de produtos (nota média, moderação básica).
- **Filtros avançados** e estado em URL (query params) para compartilhar resultados.
- **Paginação** ou **infinite scroll** na listagem de produtos.
- **Cupons de desconto** aplicáveis no checkout.

Arquitetura e dados

- Preferir banco real (PostgreSQL) com ORM (Prisma ou Drizzle).
- Usar **Server Actions** e Server Components para mutações onde fizer sentido.
- Cache e revalidação: `revalidatePath` / `revalidateTag` / ISR para otimizar páginas de produto.

Qualidade e testes

- Testes de integração e2e com **Cypress** cobrindo fluxos críticos (busca → produto → carrinho → checkout).
- Testes unitários com **Vitest** + Testing Library para componentes e lógica.
- Pipeline CI/CD (GitHub Actions) rodando lint, testes e build por PR.

Performance e SEO

- Usar `next/image` para otimização automática das imagens.
- Metadata API do Next para títulos e descrições dinâmicos por produto.
- Gerar `sitemap.xml` e `robots.txt` dinamicamente.

UX e acessibilidade

- Dark mode com TailwindCSS e persistência da preferência do usuário.
- Skeletons / Suspense para melhor percepção de performance.
- Acessibilidade (A11Y): navegação por teclado, roles/aria-labels e contraste adequado.
- Tratamento de erros com `error.tsx` e `not-found.tsx` do App Router.

Diferenciais para o portfólio

- README completo: decisões arquiteturais, prints/GIFs, link do deploy e instruções de execução.
- Usar TypeScript em todo o projeto.
- Deploy no Vercel (domínio próprio recomendado).
- Monitoramento de erros (Sentry) e métricas básicas (Lighthouse/Scores).

Plano de implementação sugerido (roadmap curto)

1. Ajustar roteamento para App Router e remover React Router (se presente).
2. Implementar persistência do carrinho e integração básica com Stripe (modo test).
3. Criar painel admin mínimo e endpoints protegidos.
4. Cobrir fluxos críticos com Cypress e adicionar testes unitários com Vitest.
5. Documentar no `README.md` e fazer deploy na Vercel.

Como apresentar na entrevista

- Explique a escolha do App Router e Server Components (benefícios de SSR/ISR e simplicidade de roteamento).
- Mostre o fluxo de checkout funcionando (modo test) e como os webhooks são tratados.
- Destaque decisões arquiteturais no `README.md` e métricas de performance.

Se quiser, aplico essa versão diretamente no arquivo ou adapto o tom/nível de detalhe para um README de apresentação.
