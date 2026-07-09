# Backlog de Histórias de Usuário — E-commerce (Next.js)

> Formato: **Como** [persona], **quero** [ação], **para que** [benefício].
> Cada história traz critérios de aceite (estilo Gherkin), prioridade (Alta/Média/Baixa) e uma estimativa de esforço (P/M/G) para você organizar sprints no seu portfólio.

---

## Épico 1 — Listagem de Produtos

### US 1.1 — Ver catálogo de produtos

**Como** visitante da loja,
**quero** ver uma lista de produtos disponíveis na página inicial,
**para que** eu possa explorar o que está à venda sem precisar buscar por algo específico.

**Critérios de aceite:**

- Dado que acesso a home, então vejo um grid de produtos com imagem, nome, preço e avaliação média.
- Se o produto estiver sem estoque, então um selo "Esgotado" é exibido sobre a imagem.
- A listagem deve carregar via Server Component, sem necessidade de JavaScript no cliente para exibir os dados iniciais.
- Enquanto os dados carregam, um skeleton loading é exibido (Suspense boundary).

**Prioridade:** Alta | **Estimativa:** M

---

### US 1.2 — Paginação / Infinite Scroll

**Como** visitante,
**quero** navegar entre páginas de produtos ou carregar mais itens ao rolar a tela,
**para que** eu não fique sobrecarregado com centenas de produtos de uma vez.

**Critérios de aceite:**

- Dado que existem mais de 20 produtos, então a listagem é paginada (ou usa infinite scroll com carregamento incremental).
- O número da página atual é refletido na URL (`?page=2`), permitindo compartilhar o link.
- Ao clicar em "carregar mais" ou rolar até o fim, um novo lote de produtos é buscado sem recarregar a página inteira.
- Se não houver mais produtos, um indicador "Você chegou ao fim" é exibido.

**Prioridade:** Média | **Estimativa:** M

---

### US 1.3 — Filtrar produtos por categoria, preço e avaliação

**Como** comprador,
**quero** filtrar os produtos por categoria, faixa de preço e nota mínima,
**para que** eu encontre mais rápido o que estou procurando.

**Critérios de aceite:**

- Dado que seleciono uma categoria, então apenas produtos dessa categoria são exibidos.
- Os filtros aplicados ficam refletidos na URL como query params (ex: `?categoria=eletronicos&preco_max=500`).
- É possível combinar múltiplos filtros simultaneamente.
- Existe um botão "Limpar filtros" que reseta a URL e a listagem.
- Se nenhum produto atender aos filtros, uma mensagem amigável de "nenhum resultado encontrado" é exibida.

**Prioridade:** Média | **Estimativa:** M

---

### US 1.4 — Ordenar produtos

**Como** comprador,
**quero** ordenar os produtos por preço (crescente/decrescente), relevância ou avaliação,
**para que** eu compare opções da forma que fizer mais sentido para mim.

**Critérios de aceite:**

- Existe um seletor de ordenação visível na listagem.
- A ordenação escolhida também é refletida na URL (`?sort=price_asc`).
- A troca de ordenação não recarrega a página inteira (apenas a lista é atualizada).

**Prioridade:** Baixa | **Estimativa:** P

---

## Épico 2 — Detalhes do Produto

### US 2.1 — Ver página de detalhes do produto

**Como** comprador,
**quero** ver informações completas de um produto (descrição, fotos, preço, estoque, avaliações),
**para que** eu tenha segurança na hora de decidir comprar.

**Critérios de aceite:**

- Dado que clico em um produto na listagem, sou levado para `/produtos/[slug]`.
- A página exibe: galeria de imagens, título, descrição, preço, quantidade em estoque, categoria e nota média.
- Se o produto não existir, uma página `not-found.tsx` customizada é exibida (HTTP 404).
- Metadados de SEO (title, description, Open Graph) são gerados dinamicamente por produto usando a Metadata API do Next.js.

**Prioridade:** Alta | **Estimativa:** M

---

### US 2.2 — Ver produtos relacionados

