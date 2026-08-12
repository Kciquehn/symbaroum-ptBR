const fs = require("fs");

const SOURCE_EXPORT = "C:/Fontes de Symbaroum/tmp/core-source-documents.json";
const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const JOURNAL = "Book 3: The GM Guide";
const PAGE = "3.06 - Monsters and Adversaries";

const normalize = (value) => String(value ?? "")
  .replace(/<[^>]+>/g, " ")
  .replaceAll("&rsquo;", "’").replaceAll("&lsquo;", "‘")
  .replaceAll("&rdquo;", "”").replaceAll("&ldquo;", "“")
  .replaceAll("&ndash;", "–").replaceAll("&mdash;", "—")
  .replaceAll("&minus;", "−").replaceAll("&nbsp;", " ")
  .replaceAll("&amp;", "&").replaceAll("&quot;", '"')
  .replace(/\s+/g, " ").trim();
const visible = (html) => String(html ?? "").split(/(<[^>]+>)/)
  .filter((part) => !part.startsWith("<") && normalize(part))
  .map(normalize);

const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const entry = data.entries[ENTRY];
const page = entry.journals[JOURNAL].pages[PAGE];
const sourceEntry = JSON.parse(fs.readFileSync(SOURCE_EXPORT, "utf8"))[0].value;
const sourceActors = Object.fromEntries(sourceEntry.actors.map((actor) => [actor.name, actor]));
const exact = new Map();
const names = new Map();
const shadowPrefixes = [];

function addExact(en, pt) {
  en = normalize(en); pt = normalize(pt);
  if (en && pt && en !== pt && !exact.has(en)) exact.set(en, pt);
}
function addHtml(en, pt) {
  const left = visible(en); const right = visible(pt);
  if (left.length === right.length) left.forEach((value, index) => addExact(value, right[index]));
  else if (left.length === 1 && right.length) addExact(left[0], right.join(" "));
}

for (const [englishName, translation] of Object.entries(entry.actors)) {
  const actor = sourceActors[englishName];
  if (!actor) continue;
  names.set(englishName, translation.name || englishName);
  addExact(englishName, translation.name);
  addExact(actor.system?.bio?.race, translation.race);
  addExact(actor.system?.bio?.shadow, translation.shadow);
  if (actor.system?.bio?.shadow && translation.shadow) shadowPrefixes.push([normalize(actor.system.bio.shadow), normalize(translation.shadow)]);
  addHtml(actor.system?.bio?.appearance, translation.appearance);
  addHtml(actor.system?.bio?.background, translation.background);
  addHtml(actor.system?.bio?.tactics, translation.tactics);
  const sourceItems = Object.fromEntries((actor.items || []).map((item) => [item.name, item]));
  for (const [itemName, itemTranslation] of Object.entries(translation.items || {})) {
    names.set(itemName, itemTranslation.name || itemName);
    addExact(itemName, itemTranslation.name);
    const sourceItem = sourceItems[itemName];
    if (sourceItem) addHtml(sourceItem.system?.description, itemTranslation.description);
  }
}
for (const [englishName, translation] of Object.entries(entry.items || {})) {
  names.set(englishName, translation.name || englishName);
  addExact(englishName, translation.name);
}

const fixed = {
  "Monsters and Adversaries": "Monstros & Adversários",
  "Elves": "Elfos", "Trolls": "Trolls", "Humans": "Humanos", "Spiders": "Aranhas",
  "Predators": "Predadores", "Reptiles": "Répteis", "Winged Creatures": "Criaturas Aladas",
  "Abominations": "Abominações", "Undead": "Mortos-Vivos",
  "Category: Cultural Being": "Categoria: Seres culturais", "Category: Beast": "Categoria: Bestas",
  "Category: Abomination": "Categoria: Abominação", "Category: Undead": "Categoria: Morto-Vivo",
  "Race": "Raça", "Resistance": "Resistência", "Traits": "Traços", "Abilities": "Habilidades",
  "Weapons": "Armas", "Armor": "Armadura", "Defense": "Defesa", "Toughness": "Vitalidade",
  "Pain Threshold": "Limiar de Dor", "Equipment": "Equipamento", "Shadow": "Sombra", "Tactics": "Táticas",
  "Accurate": "Preciso", "Cunning": "Astuto", "Discreet": "Discreto", "Persuasive": "Persuasivo",
  "Quick": "Rápido", "Resolute": "Resoluto", "Vigilant": "Vigilante",
  "Weak": "Fraca", "Ordinary": "Comum", "Challenging": "Desafiadora", "Mighty": "Poderosa",
  "None": "Nenhuma", "Nothing of value": "Nada de valor", "Human": "Humano", "Elf": "Elfo",
  "Weapons, Armor and Defense": "Armas, Armadura e Defesa"
};
for (const [en, pt] of Object.entries(fixed)) addExact(en, pt);

