# Symbaroum — Localização PT-BR para Foundry VTT

Módulo de localização em **português brasileiro** para os conteúdos oficiais de **Symbaroum RPG** no Foundry VTT, aplicado por meio do **Babele**.

Este projeto não produz traduções próprias dos textos de jogo. O trabalho consiste em localizar as chaves dos compêndios em inglês e aplicar os textos correspondentes das edições oficiais brasileiras publicadas pela **Tria Editora**.

As únicas exceções são o **System Guide** e a interface das **macros do sistema**, conteúdos técnicos do Foundry VTT que não possuem versão oficial em português. Esses textos são localizados pelo projeto com a terminologia oficial usada nos livros e no sistema.

> [!IMPORTANT]
> Este módulo não altera os módulos oficiais e não inclui livros, PDFs, imagens ou bancos de dados originais. Para utilizar cada conteúdo, é necessário possuir e instalar o respectivo módulo oficial.

> [!WARNING]
> A localização ainda está em desenvolvimento. Alguns registros continuam em inglês e os textos já inseridos ainda podem precisar de revisão de chaves, formatação ou consistência terminológica.

## Conteúdos atendidos

- **Core Rules:** Livro Básico e Guia Avançado do Jogador
- **Monster Codex:** Códice de Monstros
- **Adventure Collection:** Coletânea de Aventuras
- **Game Master's Guide:** Guia do Mestre
- **System Guide:** guia de utilização do sistema Symbaroum no Foundry VTT
- **System Macros:** pasta, nomes, diálogos, avisos e mensagens das macros incluídas no sistema

## Estado atual da localização

As quantidades abaixo representam registros e páginas do Foundry, não volume de texto. Uma página curta e uma página longa têm o mesmo peso na contagem.

| Conteúdo | Já localizado | Ainda falta |
| --- | --- | --- |
| **Core Rules** | Cobertura avançada de atores, itens, pastas e cenas. O arquivo possui 643 itens, 71 atores, 51 pastas e 11 cenas. **86 de 173 páginas** de journals já receberam texto PT-BR. | Concluir as **87 páginas** restantes e revisar chaves, formatação e consistência dos registros existentes. |
| **Monster Codex** | Itens, pastas e tabelas possuem localização. **91 de 136 atores** já têm nome de token em PT-BR, além de campos de ficha e itens incorporados tratados quando há correspondência oficial. As pastas **Goblins**, **Humanos & Outros**, **Trolls** e **Hordas da Noite Eterna** foram trabalhadas. | Concluir os **45 atores** restantes, localizar as **111 páginas** dos journals e realizar uma revisão geral. |
| **Adventure Collection** | Os **71 nomes de atores**, os nomes de **639 itens incorporados** às fichas e os nomes de **36 itens de compêndio** possuem entradas PT-BR. | A maior parte dos campos narrativos e das **186 páginas** dos journals ainda está em inglês ou precisa de revisão. |
| **Game Master's Guide** | As **61 tabelas**, seus **476 resultados** e as **28 pastas** foram localizados com os textos oficiais. Nos atores, **100 de 118 itens incorporados** reutilizam textos verificados do Core Rules. Os atores da aventura **Blight Night** também receberam nomes, raças e itens correspondentes disponíveis. | Localizar as **76 páginas** dos 9 journals, completar biografias e demais campos dos atores e revisar os **18 itens incorporados** sem correspondência direta no Core Rules. |
| **System Guide** | Guia técnico do sistema localizado em PT-BR por meio do Babele, incluindo criação de personagens, itens, testes, poderes, combate, configurações e macros. | Acompanhar futuras atualizações do sistema e revisar o guia quando o original em inglês for alterado. |
| **System Macros** | As **10 macros** da aventura `Symbaroum Macros - English` receberam nomes PT-BR. A pasta, os diálogos, avisos e resultados no chat também são localizados sem alterar o código do sistema. | Revisar a localização quando o sistema adicionar ou modificar macros. |

### Trabalho concluído nesta etapa

- Reaproveitamento das versões oficiais PT-BR de habilidades, poderes, armas, armaduras e outros itens do Core Rules nas fichas de atores de outros compêndios.
- Localização dos atores trabalhados no Monster Codex, incluindo táticas, aparência, raça, sombra e itens da ficha quando o texto oficial correspondente foi localizado.
- Localização das tabelas do Game Master's Guide, incluindo nomes visíveis, resultados e pastas.
- Localização dos nomes das pastas já atendidas pelos compêndios.
- Localização das 10 macros do sistema, mantendo seus comandos e a lógica oficial intactos.

### Próximas etapas

- [ ] Concluir os 45 atores restantes do Monster Codex.
- [ ] Localizar os journals do Monster Codex.
- [ ] Localizar os journals e campos narrativos do Game Master's Guide.
- [ ] Avançar nas páginas e nos campos narrativos da Adventure Collection.
- [ ] Concluir as páginas restantes do Core Rules.
- [ ] Fazer uma revisão final de terminologia, HTML, links, rolagens e chaves do Babele.
- [ ] Acompanhar alterações futuras no System Guide e nas macros do sistema.

## Instalação

No Foundry VTT, abra a instalação de módulos por URL e utilize o seguinte manifesto:

```text
https://raw.githubusercontent.com/Kciquehn/symbaroum-ptBR/main/module.json
```

Depois de ativar ou atualizar este módulo, importe novamente a aventura ou o compêndio oficial correspondente. Conteúdo que já foi importado para o mundo pode manter os textos antigos até ser removido e importado outra vez.

## Requisitos

- Foundry VTT v13 ou superior
- Sistema Symbaroum
- Módulo Babele
- Módulo oficial Symbaroum Core Rules
- Módulos oficiais adicionais para acessar a localização do Monster Codex, Adventure Collection e Game Master's Guide

O guia do sistema em português está disponível no compêndio **Symbaroum for FVTT system user guides**. O módulo também envia um link para esse compêndio no primeiro acesso do Mestre.

## Como colaborar

Sugestões, correções de chaves e relatos de conteúdo que ainda aparece em inglês são bem-vindos. Abra uma [issue no GitHub](https://github.com/Kciquehn/symbaroum-ptBR/issues) informando o módulo, o compêndio, a pasta e o nome exato do registro no Foundry.

Não envie PDFs ou reproduções dos livros ao repositório.

## Autores

**Kciquehn**

- Discord: `kcirehn`
- E-mail: `erickhenriquehn1@gmail.com`

**Arcani97**

- Discord: `Arcani97`

## Créditos

- Free League Publishing
- Tria Editora
- Foundry Virtual Tabletop
- Babele