**Como** comprador,
**quero** ver sugestões de produtos parecidos ao que estou visualizando,
**para que** eu descubra outras opções sem precisar buscar novamente.

**Critérios de aceite:**

- Ao final da página de detalhes, uma seção "Você também pode gostar" exibe de 4 a 8 produtos da mesma categoria.
- Produtos esgotados podem aparecer, mas com indicação visual de indisponibilidade.

**Prioridade:** Baixa | **Estimativa:** P

---

### US 2.3 — Avaliar e comentar um produto

**Como** cliente que já comprou o produto,
**quero** deixar uma nota (1 a 5 estrelas) e um comentário,
**para que** eu compartilhe minha experiência com outros compradores.

**Critérios de aceite:**

- Apenas usuários autenticados podem avaliar.
- Um usuário só pode avaliar um produto que já constou em algum pedido finalizado dele.
- A nota média do produto é recalculada automaticamente após uma nova avaliação.
- Comentários passam por uma validação simples (tamanho mínimo/máximo, sem campos vazios).
- O autor da avaliação vê seu próprio nome/apelido junto ao comentário.

**Prioridade:** Média | **Estimativa:** G

---

## Épico 3 — Carrinho de Compras

### US 3.1 — Adicionar produto ao carrinho

**Como** comprador,
**quero** adicionar um produto ao carrinho a partir da listagem ou da página de detalhes,
**para que** eu possa comprá-lo mais tarde.

**Critérios de aceite:**

- Ao clicar em "Adicionar ao carrinho", um feedback visual (toast/notificação) confirma a ação.
- Se o produto já estiver no carrinho, a quantidade é incrementada em vez de duplicar o item.
- Não é possível adicionar quantidade maior que o estoque disponível.
- A ação é feita via Server Action, sem exigir um API Route separado.
- O ícone do carrinho no header atualiza o contador de itens imediatamente.

**Prioridade:** Alta | **Estimativa:** M

---

### US 3.2 — Visualizar e editar o carrinho

**Como** comprador,
**quero** ver todos os itens do meu carrinho e poder alterar quantidades ou remover produtos,
**para que** eu tenha controle total antes de fechar a compra.

**Critérios de aceite:**

- A página do carrinho lista produto, imagem, preço unitário, quantidade e subtotal por item.
- É possível aumentar/diminuir a quantidade com validação de estoque em tempo real.
- É possível remover um item individualmente, com confirmação.
- O valor total do carrinho é recalculado automaticamente a cada alteração.
- Se o carrinho estiver vazio, uma mensagem com CTA "Ver produtos" é exibida.

**Prioridade:** Alta | **Estimativa:** M

---

### US 3.3 — Persistência do carrinho

**Como** usuário (logado ou visitante),
**quero** que meu carrinho seja mantido mesmo se eu fechar o navegador,
**para que** eu não perca os itens selecionados.

**Critérios de aceite:**

- Para visitantes, o carrinho é salvo em `localStorage` (ou cookie).
- Para usuários logados, o carrinho é salvo no banco de dados, associado ao usuário.
- Ao fazer login com um carrinho de visitante ativo, os itens são mesclados com o carrinho salvo do usuário (sem duplicar).
- Ao fazer logout, o carrinho local não deve expor dados de outro usuário no mesmo navegador.

**Prioridade:** Média | **Estimativa:** G

---

### US 3.4 — Aplicar cupom de desconto

**Como** comprador,
**quero** inserir um código de cupom no carrinho,
**para que** eu obtenha um desconto no valor final da compra.

**Critérios de aceite:**

- Existe um campo para inserir o código do cupom na página do carrinho.
- Cupons inválidos ou expirados exibem mensagem de erro clara.
- Cupons válidos aplicam o desconto (percentual ou valor fixo) e atualizam o total exibido.
- Apenas um cupom pode estar ativo por vez.
- É possível remover o cupom aplicado.

**Prioridade:** Baixa | **Estimativa:** M

---

## Épico 4 — Busca

### US 4.1 — Buscar produtos por nome

