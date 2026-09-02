# SinalZero

Prospecção inteligente de estabelecimentos, com busca geográfica, qualificação de presença digital, filtros e organização de leads.

## Desenvolvimento

```sh
npm install
npm run dev
```

Verificações obrigatórias antes de considerar uma alteração pronta:

```sh
npm run lint
npm run typecheck
npm run build
```

## Variáveis de ambiente

A branch `vercel` usa exatamente estas quatro variáveis:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_SEARCH_CX`

As duas primeiras são usadas pelo cliente Supabase. As duas últimas são usadas exclusivamente no servidor para a verificação externa de presença digital.

## Status do Projeto

### ✅ Concluído

- Auditoria estática de TODO/FIXME, `any` explícito identificado e `console.log` sem ocorrência no código pesquisado.
- Categoria menos útil removida (`Chaveiros`); catálogo mantido com 44 categorias.
- Correções históricas de autenticação, sessão, mapa, filtros, loading e animações registradas no Bug Ledger.
- Pipeline da branch `vercel` reforçado para executar **lint + typecheck + build** a cada push/PR.
- Deployment Vercel do commit anterior validado como `success`.
- Identidade visual laranja do SinalZero reforçada em bordas, controles, campos e estados de foco/hover.
- Microinterações casuais inspiradas em padrões de React Bits e Uiverse aplicadas a cards, botões, busca, varredura e sinais.
- AnimatedList recebeu entrada escalonada configurável por estabelecimento.

### 🟡 Em andamento

- Validação visual/interativa completa dos fluxos de Auth, filtros, leads salvos e respostas externas depende da execução em navegador com ambiente de execução disponível.

### 🔴 Pendente

- Executar e registrar o resultado real de `npm run lint`, `npm run typecheck` e `npm run build` após as alterações mais recentes.
- Testar manualmente em Chromium/Firefox os estados de Auth, persistência de leads, filtros combinados e falhas/timeout da busca externa.

### ⚠️ Problemas conhecidos

- Não há um runner de navegador interativo disponível nesta execução para declarar os testes visuais acima como concluídos.
- O CI agora executa lint, typecheck e build; o resultado do novo commit precisa ser observado após o GitHub Actions concluir.

## Bug Ledger

Este registro deve ser atualizado em cada ciclo de correção. Não considerar um bug resolvido apenas porque a interface compila: a correção precisa ser refletida aqui e, quando possível, validada pelo build/typecheck e pelo deployment.

### Corrigidos

| Data | Commit | Problema | Correção |
|---|---|---|---|
| 2026-08-31 | `08e43e7` | Acesso a `localStorage` durante SSR e redirecionamento prematuro para `/auth`. | Leitura do storage passou para `useEffect`; o guard passou a diferenciar estado de carregamento de sessão inexistente. |
| 2026-08-31 | `d0ee205` | Runtime Nitro não estava configurado explicitamente para Vercel. | Nitro configurado com preset `vercel`. |
| 2026-08-31 | `c821801` | Vercel não identificava corretamente a aplicação Vite/Nitro. | `framework: "vite"` adicionado à configuração da Vercel. |
| 2026-09-01 | `0d78787` | Olho da senha podia permanecer no lado esquerdo e o cadeado aparecia no formulário. | Controle de visibilidade fixado no lado direito e cadeados removidos. |
| 2026-09-01 | `37761ce` | Animações do Auth conflitavam com estilos globais e algumas classes de animação não tinham implementação própria. | Criada camada de movimento isolada para Auth, com entrada do card, revelação dos campos, órbitas, erro e suporte a `prefers-reduced-motion`. |
| 2026-09-01 | `6ee072a` | `LeadMap.tsx` usava tipos `any` apesar da regra de TypeScript estrito. | Referências do Leaflet passaram a usar `Map` e `Layer` tipados, eliminando os `any` soltos do componente. |
| 2026-09-01 | `c2b72be` | Spinner da busca de município podia desaparecer rápido demais para ser percebido. | Feedback mínimo de carregamento e spinner dedicado foram adicionados à busca. |
| 2026-09-01 | `cb307bc` | Autofill do navegador podia pintar os campos do Auth de amarelo e o controle de senha ainda podia parecer uma caixa separada. | Autofill passou a preservar o tema do formulário; controle de senha permanece integrado ao campo, sem fundo/borda próprios. |
| 2026-09-01 | `04a4504` | Autofill ainda podia ser aplicado com destaque amarelo pelo navegador em campos do Auth. | Regras específicas de `:-webkit-autofill` foram reforçadas para manter o fundo do tema e a cor do texto, inclusive durante foco/hover. |
| 2026-09-01 | `92ad73a` | Loading de estabelecimentos tinha camadas visualmente sobrepostas e pouco consistentes. | Spinner foi reconstruído com três anéis concêntricos independentes, centro estável, animações com velocidades diferentes e entrada/saída mais suave. |
| 2026-09-01 | `438ebca` | Catálogo possuía 45 categorias e uma categoria de baixa utilidade para o produto. | Removida `locksmith`/`Chaveiros`, deixando 44 categorias. |
| 2026-09-01 | `a8de996` | CI não verificava lint. | Workflow passou a executar lint antes de typecheck e build. |
| 2026-09-01 | `a969495` | AnimatedList tinha entrada fixa, limitando o escalonamento dos estabelecimentos. | Adicionado atraso inicial configurável e pequeno incremento por item. |
| 2026-09-01 | `50e33b5` | PlaceRow não repassava `animationDelay` para a animação dos resultados e mantinha import não utilizado. | `animationDelay` passou a controlar a entrada do card e o import não utilizado foi removido. |
| 2026-09-01 | `45b998e` | Identidade laranja estava visualmente enfraquecida e controles tinham poucas microinterações. | Bordas, campos, botões e estados ativos receberam identidade laranja; adicionados spotlight/sheens, respiração do radar, foco animado, hover de links e microinterações sutis inspiradas em React Bits/Uiverse. |

### Auditoria atual

- **Auth / animações:** conflito entre animação global da aplicação e animações específicas do formulário corrigido.
- **Senha:** olho preso à direita, integrado ao campo, sem caixa separadora.
- **Autofill:** campos do Auth não devem mais assumir fundo amarelo do navegador.
- **Acessibilidade de movimento:** Auth e loading respeitam `prefers-reduced-motion`.
- **Sessão:** guard do aplicativo mantém estado de verificação separado do estado sem sessão.
- **Pesquisa geográfica:** spinner próprio e feedback mínimo para buscas rápidas.
- **Loading de estabelecimentos:** três níveis concêntricos de carregamento com centro comum, tamanhos e velocidades independentes e sem overflow visual.
- **Hover:** transformações globais que faziam controles saírem do lugar foram removidas; efeitos usam sombra/brilho sem deslocamento.
- **Filtros:** filtros de classificação trabalham com valores exatos de 1 a 5 estrelas e filtros de presença são reaplicados sobre os resultados enriquecidos.
- **Presença digital:** a ausência de resposta da verificação externa não deve ser interpretada como ausência de presença digital.
- **TypeScript:** removido o uso explícito de `any` identificado no componente de mapa.
- **Categorias:** 44 categorias ativas após a remoção de Chaveiros.
- **CI:** lint, typecheck e build são executados automaticamente em `main` e `vercel`.
- **Identidade visual:** laranja voltou a ser a cor de destaque principal em bordas, ações e estados interativos.
- **Motion:** cards, busca, varredura, links e controles possuem microinterações curtas e discretas, com redução automática para usuários que preferem menos movimento.

### Pendências técnicas identificadas para próximas revisões

- Validar visualmente cada estado do Auth em Chromium e Firefox: login, cadastro, etapa de nome, OTP, erro, loading e alternância mostrar/ocultar senha.
- Validar a persistência de leads salvos entre sessões e a sincronização entre `localStorage` e Supabase.
- Validar filtros combinados: categoria + estrelas + preço + sinais + WhatsApp/Instagram + sem site.
- Validar busca e verificação externa com respostas vazias, timeout, limite de API e dados incompletos do OpenStreetMap.

## Histórico de commits

As correções históricas de infraestrutura, autenticação e interface devem continuar registradas acima. Para novas correções, adicionar uma linha ao Bug Ledger no ciclo da alteração que altera o código.