const actorText = (name, field) => normalize(entry.actors[name]?.[field]);
const manual = new Map(Object.entries({
  2: "ESTE CAPÍTULO APRESENTA",
  3: "cerca de trinta monstros e adversários que são habitualmente encontrados em Ambria e Davokar. Para facilitar para o MJ ver como eles estão conectados, as criaturas são organizadas por famílias (por exemplo elfos, predadores e abominações). As famílias são, por sua vez, relacionadas às categorias de criaturas descritas nos capítulos anteriores.",
  6: "DE ACORDO COM OS MITOS",
  7: "bárbaros, os elfos chegaram na região ao norte das Titãs na época da queda de Symbaroum; alguns até mesmo dizem que foi o príncipe élfico Eneáno que plantou a floresta Davokar na esperança de enterrar a terra maculada do império caído. Qualquer que seja a verdade, os elfos atualmente vivendo na Davokar se portam como os guardiões da mata. E referenciando tratados antigos, eles demandam que tanto os bárbaros quanto os ambrianos fiquem longe das profundezas da Davokar e de todas as ruínas de Symbaroum. Cada violação desses tratados é vista como um ato de guerra.",
  8: "Quando os ambrianos chegaram na região, eles tinham pouco conhecimento sobre elfos, e o homem comum ainda acredita que os diversos estágios de vida dos elfos são tipos muito diferentes de criaturas. Contudo, conversas com bruxas e os poucos emissários élficos que chegaram em Yndaros sugerem que os elfos vivem suas vidas em um número de fases, separadas por um período de dormência na qual o elfo passa por mudanças físicas e mentais. Também é indicado que apenas alguns sobrevivem à dormência, enquanto a maioria apodrece e morre antes de acordar para a próxima fase. Em outras palavras: mesmo que existam alguns elfos vivos atualmente que estavam por aí na época da queda de Symbaroum, eles são, pela razão mencionada acima, poucos e é quase impossível de se comunicar com eles.",
  9: "Esta seção introduz as primeiras três fases da vida do povo da floresta. Também existem elfos mais velhos, mas eles são amplamente desconhecidos pelos ambrianos e, além disso, altamente discutíveis. A maioria das autoridades concorda que a vida dos elfos inclui pelo menos quatro fases, possivelmente cinco. Se for assim, a quarta fase consistiria dos supostamente reclusos Elfos do Inverno; e a quinta de um número extremamente pequeno que sobrevive ao quarto sono e acorda como seres extremamente poderosos, por exemplo a assustadora Aloéna em Karvosti. Mas esta teoria está distante de ser considerada um fato. Em vez disso existem aqueles que alegam que Aloéna e outros como ela não tem relação com os elfos; que são uma raça separada de indivíduos antigos, que são semideuses terrenos ou que são a incorporação de forças da natureza.",
  11: "Os blocos de estatísticas nesta seção apresentam valores para armas, Armadura e Defesa conforme os traços e habilidades da criatura. Você ainda precisa verificar os traços e habilidades específicos para compreender que tipo de ações a criatura pode executar, mas os valores de dano, Armadura e Defesa já incluem os efeitos destes em suas características. Finalmente, note que abaixo de Armas, um atributo é mencionado. Este é o atributo que a criatura usa (mais frequentemente) quando ataca, novamente, conforme as habilidades possuídas.",
  58: "ELFINO (ELFO DO VERÃO)", 88: "Vigilante/Preciso", 131: "Vigilante/Preciso",
  148: actorText("Autumn Elf", "appearance"), 149: actorText("Autumn Elf", "background"), 175: "Mestre do Saber (mestre), Médico (mestre), Poder Místico (Dobrar Vontade, mestre), Poder Místico (Fervilhar Larvas, mestre), Ritualista (mestre)",
  193: "*Graças à proteção mística enquanto aprende os rituais.", 194: "Trolls", 196: "ENTRE OS AMBRIANOS",
  197: "o troll é a epítome dos muitos horrores da Davokar. Caso acredite nas histórias contadas em tavernas e estalagens, os trolls são numerosos, mas também são um grupo variado de criaturas, dos brutos do tamanho de humanos a autênticos beemotes. É evidente que eles são guiados pela fome, além de que eles também não têm os medos e cautelas dos humanos, dois fatos que os tornam inclinados a atacar viajantes e caravanas nos ermos mesmo se estiverem em menor número.",
  198: "Em pesado contraste com a experiência ambriana, lendas bárbaras falam de trolls civilizados; trolls vivendo em aldeias subterrâneas organizadas; trolls que cavam pelo solo em busca de gemas e metais, que tecem roupas mágicas e fermentam bebidas curativas. Mas o especialista sobre o tópico na Ordo Magica, o Mestre de Capítulo Argoi em Kurun, diz que mesmo que isso pudesse ser verdade há um ou dois séculos, a maioria dos trolls de hoje é muito agressiva para obedecer, se comprometer ou raciocinar; habilidades necessárias em todas as comunidades civilizadas.",
  199: "TROLL ENFURECIDO", 247: "TROLL ENFURECIDO, GREGÁRIO", 276: "Pele de troll 4 (regenera 4 de vitalidade/turno, exceto dano de ácido ou fogo)",
  290: actorText("Liege Troll", "appearance"), 291: actorText("Liege Troll", "background"), 320: "Garras 13 (curta), 2 ataques no mesmo alvo 13/10", 322: "Pele de troll 7 (regenera 4 de vitalidade/turno, exceto dano de ácido ou fogo)", 330: "Antídoto fraco, equipamento alquímico rude, joias e tranqueiras (1D10 táleres), veneno fraco", 363: "Alquimia (mestre), Amoque (mestre), Excepcionalmente Vigoroso (mestre), Excepcionalmente Resoluto (mestre), Punho de Ferro (mestre)", 368: "Pele de troll 10 (regenera 4 de vitalidade/turno, exceto dano de ácido ou fogo)", 376: "Antídoto forte, colírio, equipamento alquímico, elixir da vida, 10 pães de viagem, pó de espectro, veneno forte.",
  381: "Adversários Humanos", 383: "ATOS DE VIOLÊNCIA",
  384: "estão ao alcance tanto de bárbaros quanto de ambrianos — os últimos devido ao passado guerreiro e a tendência a valorizar a comunidade sobre o indivíduo corresponde à cultura do clã bárbaro e às duras condições de vida na Davokar. Assim, “Onde os pensamentos acabam, os punhos assumem” é um provérbio apropriado para descrever a administração de conflitos em ambos os grupos, exceto em situações em que pensamentos nunca estiveram em pauta.",
  385: "Se um humano age como amigo ou inimigo é, obviamente, determinado pelas circunstâncias. Para uma pessoa que não hesita em se envolver com os poderes corruptos da Davokar, o cultista pode ser tanto um amigo quanto um inimigo; o oposto se aplica aos caçadores de bruxas. Geralmente alguém pode dizer que não importa que alianças você pode ter ou a quais ideais aspira, você sempre irá fazer mais inimigos do que amigos; o povo da região da Davokar não é completamente neutro e ninguém sobrevive por muito tempo sem se aliar a uma ou outra facção.",
  386: "CULTISTA", 397: "Mateiro ou Privilegiado", 418: "Arma de uma mão 4", 428: "Capuz e máscara, 1D10 xelins", 471: "Capuz bordado e uma máscara fantasmagórica, 1D10 táleres", 476: "LADRÃO", 486: "Mateiro (humano) ou Vida Curta (goblin)", 507: "Arma de uma mão 4, Arma de arremesso 3",
  517: "1D6 armas de arremesso, bolsa de resina de mascar, 1D10 ortegas", 521: actorText("Robber", "tactics"), 550: "Espada e machado 4, 2 ataques no mesmo alvo", 560: "Chapéu de abas largas com uma pena colorida, 1D10 xelins",
  565: "PATRULHEIRO", 593: "Ataque Gêmeo (novato), Médico ou Mestre do Saber ou Saber de Bestas (novato), Tático (adepto)", 596: "Arco 4, Espada 4 e Adaga 3", 606: "Dez flechas, 1 cura herbal (se Médico, 5 doses), pergaminhos (sobre a área de especialidade), pão de viagem, 1D10 xelins", 638: "Astuto/Preciso", 639: "Espada de duelo 5 (equilibrada) e espada 4; Arco longo 4 (precisa)", 649: "2 curas herbais, mapa da área, pão de viagem, 1D10 táleres", 653: actorText("Ranger Captain", "tactics"),
  654: "CAÇADORES DE BRUXAS", 655: actorText("Self-Taught Witchhunter", "appearance"),
  695: "Ferramentas para interrogatório, livro com orações, 1D10 xelins", 738: "Ferramentas para interrogatório, livro com orações, incensos, 1D10 táleres",
  743: "CAÇADOR DE TESOUROS", 744: actorText("Fortune-Hunter", "appearance"), 745: actorText("Fortune-Hunter", "background"), 747: "CAÇADOR DE FORTUNAS", 749: "Cambiante, humano ou goblin", 753: "Mateiro (humano), Vida Curta e Pária (goblin), Vida Longa (cambiante)", 819: "Pele dura e couro 4 (obstrutiva)", 827: "Saco com comida podre",
  832: "GUERREIROS DO CLÃ", 874: "Armadilhas de caça e equipamento de pesca, estatueta de madeira (o espírito guardião do clã), 3 lanças de arremesso, 1D10 ortegas", 907: "Machado Duplo 11 (impacto profundo), ignora Armadura", 917: "Uma caneca de madeira ou metal, estatueta de madeira (o espírito guardião do clã), pedra para afiar o machado, 1D10 xelins",
  922: "Os Guerreiros dos Clãs", 923: "Se você olhar de perto os membros da Guarda da Ira, você verá variações causadas pela herança de guardas individuais.",
  924: "As peculiaridades mais comentadas em Ambria são mostradas pelos guerreiros de Baiaga e Karohar; o primeiro lutando junto de seus baiagorns domados, o último armado com armas-garras de trinta centímetros e atiradores de lanças. Mas outros guerreiros de clãs também têm suas peculiaridades. Por exemplo, os lutadores de Gaoia usam venenos mais frequentemente que os outros e alguns deles dominam a habilidade de arremessar aranhas venenosas em seus adversários. Entre os lutadores do clã Enoai, você encontrará os renomados domadores de trolls, que aprenderam como subjugar e controlar trolls enfurecidos, para usar como guardas de acampamento ou como vanguarda em batalha.",
  925: "Ao mencionado acima, provavelmente devem ser adicionados os rumores não verificados sobre o chamado Clã Predador. A julgar pelos contos, seus guerreiros raivosos são alimentados por elixires fortes e equipados com armas naturais criadas pelas artes sombrias conhecidas como esculpir ossos e forjar carne; chifres, presas, garras ou membros deformados em foices de ossos serrilhadas.",
  927: "Categoria: Bestas", 928: "NOS CONTOS DOS", 929: "bárbaros, as aranhas aparecem como um dos seres mais nobres e poderosos, pelo menos da perspectiva histórica. A lenda do Rei Aranha também é bem conhecida entre os ambrianos; um impiedoso senhor da guerra que governou a mata há cinco séculos; membro de um clã monstruoso de humanoides parecidos com aranhas e com uma hoste de aranhas e criaturas anfíbias de formas variadas.",
  930: "A maioria das histórias sugere que foi a ameaça do Rei Aranha que motivou os bárbaros a se unirem sob o Alto Chefe, e que suas forças combinadas conseguiram esmagar o império dele. A lenda também implica que o clã monstruoso ainda vive nas profundezas da Davokar, e que ainda existem aranhas gigantes e sapos monstruosos descendentes das hordas do monarca. Conexões também foram feitas entre a estátua esquelética em Forte do Cardo e o suposto Clã Predador, mas de acordo com a Ordo Magica, não existem relatos confiáveis que apoiem tais teorias. Em vez disso, a maioria acredita que, se existe alguma verdade na lenda, tanto o clã do Rei Aranha quanto todas as raças maiores de aranhas foram eliminadas nas campanhas dos primeiros Altos Chefes. Certamente, aranhas ainda prosperam na Davokar e são, de fato, uma ameaça séria, mas não são especialmente organizadas ou inteligentes.",
  932: actorText("Etterherd", "appearance"), 962: "Mordida 3, veneno 2 por 2 turnos", 1008: "Mordida 3, veneno 2 por 2 turnos", 1018: "Nenhum, mas suas teias podem conter objetos interessantes de vítimas anteriores (valor: 1 táler por ferrão-gotejante)",
  1024: "Categoria: Bestas", 1025: "DAVOKAR ESTÁ CHEIA", 1026: "de vida, o que, obviamente, é a razão principal do porquê os bárbaros escolhem suportar seu ambiente perigoso. Contudo, acompanhando as presas estão múltiplos predadores; bestas que frequentemente se veem transformadas em vítimas nas garras de trolls, abominações e outros seres maiores que eles.",
  1027: "Os bárbaros desenvolveram uma cultura culinária que os alegra em rejeitar um lombo macio de veado em troca de carne tirada de predadores; quanto mais perigoso o predador, melhor a carne. Dizem, por exemplo, que o Alto Chefe Maiestikar recusava qualquer coisa em seu prato, exceto Lobos Vorazes ou Gigavalis.", 1029: actorText("Mare Cat", "appearance"), 1059: "Mordida 4 (curta), veneno 2 por 2 turnos", 1075: actorText("Baiagorn", "appearance"), 1165: actorText("Aboar", "tactics"),
  1167: "Categoria: Bestas", 1168: "A QUESTÃO DE", 1169: "existirem ou não dragões na Davokar é muito debatida. Alguns eruditos alegam que lendas bárbaras, relatórios de expedições profundas e, além disso, detalhes na arquitetura de Symbaroum provam que dragões são reais. Por outro lado, seus oponentes dizem que os contos dos bárbaros realmente falam sobre linnormes, que todas as autoproclamadas testemunhas estavam loucas e que muitos detalhes parecidos com dragões nas ruínas de Symbaroum dificilmente podem ser tomados como evidências já que imagens similares eram vistas em Alberetor sem quaisquer dragões reais para inspirar os artistas.",
  1170: "O debate provavelmente vai continuar e, por enquanto, artistas ambrianos têm répteis menores e mais bestiais para usar como modelos para suas imagens de dragões. E existem muitos deles por aí, na forma de serpentes e lagartos, sem falar nas tartarugas, habitando as regiões ribeirinhas. Muitos dos répteis são venenosos, e quase todos têm sido apontados como incorporações da escuridão da Davokar pela Igreja de Prios; uma circunstância explicada pelo Primeiro Padre Jeseebegai como relacionada ao fato deles serem especialmente sensíveis à corrupção natural permeando o solo e as águas da floresta.",
  1171: "ASSIM FALOU AROALETA", 1172: "“… e sob o musgo e as raízes, sob as trilhas de rastejantes e de larvas, existem cavernas banhadas na escuridão do submundo; lá prosperam diabretes e ossos pálidos; lá a mácula cresce em paredes rochosas e casulos abomináveis; onde os que lamentam caminham nos Salões das Mil Lágrimas, circundando uma fonte perto de transbordar …”", 1174: actorText("Kanaran", "appearance"), 1201: "Acrobacias (mestre), Excepcionalmente Astuto (novato), Excepcionalmente Rápido (novato), Estrangulador (novato)", 1220: actorText("Lindworm", "background"), 1248: "Mordida 14 (curta), ou 2 ataques no mesmo alvo com dano 12 e 8",
  1260: "Verde esmeralda, como as folhas de um carvalho antigo, hipnoticamente se movendo com uma brisa de verão (corrupção: 0)", 1264: "Categoria: Bestas", 1265: "O SOM DE ASAS BATENDO", 1266: "significa coisas muito diferentes dependendo de onde você está na Davokar. Nas fronteiras, as copas das árvores estão cheias de pássaros canoros belos e coloridos, também apreciados por seus ovos e carne macia. Mais para dentro, você deve ser cauteloso para não acabar como um pedaço de carne pré-mastigada na boca de algum monstrinho saído dos ovos supramencionados.",
  1267: "E não são apenas com os vários pássaros monstruosos que você deve tomar cuidado. Assim como existem muitos anfíbios e aranhas imensas na Davokar, a floresta também contém uma variedade de insetos alados grandes o suficiente para arrancar a cabeça de humanos e ogros com uma mordida. De acordo com algumas lendas, pragas como a Mosca Dragão e o Enxameador semelhante a uma borboleta foram na verdade criadas pelos magos de Symbaroum. Mas a posição oficial tanto da Ordo Magica quanto da Igreja do Sol é que tais criaturas se desenvolveram de insetos comuns por causa da exposição prolongada à natureza corrupta da Davokar. Independente de qual teoria é a correta, existem boas razões do porquê viajantes com experiência nas profundezas da Davokar sentirem arrepios ao ouvir asas batendo, mesmo bem depois de terem retornado de suas expedições na floresta.", 1269: actorText("Violing", "appearance"), 1299: "Bico 3, 2 ataques contra o mesmo alvo", 1345: "Presas 8, 2 ataques contra o mesmo alvo",
  1362: "OS AMBRIANOS", 1363: "usam o termo Abominação para o que os bárbaros chamam de Bestas Maculadas; criaturas associadas de alguma maneira à escuridão corrompida da Davokar. Não está claro se todas as abominações são relacionadas ou se seria mais preciso falar de tipos diferentes de abominação, mas tanto a Ordo Magica quanto os Frades do Crepúsculo fazem tudo a seu alcance para aprender mais sobre o fenômeno.",
  1364: "De qualquer forma, o termo cobre uma variedade de seres que parecem ter um traço em comum: eles querem ferir humanos; eles desejam que os humanos sintam dor, que sofram, de preferência até a morte. E desejam isso com tanta paixão que nada mais importa. Você não pode negociar com uma abominação, nem fazer acordos ou amedrontá-las; a abominação parece viver para a destruição da humanidade, um indivíduo por vez, e não hesita em destruir qualquer coisa ou qualquer um que fique em seu caminho.",
  1365: "Sobre Abominações e o Submundo", 1366: "Inúmeras histórias contraditórias alegam relatar a verdade sobre a origem das abominações. Alguns dizem que elas representam uma raça antiga que está por aí desde antes dos Povos Antigos virem a luz do dia. Outros alegam que elas foram criadas ou geradas por elfos ou homens, por acidente ou intencionalmente e com algum intento malévolo.",
  1367: "Entre os Povos Antigos, uma noção comum parece ser que a origem das abominações está diretamente conectada com a queda de Symbaroum. Deve-se manter em mente, é claro, que essas histórias frequentemente alcançam os ambrianos pelas gargantas de bárbaros ou goblins. Mas dito isso, muitos desses contos antigos descrevem como os bruxos e alquimistas de Symbaroum fizeram experimentos horríveis, supostamente utilizando Magia Pura para perturbar a ordem natural, dessa forma gerando as abominações.",
  1368: "Qualquer que seja o caso, a maioria das lendas antigas também faz referência a algo às vezes chamado de Submundo, às vezes de Colinabaixo, às vezes de Abismo. Supostamente existe um mundo inteiro sob as raízes da Davokar, cheia de túneis, ruínas afundadas, lagos de magia ácida e fenômenos muito piores que esses. E de fato existem alguns exploradores ambrianos que alegam ter vagado por esse reino escondido, frequentemente tendo descido em um sumidouro ou outro. Mas mesmo se as autoridades da Ordo Magica aceitarem que tais complexos subterrâneos existem, ninguém acreditaria que a floresta inteira possa estar sobre um vasto “Submundo”. Como o próprio Seldonio disse: “Ridículo, meu caro Barão, o que você alega não faz o menor sentido!”", 1369: "NASCIDO DA MÁCULA",
  1370: actorText("Blight Born Human", "appearance"), 1371: actorText("Blight Born Human", "background"), 1404: "+9, sangue corrosivo 3 for 3 turnos", 1410: "Ferramentas e itens relacionados à sua antiga ocupação, 1D10 ortegas", 1414: actorText("Blight Born Human", "tactics"),
  1511: "Sangue Ácido (III), Armadurado (III), Ataque Corruptivo (III), Arma Natural (III), Regeneração (III), Robusto (III)", 1532: "Garras 20 (longa), ou 2 ataques contra o mesmo alvo com dano 18 e 14, +1D8 em corrupção temporária", 1534: "Carne maculada endurecida 10, regenera 4 de vitalidade/turno", 1544: actorText("Primal Blight Beast", "tactics"), 1547: "AMBRIANOS CONHECEM BEM", 1548: "o fato de que o que está morto não necessariamente partiu; a Grande Guerra significou duas décadas de batalhas contra os mortos-vivos e espíritos acorrentados dos Lordes Negros. Mas a região ao norte das Titãs provou exceder suas experiências anteriores, tanto em termos de escuridão e malignidade, quanto de fertilidade e vitalidade.",
  1549: "Os mortos-vivos não são automaticamente hostis com os vivos, embora eles tendam a ser irritáveis e inclinados à fúria invejosa. Dizem que alguns mortos-vivos são capazes de se comunicar com os vivos, e a Igreja do Sol já acusou abertamente a Ordo Magica de ter um ramo herético especializado em caçar e conversar com os mortos. Os membros da Ordem negam enfaticamente, mas Seldonio também agradeceu publicamente e com humor pela dica do Primeiro Padre; se fosse possível se comunicar com os espíritos daqueles que estavam vivos nos dias de Symbaroum, isso poderia muito bem levar a informações vitais e ao ressurgimento de antigas verdades sobre a natureza da magia.",
  1550: "LUZ GÉLIDA", 1554: "LUZ GÉLIDA", 1581: "Toque de morte 3, ignora armadura, danifica Vigoroso", 1583: "Nenhuma, metade de dano de armas normais", 1598: visible(entry.actors.Dragoul.background)[0], 1599: visible(entry.actors.Dragoul.background)[1], 1638: "1D10 ortegas", 1640: `${entry.actors.Dragoul.shadow} (completamente corrompida)`, 1674: "Garras de espectro 5, ignora armadura, danifica Resoluto", 1676: "Nenhuma, somente poderes místicos e armas mágicas são nocivas, com apenas metade do dano", 1720: "2 espadas 7/6 (equilibrada), 2 ataques conta o mesmo alvo", 1722: "Nenhuma, somente poderes místicos e armas mágicas são nocivas, com apenas metade do dano", 1724: "−3 (duas armas)", 1732: "Como o céu noturno sem nuvens, com uma luz suave que não faz nada além de fazer a escuridão parecer mais escura (completamente corrompida)", 1734: actorText("Cryptwalker", "tactics")
}).map(([index, value]) => [Number(index), value]));

