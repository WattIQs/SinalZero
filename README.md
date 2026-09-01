# SinalZero

Prospecção inteligente de estabelecimentos, com busca geográfica, qualificação de presença digital, filtros e organização de leads.

## Desenvolvimento

```sh
npm install
npm run dev
```

Verificações obrigatórias antes de considerar uma alteração pronta:

```sh
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

## Bug Ledger

Este registro deve ser atualizado no mesmo commit de cada correção. Não considerar um bug resolvido apenas porque a interface compila: a correção precisa ser refletida aqui e, quando possível, validada pelo build/typecheck e pelo deployment.

### Corrigidos

| Data | Commit | Problema | Correção |
|---|---|---|---|
| 2026-08-31 | `08e43e7` | Acesso a `localStorage` durante SSR e redirecionamento prematuro para `/auth`. | Leitura do storage passou para `useEffect`; o guard passou a diferenciar estado de carregamento de sessão inexistente. |
| 2026-08-31 | `d0ee205` | Runtime Nitro não estava configurado explicitamente para Vercel. | Nitro configurado com preset `vercel`. |
| 2026-08-31 | `c821801` | Vercel não identificava corretamente a aplicação Vite/Nitro. | `framework: "vite"` adicionado à configuração da Vercel. |
| 2026-09-01 | `0d78787` | Olho da senha podia permanecer no lado esquerdo e o cadeado aparecia no formulário. | Controle de visibilidade fixado no lado direito e cadeados removidos. |
| 2026-09-01 | `37761ce` | Animações do Auth conflitavam com estilos globais e algumas classes de animação não tinham implementação própria. | Criada camada de movimento isolada para Auth, com entrada do card, revelação dos campos, órbitas, erro e suporte a `prefers-reduced-motion`. |
| 2026-09-01 | `6ee072a` | A animação global `.route-content-enter` era aplicada também ao Auth, empilhando transforms/filtros com as animações internas. | Rotas públicas `/auth` e `/auth/callback` passaram a usar um shell isolado, sem a animação global da aplicação. |

### Auditoria atual

- **Auth / animações:** corrigido o conflito entre a animação global da aplicação e as animações específicas do formulário.
- **Senha:** cadeado removido; olho preso à direita; área interna do input reservada para o controle.
- **Acessibilidade de movimento:** Auth respeita `prefers-reduced-motion`.
- **Sessão:** guard do aplicativo mantém estado de verificação separado do estado sem sessão.
- **Filtros:** filtros de classificação trabalham com valores exatos de 1 a 5 estrelas e filtros de presença são reaplicados sobre os resultados enriquecidos.
- **Presença digital:** a ausência de resposta da verificação externa não deve ser interpretada como ausência de presença digital.
- **Build:** o workflow do GitHub executa `typecheck` e `build` em `main` e `vercel`.

### Pendências técnicas identificadas para próximas revisões

- Validar visualmente cada estado do Auth em Chromium e Firefox: login, cadastro, etapa de nome, OTP, erro, loading e alternância mostrar/ocultar senha.
- Validar a persistência de leads salvos entre sessões e a sincronização entre `localStorage` e Supabase.
- Validar filtros combinados: categoria + estrelas + preço + sinais + WhatsApp/Instagram + sem site.
- Validar busca e verificação externa com respostas vazias, timeout, limite de API e dados incompletos do OpenStreetMap.

## Histórico de commits

As correções históricas de infraestrutura, autenticação e interface devem continuar registradas acima. Para novas correções, adicionar uma linha ao `Bug Ledger` no próprio commit que altera o código.