**Como** comprador,
**quero** digitar um termo em uma barra de busca,
**para que** eu encontre rapidamente produtos específicos.

**Critérios de aceite:**

- A busca está disponível no header, acessível em todas as páginas.
- Os resultados aparecem em uma página dedicada `/busca?q=termo`, permitindo compartilhar o link.
- A busca considera nome e descrição do produto (case-insensitive, sem acentuação sensível).
- Se nenhum resultado for encontrado, uma mensagem amigável sugere termos alternativos ou categorias populares.

**Prioridade:** Alta | **Estimativa:** M

---

### US 4.2 — Sugestões de busca (autocomplete)

**Como** comprador,
**quero** ver sugestões de produtos enquanto digito na busca,
**para que** eu encontre o item mais rápido, sem precisar digitar o nome completo.

**Critérios de aceite:**

- Após 2-3 caracteres digitados, uma lista de até 5 sugestões aparece abaixo do campo de busca.
- As sugestões são "debounced" (não disparam uma requisição a cada tecla).
- É possível navegar pelas sugestões com o teclado (setas + Enter).
- Clicar em uma sugestão leva direto à página do produto.

**Prioridade:** Baixa | **Estimativa:** M

---

## Épico 5 — Autenticação e Conta do Usuário

### US 5.1 — Criar conta e fazer login

**Como** visitante,
**quero** criar uma conta ou entrar com login social (Google/GitHub),
**para que** eu tenha uma experiência personalizada e histórico de pedidos.

**Critérios de aceite:**

- É possível se cadastrar com e-mail/senha ou login social via NextAuth.js (Auth.js).
- Senhas são armazenadas com hash seguro (bcrypt/argon2), nunca em texto puro.
- Mensagens de erro claras para e-mail já cadastrado, senha fraca, ou credenciais inválidas.
- Após login, o usuário é redirecionado para a página que estava tentando acessar (ex: checkout).

**Prioridade:** Alta | **Estimativa:** G

---

### US 5.2 — Ver histórico de pedidos

**Como** cliente autenticado,
**quero** ver a lista dos meus pedidos anteriores e o status de cada um,
**para que** eu acompanhe minhas compras.

**Critérios de aceite:**

- A página "Meus Pedidos" lista pedidos com data, itens, valor total e status (processando, enviado, entregue, cancelado).
- Clicar em um pedido mostra os detalhes completos (itens, endereço de entrega, forma de pagamento usada).
- Usuários não autenticados são redirecionados para o login ao tentar acessar essa página.

**Prioridade:** Média | **Estimativa:** M

---

### US 5.3 — Gerenciar dados da conta

**Como** cliente autenticado,
**quero** editar meus dados pessoais e endereços de entrega,
**para que** minhas informações estejam sempre atualizadas para as compras.

**Critérios de aceite:**

- É possível editar nome, e-mail e adicionar/remover endereços de entrega.
- Alterações de e-mail exigem confirmação (ex: reenvio de verificação).
- Validações de formulário (CEP, campos obrigatórios) com mensagens claras de erro.

**Prioridade:** Baixa | **Estimativa:** M

---

## Épico 6 — Lista de Desejos (Wishlist)

### US 6.1 — Adicionar/remover produto da wishlist

**Como** cliente autenticado,
**quero** salvar produtos em uma lista de desejos,
**para que** eu possa comprá-los depois sem perder de vista.

**Critérios de aceite:**

- Um ícone de "coração" na listagem e nos detalhes do produto permite adicionar/remover da wishlist.
- O estado do ícone (preenchido/vazio) reflete se o produto já está na wishlist do usuário.
- A ação exige login; visitantes são convidados a se cadastrar/logar ao tentar usar a função.

**Prioridade:** Baixa | **Estimativa:** P

---

### US 6.2 — Visualizar wishlist

**Como** cliente autenticado,
**quero** ver todos os produtos que salvei na minha lista de desejos,
**para que** eu decida quando comprá-los.

**Critérios de aceite:**

