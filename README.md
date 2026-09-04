# Sinal Zero — Auditoria técnica

Atualizado em 03/09/2026 às 23:33:00 (UTC−03:00).

## Itens concluídos

- [x] **Radar de pesquisa:** corrigida a estrutura flexível da tela e ancorada a sobreposição na área de resultados. O estado “Pesquisando a área” ocupa toda a caixa de resultados, inclusive em telas largas, e não deixa faixa vazia abaixo da animação.
  - Arquivos: `src/routes/index.tsx`, `src/components/sinal-zero/AreaSearchRadar.tsx`.
  - Validação: busca autenticada em produção em Gaspar, SC retornou 343 estabelecimentos; a animação ocupou a área completa e a grade foi restaurada ao fim. Busca em São Paulo, SP retornou 900 resultados.

- [x] **Interação e acessibilidade do carregamento:** a sobreposição informa o estado por `role=status`, respeita a preferência de redução de movimento e mantém o conteúdo de resultados protegido enquanto há pesquisa ou verificação.
  - Arquivos: `src/routes/index.tsx`, `src/components/sinal-zero/AreaSearchRadar.tsx`.
  - Validação: inspeção visual em produção e revisão dos fluxos de busca e filtro.

- [x] **Acabamento e responsividade do radar:** restaurada a animação de painel inteiro. O feixe permanece dentro da geometria elíptica do radar, sem o recorte triangular que criava artefatos nos cantos; regras próprias para tela estreita preservam o enquadramento em celular.
  - Arquivo: `src/components/sinal-zero/AreaSearchRadar.tsx`.
  - Validação: TypeScript, lint e build de produção concluídos após a alteração.

- [x] **Animação de radar refinada:** removido o desfoque do campo; ampliado o campo, as ondas e o feixe do radar central para que a mesma varredura alcance os quatro cantos do painel, sem radares independentes nas pontas.
  - Arquivo: `src/components/sinal-zero/AreaSearchRadar.tsx`.
  - Validação: TypeScript, lint e build de produção concluídos após a alteração.

- [x] **Cadência avançada do radar:** GSAP sincroniza o feixe, o pulso do núcleo, o campo e os contatos detectados. A biblioteca é carregada dinamicamente somente durante a animação, preservando o carregamento inicial.
  - Arquivo: `src/components/sinal-zero/AreaSearchRadar.tsx`.
  - Validação: TypeScript, lint, build de produção e separação do arquivo de animação confirmados.

- [x] **Carregamento inicial:** removida uma exportação desnecessária da rota inicial que impedia sua divisão automática em arquivo separado. O pacote inicial passou de 529,80 kB para 444,97 kB sem compactação (167,86 kB para 141,02 kB compactado).
  - Arquivo: `src/routes/index.tsx`.
  - Validação: TypeScript, lint e build de produção concluídos; o aviso de divisão de código não reapareceu.

- [x] **Favoritos por usuário:** persistência sincronizada com retorno visual de sincronização ou modo local seguro; operações de favoritos passaram a propagar falha de sincronização para a interface.
  - Arquivos: `src/lib/saved-leads.ts`, `src/components/sinal-zero/SavedLeadsDrawer.tsx`.
  - Validação: revisão dos fluxos de leitura, gravação, remoção e fallback local.

- [x] **Segurança do Supabase:** RLS confirmada em todas as tabelas públicas; permissões públicas de função interna revogadas; acesso a favoritos limitado ao usuário autenticado; validações de formato e tamanho adicionadas aos dados gravados.
  - Arquivo: `supabase/migrations/20260902010000_harden_public_data_access.sql`.
  - Validação: políticas, privilégios e recomendações de segurança reconsultados no projeto Supabase.

- [x] **Desempenho do banco:** removido o índice redundante de `saved_leads.user_id`; o índice composto usado pela sincronização permanece.
  - Arquivo: `supabase/migrations/20260903020000_remove_redundant_saved_leads_user_index.sql`.
  - Validação: plano da consulta de sincronização e nova análise de desempenho do Supabase, sem recomendações pendentes.

- [x] **Qualidade e entrega:** TypeScript, lint e build de produção concluídos sem erros; implantação Vercel pronta e logs de build sem falhas ou vulnerabilidades de dependências reportadas.
  - Arquivos: projeto completo e `.github/workflows/build.yml`.
  - Validação: `pnpm typecheck`, `pnpm lint`, `pnpm build`, logs do deploy de produção.

- [x] **Validação final do radar GSAP em produção:** os arquivos foram publicados na branch `vercel`; o deploy de produção `dpl_3AjsMGMijpkqAAyZTvS7HL5Hobcn` ficou `READY`, está associado a `zero-sinal.vercel.app`, respondeu HTTP 200 e não apresentou erros de build nem de runtime nas últimas 24 horas.
  - Arquivos: `src/components/sinal-zero/AreaSearchRadar.tsx`, `README.md`.
  - Validação: build Vercel, disponibilidade pública, confirmação do carregamento dinâmico do GSAP e checagem de erros de runtime.

- [x] **Busca por estado:** a pesquisa agora sugere cada estado separado de municípios, com o rótulo `Estado · Nome`, e consulta o limite administrativo oficial do OpenStreetMap. A busca padrão estadual prioriza categorias de estabelecimentos com maior intenção comercial; categorias selecionadas continuam sendo respeitadas.
  - Arquivos: `src/lib/brazilian-states.ts`, `src/lib/overpass-query.ts`, `src/lib/geo.functions.ts`, `src/lib/geo.server.ts`, `src/components/sinal-zero/PlaceSearchBar.tsx`, `src/routes/index.tsx`.
  - Validação: `pnpm typecheck`, `pnpm lint` e publicação Vercel `dpl_HVA91JrxW9RGG9xg6ptLbKimv1jy` concluídos. Em produção, a opção `Estado · Santa Catarina` apareceu separada do município e a varredura estadual retornou 150 estabelecimentos distribuídos pelo estado.

- [x] **Estabilidade das fontes de estabelecimentos:** a busca padrão `Todas` deixou de gerar uma união excessivamente ampla de categorias em cidades densas, que podia ultrapassar o limite das fontes públicas. Agora ela usa uma seleção comercial de alta intenção; filtros de categoria mantêm consulta exata.
  - Arquivo: `src/lib/overpass-query.ts`.
  - Validação: `pnpm typecheck` e `pnpm lint` concluídos; nova reprodução pública em 03/09/2026 às 23:33 (UTC−03:00) selecionou `Estado · Santa Catarina` e retornou 150 estabelecimentos, sem a mensagem de indisponibilidade.

## Configuração administrada externamente

- [ ] **Proteção contra senhas vazadas do Supabase Auth:** o advisor de segurança confirmou que a proteção contra senhas comprometidas está desativada. Ela precisa ser habilitada no painel administrativo do Supabase Auth; não há endpoint disponível no conector para aplicar essa opção. Referência: `auth_leaked_password_protection`.

`PENDÊNCIAS ABERTAS = 1`

