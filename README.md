# Sinal Zero — Auditoria técnica

Atualizado em 04/09/2026 às 10:39:28 (UTC−03:00).

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

- [x] **Favoritos por usuário:** falhas transitórias de sincronização não geram exceção não tratada no navegador nem removem leads locais. A interface passa a informar o modo local seguro e uma nova montagem tenta a sincronização novamente.
  - Arquivos: `src/lib/saved-leads.ts`, `src/components/sinal-zero/SavedLeadsDrawer.tsx`, `src/components/sinal-zero/MobileActions.tsx`.
  - Validação: a reprodução em produção detectou a falha de sincronização; políticas RLS e privilégios da tabela `saved_leads` foram confirmados no Supabase. TypeScript, lint e build de produção concluídos após o fallback. No deploy `dpl_AvHgmEmRegEcaDYxbrtW2dVydYks` (`READY` e associado a `zero-sinal.vercel.app`), uma recarga exibiu “Salvos neste dispositivo; tentaremos sincronizar novamente”, sem nova exceção no navegador.

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

- [x] **Validação combinada em produção:** selecionadas todas as 44 categorias, os sinais Zero, Fraco e Médio, WhatsApp, Instagram e “sem site”. A busca estadual de Santa Catarina carregou 150 estabelecimentos; a combinação de filtros apresentou 13 resultados qualificados, sem indisponibilidade da fonte.
  - Arquivos: `src/routes/index.tsx`, `src/lib/geo.functions.ts`, `src/lib/overpass-query.ts`.
  - Validação: navegação real em `zero-sinal.vercel.app` em 04/09/2026 às 09:03 (UTC−03:00); a opção estadual foi apresentada como `Estado · Santa Catarina — SC` e a interface manteve os filtros ativos corretamente.

- [x] **Sincronização de leads em produção:** identificado que o Vercel usa o projeto Supabase `SinalZero` (`joydvnprmnorozfihncr`), que ainda não tinha a tabela `saved_leads`. A tabela, índice, RLS, políticas por usuário e privilégios autenticados foram aplicados via migração idempotente e o cache do PostgREST foi recarregado.
  - Arquivo: `supabase/migrations/20260904143000_create_saved_leads_production_table.sql`.
  - Validação: a sessão autenticada existente sincronizou 2 leads; consulta administrativa confirmou `2` registros de `1` usuário e o navegador deixou de registrar `PGRST205`/modo local. Nenhum e-mail, senha ou token foi gravado no repositório.

- [x] **Fontes e cobertura de busca:** fallback sequencial entre espelhos Overpass e consultas municipais agrupadas reduzem bloqueios e ampliam a cobertura sem disparar requisições paralelas agressivas.
  - Arquivos: `src/lib/geo.server.ts`, `src/lib/geo.functions.ts`, `src/lib/overpass-query.ts`.
  - Validação: busca real em Gaspar, SC retornou 27 estabelecimentos após o deploy `dpl_5CSU4FynHZxEicVCq2u2FPGu9BFs` (`READY`); sem mensagem de indisponibilidade. A estratégia segue as recomendações de uso de instâncias públicas do [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API).

- [x] **Identidade visual e nitidez:** tokens de texto laranja corrigidos no runtime; marca superior preserva a exceção branca solicitada e o radar permanece sem desfoque.
  - Arquivo: `src/styles.css`.
  - Validação: inspeção visual em produção após o deploy `dpl_5CSU4FynHZxEicVCq2u2FPGu9BFs`, com texto de conteúdo laranja e geometria do radar nítida.

- [x] **Mitigação local para senhas comprometidas:** o cadastro exige 12+ caracteres com maiúscula, minúscula, número e símbolo e bloqueia padrões comuns sem enviar a senha para serviços externos.
  - Arquivos: `src/lib/password-security.ts`, `src/routes/auth.tsx`.
  - Validação: TypeScript, lint e build de produção concluídos; nenhuma credencial foi registrada.

## Configuração administrada externamente

- [ ] **Proteção contra senhas vazadas do Supabase Auth:** o advisor de segurança confirmou que a proteção contra senhas comprometidas está desativada. Ela precisa ser habilitada no painel administrativo do Supabase Auth; não há endpoint disponível no conector para aplicar essa opção. Referência: `auth_leaked_password_protection`.

`PENDÊNCIAS ABERTAS = 1`