- A página "Meus Favoritos" lista os produtos salvos com preço atual e disponibilidade.
- É possível mover um item da wishlist diretamente para o carrinho.
- Se um produto salvo for descontinuado, ele aparece com aviso "Produto indisponível".

**Prioridade:** Baixa | **Estimativa:** P

---

## Épico 7 — Checkout e Pagamento

### US 7.1 — Finalizar compra (checkout)

**Como** cliente com itens no carrinho,
**quero** revisar meu pedido, informar endereço e forma de pagamento,
**para que** eu conclua minha compra.

**Critérios de aceite:**

- O checkout é dividido em etapas claras: revisão do carrinho → endereço → pagamento → confirmação.
- É exigido login antes de iniciar o checkout (ou checkout como convidado, se essa opção for adotada).
- O resumo do pedido (itens, frete, desconto, total) fica visível durante todo o fluxo.
- Não é possível avançar de etapa com campos obrigatórios vazios ou inválidos.

**Prioridade:** Alta | **Estimativa:** G

---

### US 7.2 — Pagar com cartão via Stripe (modo teste)

**Como** cliente,
**quero** pagar meu pedido com cartão de crédito de forma segura,
**para que** eu finalize a compra sem sair do site.

**Critérios de aceite:**

- A integração usa Stripe em modo de teste (test mode), sem processar pagamentos reais.
- Dados de cartão nunca trafegam pelo backend da aplicação (uso do Stripe Elements/Checkout).
- Em caso de falha no pagamento, uma mensagem de erro específica é exibida (cartão recusado, dados inválidos etc.).
- Em caso de sucesso, o pedido muda de status para "Pago" via webhook do Stripe, e o usuário vê uma página de confirmação.

**Prioridade:** Alta | **Estimativa:** G

---

### US 7.3 — Receber confirmação do pedido

**Como** cliente que acabou de comprar,
**quero** ver uma página de confirmação com o número do pedido,
**para que** eu tenha certeza de que minha compra foi concluída.

**Critérios de aceite:**

- A página de confirmação exibe número do pedido, itens comprados, valor total e prazo estimado.
- Um resumo também fica disponível na página "Meus Pedidos" (ver US 5.2).
- (Opcional/avançado) Um e-mail de confirmação é enviado automaticamente.

**Prioridade:** Média | **Estimativa:** M

---

## Épico 8 — Administração (Painel Admin)

### US 8.1 — Gerenciar produtos (CRUD)

**Como** administrador,
**quero** criar, editar, e remover produtos do catálogo,
**para que** eu mantenha a loja sempre atualizada.

**Critérios de aceite:**

- Apenas usuários com papel "admin" acessam `/admin`; demais usuários recebem erro 403/redirecionamento.
- O formulário de produto valida campos obrigatórios (nome, preço, estoque, categoria, ao menos uma imagem).
- Produtos removidos não aparecem mais na listagem pública, mas pedidos antigos que os referenciam continuam íntegros (soft delete recomendado).
- Alterações de estoque refletem imediatamente na disponibilidade de compra.

**Prioridade:** Média | **Estimativa:** G

---

### US 8.2 — Gerenciar pedidos

**Como** administrador,
**quero** ver todos os pedidos da loja e atualizar seus status,
**para que** eu controle o fluxo de processamento e entrega.

**Critérios de aceite:**

- A listagem de pedidos permite filtrar por status e período.
- É possível alterar o status de um pedido (ex: de "processando" para "enviado").
- O cliente vê o novo status refletido em "Meus Pedidos" automaticamente.

**Prioridade:** Baixa | **Estimativa:** M

---

## Épico 9 — Qualidade, Performance e Confiabilidade

_(histórias técnicas, ótimas para mostrar maturidade de engenharia no portfólio)_

### US 9.1 — Cobertura de testes E2E dos fluxos críticos

**Como** desenvolvedor mantenedor do projeto,
**quero** ter testes automatizados (Cypress) cobrindo busca → produto → carrinho → checkout,
**para que** eu detecte regressões antes de publicar novas versões.

