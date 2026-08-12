const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json";
const CORE_FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Game Masters Guide";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const actors = data.entries?.[ENTRY]?.actors;
if (!actors) throw new Error(`Missing '${ENTRY}' actors.`);

const coreItems = JSON.parse(fs.readFileSync(CORE_FILE, "utf8")).entries?.["Symbaroum Core Rules"]?.items;
if (!coreItems) throw new Error("Missing Core Rules item translations.");
const exceptionalAttribute = coreItems["Exceptional Attribute"];
const oneHandedWeapon = coreItems["Sword"];
if (!exceptionalAttribute || !oneHandedWeapon) throw new Error("Missing required official Core Rules translations.");

const abilityFields = ["description", "noviceDescription", "adeptDescription", "masterDescription"];
const copyFields = (target, sourceItem, fields) => {
  for (const field of fields) if (sourceItem[field] != null && sourceItem[field] !== "") target[field] = sourceItem[field];
};

const embeddedItemTranslations = {
  "Nightblade, Robber Baron": {
    "Fortified  Chainmail": (item) => { item.cost = "125 táleres"; }
  },
  "Varraguldru, Nightblade’s goblin tribe": {
    "Rusty Sword": (item) => copyFields(item, oneHandedWeapon, ["description"])
  },
  "Sakofal the Slaughterer": {
    "Exceptionally Resolute (Grand-Master)": (item) => copyFields(item, exceptionalAttribute, abilityFields),
    "Bite": (item) => { item.description = "<p>Mordida 20 (longa), ou dois ataques no mesmo alvo 18/14</p>"; }
  },
  "Serala-Han Urel": {
    "Exceptionally Resolute": (item) => copyFields(item, exceptionalAttribute, abilityFields),
    "Exceptionally Quick": (item) => copyFields(item, exceptionalAttribute, abilityFields)
  },
  "Uhux": {
    "Exceptionally Resolute": (item) => copyFields(item, exceptionalAttribute, abilityFields),
    "Claws": (item) => { item.description = "<p>Garra 21 (Longa), dois ataques contra o mesmo alvo e dano de veneno 4 por 4 turnos; Aura Nociva dentro de alcance corpo a corpo, dano 4 por turno (ignora Armadura)</p>"; },
    "Troll Skin": (item) => { item.description = "<p>Pele de troll 10; regenera 4 Vitalidade/turno, exceto dano de armas sagradas; meio dano de acordo com Morto-Vivo II</p>"; }
  }
};

const sharedItems = {
  "Barrvalg’s Cauldron": "Caldeirão de Barrvalg",
  "Blue Drops": "Gotas Azuis",
  "Dream Snuff": "Rapé dos Sonhos",
  "The Sword Black Gift": "A Espada Presente Negro",
  "Piercing Attack": "Ataque Perfurante",
  "Infestation": "Infestação",
  "Stinger (piercing 5)": "Ferrão (perfurante 5)",
  "Deadly Breath": "Sopro Mortal",
  "Deadly Breath (Corruption)": "Sopro Mortal (Corrupção)",
  "Devour": "Devorador",
  "Life Sense": "Senso de Vida",
  "Sturdy": "Tenaz",
  "Wrecker": "Destruidor",
  "Harmful Aura (Poisonous)": "Aura Nociva (Venenosa)"
};

