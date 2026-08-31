# SinalZero

Plataforma de monitoramento energético empresarial, reconstruída do zero como produto real. O repositório é independente do protótipo anterior `star-filter-fix`.

## Stack

- Frontend: React + TypeScript estrito + Tailwind CSS
- Framework: Next.js App Router — escolhido pela integração direta entre Server Components, cookies de sessão e proteção de rotas no servidor.
- Backend/DB: Supabase (Postgres, Auth, Storage e Edge Functions quando fizer sentido)
- Animações: Framer Motion
- E-mail: Brevo como ponto de extensão, sem envio implementado nesta etapa
- Código/versionamento: GitHub

## Estrutura

```text
/app          frontend React/Next.js
/supabase     migrations, RLS, seed e Edge Functions
/docs         arquitetura e contratos de API
```

## Regras do projeto

- Nenhum dado fictício será apresentado como real.
- Autenticação e autorização serão reais, não decorativas.
- RLS será aplicada desde as primeiras migrations e nenhuma tabela de negócio ficará sem policies.
- Contratos de API fornecidos do sistema anterior serão preservados exatamente, salvo decisão explícita após consulta.
- TypeScript estrito, sem `any` solto.
- Lovable e Base44 não fazem parte da implementação. Podem ser usados apenas como referência/ferramentação quando necessário.
- Não haverá deploy em Render ou Vercel neste estágio. O código será versionado no GitHub e o backend utilizará Supabase.

## Desenvolvimento local

Requisitos: Node.js LTS, npm, Git e Supabase CLI.

O bootstrap do frontend e os comandos definitivos de desenvolvimento serão adicionados na etapa de implementação do app.

## Supabase

As alterações do banco serão versionadas em `supabase/migrations`. O fluxo planejado para ambiente local é:

```bash
supabase start
supabase db reset
supabase db push
```

Credenciais e segredos nunca serão commitados. Use `.env.example` como referência para configuração local.

## Status

**Etapa 1 — fundação do repositório concluída.**

Próxima etapa: bootstrap do frontend e camada de configuração Supabase, antes da implementação das telas e do dashboard.
