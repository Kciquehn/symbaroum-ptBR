# Symbaroum PT-BR — instruções do projeto

## Objetivo

Este repositório é uma camada de localização para o Babele/Foundry VTT. O trabalho não é produzir uma tradução nova: é transcrever para os arquivos Babele o texto oficial em português brasileiro publicado pela Tria Editora.

## Fontes e limites

- Use como autoridade textual somente os livros oficiais em PT-BR disponíveis localmente em `Livros em ptbr/` ou trechos fornecidos pelo usuário.
- Não traduza livremente, não parafraseie e não complete texto ausente por conta própria.
- Se o trecho oficial não puder ser localizado ou sua correspondência estiver ambígua, mantenha o conteúdo inalterado e informe a pendência.
- `Livros em ptbr/` é material privado de consulta. Nunca remova essa pasta do `.gitignore`, nunca a adicione ao Git e nunca gere cópias dos livros dentro de pastas rastreadas.
- Nunca edite os módulos oficiais `symbaroum-corerules`, `symbaroum-gmg`, `symbaroum-monstercodex` ou outros módulos de conteúdo. Edite somente este módulo de tradução.

## Regras do Babele

- Os arquivos de tradução ficam em `compendium/pt-BR/` e seguem o padrão `<id-do-módulo>.<id-do-pack>.json`.
- As chaves de `entries` e das coleções internas identificam o conteúdo inglês de origem. Preserve-as exatamente, inclusive maiúsculas, espaços, hífens e texto entre parênteses.
- Traduza apenas os valores mapeados, como `name`, `description`, `race`, `tokenName`, `noviceDescription`, `text` etc.
- Itens incorporados em atores são documentos próprios. Traduza-os dentro de `actors.<ator inglês>.items.<item inglês>`, mesmo quando já exista uma tradução igual na coleção superior `items`.
- Reutilize texto do Core Rules em outro compêndio somente quando o item e sua regra forem realmente equivalentes. Variantes devem conservar sua chave própria e usar o texto oficial correspondente.
- Preserve HTML, links `@UUID[...]`, imagens, tabelas, estrutura de páginas e dados mecânicos. Altere somente o conteúdo coberto pela edição oficial em PT-BR.
- Não renomeie, reorganize ou normalize chaves sem conferir o documento inglês de origem.

## Verificação obrigatória

- Validar todo JSON alterado.
- Confirmar que as chaves inglesas e a quantidade de documentos não mudaram acidentalmente.
- Conferir itens incorporados separadamente dos itens de nível superior.
- Preservar tags HTML e referências do Foundry.
- Executar os validadores relevantes em `scripts/` e `git diff --check`.
- Não criar commit, enviar ao GitHub ou modificar arquivos não relacionados sem pedido explícito do usuário.

Consulte `docs/fluxo-traducao-babele.md` para a anatomia detalhada dos arquivos e o fluxo de trabalho.
