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

### 🟢 Concluído no ciclo atual

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
- Sincronização de leads salvos passou a deduplicar chamadas concorrentes.
- Dependências efetivamente usadas pelo código foram restauradas no `package.json`: Leaflet, tipos do Leaflet, Radix Tooltip e Radix Toggle Group.
- `LeadMap` foi alinhado ao modelo atual `Establishment`, eliminando a referência a um tipo `Lead` inexistente e corrigindo a leitura do número de sinais.
- CSS do Leaflet passou a ser carregado junto ao componente de mapa.
- **Novo:** hover de `Varrer área` e controles de categoria/filtro foi contido para evitar expansão visual além do viewport.
- **Novo:** bordas dos botões, popovers e controles críticos foram reforçadas para laranja brilhante, reduzindo o aspecto branco/brilhante anterior.
- **Novo:** filtros de categoria passaram a usar mapeamentos OSM mais precisos para `healthcare`, `office` e `craft`, além de corrigir sobreposição indevida entre roupas, joalheria e supermercados.
- **Novo:** busca Overpass passou a consultar mais fontes OSM relevantes para categorias profissionais e de serviços, melhorando cobertura e acertividade.
- **Novo:** filtros de presença foram visualmente padronizados para deixar claro o estado ativo e preservar a combinação com demais filtros.

### 🟢 CI / Deploy

- Ciclos anteriores confirmaram `lint = success`, `typecheck = success` e `build = success`.
- O último commit de código anteriormente validado pela Vercel foi `00385b87a16c3ed101c0c363595286e15af9d053`.
- Um commit posterior somente de documentação teve GitHub Actions verde, enquanto a Vercel ficou bloqueada por `build-rate-limit`; isso é limitação de plataforma/conta e não falha de código.
- As alterações deste ciclo devem passar novamente pelo CI antes de serem consideradas encerradas.

### 🟡 Validação manual

- [x] Validação visual do usuário confirmou hovers ultrapassando limite e bordas brancas como problemas reais; ambos foram tratados neste ciclo.
- [ ] Revalidar no navegador Chromium/Firefox Auth, persistência de leads, filtros combinados e falhas/timeout das buscas externas.
- [ ] Revalidar comportamento mobile e responsivo dos novos efeitos de motion sem layout shift.
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
| 2026-09-02 | `56f8953` | Leads salvos do Supabase podiam existir no backend/localStorage sem atualizar o estado visual do drawer após reload. | Drawer passou a hidratar seu próprio estado após `syncSavedLeads()`. |
| 2026-09-02 | `dfe32ba` | ESLint emitia warnings de Fast Refresh em primitives de UI. | Regra `react-refresh/only-export-components` desativada nesses componentes. |
| 2026-09-02 | `a70e033` | TypeScript não encontrava Leaflet, tipos do Leaflet e Radix Tooltip. | Dependências ausentes adicionadas ao `package.json`. |
| 2026-09-02 | `00d1956` | `LeadMap` importava um tipo `Lead` inexistente. | Componente alinhado a `Establishment` e `signalCount`. |
| 2026-09-02 | `3182c44` | Mapa Leaflet podia carregar sem CSS próprio. | `leaflet/dist/leaflet.css` importado no módulo do mapa. |
| 2026-09-02 | `00385b8` | TypeScript não encontrava Toggle Group. | Dependência restaurada e CI ficou verde. |
| 2026-09-02 | `845bc5f` | Sincronizações simultâneas de leads salvos podiam repetir consulta/persistência. | `syncSavedLeads()` passou a compartilhar uma única Promise em voo. |
| 2026-09-02 | `5a3d3b4` | Bordas dos botões ainda tinham pouca presença laranja. | Variantes principais receberam bordas e sombras laranja mais fortes. |
| 2026-09-02 | `1b85c75` | Hover/controle de `Varrer área` podia criar expansão visual e os popovers ainda tinham borda pouco definida. | Contenção de largura/overflow, collision padding e bordas laranja reforçadas. |
| 2026-09-02 | `703f87a` | Filtros tinham bordas neutras/brancas e microanimações podiam aumentar o footprint visual. | Estados passaram a usar bordas laranja e transições sem deslocamento. |
| 2026-09-02 | `76a88d5` | Algumas categorias OSM eram amplas demais ou classificadas de forma imprecisa. | Mapeamentos refinados; supermercados e roupas ficaram mais específicos e healthcare/craft foram adicionados. |
| 2026-09-02 | `879baa2` | Busca por categoria não cobria fontes OSM de `healthcare`, `office` e `craft`. | Consulta Overpass ampliada mantendo blocos específicos por categoria. |

### Auditoria técnica atual

- **Auth / sessão:** guard e timeout de sessão estão protegidos contra SSR e cleanup inadequado.
- **Leads salvos:** sincronização assíncrona é refletida no drawer e chamadas concorrentes são deduplicadas.
- **Presença digital:** falha/timeout da verificação externa permanece como `unverified`; não há inferência de ausência.
- **Pesquisa:** proteção contra resultados obsoletos por execução/versionamento permanece ativa.
- **Localização:** Nominatim + Photon continuam sendo usados com normalização, ranking, fuzzy matching, deduplicação e bounding box.
- **Categorias:** consultas específicas agora abrangem mais chaves OSM e o pós-processamento mantém correspondência com `CategoryKey`.
- **Filtros:** categoria, sinais, presença, classificação, preço e ordenação continuam combináveis; os controles foram visualmente reforçados.
- **Loading:** feedback visual dedicado e compatível com redução de movimento.
- **Mapas:** Leaflet é carregado sob demanda, tipado e com CSS próprio.
- **TypeScript/Lint/Build:** devem ser reconfirmados no CI deste ciclo.
- **Motion:** microinterações são curtas, contidas e respeitam `prefers-reduced-motion`.

## Critério de encerramento da auditoria

Não declarar o projeto 100% concluído enquanto existir pendência técnica real. O encerramento exige CI verde com `lint`, `typecheck` e `build`, validação das correções funcionais e uma segunda rodada de auditoria sem novos problemas críticos descobertos.
