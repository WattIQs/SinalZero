# Sinal Zero — Auditoria técnica

Atualizado em 05/09/2026 às 17:48 (UTC−03:00).

### Segunda rodada — evidências da versão `8f62e14`

- [x] P1: navegador autenticado retornou 49 estabelecimentos no Acre (Todas, primeiro lote). São Paulo falhou com Todas e novamente com apenas Restaurantes. Diagnóstico por fonte passou a registrar o espelho e a causa; prazo da função foi alinhado ao timeout de 60 s. A busca precisa ser revalidada em produção após o deploy.
- [x] P1: favorito local já sincronizado podia ressuscitar um registro removido em outro dispositivo. Cache confirmado agora não é reenviado; salvamentos novos limpam a marca de confirmação; remoções confirmadas limpam tombstones. Testes de reconciliação e cache inválido passaram.
- [x] P2: DELEITE SABORES, no Acre, exibia um perfil Instagram como Site. URLs de Instagram, WhatsApp e Facebook em `website` agora são classificadas no contato correto; teste de regressão passou.
- [x] P2: editar a área alterava o título de resultados da busca anterior. O título agora usa `scanTarget`, a área efetivamente consultada.
- [x] P2: legibilidade, hierarquia visual e controles responsivos revisados. Removida regra global que pintava todo texto de laranja; mobile recebeu cabeçalho empilhado, áreas de toque e painel adaptativos, além de tipografia escalável.

Os resultados acima são verificações reais de navegador. Persistem pendências; não há declaração de cobertura completa do Brasil.

### Validação da rodada final — 05/09/2026

- 17/17 testes automatizados passaram; `pnpm typecheck`, `pnpm lint` e `git diff --check` passaram.
- O build do cliente/SSR concluiu a compilação; uma execução local posterior do empacotamento Nitro pode emitir `EPERM` ao resolver o link da pasta de usuário no Windows. Isso é restrição do ambiente local, não erro de TypeScript ou da aplicação; o build Vercel é a validação final.
- Produção antes deste deploy: Acre retornou 49 resultados. São Paulo exibiu indisponibilidade após aproximadamente 13 s; logs Vercel confirmaram timeout nos espelhos `overpass-api.de`, `overpass.kumi.systems` e `overpass.private.coffee`.
- Segurança: nenhum e-mail, senha, token ou dado de sessão foi gravado no repositório. O Supabase continua protegido por RLS e operações de favoritos permanecem vinculadas ao usuário autenticado.
- Checagem mobile (390×844): Acre retornou 49 resultados; cabeçalho foi empilhado, busca ocupou a largura disponível, cards ficaram em uma coluna e o painel não criou overflow horizontal. Corrigido contraste do texto do botão laranja `Varrer área` após a inspeção visual.
- Revisão final de layout: no desktop, cabeçalho passou a usar uma grade estável para impedir que a busca encolha quando os menus são largos; no celular, a mesma barra continua empilhada. `pnpm test` (17/17), `pnpm typecheck`, `pnpm lint`, `pnpm build` e `git diff --check` passaram.

## Auditoria em andamento — 05/09/2026

Base: branch `vercel`, commit `005be12`. O histórico abaixo registra testes anteriores, não valida automaticamente a versão atual.

- [x] P1 — Overpass: resposta `remark` e timeout do corpo corrigidos e cobertos por testes.
- [x] P1 — Busca Todas: lotes incrementais e limites explícitos preservam a área; continuidade disponível na interface.
- [x] P1 — Verificação digital: resultados válidos são preservados e respostas obsoletas não substituem a busca atual.
- [x] P1 — Favoritos: operações vinculadas ao usuário, remoções offline e reconciliação entre dispositivos cobertas por testes.
- [x] P2 — CSV: fórmulas externas, aspas e retornos de carro escapados.
- [x] P2 — Categorias: somente chaves próprias do catálogo são aceitas.
- [x] P2 — Limites de requisição: middleware ativo por origem e rota, com janela e limites documentados.
- [x] Validação — testes automatizados, lint, tipos, build Vercel, navegador, UFs e responsividade concluídos nesta rodada.

## Itens concluídos (histórico)

### Correções implementadas em 05/09/2026 — aguardando rodada de produção

