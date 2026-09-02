# SinalZero

Prospecção inteligente de estabelecimentos, com busca geográfica, qualificação de presença digital, filtros e organização de leads.

## Desenvolvimento

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Variáveis de ambiente

A branch `vercel` usa `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `GOOGLE_SEARCH_API_KEY`, `GOOGLE_SEARCH_CX` e `TURNSTILE_SECRET_KEY`. O segredo do Turnstile é exclusivamente server-side.

## Status do projeto — auditoria técnica encerrada

### Concluído

- Auditoria estática de segurança, dependências, integrações legadas, sessão, leads salvos, busca, filtros, verificação externa, mapa e qualidade de código.
- Isolamento do cache local de leads por usuário.
- Rate limiting server-side para `searchPlacesServer`, `searchOverpassServer` e `verifyLeadsServer`.
- Validação estrutural dos lotes enviados à verificação externa.
- `zod` e `nitro` declarados diretamente no `package.json`.
- Telemetria e metadados legados do Lovable removidos do runtime/projeto.
- `LeadMap` tipado com `Establishment` e Leaflet carregado sob demanda.
- Ciclo de vida do mapa corrigido: atualização dos marcadores usa o módulo Leaflet carregado dinamicamente e a instância é removida no desmontagem.
- CSS do Leaflet carregado junto ao mapa.
- Categorias OSM refinadas e cobertura Overpass ampliada.
- Filtros, bordas, hovers, loading e motion revisados.
- Proteção CSRF existente mantida.
- RLS/ownership de `profiles` e `saved_leads` mantidos.
- Segunda auditoria estática concluída sem novo problema crítico que justificasse alteração.

## CI / Deploy

O commit atual `d379c4ef39de2267fb710d04321e7b102766fd64` passou por:

- `npm install` ✅
- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm run build` ✅
- Vercel ✅

## Bug Ledger

| Data | Commit | Problema | Correção |
|---|---|---|---|
| 2026-08-31 | `08e43e7` | `localStorage` durante SSR e redirect prematuro | Guard e leitura de storage corrigidos |
| 2026-08-31 | `d0ee205` | Nitro não configurado explicitamente | Preset Vercel configurado |
| 2026-08-31 | `c821801` | Vercel não identificava Vite/Nitro | `framework: "vite"` configurado |
| 2026-09-01 | `0d78787` | Controle de senha/cadeado no Auth | Layout do controle corrigido |
| 2026-09-01 | `37761ce` | Motion do Auth conflitava com estilos globais | Motion isolado e reduced-motion |
| 2026-09-01 | `6ee072a` | Tipos Leaflet inadequados | Tipos explícitos |
| 2026-09-01 | `c2b72be` | Spinner de município desaparecia rápido | Loading mínimo adicionado |
| 2026-09-01 | `cb307bc` / `04a4504` | Autofill amarelo | Estilos de autofill corrigidos |
| 2026-09-01 | `92ad73a` | Loading sobreposto | Spinner reconstruído |
| 2026-09-01 | `438ebca` | Categoria `Chaveiros` pouco útil | Categoria removida |
| 2026-09-01 | `a8de996` | CI sem lint | Lint adicionado ao workflow |
| 2026-09-01 | `a969495` / `50e33b5` | Entrada do AnimatedList fixa | Delay configurável por item |
| 2026-09-01 | `45b998e` | Identidade visual fraca | Bordas, estados e motion revisados |
| 2026-09-02 | `ce8adb3` | Botões claros/brancos | Identidade laranja reforçada |
| 2026-09-02 | `03b020b` / `f1ca634` | ESLint dependente do Prettier | Integração removida |
| 2026-09-02 | `544ecf9` | Turnstile ausente do `.env.example` | Documentação adicionada |
| 2026-09-02 | `56f8953` / `845bc5f` | Leads salvos dessincronizados/concorrentes | Hidratação e deduplicação |
| 2026-09-02 | `a70e033` / `00385b8` | Dependências/tipos ausentes | Dependências restauradas |
| 2026-09-02 | `00d1956` / `3182c44` | LeadMap e CSS Leaflet | Mapa alinhado e CSS carregado |
| 2026-09-02 | `5a3d3b4` / `1b85c75` / `703f87a` | Bordas, hovers e footprint visual | Contenção e identidade laranja |
| 2026-09-02 | `76a88d5` / `879baa2` | Cobertura/categorização OSM insuficiente | Mapeamentos e Overpass ampliados |
| 2026-09-02 | `e4991dc5` | Telemetria Lovable sem função | Runtime e módulo obsoleto removidos |
| 2026-09-02 | `d379c4e` | Ciclo de vida do Leaflet e limpeza de marcadores | Inicialização/atualização/desmontagem separadas |

## Decisões de engenharia

- Código desnecessário é removido, não mantido por inércia.
- Melhorias só entram quando trazem benefício real ao produto.
- Trabalho caro só é priorizado quando o retorno justifica o custo.
- Rate limiting atual é best-effort por instância; um limitador distribuído só deve ser adotado quando a escala justificar.
- Validação manual de navegador é uma atividade operacional externa e não é declarada como executada neste ambiente.

## Encerramento

**Não há pendências técnicas de código, CI, deploy ou auditoria registradas nesta rodada.**

A validação manual em navegador continua sendo uma atividade externa quando houver um runner disponível, sem ser falsamente marcada como concluída.
