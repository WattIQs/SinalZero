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
- Hover de `Varrer área` e controles de categoria/filtro foi contido para evitar expansão visual além do viewport.
- Bordas dos botões, popovers e controles críticos foram reforçadas para laranja, reduzindo o aspecto branco/brilhante anterior.
- Filtros de categoria passaram a usar mapeamentos OSM mais precisos para `healthcare`, `office` e `craft`, além de corrigir sobreposição indevida entre roupas, joalheria e supermercados.
- Busca Overpass passou a consultar mais fontes OSM relevantes para categorias profissionais e de serviços, melhorando cobertura e assertividade.
- Filtros de presença foram visualmente padronizados para deixar claro o estado ativo e preservar a combinação com demais filtros.
- Isolamento dos leads salvos por usuário e validação estrutural dos lotes de verificação foram reforçados no servidor.
- Rate limiting server-side foi aplicado às operações de busca, varredura e verificação externa.
- Dependências diretas `zod` e `nitro` foram declaradas para tornar o build determinístico.
- Código e metadados obsoletos específicos do Lovable foram removidos; o produto não depende dessa integração.
- `LeadMap` agora garante que os marcadores sejam renderizados somente depois que a instância Leaflet estiver efetivamente pronta, eliminando uma condição de corrida entre inicialização assíncrona e atualização dos marcadores.

### 🟢 CI / Deploy

- GitHub Actions da branch `vercel` confirmou **lint = success, typecheck = success e build = success** no commit `5f04d30ba027c713be5545e87104faa17c67bec7`.
- Vercel confirmou status **success** para o mesmo commit.
- O bloqueio histórico `build-rate-limit` foi tratado como limitação da plataforma/conta, não como falha de código.

### 🟢 Validação técnica desta rodada

- Auditoria estática de segurança, dependências, integrações externas, SSR, estado assíncrono e lifecycle do mapa foi concluída.
- Condição de corrida encontrada no lifecycle do Leaflet foi corrigida e validada pelo CI.
- Segunda rodada de auditoria técnica não encontrou novo problema crítico que justifique outra alteração imediata.

### ⚠️ Limitação conhecida

- Não há runner de navegador interativo disponível nesta execução. A validação visual manual em Chromium/Firefox permanece dependente de execução fora deste ambiente e não é usada como justificativa para afirmar que o navegador foi testado.
- O rate limiting atual é **best-effort por instância**; em Vercel serverless, buckets em memória não substituem um limitador distribuído quando a escala exigir isso.

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
| 2026-09-02 | `e4991dc5` | Código de telemetria de erros específico do Lovable permanecia no runtime apesar de a integração não fazer parte do produto. | Importação/chamada removidas do error boundary e módulo de telemetria obsoleto excluído. |
| 2026-09-02 | `5f04d30` | Divisão do lifecycle do Leaflet podia fazer a atualização dos marcadores ocorrer antes da inicialização assíncrona do mapa. | Estado `mapReady` passou a sincronizar a renderização dos marcadores com a criação efetiva da instância Leaflet. |

### Auditoria técnica atual

- **Auth / sessão:** guard e timeout de sessão estão protegidos contra SSR e cleanup inadequado.
- **Leads salvos:** sincronização assíncrona é refletida no drawer, chamadas concorrentes são deduplicadas e o cache local é isolado por usuário.
- **Presença digital:** falha/timeout da verificação externa permanece como `unverified`; não há inferência de ausência.
- **Pesquisa:** proteção contra resultados obsoletos por execução/versionamento permanece ativa.
- **Localização:** Nominatim + Photon continuam sendo usados com normalização, ranking, fuzzy matching, deduplicação e bounding box.
- **Categorias:** consultas específicas abrangem chaves OSM relevantes e o pós-processamento mantém correspondência com `CategoryKey`.
- **Filtros:** categoria, sinais, presença, classificação, preço e ordenação continuam combináveis; os controles foram visualmente reforçados.
- **Loading:** feedback visual dedicado e compatível com redução de movimento.
- **Mapas:** Leaflet é carregado sob demanda, tipado, com CSS próprio, cleanup no unmount e sincronização explícita de prontidão antes dos marcadores.
- **Segurança server-side:** CSRF explícito, validação estrutural dos lotes de verificação e rate limiting por operação estão ativos.
- **TypeScript/Lint/Build:** CI confirmou os três estágios verdes no último commit de código.
- **Motion:** microinterações são curtas, contidas e respeitam `prefers-reduced-motion`.
- **Integrações legadas:** telemetria específica do Lovable foi removida do runtime; o produto não depende dessa integração.

## 🔎 Auditoria de qualidade — 2026-09-02

A primeira auditoria encontrou pendências reais e elas foram tratadas no código. A segunda rodada técnica revisou as áreas de maior risco e não encontrou novo problema crítico que justifique outra alteração imediata.

### 🔴 P1 — Segurança / integridade — concluído

