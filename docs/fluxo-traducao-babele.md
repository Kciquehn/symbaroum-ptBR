# Fluxo de transcrição oficial para o Babele

## 1. Natureza do projeto

O módulo registra no formato do Babele o conteúdo oficial em português brasileiro publicado pela Tria Editora. O texto inglês presente nos módulos de Symbaroum para Foundry serve para localizar o documento técnico correspondente; o texto português deve vir da edição oficial, e não de tradução automática ou adaptação livre.

Os livros locais em `Livros em ptbr/` são fontes privadas de consulta e permanecem fora do Git. Os módulos oficiais instalados também são somente fontes de leitura. Toda alteração deve ficar neste módulo, principalmente em `compendium/pt-BR/`.

## 2. Como um arquivo de tradução é localizado

O nome segue este padrão:

```text
<id do módulo de origem>.<id do compêndio de origem>.json
```

Exemplo do Core Rules:

```text
symbaroum-corerules.symbaroum-core-rules.json
```

O `register.js` registra no Babele:

- módulo de tradução: `symbaroum-ptBR`;
- idioma: `pt-BR`;
- diretório: `compendium/pt-BR`.

## 3. Anatomia geral

Um arquivo contém quatro áreas principais:

```json
{
  "label": "Nome exibido em português",
  "mapping": {},
  "folders": {},
  "entries": {}
}
```

- `label`: nome visível da tradução.
- `mapping`: associa nomes curtos usados no JSON aos caminhos reais dos dados do Foundry.
- `folders`: traduções de pastas no nível do compêndio, quando aplicável.
- `entries`: documentos traduzidos, identificados pelas chaves do conteúdo inglês.

No Core Rules, o documento principal é uma Adventure:

```json
{
  "entries": {
    "Symbaroum Core Rules": {
      "name": "Nome oficial em PT-BR",
      "description": "<p>...</p>",
      "scenes": {},
      "actors": {},
      "items": {},
      "folders": {},
      "journals": {}
    }
  }
}
```

`"Symbaroum Core Rules"` é uma chave de identidade do documento inglês. Ela não deve ser traduzida.

## 4. Chaves inglesas e valores portugueses

O padrão manual do Core é:

```json
{
  "items": {
    "Bow": {
      "name": "Arco",
      "description": "<p>Texto oficial em português...</p>"
    }
  }
}
```

- `"Bow"` é a chave inglesa usada para encontrar o item de origem.
- `"Arco"` é o valor que o Babele aplica ao campo `name`.
- `description` contém a transcrição oficial, preservando a marcação HTML esperada pelo Foundry.

O Babele atual tenta identificar documentos por `_id`, depois por `name` e por `sourceId`. O Core Rules deste projeto usa predominantemente o nome inglês como chave. Por isso, a grafia da chave deve reproduzir exatamente o documento de origem. Diferenças de caixa, espaços ou hífens podem representar documentos diferentes ou impedir a correspondência esperada.

## 5. Mapeamentos observados no Core Rules

### Atores

Além de `name` e `tokenName`, o Core mapeia os seguintes campos da ficha:

| Campo no JSON | Caminho no Foundry |
| --- | --- |
| `race` | `system.bio.race` |
| `occupation` | `system.bio.occupation` |
| `manner` | `system.bio.manner` |
| `shadow` | `system.bio.shadow` |
| `appearance` | `system.bio.appearance` |
| `background` | `system.bio.background` |
| `personalGoal` | `system.bio.personalGoal` |
| `tactics` | `system.bio.tactics` |
| `quote` | `system.bio.quote` |

### Itens, habilidades, poderes, rituais e equipamentos

| Campo no JSON | Caminho no Foundry |
| --- | --- |
| `description` | `system.description` |
| `material` | `system.material` |
| `noviceDescription` | `system.novice.description` |
| `adeptDescription` | `system.adept.description` |
| `masterDescription` | `system.master.description` |
| `cost` | `system.cost` |
| `tradition` | `system.tradition` |
| `power0Name` … `power4Name` | `system.power.0.name` … `system.power.4.name` |
| `power0Description` … `power4Description` | `system.power.0.description` … `system.power.4.description` |