const terms = [...names, ...Object.entries({
  novice: "novato", adept: "adepto", master: "mestre", flexible: "flexível", impeding: "obstrutiva",
  short: "curta", long: "longa", balanced: "equilibrada", deep: "profundo", corruption: "corrupção",
  thoroughly: "completamente"
})].sort((a, b) => b[0].length - a[0].length);

function translated(value, index, nodes) {
  const clean = normalize(value);
  if (manual.has(index + 1)) return manual.get(index + 1);
  if (clean === "Strong") return normalize(nodes[index - 1]) === "Resistance" ? "Forte" : "Vigoroso";
  if (clean === "None") {
    const previous = normalize(nodes[index - 1]);
    return previous === "Equipment" ? "Nenhum" : "Nenhuma";
  }
  if (exact.has(clean)) return exact.get(clean);
  for (const [en, pt] of shadowPrefixes) {
    if (!clean.startsWith(`${en} (`)) continue;
    return `${pt}${clean.slice(en.length)}`
      .replace("(corruption:", "(corrupção:")
      .replace("(thoroughly corrupt)", "(completamente corrompida)");
  }
  if (clean.length > 100) throw new Error(`Missing official mapping for node ${index + 1}: ${clean}`);
  return clean.split(/(@UUID\[[^\]]+\])/).map((segment) => {
    if (segment.startsWith("@UUID[")) return segment;
    let output = segment;
    for (const [en, pt] of terms) output = output.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), pt);
    return output;
  }).join("");
}

const nodes = visible(page.text);
if (require.main === module) {
  let changed = 0;
  const unresolved = [];
  nodes.forEach((node, index) => {
    const result = translated(node, index, nodes);
    if (result !== node) changed += 1;
    if ((!manual.has(index + 1) && !exact.has(node) && node.length > 100 && !/^@UUID/.test(node)) ||
        (result === node && /[A-Za-z]{3}/.test(node) && !/^@UUID/.test(node))) unresolved.push([index + 1, node]);
  });
  console.log(JSON.stringify({ total: nodes.length, changed, unresolved: unresolved.length }, null, 2));
  for (const [index, node] of unresolved) console.log(`${index}\t${node}`);
}

module.exports = { normalize, visible, translated, nodes };