- [x] **Isolamento do cache local de leads por usuário.** Corrigido com chave versionada por `user_id` e sincronização do cache com o estado de autenticação.
- [x] **Proteção contra abuso dos RPCs de busca/verificação.** Adicionado rate limiting server-side por IP, com limites diferentes por operação.
- [x] **Validação estrutural do lote de leads enviado à verificação externa.** Adicionada validação de quantidade, identidade, coordenadas e estruturas essenciais antes de consumir a API externa.

### 🟡 P2 — Dependências / qualidade — concluído

- [x] **Zod usado pelo código sem declaração direta no `package.json`.** Dependência declarada diretamente.
- [x] **Nitro usado diretamente em `vite.config.ts` sem declaração no `package.json`.** Pacote Nitro declarado diretamente.
- [x] **Telemetria específica do Lovable sem função no produto.** Código de runtime e metadados obsoletos removidos.

### 🟢 Segunda auditoria — concluída

- [x] Revisão do lifecycle do Leaflet; condição de corrida encontrada e corrigida.
- [x] Revisão de SSR, sessão, localStorage, RPCs server-side e integrações externas.
- [x] Revisão de dependências diretas e pipeline de CI.
- [x] Revisão estática de TODO/FIXME, `any` explícito e `console.log`.
- [x] Revisão de limites de entrada, coordenadas, categorias e tamanho de lote.
- [x] CI final: lint, typecheck e build verdes.
- [x] Vercel final: status success no último commit de código.

## Critério de encerramento da auditoria

A auditoria técnica deste ciclo está encerrada: as pendências de código identificadas foram corrigidas, registradas no Bug Ledger e validadas pelo CI. A única limitação não executável neste ambiente é a inspeção manual em navegador interativo; ela permanece explicitamente documentada e não é apresentada como teste realizado.

## Auditoria complementar — 2026-09-02

### Etapa 01 — Build e deploy

- [x] Confirmada a divergência entre a documentação e a configuração: o Nitro iniciava com o preset `node-server`, embora a branch seja publicada na Vercel.
- [x] Corrigido `vite.config.ts` para usar o preset `vercel`, gerando o artefato `.vercel/output` adequado para a plataforma.
- [x] Validada a seleção do runtime Node.js 24 e do preset `vercel` no build local.
- [ ] Após o próximo deploy, confirmar no painel da Vercel que a produção está usando esse artefato. No momento da auditoria, `https://zero-sinal.vercel.app/auth` respondeu com a interface principal, sinal de que a publicação atual não corresponde integralmente à branch auditada.

### Etapa 02 — Segurança e robustez das APIs

- [x] Protegidos os Server Functions de busca e resolução de municípios com schemas Zod: entradas malformadas, vazias ou excessivamente longas passam a ser recusadas antes de chegarem a IBGE/Nominatim.
- [x] Mantidas as proteções existentes de CSRF, RLS, políticas por proprietário e validação do lote de verificação de leads.
- [x] Auditoria de dependências de produção executada sem vulnerabilidades conhecidas (`0` baixa, moderada, alta ou crítica).

### Etapa 03 — Frontend e qualidade

- [x] Corrigido o aviso de dependências do React no ciclo de vida do mapa, preservando a atualização do centro sem recriar a instância Leaflet.
- [x] `lint` e `typecheck` concluídos sem erros nem avisos.
- [x] Build compilou os bundles de cliente e SSR e iniciou a geração do artefato Vercel; o empacotamento final foi bloqueado pela restrição de `readlink` do ambiente de auditoria em `C:\\Users\\xingl`, fora do código do projeto.
- [ ] O Vite ainda informa um bundle inicial de aproximadamente 649 kB (207 kB gzip). A divisão desse bundle deve ser medida no deploy real antes de uma refatoração de carregamento sob demanda, para não trocar um alerta genérico por complexidade sem ganho comprovado.

### Etapa 04 — Reprodutibilidade do CI

- [x] O pipeline foi confirmado com sucesso no commit `20f019b` (execução #193). O único alerta residual era a execução interna em Node.js 20 de `actions/checkout@v4` e `actions/setup-node@v4`, já descontinuada pelo GitHub.
- [x] As actions foram atualizadas para versões compatíveis com Node.js 24 e o pipeline fixa explicitamente a versão do pnpm utilizada.
- [x] Adicionado lockfile do pnpm e substituído o `npm install` não determinístico por `pnpm install --frozen-lockfile`; cada execução passa a resolver exatamente o mesmo conjunto de dependências.
- [x] A primeira execução desta alteração revelou dois problemas do próprio pipeline: `pnpm/action-setup@v4` ainda dependia de Node.js 20 e o envio inicial do lockfile foi corrompido. A action foi removida em favor do Corepack nativo do Node 22 e o lockfile foi reenviado de forma íntegra.
- [x] Validação final: execução #195 do GitHub Actions concluída com sucesso, incluindo instalação congelada, lint, typecheck e build Vercel, sem o aviso de Node.js 20.