const translations = {
  "Ashfaru, the Poison-Maker of Nightblade": {
    name: "Ashfaru, o Criador de Venenos de Lâmina Noturna",
    race: "Humano (bárbaro)",
    shadow: "Cinza esverdeado, como mofo em uma árvore em decomposição (corrupção: 4)",
    background: "<p>Ashfaru é um bruxo renegado que deixou seu clã e o círculo de bruxas depois de envenenar um rival no amor. Lâmina Noturna salvou o alquimista das garras de um troll raivoso, e desde então eles viajaram juntos. Atualmente, a principal tarefa de Ashfaru é fornecer drogas aos goblins de Varraguldru, para fazê-los servir a Lâmina Noturna como escravos leais. Ele também fornece a Lâmina Noturna um elixir que estabiliza a mente frágil da cavaleira maculada. Ele não foi capaz de fazer nada sobre a condição física de sua amante — pois são necessários fluidos mais fortes, como por exemplo, a Água do Crepúsculo. Ashfaru tornou-se viciado em suas próprias drogas, o que é evidente ao olhar em seus olhos injetados de sangue ou em seus lábios pálidos e mãos trêmulas. Muitas vezes, você pode ver traços empoeirados do Rapé dos Sonhos em torno das narinas do velho místico.</p>",
    tactics: "Ashfaru se aconchega atrás dos goblins ao lado de seu caldeirão. Se severamente ameaçado, ele ferve uma dose de veneno forte no caldeirão, o que afeta todos na área, menos ele. Depois disso, ele tentará correr para a floresta com seu artefato."
  },
  "Nightblade, Robber Baron": {
    name: "Lâmina Noturna, baronesa ladina",
    race: "Humana (Ambriana)",
    shadow: "Roxo escuro com flocos de prata, afundando lentamente na escuridão (corrupção: 6)",
    background: "<p>A figura trágica que se chama Lâmina Noturna seria ridícula ou lamentável se não fosse pelo fato de estar acometida pela mácula e muito desesperada: ela viveu uma vida longa atormentada pela corrupção e está colocando sua última esperança na lenda da Água do Crepúsculo, esperando que isso possa salvá-la da escuridão que se forma dentro dela. Com a ajuda de drogas poderosas, ela conseguiu manter a loucura à distância, mas os elixires não fazem nada para deter ou retardar a corrupção física. Lâmina Noturna exibe várias marcas visíveis da mácula — seus olhos vermelhos de sangue brilham no escuro, há pus secretando das feridas no seu pescoço e ela traz consigo um odor de enxofre e desgraça.</p>",
    tactics: "O objetivo de Lâmina Noturna é claro: conquistar o Coração de Jakad e assumir o controle de sua fonte. Ela confia nos goblins para atacar a paliçada, depois caminha para o campo de batalha ao som do sangue sedento de sua espada negra."
  },
  "Shuggludd, rebellious goblin": {
    name: "Shuggludd, goblin rebelde",
    race: "Goblin",
    shadow: "Cores verdes saudáveis",
    background: "<p>A tribo de Varraguldru não tem mais um líder, mas é comandada pela Lâmina Noturna, sonhando constantemente com as drogas do fabricante de venenos Ashfaru — com uma exceção: o goblin Shuggludd. Ao estudar Ashfaru no trabalho, Shuggludd aprendeu o suficiente para conseguir inventar as Gotas Azuis, negando assim o poder de corrupção da Goma Selvagem. Infelizmente, ele se tornou viciado no conforto sedutor das Gotas Azuis. Elas o tornam dócil, mas pelo menos não o matam.</p><p>Shuggludd tem os mesmos valores que os membros de sua tribo, com a adição da habilidade Alquimia no nível novato. Shuggludd também tem um conjunto de alquimia em sua mochila, com o qual ele faz Gotas Azuis que consome toda vez que é alimentado à força com Goma Selvagem. Isso o salvou de seus efeitos negativos, tanto de curto quanto de longo prazo.</p><p>Entendimento com um teste de [<em>Vigilante</em> –3] bem-sucedido: Este goblin parece se comportar como o resto, mas age racionalmente e com uma evidente vontade de sobreviver.</p><p>Entendimento com um teste de [<em>Vigilante</em> –3] e <em>Alquimia</em> ou <em>Médico</em> bem-sucedido: O goblin não possui os sintomas físicos da doença das drogas — sua intoxicação é uma encenação!</p>",
    tactics: "Shuggludd age drogado, mas fica longe de combate, se possível. Em vez disso, ele tenta alcançar os personagens jogadores na esperança de chegar a um acordo — se eles atacarem Ashfaru e seu caldeirão, os goblins poderão ser libertados de seus vícios. Se isso acontecer, Lâmina Noturna e Ashfaru podem ser combatidos sem que eles se amontoem atrás de um monte de lacaios."
  },
  "Varraguldru, Nightblade’s goblin tribe": {
    name: "Varraguldru, tribo goblin da Lâmina Noturna",
    race: "Goblin",
    shadow: "Várias cores com manchas de escuridão doentia de drogas (corrupção: 3)",
    background: "<p>Os remanescentes do que antes era a orgulhosa tribo goblin Varraguldru são uma visão triste. O líder da tribo juntou-se a Lâmina Noturna enquanto ela lhe prometia ouro e honra, uma promessa à qual ela inicialmente cumpriu enquanto estavam saqueando ruínas. Eles encontraram ouro e terrores o suficiente para levá-los a abusar das drogas oferecidas pela cavaleira. Desde então, Lâmina Noturna os explorou sem piedade por sua causa sombria; os restos da tribo agora a servem com lealdade instilada por drogas. As drogas fortalecem os goblins, mas à custa de instabilidade emocional e compulsões estranhas.</p><p>Entendimento com um teste de <em>Vigilante</em> bem-sucedido: muitos goblins coçam os braços, riem ou choram histericamente, espumam pela boca ou olham para o nada com olhos quase mortos enquanto cuidam dos negócios. Claramente, algo não está certo…</p><p>Entendimento com um teste de <em>Vigilante</em> e <em>Alquimia</em> ou <em>Médico</em> bem-sucedido: Os goblins estão obviamente drogados!</p>",
    tactics: "<p>Os guerreiros da tribo Varraguldru são bêbados e selvagens. Eles se aglomeram em torno de seus inimigos, tentando envolvê-los todos no corpo a corpo de uma só vez. A habilidade do Instinto de Sobrevivência é usada para contornar a linha de frente e alcançar arqueiros e místicos mais atrás. Inspirados pelas drogas, os goblins espumantes lutam até a morte.</p>"
  },
  "Corrupted Insect Swarm": {
    name: "Enxame de Insetos",
    race: "Abominação (criaturas aladas)",
    shadow: "Verde escuro lustroso, como a cabeça de uma mosca varejeira (completamente corrompida)",
    appearance: "<p>Criado pela Cerimônia Mística <em>Enxame de Insetos</em>.</p>",
    tactics: "O enxame age por instinto e ataca seus inimigos até que morram ou que o enxame seja destruído."
  },
  "Sakofal the Slaughterer": {
    name: "Sakofal, o Matador",
    race: "Besta (répteis)",
    shadow: "Verde escuro reluzente, como uma esmeralda bruta na luz do sol mais intensa (corrupção: 0)",
    appearance: "<p><strong>O DRAGÃO LENDÁRIO</strong></p><p>Sakofal, o Matador, é mencionado brevemente no livro digital Symbaroum — Locais de Aventura e em Symbar — Mãe da Escuridão. Diferente do outro dragão que aterrorizou a antiga Symbaroum, Fofar, o Destruidor, Sakofal resistiu a tentação de se permitir ser ‘exaltado’ (ou seja, nascido da mácula) pelos Teurgos de Symbar. Em vez disso ele foi preso há muito em uma hibernação pelas melodias sonolentas do Pacto de Ferro; agora ele despertou, emaciado e faminto como nunca antes.</p>",
    background: "<p><strong>Características:</strong> Tão magro que as costelas, juntas e ossos do rosto marcam a pele de escamas esmeralda.</p><p><strong>Nível Grão-Mestre:</strong> A fome desesperada do dragão e o desejo de recuperar sua força antiga se manifesta na habilidade Excepcionalmente Resoluto (grão-mestre).</p><p><strong>Habilidade Inesperada:</strong> O traço Destruidor no nível mestre permite que Sakofal destrua estruturas com suas garras e mandíbulas, o que por sua vez dificulta a busca de abrigo contra o monstro — especialmente porque seu Senso de Vida (mestre) também lhe capacita a sentir criaturas vivas através de muralhas ou até mesmo a vários metros de solo.</p><p><strong>Fraqueza:</strong> Sakofal está ferozmente faminto e, por isso, muito agressivo e impetuoso — conta como Amoque (novato), o que o torna relativamente fácil de acertar. Como resultado da longa hibernação, ele também perdeu contato com sua raça, o que o privou de seu traço Sabedoria das Eras.</p>",
    tactics: "Sakofal desce como uma tempestade em seus inimigos, executando dois ataques de passagem no mesmo alvo; um acerto lhe dá a chance de devorar imediatamente o alvo como uma reação [Vigoroso←Vigoroso]. Caso os inimigos sejam muitos e estejam agrupados, ele pode tentar um ataque de fogo, mas com menos chance de acertar qualquer um (Preciso)."
  },
  "Serala-Han Urel": {
    name: "Serala-Han Urel",
    race: "Espírito",
    shadow: "Como uma noite de céu claro, com luzes leves que apenas acentuam a escuridão avassaladora (completamente corrompida)",
    appearance: "<p><strong>O LENDÁRIO ANDARILHO DA CRIPTA</strong></p><p>Na escuridão do norte da Davokar, o espírito da Rainha Serala-Han Urel ainda paira na antiga sede de seu reino outrora próspero. Ela e o povo dela foram completamente massacrados pelos exércitos de Symbar e tudo o que resta do ser dela é amargura, raiva e uma sede por vingança, com uma exceção — ela ainda guarda com carinho as memórias da terra que ela e os ancestrais dela estabeleceram e desenvolveram.</p>",
    background: "<p><strong>Características:</strong> Além de ser anormalmente grande para uma humana, o espírito possui um buraco do tamanho de um punho logo abaixo da jugular e está coberto por tatuagens azuis brilhantes. A rainha recobrará os sentidos caso alguém mencione o reino dela (Ureld), o que significa que é possível negociar com ela (requer Mestre do Saber em nível mestre).</p><p><strong>Nível Grão-Mestre:</strong> O nível grão-mestre de Força da Empunhadura Dupla dá à Serala-Han um ataque extra com a inércia, mesmo se o ataque inicial acertar seu alvo. O efeito ativo de quebrar armadura do nível mestre se aplica a ambos os ataques, caso ela decida usá-lo.</p><p><strong>Habilidade Inesperada:</strong> Serala-Han Urel é Robusta, o que, de acordo com a lenda, é o resultado dela descender dos gigantes de gelo do norte distante. Ela também possui a habilidade de expelir a vingança furiosa que a domina como uma rajada de energia corruptiva.</p><p><strong>Fraqueza:</strong> A única fraqueza real da rainha é o amor duradouro dela por seu antigo reino, Ureld. Os que a elogiarem de forma convincente pelas conquistas [Persuasivo←Resoluto] podem ser autorizados a partir vivos do palácio arruinado. Caso alguém use histórias e evidências fabricadas para convencê-la de que um herdeiro por direito ao trono de Ureld retornou [Persuasivo←Resoluto+5], ela finalmente ficará em paz e partirá do mundo dos vivos para sempre.</p>",
    tactics: "A rainha faz uso pleno de sua habilidade manifestação, atacando fisicamente enquanto permanece imaterial em todos os outros aspectos. Ela gosta de liberar uma tempestade de corrupção antes de começar a girar seu machado duplo, primeiro em inimigos que não tenham sido afetados pelo traço Frio da Tumba, então nos místicos e guerreiros com armas mágicas."
  },
  "Uhux": {
    name: "Uhux",
    race: "Morto-Vivo (Troll)",
    shadow: "Vermelho azulado, como o sangue anóxico das veias mais profundas (completamente corrompido)",
    appearance: "<p><strong>O ARQUITROLL LENDÁRIO</strong></p><p>A lenda do arquitroll Uhux é bem conhecida por toda a região da Davokar. O monstro tem aterrorizado tudo e todos por séculos e o fato de que não tem sido visto há quase uma década apenas alimenta as fantasias dos bárbaros e ambrianos. Alguns dizem que ele está no Além-mundo, engordando para uma campanha de guerra para exterminar a humanidade; aqueles com mais conhecimento sobre o ciclo de vida troll assumem que ele está passando pela quarta hibernação e vai voltar ainda maior, mais forte e mais faminto do que nunca.</p><p>Entretanto, a verdade é que Uhux foi morto há oito anos pelo herói de guerra Vojondan de Vajvod, que também morreu pelos ferimentos, sozinho nas profundezas da Davokar. Infelizmente, a história de Uhux não acabou ali, pois a escuridão da alma dele o ergueu como morto-vivo meia década depois. Agora ele está de volta, indo para o sudoeste, na direção de assentamentos bárbaros e entrepostos ambrianos...</p>",
    background: "<p><strong>Características:</strong> A parte de cima do crânio de Uhux está partida, como se atingido por um machado grande, e uma gosma amarelada parecida com pus escorre constantemente por sua face e pescoço.</p><p><strong>Nível Grão-Mestre:</strong> Com o nível grão-mestre de Punho de Ferro, Uhux causa 1d10 (+5) de dano em todos os seus ataques, como uma ação Passiva.</p><p><strong>Habilidade Inesperada:</strong> Uhux é um morto-vivo, e um efeito da condição morta-viva é que ele exala substâncias tóxicas como gosmas e vapores — ele possui os traços Venenoso e Aura Nociva.</p><p><strong>Fraqueza:</strong> Algumas bruxas e elfos sabem que Uhux é hipersensível ao salgueiro e às energias sagradas — armas santificadas feitas de salgueiro (ou seja, flechas, lanças, cajados de madeira) possuem a qualidade Contundente, mas a proteção natural do arquitroll (de Armadurado, Amoque e Robusto) contra tais ataques é reduzida pela metade e o dano sofrido não pode ser regenerado.</p>",
    tactics: "Uhux avança na batalha cercado por vapores venenosos, cantarolando uma melodia sombria que cativa a todos os ouvintes ao seu redor. Então ele deixa suas garras cantarem até que não reste ninguém para ouvir sua canção sangrenta."
  },
  "Blackhawk, minstrel": {
    name: "Falcão Negro, menestrel",
    race: "Humano",
    shadow: "Verde ou cobre",
    appearance: "<p>O menestrel Falcão Negro viaja ao longo da borda da Davokar entretendo os outros em troca de xelins e ortegas. O bardo excessivamente gentil, ‘ensinado pelos elfos de Ylhurandy’ segundo ele, é um beberrão, mas sabe muito sobre as lendas da região. Se ninguém mais contou a lenda do Coração de Jakad aos personagens jogadores, Falcão Negro o fará. O menestrel não tem intenção de lutar senão em legítima defesa, mas pode ser persuadido a empunhar sua clava com espinhos se os PJs conseguirem fazer que ele entenda que eles devem permanecer juntos para sobreviver.</p>"
  },
  "Koldra, innkeeper": {
    name: "Koldra, estalajadeira",
    race: "Humana (Ambriana)",
    shadow: "Prateado cintilante",
    appearance: "<p>Koldra é uma pessoa carismática, com mãos duras devido à sua carreira anterior como caçadora de fortunas.</p>"
  },
  "Mangold, plant-loving house-ogre": {
    name: "Mangold, ogro doméstico amante das plantas",
    race: "Ogro",
    shadow: "Vermelho carmesim",
    appearance: "<p>Mangold é um ogro extraordinariamente manso, mais feliz quando cuida do jardim da estalagem. Quando o ogro fica agitado — por exemplo, se Koldra ou sua família estiver ameaçada — você pode usar os valores de um Saqueador.</p>"
  }
};