**Critérios de aceite:**

- Existe ao menos um teste E2E para cada fluxo crítico listado.
- Os testes rodam automaticamente em CI a cada Pull Request.
- Falhas de teste bloqueiam o merge do PR.

**Prioridade:** Alta | **Estimativa:** G

---

### US 9.2 — Pipeline de CI/CD

**Como** desenvolvedor mantenedor do projeto,
**quero** que lint, testes e build rodem automaticamente a cada push/PR,
**para que** eu garanta qualidade contínua sem depender de checagem manual.

**Critérios de aceite:**

- GitHub Actions executa: instalação de dependências, lint, testes unitários, testes E2E e build.
- O status do pipeline aparece visível no README (badge).
- Deploy automático na Vercel ocorre apenas se o pipeline passar com sucesso.

**Prioridade:** Alta | **Estimativa:** M

---

### US 9.3 — Performance e SEO

**Como** dono do produto (eu, para fins de portfólio),
**quero** que o site tenha bom desempenho e seja indexável por buscadores,
**para que** ele demonstre boas práticas de front-end profissional.

**Critérios de aceite:**

- Imagens de produto usam `next/image` com lazy loading.
- Metadados (title, description, Open Graph) são definidos dinamicamente por página.
- `sitemap.xml` e `robots.txt` são gerados automaticamente.
- Pontuação no Lighthouse (Performance, Acessibilidade, SEO, Boas Práticas) igual ou superior a 90 em cada categoria, documentada no README.

**Prioridade:** Média | **Estimativa:** M

---

### US 9.4 — Acessibilidade

**Como** usuário que depende de tecnologia assistiva,
**quero** navegar pelo site usando teclado e leitor de tela,
**para que** eu consiga comprar produtos com a mesma facilidade que qualquer outro usuário.

**Critérios de aceite:**

- Todos os elementos interativos (botões, links, campos) são acessíveis via `Tab` e possuem foco visível.
- Imagens possuem `alt` descritivo.
- Formulários possuem `label` associados corretamente aos campos.
- Contraste de cores atende ao mínimo AA do WCAG 2.1.

**Prioridade:** Média | **Estimativa:** M

---

### US 9.5 — Tratamento de erros e estados vazios

**Como** usuário,
**quero** ver mensagens claras quando algo dá errado ou não há dados,
**para que** eu entenda o que aconteceu e o que fazer a seguir.

**Critérios de aceite:**

- Erros inesperados são capturados por um `error.tsx` amigável, com opção de "Tentar novamente".
- Páginas/recursos não encontrados usam `not-found.tsx` customizado.
- Estados vazios (carrinho vazio, busca sem resultado, wishlist vazia) têm mensagens e CTAs próprios, evitando telas em branco.
- Erros críticos são reportados a uma ferramenta de monitoramento (ex: Sentry).

**Prioridade:** Média | **Estimativa:** P

---

## Resumo de priorização sugerida (roadmap)

| Sprint                   | Foco                      | Histórias                       |
| ------------------------ | ------------------------- | ------------------------------- |
| **1 — MVP**              | Fluxo básico de compra    | US 1.1, 2.1, 3.1, 3.2, 4.1      |
| **2 — Conta e Checkout** | Autenticação + pagamento  | US 5.1, 5.2, 7.1, 7.2, 7.3      |
| **3 — Descoberta**       | Busca e filtros avançados | US 1.2, 1.3, 1.4, 4.2           |
| **4 — Engajamento**      | Wishlist e avaliações     | US 2.3, 6.1, 6.2                |
| **5 — Gestão**           | Painel admin e cupons     | US 3.4, 8.1, 8.2                |
| **6 — Polimento**        | Qualidade e portfólio     | US 9.1, 9.2, 9.3, 9.4, 9.5, 5.3 |

Essa ordem prioriza primeiro um fluxo de compra funcional ponta a ponta (o que já impressiona em uma demo), depois vai adicionando profundidade técnica e refinamento — ótimo storytelling para explicar decisões em uma entrevista.
