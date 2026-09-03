# Sinal Zero — Auditoria técnica

Atualizado em 03/09/2026.

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

## Configuração administrada externamente

- A proteção contra senhas vazadas do Supabase é uma opção exclusiva do painel administrativo de Auth e não faz parte do código, banco ou deploy deste repositório. Ela permanece documentada como recomendação operacional do proprietário do projeto.

`PENDÊNCIAS ABERTAS = 0`
