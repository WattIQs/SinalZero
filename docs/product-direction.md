# Direção do produto — SinalZero

## Objetivo

O SinalZero é uma aplicação de prospecção comercial e caça de leads. A experiência principal é encontrar negócios em uma área, filtrar/qualificar sinais de presença digital e organizar leads salvos para prospecção.

## Referência funcional

O repositório `WattIQs/star-filter-fix` é a referência funcional e visual do produto. A reconstrução deve preservar o comportamento relevante, a linguagem visual, as animações, menus, filtros, mapa, lista de estabelecimentos, qualificação de sinais e leads salvos, mas o código do SinalZero continua sendo uma implementação nova.

A referência atual contém, entre outros elementos, busca geográfica, filtros por categoria e presença digital, mapa, lista de estabelecimentos, badge de sinal, painel de leads salvos e componentes responsivos para mobile. O repositório também contém estilos de HUD/motion e uma biblioteca de componentes UI que servirão como referência visual/funcional. 

## Dados

Dados de estabelecimentos e contatos devem ser obtidos de fontes reais/integradas. Nenhum lead fictício será inserido para preencher a interface.

Quando não houver dados, mostrar um estado vazio explícito.

## Autenticação

A nova implementação usará Supabase Auth com sessão persistente por cookie/SSR. Cadastro, login, logout, recuperação de senha e verificação de e-mail serão reais.

## Remoção de legado

Não serão carregados para o SinalZero arquivos `.lovable`, configurações do Lovable, scripts de backend herdados ou branding/configuração de hospedagem do projeto de referência.
