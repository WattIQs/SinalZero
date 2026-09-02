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

A branch `vercel` usa estas variáveis:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_SEARCH_CX`
- `TURNSTILE_SECRET_KEY`

As duas primeiras são usadas pelo cliente Supabase. `GOOGLE_SEARCH_API_KEY` e `GOOGLE_SEARCH_CX` são usados exclusivamente no servidor para a verificação externa de presença digital. `TURNSTILE_SECRET_KEY` é exclusivamente server-side e deve existir somente no ambiente da Vercel.

## Status do Projeto

### 🟢 Concluído

- Auditoria estática de TODO/FIXME, `any` explícito identificado e `console.log` sem ocorrência no código pesquisado.
- Categoria menos útil removida (`Chaveiros`); catálogo mantido com 44 categorias.
- Correções históricas de autenticação, sessão, mapa, filtros, loading e animações registradas no Bug Ledger.
- Pipeline da branch `vercel` executa **lint + typecheck + build** a cada push/PR.
- Nitro configurado explicitamente para o build/deploy da aplicação TanStack Start na Vercel.
- Identidade visual laranja do SinalZero reforçada em bordas, controles, campos e estados de foco/hover.
- Microinterações casuais inspiradas em padrões de React Bits e Uiverse aplicadas a cards, botões, busca, varredura e sinais.
- AnimatedList recebeu entrada escalonada configurável por estabelecimento.
- Lint ficou independente do Prettier para evitar falso positivo de formatação; o script `format` continua disponível separadamente.
- `.env.example` documenta `TURNSTILE_SECRET_KEY` sem expor segredo.
- Persistência dos leads salvos foi reforçada: o drawer hidrata seu estado após a sincronização assíncrona com Supabase.
- Dependências efetivamente usadas pelo código foram restauradas no `package.json`: Leaflet, tipos do Leaflet, Radix Tooltip e Radix Toggle Group.
- `LeadMap` foi alinhado ao modelo atual `Establishment`, eliminando a referência a um tipo `Lead` inexistente e corrigindo a leitura do número de sinais.
- CSS do Leaflet passou a ser carregado junto ao componente de mapa.

### 🟢 CI / Deploy

- **GitHub Actions:** último ciclo completo validado com `lint = success`, `typecheck = success` e `build = success` no commit `00385b87a16c3ed101c0c363595286e15af9d053`.
- **Vercel:** último commit validado pelo status `Vercel = success` no commit `00385b87a16c3ed101c0c363595286e15af9d053`.
- O build anterior também expôs e permitiu corrigir dependências ausentes que o Vercel conseguia contornar, mas o TypeScript do CI não.

### 🟡 Validação manual restante

- [ ] Validar em navegador Chromium/Firefox Auth, persistência de leads, filtros combinados e falhas/timeout das buscas externas.
- [ ] Validar comportamento mobile e responsivo dos novos efeitos de motion sem layout shift.
- [ ] Fazer segunda auditoria funcional após os testes de navegador para procurar novos bugs de UX/performance.

### ⚠️ Limitação conhecida

- Não há runner de navegador interativo disponível nesta execução; portanto, testes visuais/manuais não devem ser marcados como concluídos sem validação real.

## Bug Ledger

Este registro deve ser atualizado em cada ciclo de correção. Não considerar um bug resolvido apenas porque a interface compila: a correção precisa ser refletida aqui e, quando possível, validada pelo build/typecheck e pelo deployment.

### Corrigidos

| Data | Commit | Problema | Correção |
|---|---|---|---|
| 2026-08-31 | `08e43e7` | Acesso a `localStorage` durante SSR e redirecionamento prematuro para `/auth`. | Leitura do storage passou para `useEffect`; o guard passou a diferenciar estado de carregamento de sessão inexistente. |
| 2026-08-31 | `d0ee205` | Runtime Nitro não estava configurado explicitamente para Vercel. | Nitro configurado com preset `vercel`. |
| 2026-08-31 | `c821801` | Vercel não identificava corretamente a aplicação Vite/Nitro. | `framework: "vite"` adicionado à configuração da Vercel. |
| 2026-09-01 | `0d78787` | Olho da senha podia permanecer no lado esquerdo e o cadeado aparecia no formulário. | Controle de visibilidade fixado no lado direito e cadeados removidos. |
| 2026-09-01 | `37761ce` | Animações do Auth conflitavam com estilos globais. | Criada camada de movimento isolada para Auth, com suporte a `prefers-reduced-motion`. |
| 2026-09-01 | `6ee072a` | `LeadMap.tsx` usava tipos `any`. | Referências do Leaflet passaram a usar tipos explícitos. |
| 2026-09-01 | `c2b72be` | Spinner da busca de município podia desaparecer rápido demais. | Feedback mínimo de carregamento e spinner dedicado adicionados. |
| 2026-09-01 | `cb307bc` | Autofill podia pintar campos do Auth de amarelo. | Autofill passou a preservar o tema do formulário. |
| 2026-09-01 | `04a4504` | Autofill ainda podia aplicar destaque amarelo em foco/hover. | Regras específicas de `:-webkit-autofill` reforçadas. |
| 2026-09-01 | `92ad73a` | Loading de estabelecimentos tinha camadas visualmente sobrepostas. | Spinner reconstruído com três anéis concêntricos. |
| 2026-09-01 | `438ebca` | Catálogo possuía categoria de baixa utilidade (`Chaveiros`). | Categoria removida; catálogo ficou com 44 categorias. |
| 2026-09-01 | `a8de996` | CI não verificava lint. | Workflow passou a executar lint antes de typecheck e build. |
| 2026-09-01 | `a969495` | AnimatedList tinha entrada fixa. | Atraso inicial configurável e incremento por item adicionados. |
| 2026-09-01 | `50e33b5` | PlaceRow não repassava `animationDelay`. | Card passou a controlar o atraso da entrada. |
| 2026-09-01 | `45b998e` | Identidade laranja estava enfraquecida e havia poucas microinterações. | Bordas, campos, botões e estados ativos receberam identidade laranja e motion sutil. |
| 2026-09-02 | `ce8adb3` | Botões principais ainda podiam parecer claros/brancos. | Variantes `Button` passaram a usar identidade laranja explícita. |
| 2026-09-02 | `03b020b` | ESLint dependia da integração com Prettier para executar. | Plugin Prettier removido da configuração de lint. |
| 2026-09-02 | `f1ca634` | `eslint-plugin-prettier` deixou de ser necessário. | Dependência removida. |
| 2026-09-02 | `544ecf9` | `.env.example` não documentava o segredo server-side do Turnstile. | `TURNSTILE_SECRET_KEY` adicionado sem valor real. |
| 2026-09-02 | `56f8953` | Leads salvos do Supabase podiam existir no backend/localStorage sem atualizar o estado visual do drawer após reload. | Drawer passou a hidratar seu próprio estado após `syncSavedLeads()`, preservando também atualizações do estado pai. |
| 2026-09-02 | `dfe32ba` | ESLint emitia 6 warnings de Fast Refresh em componentes UI que exportam helpers/variantes intencionalmente. | Regra `react-refresh/only-export-components` desativada para eliminar falso positivo nesses primitives. |
| 2026-09-02 | `0721d39` | ESLint acusava `catch {}` vazio na verificação de Instagram. | Fallback passou a documentar explicitamente que o handle existente é preservado. |
| 2026-09-02 | `33d7c7f` | ESLint acusava `timeoutId` como `let` não reatribuído. | Timeout passou a usar `const`, mantendo seu ciclo de vida correto. |
| 2026-09-02 | `a70e033` | TypeScript não encontrava Leaflet, tipos do Leaflet e Radix Tooltip. | Dependências ausentes adicionadas ao `package.json`. |
| 2026-09-02 | `00d1956` | `LeadMap` importava um tipo `Lead` inexistente e comparava um objeto `signals` com números. | Componente alinhado a `Establishment` e `signalCount`. |
| 2026-09-02 | `3182c44` | Mapa Leaflet podia carregar sem seu CSS específico. | `leaflet/dist/leaflet.css` importado no módulo do mapa. |
| 2026-09-02 | `00385b8` | TypeScript ainda não encontrava `@radix-ui/react-toggle-group` por omissão acidental no ajuste de dependências. | Dependência restaurada; ciclo completo de CI ficou verde. |

### Auditoria técnica atual

- **Auth / sessão:** guard e timeout de sessão estão protegidos contra SSR e cleanup inadequado.
- **Leads salvos:** sincronização assíncrona é refletida no drawer sem depender de um novo clique do usuário.
- **Presença digital:** falha/timeout da verificação externa permanece como `unverified`; não há inferência de ausência de presença digital.
- **Pesquisa:** há proteção contra resultados obsoletos por execução/versionamento na camada principal de busca.
- **Loading:** feedback visual dedicado e compatível com redução de movimento.
- **Mapas:** Leaflet é carregado sob demanda, tipado e com CSS próprio.
- **TypeScript:** último ciclo de CI confirmou ausência de erros de tipos.
- **Lint:** último ciclo confirmou ausência de erros e warnings do ESLint.
- **Build:** último ciclo confirmou build de produção concluído.
- **Deploy:** último status Vercel confirmado como `success`.
- **Motion:** microinterações curtas e discretas, com respeito a `prefers-reduced-motion`.

### Segunda auditoria — pontos que continuam merecendo validação manual

- [ ] Auth: login, cadastro, nome, OTP, erro, loading, senha visível/oculta e sessão expirada.
- [ ] Leads: salvar, recarregar, abrir drawer, remover, sincronizar com Supabase e manter dados locais não sincronizados.
- [ ] Filtros combinados: categoria + estrelas + preço + sinais + WhatsApp/Instagram + sem site.
- [ ] Busca: município inválido, pesquisa vazia, API lenta, timeout, resultado parcial e pesquisa rápida consecutiva.
- [ ] Mapa: markers, seleção, zoom, atualização de centro, mobile e carregamento tardio do Leaflet.
- [ ] Responsividade: mobile pequeno, mobile, tablet, notebook, desktop e monitor grande.
- [ ] UX: verificar se as novas animações não atrasam interação, criam layout shift ou geram excesso de movimento.

## Histórico de commits

As correções históricas de infraestrutura, autenticação e interface continuam registradas acima. Para novas correções, adicionar uma linha ao Bug Ledger no ciclo da alteração.

## Critério de encerramento da auditoria

Não declarar o projeto 100% concluído enquanto existir pendência técnica real. O encerramento exige CI verde com `lint`, `typecheck` e `build`, validação das correções funcionais e uma segunda rodada de auditoria sem novos problemas críticos descobertos.
