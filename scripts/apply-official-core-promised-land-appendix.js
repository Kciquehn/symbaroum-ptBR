const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const JOURNAL = "Book 4: The Promised Land";
const PAGE = "4.05 - Appendix";
const checkOnly = process.argv.includes("--check");

const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const journal = data.entries?.[ENTRY]?.journals?.[JOURNAL];
const page = journal?.pages?.[PAGE];
if (!journal || typeof page?.text !== "string") throw new Error(`Missing '${JOURNAL}.${PAGE}'.`);

const replacements = new Map([
  [1, "Apêndice"],
  [2, "NESTA SEÇÃO VOCÊ"],
  [3, "encontrará uma descrição dos artefatos místicos que os personagens jogadores podem encontrar ou serem afetados durante o cenário. A seção também inclui dois mapas e retratos pequenos de alguns dos lugares visitados no capítulo final da aventura."],
  [4, "Artefatos"],
  [5, "@UUID[Item.1cCakrFd71BLvovB]{Mão Mumificada de Mal-Rogan}"],
  [6, "O “amuleto” de Mal-Rogan é de fato sua própria mão esquerda, mumificada e pendurada em uma corrente enferrujada. A alma de Mal-Rogan está vinculada ao amuleto e pode conceder a outros além dele próprio os poderes listados abaixo. Entretanto, a mão vem com um severo efeito negativo: enquanto o amuleto existir, Mal-Rogan irá ressuscitar, independentemente de como foi morto ou o que foi feito com o corpo; e ele irá fazer qualquer coisa para reivindicar sua alma corrupta!"],
  [7, "Palavra da Perdição:"],
  [8, "Se o dono do amuleto dominar a habilidade Líder, ele pode proferir palavras de perdição sobre seus inimigos. Com uma jogada bem-sucedida contra"],
  [9, "Resoluto"],
  [10, ", a chance do inimigo de conseguir um sucesso ao atacar é reduzida pelo restante da cena; o dono pode fazer duas tentativas contra"],
  [11, "Defesa"],
  [12, "para evitar ataques físicos."],
  [13, "Ação:"], [14, "Ativa"], [15, "Corrupção:"], [16, "1D6"],
  [17, "Êxtase Sombrio:"],
  [18, "Com uma jogada bem-sucedida contra"], [19, "Resoluto"],
  [20, ", o dono do amuleto pode uma vez por turno rerrolar um Teste de Sucesso."],
  [21, "Ação:"], [22, "Livre"], [23, "Corrupção:"], [24, "1D4"],
  [25, "Vingança de Mal-Rogan:"],
  [26, "É possível para alguém ligado ao amuleto destruí-lo; é necessário apenas uma jogada bem-sucedida contra"],
  [27, "Resoluto"],
  [28, ". Se isso ocorrer, a alma libertada de Mal-Rogan tentará possuir seu antigo mestre, de acordo com as regras para o ritual"],
  [29, "Possessão"], [30, "Poderes Místicos"],
  [31, ". Mal-Rogan é muito vingativo e irá fazer o máximo para punir todos que estiverem envolvidos em assassiná-lo e roubar seu prezado medalhão; isso é, o grupo inteiro dos personagens jogadores e não apenas aquele que carregou o amuleto. Se a possessão falhar, Mal-Rogan morre de uma vez por todas. O mesmo ocorre quando uma possessão bem-sucedida chega ao fim."],
  [32, "@UUID[Item.Qeg4ZRy5Gpqktfy6]{A Pedra do Sol}"],
  [33, "Em tempos antigos, magos ligaram um espírito de fogo selvagem a esta pedra. Normalmente ela brilha com uma luz pálida e libera um calor ameno (suficiente para manter alguém aquecido em um dia gelado de inverno). Aquele que se liga à pedra pode despertar o espírito de fogo e comandá-lo a executar ações mais dramáticas, nomeadas da seguinte forma:"],
  [34, "Atacar com Fogo:"], [35, "Com uma jogada bem-sucedida contra"], [36, "Resoluto"],
  [37, ", o mestre da Pedra do Sol pode colocar fogo em um objeto à vista; incluindo a vestimenta de inimigos. O fogo queima por 1D4 turnos e causa 1D4 de dano a cada turno. Armadura protege normalmente. Uma pessoa em chamas pode extinguir o fogo rolando no chão (ação de movimento) e obtendo sucesso em uma jogada contra"],
  [38, "Rápido"], [39, "."], [40, "Ação:"], [41, "Ativa"], [42, "Corrupção:"], [43, "1D4"],
  [44, "Amplificar Chama:"],
  [45, "Se o senhor da pedra domina poderes que produzem fogo, ele pode usar a pedra para amplificar suas magias de fogo. Com uma jogada bem-sucedida contra"],
  [46, "Resoluto"], [47, ", o efeito é aumentado em um passo (ou seja, de 1D6 para 1D8, ou com +1 se já for 1D12)."],
  [48, "Ação:"], [49, "Livre"], [50, "Corrupção:"], [51, "1D4"],
  [52, "@UUID[Actor.KFgw0YV1Q8fihYgO]{Espírito de Fogo:}"],
  [53, "Com uma jogada bem-sucedida contra"], [54, "Resoluto"],
  [55, ", o mestre da pedra pode liberar o espírito de fogo capturado, dessa forma destruindo o artefato. O espírito aparece como um humanoide alto feito de chamas e fuligem. Ele é grato e irá obedecer a seu mestre pelo restante da cena. Comandos simples podem ser dados a ele (Ação Livre) como “guarde este local”, “ataque este indivíduo” ou “me mantenha seguro”."],
  [56, "Ação:"], [57, "Ativa"], [58, "Corrupção:"], [59, "1D6"],
  [60, "ESPÍRITO DE FOGO"], [61, "Resistência"], [62, "Desafiadora"], [63, "Traços"],
  [64, "Arma Natural (III), Forma de Espírito (II)"], [65, "Preciso"], [66, "15 (−5),"], [67, "Astuto"], [68, "10 (0),"],
  [69, "Discreto"], [70, "5 (+5),"], [71, "Persuasivo"], [72, "7 (+3),"], [73, "Rápido"], [74, "13 (−3),"],
  [75, "Resoluto"], [76, "9 (+1),"], [77, "Vigoroso"], [78, "11 (−1),"], [79, "Vigilante"], [80, "10 (0)"],
  [81, "Habilidades"], [82, "Guerreiro Natural (mestre)"], [83, "Armas"],
  [84, "Abraço ardente 9 (Longo), dois ataques contra o mesmo alvo"], [85, "Armadura"],
  [86, "Nenhuma (sofre metade do dano de todos os ataques)"], [87, "Defesa"], [88, "−3"], [89, "Vitalidade"], [90, "11"],
  [91, "Limiar de Dor"], [92, "6"], [93, "Ordo Magica e a Pedra do Sol"],
  [94, "Os mestres da Ordo Magica irão demandar uma boa explicação da pessoa que se ligar à pedra: uma luta desesperada contra uma abominação ou com elfos tentando pegar a pedra são consideradas razões válidas. Se o Mestre de Jogo não pensar o contrário, um mestre que pegar o PJ com a Pedra do Sol irá exigi-la de volta pelo bem da Ordem, ou então exigir um favor em troca do artefato. A última opção pode obviamente ser um excelente gancho para uma aventura maior ou menor…"],
  [95, "Locais"], [96, "OS LOCAIS"],
  [97, "a seguir são apresentados na aventura. Se o MJ quiser expandir, ou se os PJs tomarem iniciativas que os levam a outros lugares, você sempre pode desenhar seus próprios mapas, antes do jogo começar ou durante a sessão."],
  [98, "A PASSAGEM DA MONTANHA"],
  [99, "A passagem, na verdade, são duas passagens, guarnecidas por encostas altas ao leste e oeste e com um vasto platô entre elas."],
  [100, "O CERCADO"],
  [101, "Os seis vagões da caravana formam um cercado toda noite, ou quando sob ameaça. Entre os vagões são colocados portões de madeira, apoiados em barris. Todos os viajantes têm um posto designado no caso de perigo, à frente se a pessoa pode lutar ou, caso contrário, abrigada atrás dos vagões. Encontrar o lugar da pessoa no cercado é uma rotina bem ensaiada que não requer instruções; um alarme de um guarda ou uma ordem de Argasto é suficiente para todos correrem para seus lugares determinados com armas em mãos."],
  [102, "O ACAMPAMENTO ÉLFICO"],
  [103, "O acampamento élfico fica localizado mais ou menos na metade do platô na encosta oeste (o Mestre de Jogo decide por um local adequado). O acampamento é simples, com uma tenda em tons de terra, alguns equipamentos e três camas para descansar ou meditar. Um dos elfos está sempre de guarda e o acampamento é muito bem camuflado, embora seja possível encontrar seus rastros."]
]);

