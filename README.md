# Sinal Zero — Auditoria técnica

Atualizado em 03/09/2026.

## Itens concluídos

- [x] **Radar de pesquisa:** corrigida a estrutura flexível da tela e ancorada a sobreposição na área de resultados. O estado “Pesquisando a área” ocupa toda a caixa de resultados, inclusive em telas largas, e não deixa faixa vazia abaixo da animação.
  - Arquivos: `src/routes/index.tsx`, `src/components/sinal-zero/AreaSearchRadar.tsx`.
  - Validação: busca autenticada em produção em Gaspar, SC retornou 343 estabelecimentos; a animação ocupou a área completa e a grade foi restaurada ao fim. Busca em São Paulo, SP retornou 900 resultados.

- [x] **Interação e acessibilidade do carregamento:** a sobreposição informa o estado por `role=status`, respeita a preferência de redução de movimento e mantém o conteúdo de resultados protegido enquanto há pesquisa ou verificação.
  - Arquivos: `src/routes/index.tsx`, `src/components/sinal-zero/AreaSearchRadar.tsx`.
  - Validação: inspeção visual em produção e revisão dos fluxos de busca e filtro.

- [x] **Acabamento e responsividade do radar:** removido o recorte triangular do feixe e aplicada contenção circular dupla, impedindo artefatos nos cantos. A escala agora se adapta somente em telas muito estreitas, preservando os 96 px no layout normal.
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

## Pendência aberta

- [ ] **Proteção contra senhas vazadas do Supabase:** o verificador de segurança do próprio Supabase ainda indica que a proteção está desativada. A opção é uma configuração administrativa de Auth e não é exposta pelo conector disponível.
  - Ação necessária: ativar **Auth → Password Security → Leaked password protection** no painel do projeto Supabase.
  - Após a ativação: repetir a análise de segurança e finalizar este registro com `PENDÊNCIAS ABERTAS = 0`.

`PENDÊNCIAS ABERTAS = 1`
