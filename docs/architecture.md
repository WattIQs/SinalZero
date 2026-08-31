# Arquitetura — SinalZero

## Direção

O SinalZero será desenvolvido como um produto real, com frontend, autenticação, banco, políticas de acesso e contratos de API versionados separadamente.

## Camadas

- `app/`: aplicação web React/TypeScript baseada em Next.js App Router.
- `supabase/`: migrations SQL, RLS, seeds controlados e Edge Functions quando uma função de backend for melhor mantida no Supabase.
- `docs/`: decisões arquiteturais e contratos públicos da aplicação.

## Dados

O Postgres do Supabase é a fonte de verdade. A interface não poderá fabricar indicadores, clientes, unidades, consumos ou alertas para preencher telas.

Quando não houver registros reais para os filtros selecionados, a UI deverá exibir estado vazio explícito.

## Segurança

A sessão será validada no servidor. Dados protegidos não serão carregados apenas para depois serem escondidos no cliente. RLS será tratada como segunda camada obrigatória de autorização no banco.

## Sessão

A implementação usará cookies compatíveis com SSR para manter a sessão entre reloads e permitir que o servidor decida se uma rota protegida pode renderizar seus dados.

## API

Os contratos existentes serão adicionados incrementalmente em `docs/api-contract.md`. Nenhum campo antigo será removido ou renomeado sem decisão explícita.

## E-mail

A interface de e-mail ficará isolada em serviço próprio. Brevo será integrado posteriormente; esta etapa não envia mensagens.

## UI

A referência visual do produto anterior poderá orientar estética e comportamento, mas nenhum código do protótipo será tratado como base da nova aplicação. A experiência deverá usar skeletons estruturais, transições suaves e microinterações, com suporte a `prefers-reduced-motion`.
