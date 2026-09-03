# Sinal Zero — Registro de auditoria

Atualizado em 03/09/2026.

## Estado atual

- Concluído: radar de pesquisa cobre todo o painel de resultados em desktop e celular.
- Concluído: revisão dos commits recentes relacionados ao radar; havia variações que limitavam o carregamento a um cartão interno.
- Concluído: revisão de segurança do Supabase. RLS está ativo em todas as tabelas públicas e os favoritos continuam protegidos por usuário.
- Concluído: restringida a execução pública de uma função interna de verificação, reduzidas permissões SQL e adicionados limites de formato/tamanho para favoritos salvos.

## Alteração em validação

- O painel de resultados preenche a altura disponível.
- Durante pesquisa ou verificação, o radar é uma sobreposição da área inteira de resultados, sem altura fixa e sem deixar áreas de resultados expostas.
- A animação respeita redução de movimento configurada no dispositivo.

## Testes executados

- TypeScript sem erros.
- Lint sem erros.
- Build de produção concluído.
- Políticas RLS, privilégios de tabelas, função interna e restrições de favoritos confirmados no Supabase.
- Deploy de produção anterior confirmado como pronto na Vercel.
- Busca autenticada em produção concluída para São Paulo, SP: 900 estabelecimentos retornados; radar exibido por toda a área de resultados e grade restaurada ao final.
- Correção final de altura: a coluna de conteúdo agora ocupa explicitamente o espaço restante e o radar fica ancorado dentro dela; isso removeu a faixa vazia abaixo da animação observada em tela ampla.
- Busca autenticada em produção concluída para Gaspar, SC: 343 estabelecimentos retornados; radar ocupou toda a caixa de resultados até a borda inferior e a grade foi restaurada ao final.

## Histórico relevante revisado

- Ajustes anteriores do radar foram consolidados para evitar diferenças entre tamanhos de tela.
- A interface de favoritos informa sincronização concluída ou modo local seguro.

## Pendência de configuração externa

- A proteção contra senhas vazadas do Supabase permanece desativada no painel do provedor. Esta integração não possui permissão para alterar essa opção; ela deve ser ativada em Auth → Password Security.