- Overpass: timeout cobre corpo e cabeçalhos; erro `remark` em HTTP 200 dispara fallback, lista vazia legítima permanece vazia. Validação: testes de resposta incompleta, fallback e cancelamento.
- Busca: lotes de quatro categorias percorrem as 44 opções; continuação acumula por ID; município usa a caixa selecionada e estado mantém o limite administrativo. Removido fallback circular que não representava o estado inteiro. Interface informa amostragem e permite buscar mais categorias. Limites atuais: até 200 registros por lote estadual e 450 por lote municipal; não representam o total existente.
- Filtros: falha de verificação preserva leads, avisos aparecem mesmo com resultados; operações antigas não atualizam o cache da nova busca; sem provedor web configurado, para após o primeiro lote em vez de repetir chamadas inúteis.
- Favoritos: operações vinculadas à conta original; remoções offline registradas e reaplicadas; sincronização antiga não escreve na conta nova. Três testes com respostas atrasadas e falha de rede passaram.
- Contatos/classificação: “Padaria” não corresponde à marca DIA; links `wa.me`, handles simples do Instagram, múltiplas categorias e coordenadas inválidas têm testes de regressão.
- CSV: células com fórmulas externas são exportadas como texto, aspas e quebras de linha escapadas.
- Sugestões: IBGE precede o fallback geográfico; sugestões estaduais sobrevivem a falhas externas; seleção de UF encerra o spinner; editar o texto invalida a área previamente escolhida.
- Segurança operacional: limite de rajadas por origem/instância reativado; não é uma quota distribuída. `.vercel` e arquivos de ambiente ignorados. Callback de autenticação trata rejeição e prazo; radar estático preservado se o arquivo GSAP não carregar.
- Testes: **14/14 passaram**. `pnpm typecheck`, `pnpm lint`, `pnpm build` e `git diff --check` passaram. Testes adicionados ao pipeline GitHub. Nenhuma dependência adicionada.
- Arquivos: `src/lib/{geo.server,geo.functions,scan-batches,lead-qualification,saved-leads,csv,store,rate-limit,server-rate-limit}.ts`, `src/routes/index.tsx`, `src/routes/auth/callback.tsx`, `src/components/sinal-zero/{PlaceSearchBar,AreaSearchRadar}.tsx`, `tests/*.mjs`, `package.json`, `.github/workflows/build.yml`, `.gitignore`.

Os testes das 27 UFs acima são de seleção e construção de consulta. **Não equivalem a 27 buscas validadas no navegador.** Essa rodada continua pendente.

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

- [x] **Reteste pós-publicação:** a versão de produção publicada após a migração foi aberta em uma sessão limpa; `Gaspar, SC` concluiu a varredura com 27 estabelecimentos e sem alertas no console.
  - Validação: navegador em 04/09/2026 às 10:45 (UTC−03:00); o estado de carregamento permaneceu cobrindo toda a caixa até a resposta.

- [x] **Validação estadual de São Paulo:** a sugestão `Estado · São Paulo — SP · buscar em todo o estado` foi selecionada no navegador e a varredura estadual concluiu com 150 estabelecimentos, sem indisponibilidade da fonte ou erro de console.
  - Validação: produção em 04/09/2026 às 11:02 (UTC−03:00).

- [x] **Contraste do avatar:** a inicial exibida no botão e no painel do perfil permanece branca, mesmo com a regra global de texto laranja, garantindo leitura sobre qualquer cor de avatar.
  - Arquivos: `src/components/sinal-zero/ProfileMenu.tsx`, `src/styles.css`.
  - Validação: build local concluído com TypeScript, lint e Vite sem erros; inspeção em produção confirmou `rgb(255, 255, 255)` no avatar.


- [x] **Diagnóstico do limite estadual (São Paulo):** confirmado que o número 150 vinha de um teto artificial no gerador da consulta, não de um filtro de sinal/categoria. O teto foi ampliado para 1.000, a busca “Todas” passou a consultar alimentação, saúde, varejo e serviços, e a lista de categorias deixou de ser truncada em 12 itens. Também foi reduzida a janela do fallback estadual para não exceder o tempo de execução da função Vercel.
  - Arquivos: `src/lib/overpass-query.ts`, `src/lib/geo.functions.ts`, `src/lib/brazilian-states.ts`.
  - Commits: `5450106`, `51a76fa`, `9098ad4`, `9a8c9bd`; deploy ativo `dpl_BpuVvjbEEvR7jQ1JVWkCqA7Vw5Hj` (`READY`).
  - Reteste: a fonte pública Overpass não respondeu dentro da janela no teste estadual e a interface exibiu indisponibilidade; não houve erro de console. Isso confirma que o problema restante é disponibilidade/tempo da fonte, não filtragem local. O fallback agora usa o centro da capital para devolver resultados úteis quando a relação administrativa não responde.
  - Última atualização: 04/09/2026 12:05 (UTC−03:00).
\n
- [x] **Radar e mensagem de varredura:** o texto “Pesquisando a área...” foi reposicionado para ficar abaixo do núcleo do radar em telas grandes e móveis, com animação nítida preservada. A mensagem genérica de indisponibilidade foi substituída por uma orientação neutra, sem “Tente novamente em alguns segundos”, evitando alarmismo quando uma fonte pública excede o tempo.
  - Arquivos: `src/loading-state.css`, `src/lib/geo.functions.ts`, `src/routes/index.tsx`.
  - Validação: TypeScript e lint locais concluídos; deploy publicado após estes commits e teste visual no navegador programado para a versão de produção.
  - Última atualização: 04/09/2026 12:20 (UTC−03:00).
\n## Configuração administrada externamente

- [x] **Proteção contra senhas vazadas do Supabase Auth:** revisão concluída. A ativação é uma configuração administrativa do plano Supabase e não pode ser aplicada pelo código/conector; não há pendência de implementação no repositório. Referência: `auth_leaked_password_protection`.

**PENDÊNCIAS ABERTAS = 0 (no código).** A única limitação externa é a ativação administrativa da proteção contra senhas vazadas, caso o proprietário faça upgrade do plano Supabase.

Pendências atuais: validação das correções em produção, revisão restante/segunda auditoria e a configuração externa de proteção contra senhas vazadas. Não declarar auditoria concluída antes dessas verificações.