O campo `name` vem do mapeamento padrão do Babele e continua sendo usado normalmente.

### Diários e páginas

Os diários são identificados pelo nome inglês do Journal e cada página por sua própria chave inglesa:

```json
{
  "journals": {
    "English Journal Name": {
      "name": "Nome oficial em português",
      "pages": {
        "English Page Name": {
          "name": "Nome oficial da página",
          "text": "<div>...</div>"
        }
      }
    }
  }
}
```

O campo `text` corresponde a `text.content` em `JournalEntryPage`. Páginas de imagem também podem usar `src` e `caption`. A chave customizada `journal` no bloco `mapping` é singular porque corresponde ao caminho interno usado pela Adventure, enquanto a coleção traduzida dentro de `entries` aparece como `journals`.

### Pastas, cenas e outros documentos

- Em `folders`, a chave é o nome inglês e o valor é o nome oficial em português.
- Cenas podem ter `name`, `notes` e `drawings`; as chaves internas das notas também devem continuar correspondendo ao texto identificador de origem.
- Macros, tabelas e outras coleções só devem receber campos previstos no mapeamento efetivo do arquivo.

## 6. Itens incorporados em atores

Uma ficha de ator guarda cópias próprias de habilidades, poderes, armas, armaduras e outros itens. Traduzir apenas a coleção superior `items` não altera automaticamente essas cópias.

Estrutura correta:

```json
{
  "actors": {
    "English Actor Name": {
      "name": "Nome oficial em português",
      "tokenName": "Nome oficial em português",
      "items": {
        "Bow": {
          "name": "Arco",
          "description": "<p>Texto oficial...</p>"
        }
      }
    }
  }
}
```

Consequências práticas:

1. O mesmo item pode precisar aparecer na coleção superior e dentro de muitos atores.
2. A cópia dentro do ator pode ter descrição, nível, material, custo ou poderes próprios.
3. Só é seguro copiar a tradução do Core quando o item incorporado representa a mesma regra.
4. Nomes com qualificadores, por exemplo texto entre parênteses, são variantes distintas e devem ser conferidos na fonte oficial.

## 7. Fluxo de trabalho recomendado

1. Identificar o módulo, o compêndio e o documento inglês de origem.
2. Copiar a chave inglesa exatamente como ela aparece no documento do Foundry.
3. Localizar no livro oficial da Tria o item, habilidade, poder, ator ou seção equivalente.
4. Transcrever somente os campos que possuem correspondência oficial confirmada.
5. Preservar tags HTML, quebras relevantes, tabelas, imagens, links `@UUID[...]`, fórmulas e estrutura mecânica.
6. Para atores, repetir a conferência em `items` incorporados.
7. Não preencher por inferência. Conteúdo ainda não localizado deve permanecer ausente ou inalterado.
8. Validar o JSON, as chaves e a estrutura antes de considerar o trabalho concluído.

## 8. Validação

Depois de uma alteração:

- analisar todos os JSONs modificados;
- comparar as chaves antes e depois para impedir renomeações acidentais;
- verificar duplicatas e correspondências ambíguas;
- preservar a contagem e o balanceamento das tags HTML em páginas extensas;
- executar os scripts relevantes em `scripts/`;
- executar `git diff --check`;
- revisar o diff para garantir que somente os campos pretendidos mudaram.

O Core Rules atual foi construído manualmente e serve como referência estrutural, mas está incompleto. A ausência de uma tradução nele não autoriza criar uma tradução nova.

## 9. Inventário observado no Core Rules

Na análise realizada em 9 de agosto de 2026, a entrada `Symbaroum Core Rules` continha:

- 11 cenas;
- 71 atores;
- 643 itens de nível superior;
- 51 pastas;
- 74 diários.

Também foram encontrados itens incorporados dentro dos atores. Esses números são um retrato do arquivo naquele momento e podem mudar conforme o trabalho continuar.
