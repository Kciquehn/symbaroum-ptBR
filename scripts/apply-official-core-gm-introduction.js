const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const JOURNAL = "Book 3: The GM Guide";
const PAGE = "3.01 - The Game Masters Guide";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const journal = data.entries?.[ENTRY]?.journals?.[JOURNAL];
const page = journal?.pages?.[PAGE];
if (!journal || typeof page?.text !== "string") throw new Error(`Missing '${JOURNAL}.${PAGE}'.`);

const pt = [
  "Introdução",
  "BEM-VINDO AO GUIA DO MESTRE.",
  "De forma simples, o Mestre é a pessoa que mantém o jogo andando; principalmente ao apresentar o cenário de Symbaroum para os jogadores e ao fazer seus personagens enfrentar todo o tipo de perigos e desafios. O Mestre deve disponibilizar um tempo para aprender o conteúdo do Guia do Jogador também, já que ele ou ela deve guiar jogadores novos através do processo de criação de personagem, e ensiná-los a usar as regras do jogo. Além disso, o Mestre deve administrar os oponentes — inimigos e monstros que, em muitos casos, são caracterizados pelas habilidades e poderes descritos em capítulos anteriores.",
  "ESSE LIVRO CONSISTE",
  "em seis capítulos, dos quais o primeiro fornece uma introdução à todas as tarefas sob responsabilidade do Mestre. Os dois capítulos seguintes tratam das regras, um descrevendo as regras usadas pelo Mestre e outro apresentando elementos de regra mais ligados ao mundo de jogo em si — como viagens e transações econômicas em Ambria.",
  "O quarto capítulo oferece dicas e guias de como o Mestre pode criar suas próprias aventuras, e os dois capítulos finais lidam com monstros e criaturas: o capítulo cinco de maneira geral e o capítulo seis contendo descrições de abominações, bestas e criaturas mortas vivas individuais.",
  "Antes da Sessão",
  "AO LONGO DOS ANOS",
  "em que nós na Free League temos jogado RPG, frequentemente retornamos a um par de princípios que consideramos serem sinais de uma boa narração. Desses princípios você pode derivar uma série de tarefas que o Mestre tem que lidar. É importante que elas sejam levadas à sério, se a experiência partilhada de jogo for para ser recompensadora para todos os envolvidos. Pode parecer uma lista desanimadora, ainda assim, nós achamos que tentar abraçar o máximo delas acaba valendo o esforço.",
  "É claro que, como Mestre, você está livre para escolher dentre a lista, preferencialmente depois de falar com seu grupo de jogo e chegar a uma conclusão quanto a quais serão usadas.",
  "Esta transcrição, coletada de uma das colunas de Haganor, é indisputavelmente a mais amplamente debatida entre estudiosos ambrianos. Ela realmente identifica a localização de Symbar e, se for o caso: para qual localização ela aponta, exatamente?",
  "TORNANDO A AVENTURA SUA",
  "Se você, como Mestre, narrar uma aventura ou um cenário escrito por outra pessoa (por nós na Free League, por exemplo) é importante ler o manuscrito de capa a capa, mas ainda mais importante do que isso é lê-la com uma caneta na mão. Faça anotações onde estão os detalhes que você quer expandir ou deseja desenvolver mais, coisas que você quer remover ou mudar — você é quem conhece melhor o seu grupo de jogo e personagens, e a aventura deve ser recompensadora para todos. No caso de uma aventura oficial publicada, você deve sempre tratar como uma coleção de ideias e possíveis desafios. Trabalhe com isso e torne a aventura sua, para o seu bem e o de seus jogadores.",
  "REVISE A ÚLTIMA SESSÃO DE JOGO",
  "Considere o que aconteceu durante a última sessão de jogo e como isso pode afetar eventos futuros, especialmente a sessão vindoura. Se planeje para essas eventualidades.",
  "ASSIM FALOU AROALETA",
  "“... e lembre de quais raízes essa beleza verdejante brota; mesmo a mais rica colheita se alimenta da podridão, e nunca uma colheita foi tão exuberante, ou um solo foi tão negro, quanto o nos salões sombrios da Davokar.”",
  "COMPREENDA O INIMIGO",
  "Quem tenta impedir os personagens de alcançarem seus objetivos? O que o inimigo quer dos personagens, ou impedi-los de fazer? Quão preparado está esse inimigo para alcançar seus objetivos? O que o atrapalha? Que forças externas ele deve levar em consideração (outras forças ou autoridades na área)? Quais são suas forças e fraquezas? Também, lembre-se que mesmo um inimigo poderoso não pode estar em todos os lugares ao mesmo tempo.",
  "PREPARE DESAFIOS",
  "Prepare desafios que correspondam aos objetivos dos personagens jogadores. Quais obstáculos estão no seu caminho? Que tipos de criaturas espreitam a área? O que os inimigos dos personagens vão fazer para impedi-los?",
  "Durante a Sessão",
  "PEÇA AOS JOGADORES PARA RECAPITULAR",
  "Comece sua sessão de jogo despertando a memória de seus jogadores (e personagens). Primeiro, pergunte aos jogadores o que aconteceu da última vez que se encontraram, mas deixe-os também explicar o que seus personagens têm feito desde então e o que planejam fazer agora. Corrija seus jogadores se eles se lembrarem incorretamente, e adicione detalhes que possam ter esquecido e que sejam importantes para a sessão de jogo atual.",
  "DIGA SIM",
  "Evite dizer não quando seus jogadores tomam a iniciativa. Em vez, diga sim e siga com um desafio. Deixe os jogadores decidirem se o desafio é poderoso demais, ou se é um risco que vale a pena tomar.",
  "SURPRESAS DESAGRADÁVEIS",
  "Exponha os personagens a situações perigosas e inesperadas que eles não buscaram. O cenário de Symbaroum é perigoso e frequentemente injusto: os personagens não devem ser capazes de prever, estimar ou evitar todos os desafios que enfrentam.",
  "DESCREVA O MUNDO",
  "Descreva aos jogadores o que seus personagens sentem — o que eles veem, como cheira e o que ouvem. Destaque os contrastes, o que descrevem as diferenças no mundo de jogo, já que é mais fácil descrever “isto” quando comparado ou relacionado com “aquilo”. Se necessário, você também pode descrever o que o personagem está pensando; ele provavelmente sabe mais sobre o mundo de jogo que os jogadores, o que torna apropriado dizer coisas como “você percebe que...”. Mas se certifique de deixar os jogadores cuidarem dos sentimentos e reações.",
  "INCORPORE OS PERSONAGENS DO MESTRE",
  "Dê nomes aos seus personagens do mestre (PdMs) e os retrate com comportamentos e personalidades próprios, para que os jogadores que estejam no encontro se lembrem. Torne os PdMs compreensíveis ao dá-los motivos razoáveis. PdMs podem parecer loucos ou cômicos, mas para eles, suas ações são sempre motivadas e perfeitamente sãs.",
  "DESCREVA CONSEQUÊNCIAS",
  "Use PdMs para espelhar as ações dos personagens jogadores — se eles odeiam ou amam o que os personagens jogadores estão fazendo, eles deveriam demonstrar isso. Essas reações também podem ser descritas ao fim da sessão de forma narrativa, se já não estiverem óbvias. O propósito disso é fazer com que os jogadores entendam que suas decisões durante o jogo têm repercussões, algo que ajuda a fazer o mundo de jogo parecer vivo e dando um toque de “realidade”.",
  "SALVE-OS DE PROBLEMAS",
  "Se você como Mestre colocou os jogadores em uma posição ruim, então você também deve estar preparado para salvá-los da morte certa. Não os deixe morrer; dê a chance de eles sobreviverem e serem capturados. Ou deixe outro grupo aparecer e salvá-los no último momento possível — e depois demandando sua ajuda com algo difícil ou desagradável, é claro.",
  "DEIXE O “MAL” INEXPLICADO",
  "A escuridão espreitando nas raízes da Davokar está além da humanidade. Talvez a escuridão odeie todas as coisas vivas; talvez a escuridão se alimente da força vital alheia; ou talvez ela simplesmente trate todos os seres vivos como brinquedos. Os aliados do mal, seus servos, aqueles que se transformam em bestas maculadas e anseiam pela vida podem ser descritos, e algumas vezes explicados, mas a fonte da escuridão é quase inexplicável.",
  "Depois da Sessão",
  "RECOMPENSE OS JOGADORES",
  "Peça aos jogadores para descreverem o que seus personagens planejam fazer em seguida ou, se a aventura acabou de ser concluída, o que eles pretendem fazer até a próxima jornada começar. Tais informações são essenciais para o Mestre planejar a próxima sessão.",
  "OS PLANOS DOS PERSONAGENS",
  "Recompense os personagens com Experiência para cada cena que encontrem, e também adicione outros tipos de recompensas: recompensas sociais como contatos, segredos, títulos e novos equipamentos ou talvez até mesmo artefatos mágicos.",
  "CONCLUA A SESSÃO",
  "Anote os detalhes ou palavras chave descrevendo o que aconteceu durante a sessão, assim como pensamentos e ideias que podem ser úteis durante sessões futuras."
];

function translateVisibleHtml(html) {
  let index = 0;
  const output = html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) return part;
    const normalized = part.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim();
    if (!normalized) return part;
    if (index >= pt.length) throw new Error(`Unexpected visible node ${index + 1}.`);
    const translated = pt[index++];
    const leading = part.match(/^\s*/)?.[0] ?? "";
    const trailing = part.match(/\s*$/)?.[0] ?? "";
    return `${leading}${translated}${trailing}`;
  }).join("");
  if (index !== pt.length) throw new Error(`Visible-node mismatch: found ${index}/${pt.length}.`);
  return output;
}

page.text = translateVisibleHtml(page.text);

function locateJournal(text) {
  let index = 0; let found;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.join("/") === `entries/${ENTRY}/journals/${JOURNAL}`) found = { start, end: index }; }
  function object(path) { index++; ws(); if (text[index] === "}") { index++; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index++; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index++; ws(); if (text[index] === "]") { index++; return; } let item = 0; while (index < text.length) { value([...path, item++]); ws(); if (text[index] === "]") { index++; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
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
console.log(JSON.stringify({ checkOnly, wouldChange, visibleNodes: pt.length }, null, 2));