function locateActors(text) {
  const locations = new Map(); let index = 0;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "actors") locations.set(path[3], { start, end: index }); }
  function object(path) { index += 1; ws(); if (text[index] === "}") { index += 1; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index += 1; ws(); if (text[index] === "]") { index += 1; return; } let n = 0; while (index < text.length) { value([...path, n++]); ws(); if (text[index] === "]") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); ws(); if (index !== text.length) throw new Error("Unexpected trailing data."); return locations;
}

const beforeActorKeys = Object.keys(actors);
const beforeItems = new Map(beforeActorKeys.map((key) => [key, Object.keys(actors[key].items ?? {})]));
for (const [key, fields] of Object.entries(translations)) {
  const actor = actors[key];
  if (!actor) throw new Error(`Missing actor '${key}'.`);
  Object.assign(actor, fields);
  for (const [itemKey, item] of Object.entries(actor.items ?? {})) if (sharedItems[itemKey]) item.name = sharedItems[itemKey];
  for (const [itemKey, applyTranslation] of Object.entries(embeddedItemTranslations[key] ?? {})) {
    const item = actor.items?.[itemKey];
    if (!item) throw new Error(`Missing embedded item '${key}.${itemKey}'.`);
    applyTranslation(item);
  }
}
if (JSON.stringify(Object.keys(actors)) !== JSON.stringify(beforeActorKeys)) throw new Error("Actor keys changed.");
for (const [key, itemKeys] of beforeItems) if (JSON.stringify(Object.keys(actors[key].items ?? {})) !== JSON.stringify(itemKeys)) throw new Error(`Item keys changed for '${key}'.`);

const locations = locateActors(source);
const replacements = Object.keys(translations).map((key) => ({ ...locations.get(key), value: actors[key], key }));
if (replacements.some((replacement) => replacement.start == null)) throw new Error("Could not locate every actor.");
const eol = source.includes("\r\n") ? "\r\n" : "\n"; let output = source;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) { const lineStart = source.lastIndexOf("\n", replacement.start - 1) + 1; const indent = source.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? ""; const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`); output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end); }
const reparsed = JSON.parse(output).entries?.[ENTRY];
if (!reparsed || JSON.stringify(reparsed.actors) !== JSON.stringify(actors)) throw new Error("Serialized actor data mismatch.");
if (!checkOnly && output !== source) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: output !== source, actorsChanged: Object.keys(translations).length }, null, 2));