function translateVisibleHtml(html) {
  let visibleIndex = 0;
  const applied = new Set();
  const output = html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) return part;
    const normalized = part.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim();
    if (!normalized) return part;
    visibleIndex += 1;
    if (!replacements.has(visibleIndex)) return part;
    applied.add(visibleIndex);
    const leading = part.match(/^\s*/)?.[0] ?? "";
    const trailing = part.match(/\s*$/)?.[0] ?? "";
    return `${leading}${replacements.get(visibleIndex)}${trailing}`;
  }).join("");
  if (visibleIndex !== replacements.size || applied.size !== replacements.size) {
    throw new Error(`Visible-node mismatch: found ${visibleIndex}, applied ${applied.size}/${replacements.size}.`);
  }
  return output;
}

const translated = translateVisibleHtml(page.text);
page.text = translated;

function locateJournal(text) {
  let index = 0;
  let found;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.join("/") === `entries/${ENTRY}/journals/${JOURNAL}`) found = { start, end: index }; }
  function object(path) { index += 1; ws(); if (text[index] === "}") { index += 1; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index += 1; ws(); if (text[index] === "]") { index += 1; return; } let item = 0; while (index < text.length) { value([...path, item++]); ws(); if (text[index] === "]") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); return found;
}

const location = locateJournal(source);
if (!location) throw new Error(`Could not locate journal '${JOURNAL}'.`);
const eol = source.includes("\r\n") ? "\r\n" : "\n";
const lineStart = source.lastIndexOf("\n", location.start - 1) + 1;
const indent = source.slice(lineStart, location.start).match(/^\s*/)?.[0] ?? "";
const serialized = JSON.stringify(journal, null, 2).replaceAll("\n", `${eol}${indent}`);
const output = source.slice(0, location.start) + serialized + source.slice(location.end);
const wouldChange = output !== source;

if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange, visibleNodes: replacements.size }, null, 2));
