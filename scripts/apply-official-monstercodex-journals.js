const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const ENTRY = "Symbaroum Monster Codex";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const entry = data.entries?.[ENTRY];
if (!entry?.journals || !entry?.actors) throw new Error(`Missing '${ENTRY}' journals or actors.`);

function translateVisibleHtmlByIndex(html, replacements, label) {
  let visibleIndex = 0;
  const applied = new Set();
  const translated = html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) return part;
    const normalized = part.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim();
    if (!normalized) return part;
    visibleIndex += 1;
    if (!replacements.has(visibleIndex)) return part;
    const leading = part.match(/^\s*/)?.[0] ?? "";
    const trailing = part.match(/\s*$/)?.[0] ?? "";
    applied.add(visibleIndex);
    return `${leading}${replacements.get(visibleIndex)}${trailing}`;
  }).join("");
  if (applied.size !== replacements.size) {
    const missing = [...replacements.keys()].filter((index) => !applied.has(index));
    throw new Error(`${label}: applied ${applied.size}/${replacements.size} indexed translations; missing ${missing.join(", ")}.`);
  }
  return translated;
}

function visibleNodesFromHtml(html) {
  return html.split(/(<[^>]+>)/)
    .filter((part) => !part.startsWith("<"))
    .map((part) => part.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function replaceOnce(text, oldValue, newValue, label) {
  const first = text.indexOf(oldValue);
  if (first < 0) throw new Error(`Missing ${label}.`);
  if (text.indexOf(oldValue, first + oldValue.length) >= 0) throw new Error(`Ambiguous ${label}.`);
  return text.slice(0, first) + newValue + text.slice(first + oldValue.length);
}

function replaceNthInner(text, expression, index, inner, label) {
  let seen = 0;
  let changed = false;
  const output = text.replace(expression, (whole, open, _oldInner, close) => {
    if (seen++ !== index) return whole;
    changed = true;
    return `${open}${inner}${close}`;
  });
  if (!changed) throw new Error(`Missing ${label} at index ${index}.`);
  return output;
}

function translateIntroduction(html) {
  if (html.includes("BESTAS, ÍNFEROS E ABOMINAÇÕES!")) {
    return html.replace("and our friends at Rollspel.nu", "e nossos amigos de Rollspel.nu e /r/Symbaroum");
  }
  html = replaceOnce(html, "BEASTS, FIENDS &amp; ABOMINATIONS!", "BESTAS, ÍNFEROS E ABOMINAÇÕES!", "introduction title");
  html = replaceNthInner(
    html,
    /(<p class="h4mod">)([\s\S]*?)(<\/p>)/g,
    0,
    `
            <strong>
                <span class="parahead">CERCA DE QUINZE ANOS ATRÁS, </span>
                a equipe de criação de Symbaroum lançou o bestiário para uma versão anterior do RPG Mutant, chamado Zonernas Zoologi (a Zoologia das Zonas). Quando se olha para trás para tudo que foi escrito e ilustrado, este livro magnífico é sempre mencionado na discussão de qual produto deixa a equipe mais orgulhosa e alegre. Sabendo disso, é fácil compreender que levou algum tempo até todos acharem que estavam prontos para trabalhar em um bestiário para as criaturas mais ou menos notáveis de Symbaroum. E não é nenhuma surpresa que o projeto tenha sido lançado com uma notável sensação de ansiedade em relação ao desempenho.
                <br /><br />
                Mas, agora, aqui esta ele: o Códice de Monstros de Symbaroum, repleto de bestas e abominações que estão à espreita para afundar suas presas, garras ou espadas nos personagens do seu grupo. O processo de produção foi guiado por três objetivos principais: o resultado deveria ser belo, agradável de ler e útil em jogo. E agora é você quem irá decidir o quão bem-sucedido o livro é. Mas, independentemente de qual for sua avaliação, a equipe entrega o livro pronto com um sentimento agradável de que este códice de monstros tornará Symbaroum um RPG ainda melhor.
                <br /><br />
                Bons jogos!
                <br /><br />
                Equipe Symbaroum
            </strong>
        `,
    "editorial paragraph"
  );
  html = replaceOnce(html, "The Advanced Player’s Guide", "O Guia Avançado do Jogador", "advanced guide heading");
  html = replaceNthInner(
    html,
    /(<p class="fancytext" style="color:hsl\(0, 0%, 0%\)">)([\s\S]*?)(<\/p>)/g,
    0,
    `
                Ao escrever o Códice de Monstros de Symbaroum, presumimos que você também tenha acesso ao Livro Básico e ao Guia Avançado do Jogador. É totalmente possível usar o material deste livro que você tem em mãos sem o livro de regras avançadas mas, nesse caso, quem estiver mestrando deve se preparar para ignorar ou substituir as habilidades e poderes místicos oriundos dele.
            `,
    "advanced guide text"
  );
  html = replaceOnce(html, "<h2 style=\"margin-right:282px;font-weight:bold\">Introduction</h2>", "<h2 style=\"margin-right:282px;font-weight:bold\">Bem-vindo...</h2>", "welcome heading");

  const pblocks = [
    `
            <strong><span style="color:hsl(19, 70%, 37%)">BEM-VINDO </span>... AO CÓDICE DE MONSTROS</strong> de Symbaroum, um livro que apresenta uma coleção de criaturas surpreendentes e fenômenos notáveis que podem ser encontrados na vasta floresta Davokar e arredores. Aqui, você encontrará monstros e adversários desconhecidos, ou ainda não catalogados, que estão muito ansiosos para submeter os personagens de seus jogadores a novos e mais difíceis desafios. Você também encontrará regras e diretrizes úteis para criar suas próprias monstruosidades únicas ou para preparar desafios interessantes em Ambria, Davokar ou nas montanhas.
            <br /><br />
            <strong>ESPERAMOS QUE ESTE</strong> bestiário demonstre como os habitantes mais ou menos bestiais de Symbaroum são construídos, para que você que veste a camisa de Mestre de Jogo tenha mais facilidade em criar, adicionar e modificar o conteúdo de acordo com suas preferências e necessidades. Este livro é dividido em três seções, intituladas Hordas da Noite Eterna, Monstros e Adversários, e Regras e Diretrizes — seções que são muito diferentes em estilo e conteúdo, mas que se complementam e que, juntas, fornecem material para muitas horas emocionantes (e provavelmente perigosas) na mesa de jogo.
        `,
    `
            A seção de abertura é, em muitos aspectos, baseada em seu nome — o trabalho original escrito pelo famoso estudioso de monstros Padre Almagast. Inicialmente, tínhamos planos de basear a maioria dos textos descritivos da seção nas palavras do venerável Manto Negro, mas logo notamos que suas análises, relatos e julgamentos transmitiriam uma descrição muito tendenciosa e confiante das criaturas em questão. Em vez disso, nos esforçamos para aplicar uma perspectiva mais ampla e menos categórica, para que as apresentações estejam mais alinhadas às incertezas que realmente existem quanto à sua história e natureza, também complementadas com exemplos de relatórios, representações e lendas nas quais o Manto Negro inspirou sua obra. Também vale mencionar que mantivemos grande parte do estilo e diagramação em homenagem ao Padre Almagast e, talvez, também na esperança de que ele nos perdoe por nos desviarmos de seus retratos em uma certa medida.
            <br /><br />
            Cada uma das vinte e sete partes de Hordas da Noite Eterna descreve uma criatura. Frequentemente, duas ou mais versões da mesma criatura são apresentadas (com idades, tamanhos ou categorizações diversas) e, às vezes, certas partes apresentam tipos diferentes do que pode parecer ser a mesma criatura. Contudo, no geral, a ideia é que cada parte sirva para dois fins principais: declarar algo e aprofundar o entendimento do cenário de Symbaroum e, ao mesmo tempo, apresentar adversários que podem desafiar o grupo de novas formas, seja social ou taticamente.
            <br /><br />
            Por fim, cada parte apresenta uma proposta de aventura. Quem mestra pode optar por usá-la como apresentado e desenvolvê-la como um cenário jogável, ou usá-la como inspiração e exemplo de como as várias criaturas podem ser colocadas em ação.
        `,
    `
            A segunda seção deste livro visa mais a quantidade do que a profundidade. Sem ser completamente exaustiva, ela apresenta cerca de noventa pessoas, animais e bestas com estatísticas e descrições curtas — algumas residindo nas sombras da Davokar, outras geralmente encontradas sob os céus abertos de Prios. A maioria é nova, mas também aproveitamos a oportunidade para coletar algumas das criaturas que foram introduzidas em publicações anteriores, como, por exemplo, os episódios de O Trono de Espinhos — com ou sem pequenos ajustes. Para quem mestra, a intenção é que esta seção facilite a pesquisa de estatísticas relevantes para adversários e monstros encontrados pelos personagens, mas também esperamos que possa funcionar como inspiração no processo de criação de personagens e bestas do mestre.
        `,
    `
            A seção final do Códice de Monstros apresenta trinta e sete traços monstruosos adicionais aos dezenove do Livro Básico — o suficiente para construir centenas de criaturas que desafiam os personagens de formas diferentes. Nesta seção, você também encontrará diretrizes sobre como desenvolver com equilíbrio suas próprias criaturas e desafios de combate, que esperamos serem suficientemente claras para explicar como as regras devem funcionar, ainda que curtas o bastante para não serem desnecessariamente exageradas. Além disso, esta seção apresenta dicas sobre como usar as várias criaturas do bestiário ao criar três tipos de campanhas de aventura — ou “Crônicas de Monstro”, como as chamamos.
            <br /><br />
            Concluindo, desejamos a você muita diversão com este livro, e torcemos para que ele atenda à nossa grande ambição: que este conteúdo forneça material para centenas de horas de jogos inesquecíveis num mundo em que o mesmo material contribui para tornar tudo ainda mais maravilhoso e cativante!
        `
  ];
  for (let index = 0; index < pblocks.length; index += 1) {
    html = replaceNthInner(html, /(<p class="pblock">)([\s\S]*?)(<\/p>)/g, index, pblocks[index], `pblock ${index}`);
  }

  const headings = [
    `
            SEÇÃO 1: <br />
            HORDAS DA NOITE ETERNA
        `,
    `
            SEÇÃO 2: <br />
            MONSTROS E ADVERSÁRIOS
        `,
    `
            SEÇÃO 3: <br />
            REGRAS E DIRETRIZES
        `
  ];
  for (let index = 0; index < headings.length; index += 1) {
    html = replaceNthInner(html, /(<h3>)([\s\S]*?)(<\/h3>)/g, index, headings[index], `section heading ${index}`);
  }

  const labels = new Map([
    ["CONSTRUCTION", "CRIAÇÃO"],
    ["ILLUSTRATIONS", "ILUSTRAÇÕES"],
    ["CONTRIBUTIONS", "CONTRIBUIÇÕES"],
    ["GRAPHIC DESIGN <br /> AND LAYOUT", "DESIGN GRÁFICO <br /> E DIAGRAMAÇÃO"],
    ["EDITING &amp; PROOFREADING", "EDIÇÃO E LEITURA DE PROVA"],
    ["SPECIAL THANKS TO:", "AGRADECIMENTOS ESPECIAIS A:"],
    ["FOUNDRY VTT VISUALISATION", "VISUALIZAÇÃO PARA FOUNDRY VTT"],
    ["MODULE TESTING", "TESTES DO MÓDULO"]
  ]);
  for (const [english, portuguese] of labels) html = replaceOnce(html, english, portuguese, `credit label '${english}'`);
  html = replaceOnce(html, "Symbaroum is a registered trademark of Fria Ligan AB.", "Symbaroum é uma marca registrada de Fria Ligan AB.", "trademark");
  html = replaceOnce(html, "and our friends at Rollspel.nu", "e nossos amigos de Rollspel.nu e /r/Symbaroum", "special thanks ending");
  return html;
}

const changes = new Map([
  ["Section 1: Hordes Of The Eternal Night", new Map([
    ["0 Introduction & Credits", translateIntroduction],
    ["01 Arachs", (html) => {
      const poisoner = entry.actors["Arach, Poisoner"];
      const exalted = entry.actors["Arach, Exalted"];
      const background = visibleNodesFromHtml(poisoner.background);
      const appearance = visibleNodesFromHtml(poisoner.appearance);
      if (background.length !== 2 || appearance.length !== 1) throw new Error("Unexpected translated Arach actor text structure.");
      const replacements = new Map([
        [1, "Provavelmente é verdade que poucas pessoas, se houver alguma, sabem tanto sobre os inimigos do Provedor das Leis quanto eu. Eu conheço todos eles, da abominação mais imensa à menor faísca, do mais antigo arquitroll até a mais jovem desova da mácula. Eu ouvi as lendas, estudei as anotações, examinei os cadáveres e espécimes vivos. Ainda assim, não tenho uma resposta definitiva para a pergunta que me encontra com mais frequência do que outras: qual é o monstro mais abominável sob o céu de Prios?"],
        [2, "Os candidatos são muitos, mas naturalmente existem aqueles que se destacam dos demais. As bestas maculadas antigas que devastavam e arruinavam desde muito antes da queda de Symbaroum exibem tanto a escuridão quanto a força para serem candidatos qualificados. E com certeza o mesmo pode ser dito sobre as serpentes do mundo, especialmente se a própria Serpente do Mundo despertar; e também os dragões, supondo que os rumores de seu retorno possam ser tomados como verdade. Além disso, existem outros mais astutos, e a esse respeito falo de bestas vis como salgueiros vorazes, faíscas parasitárias e enxameadores noturnos à espreita — todos imensamente famintos, espertos e calculistas em sua caçada por vida e sangue."],
        [3, "No entanto, é preciso pensar se não há outra criatura que ofusque a todos, uma criatura com o potencial real de afogar toda a Criação na escuridão da Noite Eterna. Mesmo que essa criatura se revele em luz, ela pode ser seduzida por caminhos mais sombrios se não for avisada sobre a tentação, ensinada a resistir à atração e punida por toda transgressão. Sim, caro leitor, estou falando de você. Estou falando sobre o humano…"],
        [4, "Trecho de Hordas da Noite Eterna, Padre Almagast"], [5, "Aracs"], [6, "OS PREDATÓRIOS ARACS"], [7, background[0]],
        [8, "ESSES RELATÓRIOS E RUMORES ESPORÁDICOS,"], [9, background[1]], [10, "A Transformação"],
        [11, "O processo pelo qual um ser cultural se transforma em arac envolve uma cerimônia realizada em duas fases. Inicialmente, um casulo de fios de seda em forma de ovo e tamanho humano é tecido. Através do poder e clangor do ritual recebe um brilho dourado. Este ovo pode esperar até um ano para a fase dois, quando um ser cultural atordoado ou inconsciente é colocado dentro dele."],
        [12, "Durante o canto de uma hora da segunda fase, o casulo encolhe lentamente enquanto os fios ficam mais duros e grossos, de modo que o prisioneiro finalmente é pego como se estivesse em um torno e a transformação pode começar. A criatura desnutrida que emerge cerca de um mês depois mantém suas memórias, mas é consumida pelo desejo de servir seus novos líderes e camaradas. É preciso passar em um Teste de Resoluto para que ele consiga sair do coletivo, e depois Testes repetidos para não voltar. Para realizar uma ação que é diretamente prejudicial a outros aracs, é necessário um Teste bem-sucedido de"],
        [13, "[Resoluto –5]"], [14, "."], [15, "DIZ-SE"], [16, appearance[0]], [17, poisoner.name],
        [18, "@UUID[Actor.JV7Z0YfuHYFBy4ML]{Arac Envenenador}"], [19, "ASSIM FALOU AROALETA"],
        [20, "“… e lá, no barulhento e sibilante enxame inimigo, lutou a cria de Angathal, ereta e orgulhosa. Com lança e machado, com mandíbulas gotejantes, arak-an e arak-zanz atacaram a fortaleza de Serembar…”"],
        [21, "ARAC ENVENENADOR"], [22, "Raça"], [23, poisoner.race], [24, "Resistência"], [25, "Ordinária"], [26, "Traços"],
        [27, "Armadurado (I), Arma Natural (I), Venenoso (I)"], [28, "Preciso"], [30, "Astuto"], [32, "Discreto"], [34, "Persuasivo"], [36, "Rápido"], [38, "Resoluto"], [40, "Vigoroso"], [42, "Vigilante"],
        [44, "Habilidades"], [45, "Ataque Furtivo (adepto)"], [46, "Armas"], [47, "Discreto/Preciso"],
        [48, "Mordida 3 (curta), +4 com Vantagem e veneno 2 por 2 turnos"], [49, "Armadura"], [50, "Pele coriácea 2"], [51, "Defesa"], [53, "Vitalidade"], [55, "Limiar de Dor"],
        [57, "Sombra"], [58, poisoner.shadow], [59, "Táticas"], [60, poisoner.tactics], [61, exalted.name],
        [62, "@UUID[Actor.eXsav69YEGX2cyGT]{Arac Exaltado}"], [63, "ARAC EXALTADO"], [64, "Raça"], [65, exalted.race], [66, "Resistência"], [67, "Forte"], [68, "Traços"],
        [69, "Companheiros (III; um Envenenador, um Ferrão-gotejante e um Rebanho Etter), Aura Nociva (II), Arma Natural (II), Venenoso (III), Teia (III)"],
        [70, "Preciso"], [72, "Astuto"], [74, "Discreto"], [76, "Persuasivo"], [78, "Rápido"], [80, "Resoluto"], [82, "Vigoroso"], [84, "Vigilante"],
        [86, "Habilidades"], [87, "Ataque Furtivo (adepto), Dominação (mestre), Mestre do Saber (adepto)"], [88, "Armas"], [89, "Persuasivo"],
        [90, "Mordida 4, +4 com Vantagem e veneno 4 por 4 turnos"], [91, "Armadura"], [92, "Nenhuma"], [93, "Defesa"], [95, "Vitalidade"], [97, "Limiar de Dor"],
        [99, "Sombra"], [100, exalted.shadow], [101, "Táticas"], [102, exalted.tactics],
        [103, "O fio que foi tecido tem começo, tem fim, mas nunca deixa de existir. O fio que acabou ainda permanece, para sempre ligado à existência — essencial, ininterrupto, imutável. Se o fim se fundir com o fim, o começo é vazio, o fim é vazio e aquilo que terminou torna-se eterno. Assim acontecerá, um dia, com Angathal Taar, nosso soberano e senhor do mundo."],
        [104, "Trecho da Profecia de Taar"], [105, "Querida irmã,"],
        [106, "Estou escrevendo para você de dentro de um ovo de fios dourados, com uma vela moribunda como minha única fonte de luz. As letras se espalham pelo pergaminho enquanto o veneno se espalha em minhas veias. Minha assassina está ao meu lado, seu corpo perfurado pelo meu confiável estoc; a morte capturou as muitas articulações de seus membros em ângulos não naturais, e seu rosto apresenta os quatro olhos da aranha em uma fileira. Suas mandíbulas são mandíbulas venenosas, uma delas quebrada e enfiada no fundo da minha coxa."],
        [107, "Minha outra mão está apertando a cruz de Taar, erroneamente chamada de antigo símbolo de Prios pelo vendedor em Forte do Cardo. Não é um sol, é uma aranha dourada, o símbolo sagrado de Angathal Taar, cujo reino outrora se estendia em torno de uma rede de pirâmides. A Pirâmide de Serand é conhecida e pesquisada, mas encontrei outra, afundada no solo e intocada por séculos. A cruz de Taar era minha chave, o caminho para a pirâmide, para as câmaras inferiores e o ovo dourado. Oh, como cantava ao meu toque; como se abriu, fio a fio, para expor seu interior vazio."],
        [108, "Quando os vigias subiram, fugi para cá para evitar a morte certa. Mas foi somente quando o ovo fechou que percebi que essa era a intenção deles, me levar a essa armadilha dourada. Eu os ouço cantando lá fora, roucos e com mandíbulas batendo. Inicialmente, eu me perguntava se cantavam para mim ou para sua irmã caída, mas agora percebo que isso faz parte do ritual. Vou me transformar, vou morrer e renascer como um deles. Você que está lendo esta carta, por favor, leve-a para minha irmã na cidade de Forte do Cardo."],
        [109, "Amada irmã, a casa agora é sua, e você não terá que aturar meu desleixo e sonhos com o Rei Aranha. Fui convocado para o exército dele e, da próxima vez que nos encontrarmos, suas palavras venenosas não serão nada comparadas ao veneno de minhas mandíbulas."],
        [110, "Respeitosamente, Lemelio Starak"], [111, "(Carta amassada, encontrada em um cadáver arac, morto nas profundezas da Davokar)"],
        [112, "Configuração de Aventura"], [113, "O ARAC EXALTADO"],
        [114, "Maz-at-tezz começou a tecer o evangelho das aranhas em uma ruína submersa, parcialmente desmoronada e completamente coberta de mato na fronteira entre Davokar Iluminada e Davokar Escura. Seus Envenenadores baniram (ou mataram) todas as feras e uma tribo goblin da área e iniciaram suas tarefas mais importantes — caçar artefatos em ruínas próximas e garantir o crescimento do exército da princesa. A última é alcançada levando prisioneiros humanos ao nível inferior da pirâmide para serem transformados."],
        [115, "Os personagens jogadores podem se envolver quando as pessoas começam a desaparecer de algum posto avançado ou vila na fronteira da Davokar. Talvez um dos goblins banidos possa ser encontrado e conte sobre a ruína em que viveu; talvez os personagens visitem a antiga casa dos goblins e encontrem um grupo de Envenenadores caçadores de tesouros? Por que não deixá-los encontrar a carta de Lemelio Starak nas ruínas, para lhes dar uma pista do que está acontecendo? Se assim for, sua próxima tarefa será encontrar a pirâmide tomada pela vegetação, entrar e tentar libertar os prisioneiros que ainda não se transformaram — provavelmente com forte resistência de Maz-at-tezz e seus guerreiros."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "01 Arachs");
    }],
    ["02 Bestiaal", (html) => {
      const clawing = entry.actors["Bestiaal, Clawing Fighter"];
      const carrier = entry.actors["Bestiaal, Glint-Carrier"];
      const winged = entry.actors["Bestiaal, Winged Hunter"];
      const background = visibleNodesFromHtml(clawing.background);
      const appearance = visibleNodesFromHtml(clawing.appearance);
      if (background.length !== 2 || appearance.length !== 1) throw new Error("Unexpected translated Bestiaal actor text structure.");
      const glintContinuation = appearance[0].indexOf("Até agora,");
      if (glintContinuation < 0) throw new Error("Could not split translated Bestiaal appearance around the Glint link.");
      const replacements = new Map([
        [1, "Bestiaal"],
        [2, "Não entendi os olhares estranhos e os sinais de proteção que eram direcionados a nós em Forte do Cardo, e demorei um bom tempo para perceber que realmente eram sobre nossa escolha de guia. A garota mascarada era reclusa e cuidadosa para não mostrar o rosto diante dos outros, mas não há dúvida de que era qualificada — ela encontrou o caminho mais rápido pela floresta e, em várias ocasiões, seus instintos nos conduziram ilesos por emboscadas e armadilhas. Claro, ela rastreava como um cachorro, farejando o chão, mas esse é um método também praticado pelos bárbaros."],
        [3, "Honestamente, eu não conseguia ver o que causava o alarme e a preocupação — até sermos cercados por dragouls. A garota criou asas e voou sobre nós com seu arco cantando, para depois mergulhar no chão e se lançar na batalha, subitamente alta, musculosa e com garras longas e afiadas. Devo dizer que, naquele momento, nossa guia se tornou a coisa mais interessante sobre nossa expedição."],
        [4, "Irmão Erbalmer"], [5, "Líder da expedição em nome de Prios"], [6, "DE ACORDO COM SEUS"], [7, background[0]],
        [8, "APÓS A QUEDA"], [9, background[1]], [10, "PELO QUE SE"], [11, `${appearance[0].slice(0, glintContinuation).trim().replace(/faíscas\.$/, "faíscas")} (veja`],
        [12, "Faísca"], [13, `). ${appearance[0].slice(glintContinuation)}`],
        [14, "Forma Verdadeira e Bestiaais"],
        [15, "O poder místico Forma Verdadeira pode revelar a forma básica de um bestiaal, sem nenhum dos traços adicionados por Metamorfismo. Além disso, com o nível adepto do mesmo poder, o bestiaal pode ser forçado a assumir sua forma básica, sem traços extras, e o nível mestre pode impedi-lo de reativar os traços extras."],
        [16, "Cercado nas Corvos, bem ao norte. Encontramos a aldeia deles, em um vale arborizado. Darean e Sagal estavam lá, ele perfurado por um espeto, ela amarrada. As feras nos descobriram, corremos, aqui. O silêncio revela que eles estão se aproximando. Que Prios leve este pombo até você com minha despedida."],
        [17, "Sempre seu — Enon."], [18, "Pombo-correio das Corvos"], [19, "Configuração de Aventura"], [20, "OS PERSONAGENS RECEBEM"],
        [21, "um pedido de socorro de um acampamento madeireiro ou posto avançado semelhante em Davokar — pessoas foram mortas ou levadas, até duas de cada vez; tudo o que foi encontrado são os restos mortais das vítimas. A melhor (talvez única?) maneira de expor os assassinos é usar iscas vivas, possivelmente um ou dois personagens disfarçados. Na primeira tentativa, eles podem ser atacados por algo totalmente diferente (predadores, trolls furiosos ou elfos), mas logo fica evidente que estes não poderiam ter causado os assassinatos anteriores."],
        [22, "Uma segunda tentativa produz resultados; eles são atacados por 4–5 bestiaais. No entanto, quando a armadilha se fecha, um ou mais bestiaais caem de joelhos, implorando por misericórdia. Se os personagens os deixarem viver, eles revelarão que são refugiados de um vilarejo nas montanhas e que o portador de faísca enviado para caçá-los mantém dois de seus filhos cativos e os obriga a alimentá-lo com carne fresca, de preferência humana. Os personagens terão que escolher se matam o grupo de caça, os ajudam a matar o portador de faísca ou tentam resgatar as crianças para que os refugiados possam fugir de seu algoz."],
        [23, "Bestiaal (Lutador de Garras)"], [24, "@UUID[Actor.SvrEz3BIqOL3QRLh]{Bestiaal Lutador de Garras}"],
        [65, "Bestiaal (Portador de Faísca)"], [66, "@UUID[Actor.Gopu3ULPmJMcowGe]{Bestiaal Portador de Faísca}"],
        [107, "Bestiaal (Caçador Alado)"], [108, "@UUID[Actor.7V7RzTdQv4QunTDr]{Bestiaal Caçador Alado}"],
        [149, "Nova Regra: Jogar com um Bestiaal"],
        [150, "É totalmente possível, embora desafiador, interpretar um personagem da raça Bestiaal. Isso é desafiador em dois aspectos: primeiro no sentido de que os bestiaais não têm um papel determinado em Ambria, tornando-os difíceis de retratar; em segundo lugar, pode ser difícil, do ponto de vista das regras, lidar com a flexibilidade fornecida pelo traço Metamorfismo. No entanto, se o jogador estiver preparado para aceitar essas condições, os membros da raça bestiaal podem ser muito gratificantes de se jogar."],
        [151, "Observe que a forma básica de um Bestiaal tem apenas o traço monstruoso Metamorfismo, o traço/dádiva Mateiro e (como sugestão) o fardo Pária."]
      ]);
      const variants = [
        { base: 25, actor: clawing, title: "BESTIAAL LUTADOR DE GARRAS", traits: "Armadurado (II, de Metamorfismo), Mateiro, Metamorfismo (III), Robusto (II, de Metamorfismo)", abilities: "Ataque Gêmeo (adepto), Atirador (adepto), Homem-de-armas (novato)", weapons: "Arco 5, duas armas de uma mão 7/4", armor: "Pele de couro 7" },
        { base: 67, actor: carrier, title: "BESTIAAL PORTADOR DE FAÍSCA", traits: "Armadurado (II, de Metamorfismo), Mateiro, Metamorfismo (III), Robusto (II, de Metamorfismo), Tenaz (I), Veloz (I)", abilities: "Ataque Gêmeo (adepto), Atirador (adepto), Homem-de-armas (novato)", weapons: "Arco 5, duas armas de uma mão 7/4", armor: "Pele de couro 7" },
        { base: 109, actor: winged, title: "BESTIAAL CAÇADOR ALADO", traits: "Armadurado (II, de Metamorfismo), Mateiro, Metamorfismo (III), Asas (II, de Metamorfismo)", abilities: "Ataque Gêmeo (adepto), Atirador (adepto), Homem-de-armas (novato)", weapons: "Arco 5, duas armas de uma mão 4", armor: "Pele de couro 4" }
      ];
      for (const variant of variants) {
        const b = variant.base;
        [
          [0, variant.title], [1, "Raça"], [2, variant.actor.race], [3, "Resistência"], [4, "Desafiadora"], [5, "Traços"], [6, variant.traits],
          [7, "Preciso"], [9, "Astuto"], [11, "Discreto"], [13, "Persuasivo"], [15, "Rápido"], [17, "Resoluto"], [19, "Vigoroso"], [21, "Vigilante"],
          [23, "Habilidades"], [24, variant.abilities], [25, "Armas"], [26, "Preciso"], [27, variant.weapons], [28, "Armadura"], [29, variant.armor],
          [30, "Defesa"], [32, "Vitalidade"], [34, "Limiar de Dor"], [36, "Sombra"], [37, variant.actor.shadow], [38, "Táticas"], [39, variant.actor.tactics]
        ].forEach(([offset, value]) => replacements.set(b + offset, value));
      }
      return translateVisibleHtmlByIndex(html, replacements, "02 Bestiaal");
    }],
    ["03 Colossi", (html) => {
      const actor = entry.actors.Coloss;
      const background = visibleNodesFromHtml(actor.background);
      const appearance = visibleNodesFromHtml(actor.appearance);
      if (background.length !== 3 || appearance.length !== 1) throw new Error("Unexpected translated Coloss actor text structure.");
      const replacements = new Map([
        [1, "Colosso"],
        [2, "Bem, claro, é melhor você acreditar que vi um colosso de perto, terrivelmente perto. Foi num daqueles dias em que você prefere ficar na barraca — uma chuva torrencial caía nas copas das árvores; as gotas se espatifavam em uma névoa úmida ou se reuniam nas folhas para cair em lençóis pesados que realmente martelavam o couro cabeludo. Mas afivelei a aljava e me forcei a sair para verificar as armadilhas."],
        [3, "Uma das armadilhas foi colocada perto das ruínas do Cruzamento da Âncora, e foi lá que o encontrei. Que ele era um bruxo, eu soube imediatamente, pelas roupas e pela máscara de casca de árvore. Sem vida. Como se estivesse morto. Sem ferimentos visíveis, mas com manchas pretas no rosto, como se de ácido ou possivelmente… bem, de morte?"],
        [4, "De qualquer forma, corri para sentir seu pulso. O coração batia, embora fracamente. Pouco depois de começar a enxugar seu rosto com uma cura herbal, ouvi — um estrondo alto atrás de mim, como se um galho de árvore resistente se quebrasse lentamente. Eu virei meu pescoço, fui recebido por um berro abismal e uma perna dianteira que foi levantada para me esmagar. Eu congelei. Completamente paralisado."],
        [5, "Nesse momento o bruxo acordou, e o colosso congelou, como eu. Se a cura herbal tivesse demorado um pouco mais para funcionar, eu teria me tornado um com o solo e você não existiria. Essa é a verdade!"],
        [6, "Vovô Toste se gaba para seus netos com uma caneca de cerveja em O Dragão Enferrujado, Kastor"],
        [7, "ENTRE OS AMBRIANOS,"], [8, appearance[0]], [9, "A CERIMÔNIA MÍSTICA"], [10, background[0]], [11, "O ATO DE"], [12, background[1]],
        [13, "ISSO TAMBÉM EXPLICA"], [14, background[2]], [15, "Configuração de Aventura"], [16, "OS PERSONAGENS CHEGAM"],
        [17, "a um assentamento ao redor do qual está espreitando um colosso solitário e faminto. Inicialmente, os rastros são encontrados nas proximidades; mais tarde, rangidos altos são ouvidos quando a fera frustrada bate em árvores totalmente crescidas, seguidas por avistamentos reais. Então vêm os primeiros ataques (possivelmente contra o gado), logo seguidos pelo assassinato de um ser cultural."],
        [18, "Uma das figuras de autoridade no assentamento pede ajuda aos personagens para lidar com a situação. Isso pode ser feito de várias maneiras — o combate direto é possível, mas um Teste bem-sucedido de Astuto com Saber de Bestas abre a opção de alimentar e, portanto, domar a criatura. Façam o que fizerem, uma séria complicação se revela: alguém reconhece um equipamento no colosso (trança de bruxa, máscara facial ou similar) e sabe quem montava e cuidava desse animal em particular: a bruxa Ayda."],
        [19, "Isso é profundamente preocupante, pois todo outono (ou em algum outro momento adequado) o assentamento sofre problemas associados a um monstro que passa (arquitroll, elfo do inverno, linnorme ou ser igualmente poderoso). Ayda sempre ajudou os moradores a desviar a atenção do monstro faminto e ameaçador quando passava pelo assentamento; como ela se foi, talvez morta, os moradores estão em sério perigo."],
        [20, "Os personagens jogadores são solicitados a rastrear Ayda. Como sugestão, eles a encontram morta, após ter sido capturada ou emboscada, mas entre seus pertences descobrem instruções de como desviar a atenção do monstro dos colonos. Colocar essas instruções em prática também recai sobre os personagens, e se falharem devem se preparar para uma luta duríssima — ou podem decidir fugir, deixando conscientemente centenas de crianças, mulheres e homens em grande perigo."],
        [21, "O colosso da bruxa pode carregar"], [22, "O colosso da bruxa pode atropelar"], [23, "Chutar e arranhar e mastigar, de fato,"], [24, "Sim, é disso que os colossos precisam."],
        [25, "Canção infantil popular em Davokar"], [26, actor.name], [27, "@UUID[Actor.x3CvaYZzAhaWvOuB]{Colosso}"], [28, "COLOSSO"],
        [29, "Raça"], [30, actor.race], [31, "Resistência"], [32, "Forte"], [33, "Traços"], [34, "Colossal (II), Arma Natural (III), Robusto (III), Tenaz (II), Destruidor (III)"],
        [35, "Preciso"], [37, "Astuto"], [39, "Discreto"], [41, "Persuasivo"], [43, "Rápido"], [45, "Resoluto"], [47, "Vigoroso"], [49, "Vigilante"],
        [51, "Habilidades"], [52, "Punho de Ferro (adepto), Guerreiro Natural (adepto)"], [53, "Armas"], [54, "Vigoroso"],
        [55, "Cascos 12/8 (longa, destruidor), dois ataques no mesmo alvo"], [56, "Armadura"], [57, "Couro semelhante a casca 4"], [58, "Defesa"], [60, "Vitalidade"], [62, "Limiar de Dor"],
        [64, "Sombra"], [65, actor.shadow], [66, "Táticas"], [67, actor.tactics], [68, "Criar Eliend, Cerimônia"],
        [69, "A cerimônia mística que transforma uma bruxa em um colosso exige um mínimo de quatro participantes, um dos quais atua como oficiante. Leva um dia inteiro para concluir e os participantes sofrem, em conjunto, 5D6 de corrupção temporária, dividida igualmente entre eles e sem causar quaisquer outros efeitos colaterais. Um dos participantes está vinculado à criação recém-despertada, como se fosse um familiar."],
        [70, "Além disso, se uma bruxa encontrar um colosso solitário nos ermos e ganhar sua confiança, ela poderá se ligar à criatura usando o ritual Familiar."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "03 Colossi");
    }],
    ["04 Corrupted Nature", (html) => {
      const replacements = new Map([
        [1, "Natureza Corrompida"],
        [2, "Tínhamos a bruxa cercada e ela sabia disso. Ela não tinha para onde correr; com a face do penhasco de um lado e o pântano do outro, ela recuou para o desfiladeiro e fez com que suas amaldiçoadas Bestas de Espinhos impedissem nosso avanço."],
        [3, "Vários de nossos guias hesitaram quando receberam a ordem de segui-la até as sombras, mas eu continuei. É certo que o fundo do desfiladeiro oferecia uma vista desanimadora — pálido acinzentado, como se a própria rocha tivesse sido incinerada e mais tarde nenhuma vida tivesse regressado; até o ar estava seco de um modo que sugeria que os ventos não conseguiam trazer umidade para aquele vale de cinzas. Um lugar adequado para a morte de uma bruxa, pensei. Só quando iniciamos o nosso ataque é que percebi que a sua retirada foi cuidadosamente planejada, que ela também sabia que iria morrer e decidiu levar-nos com ela. À medida que nossos guerreiros avançavam, fizemos nossas orações e tecemos nossos feitiços enquanto a bruxa convocava seus aliados sombrios para nos combater. A corrupção pairava no ar, tão inevitável aqui como em qualquer outro lugar. Sabíamos o que estávamos fazendo — o fogo pode ser combatido com fogo, por aqueles que são suficientemente disciplinados. Ou assim pensamos. Naquele momento, estávamos totalmente errados."],
        [4, "A corrupção caiu no chão como lágrimas negras, e onde cada gota caiu, um daemon apareceu para atacar imediatamente — nós ou a bruxa; eles não discriminaram ao decidir quem despedaçar. O último som que ouvi antes de meus escudeiros me arrastarem ferido foi o da bruxa rindo, uma risada que se transformou em grito quando ela e o resto da minha tropa foram destruídos nas profundezas daquele desfiladeiro amaldiçoado."],
        [5, "Templário Aralo Patio, declaração após o retorno à Muralha do Templo"], [6, "NÃO HÁ"],
        [7, "dúvida de que nas partes mais profundas da Davokar existem lugares muito diferentes do que normalmente é visto como natural. Quem afirma que fenômenos semelhantes podem ser encontrados nas montanhas e nos campos ondulados de Ambria também está correto. Não importa se a corrupção da área há muito tempo é evidente, se ela floresceu após séculos de abandono ou se surgiu recentemente, há lugares que não devem ser visitados; lugares cuja ira ameaça todos os que vivem. Infelizmente, a malícia pode ser difícil de perceber antes que seja tarde demais."],
        [8, "Descobrindo a Natureza Corrompida"],
        [9, "O ato de entrar em uma área com natureza corrompida pode ser notado com sucesso num Teste de Vigilante por qualquer pessoa com Mateiro ou Visão de Bruxa. Com Mateiro, o personagem percebe que o lugar não é natural e perigoso; com Visão de Bruxa também é possível perceber a corrupção no ar, no solo e nas águas."],
        [10, "Se o Teste for bem-sucedido, é possível voltar e contornar a área, ao custo de uma rota mais longa (+1D12 horas)."],
        [11, "A NATUREZA CORROMPIDA APARECE"],
        [12, "em muitas formas diferentes — pode ser densos bancos de nevoeiro que vagarosamente flutuam pela floresta, lugares onde o solo e toda a vegetação escureceram, pântanos cheirando a putrefação ou áreas sofrendo de rasgos na estrutura física do mundo. As bruxas chamam esses lugares por nomes como Névoas da Mácula, Espelhos Noturnos, Terras Negras e Feridas do Mundo, e afirmam que todos eles variam em força e circunferência. Existem histórias de feridas no mundo que se transformaram em Abismos da Perdição, ligadas ao Além-mundo e expelindo daemones famintos; de névoas densas pairando ao redor e seguindo monstruosas bestas maculadas primitivas; e até mesmo de terrenos manchados pela escuridão tão vil que eles podem corromper viajantes e animais ao primeiro suspiro."],
        [13, "O QUE TODOS ESSES TIPOS"],
        [14, "de natureza corrompida têm em comum é que eles podem prejudicar os seres vivos de muitas maneiras diferentes: eles podem infectar com corrupção, punir com surtos de corrupção ou incorporar a corrupção na forma física de abominações e daemones. Quanto a este último, as bestas podem aparecer de diferentes formas — às vezes rastejam para fora dos pântanos das Terras Negras; às vezes eles parecem se materializar do nevoeiro; e às vezes abrem caminho através das lágrimas das feridas do mundo."],
        [15, "As alucinações que às vezes ocorrem em áreas corrompidas podem parecer tão reais que podem ser o fim de todo um grupo de aventureiros."],
        [16, "Compreendendo o Perigo"],
        [17, "Quando os personagens percebem que estão em uma área corrompida, alguém com as habilidades Visão de Bruxa ou Saber de Bestas pode tentar prever o que está por vir. Um Teste bem-sucedido de Astuto fornece informações sobre quais tipos de perigo/perigos provavelmente são encontrados na área (Corrupção Virulenta, Retaliação e/ou Materialização). Se o Teste passar com uma diferença de 5 ou mais, o personagem também terá uma ideia de quão graves são os perigos (o Mestre de Jogo dá uma dica da resistência em termos de ordinária, desafiadora, forte ou poderosa)."],
        [18, "“O homem inculto é como um lodo doente de corrupção: fedorento, terrível e cheio de impulsos abomináveis”."], [19, "Eufrynda, notória Mestra da Ordem"],
        [20, "Configuração de Aventura"], [21, "UMA MANEIRA DE"],
        [22, "dar à natureza corrompida um papel claro em uma aventura é deixar uma pessoa que os personagens estão caçando fugir para as brumas, para os terrenos enegrecidos ou pútridos ou para uma área infestada por feridas do mundo. Talvez a presa tenha acidentalmente parado lá, ou talvez seja um movimento calculado — o inimigo confia em si mesmo para encontrar a saída e espera que os personagens caçadores não."],
        [23, "Quanto aos personagens, a questão é se eles percebem o perigo ou se correm para a área sem saber e correm o risco de se perder. Como de costume, um dos jogadores faz os Testes para o inimigo em fuga, para ver se ele encontra uma saída ou não. As chances são de que caçadores e presas fiquem presos na área; talvez a situação os obrigue a negociar um tratado temporário para que possam enfrentar os perigos da corrupção juntos?"],
        [24, "Tabela 1: Número de Perigos"], [25, "@DRAW[RollTable.3RZEFPXLR31LO9jC]{Tabela 1: Número de Perigos}"], [26, "1D10"], [27, "Número de rolagens na Tabela 2"],
        [38, "Efeitos da Natureza Corrompida"], [39, "AO ENCONTRAR NATUREZA CORROMPIDA,"],
        [40, "as tabelas a seguir são usadas para determinar quais perigos são encontrados na área. Uma jogada na Tabela 1 decide quantas vezes o Mestre de Jogo deve rolar na Tabela 2. Se várias jogadas forem feitas, o mesmo resultado não deve aparecer duas vezes; se isso acontecer, role novamente. Da mesma forma, apenas um resultado de Corrupção Virulenta é permitido. Por fim, note que se mais de uma rolagem resultar em encontros com criaturas atacantes, elas aparecerão em ondas com 5+1D6 turnos entre elas — sempre com o mais fraco primeiro, e depois de acordo com o poder crescente."],
        [41, "Tabela 2: Perigos na Natureza Corrompida"], [42, "@DRAW[RollTable.gTJUi7obnaUgna9D]{Tabela 2: Perigos na Natureza Corrompida}"],
        [43, "1D20"], [44, "Tipo"], [45, "Efeito"],
        [47, "Corrupção Virulenta"], [48, "Passe em um Teste de"], [49, "Vigoroso"], [50, "a cada hora/cena ou sofra 1D4 de corrupção temporária"],
        [52, "Corrupção Virulenta"], [53, "Passe em um Teste de"], [54, "Vigoroso"], [55, "a cada hora/cena ou sofra 1D6 de corrupção temporária"],
        [57, "Corrupção Virulenta"], [58, "Todos sofrem 1D4 de corrupção temporária por hora/cena"],
        [60, "Corrupção Virulenta"], [61, "Todos sofrem 1D6 de corrupção temporária por hora/cena; além disso, uma falha no Teste de"], [62, "Vigoroso"], [63, "dá um ponto de corrupção permanente"],
        [65, "Retaliação"], [66, "Toda a corrupção temporária gerada na área é duplicada"],
        [68, "Retaliação"], [69, "Aqueles que sofrem corrupção temporária na área, sofrem danos iguais na"], [70, "Vitalidade"],
        [72, "Retaliação"], [73, "Aqueles que sofrem corrupção temporária na área, sofrem 1D4 de dano à"], [74, "Vitalidade"], [75, "por ponto de corrupção"],
        [77, "Retaliação"], [78, "Cada ponto de corrupção gerado na área dá origem a um daemon (estatísticas como"],
        [79, "@UUID[Actor.pybvT6243mPjPB3B]{Daemon Intruso}"], [80, ") que ataca um alvo aleatório."],
        [82, "Retaliação"], [83, "A cada turno, quando a corrupção é gerada, todos na área sofrem de alucinações horríveis; todos os que falham no Teste de"], [84, "Resoluto"], [85, "passam um turno se defendendo contra inimigos imaginários (nenhuma ação é permitida)."],
        [87, "Retaliação"], [88, "As alucinações são ainda mais fortes e exigem um Teste contra ["], [89, "Resoluto"], [90, "–5]; uma falha significa paralisia por 1D4 turnos."],
        [92, "Materialização"], [93, "1D4 daemones com estatísticas como"], [94, "@UUID[Actor.7bgI72Wvpi2Q73Om]{Humano Nascido da Mácula}"],
        [96, "Materialização"], [97, "1D8 daemones com estatísticas como"], [98, "@UUID[Actor.7bgI72Wvpi2Q73Om]{Humano Nascido da Mácula}"],
        [100, "Materialização"], [101, "1D4 daemones com estatísticas como"], [102, "@UUID[Actor.7n5I70KGYIHxsLLl]{Alce Nascido da Mácula}"],
        [104, "Materialização"], [105, "1D8 daemones com estatísticas como"], [106, "@UUID[Actor.7n5I70KGYIHxsLLl]{Alce Nascido da Mácula}"],
        [108, "Materialização"], [109, "1D4 daemones com estatísticas como"], [110, "@UUID[Actor.pybvT6243mPjPB3B]{Daemon Intruso}"],
        [112, "Materialização"], [113, "1D8 daemones com estatísticas como"], [114, "@UUID[Actor.pybvT6243mPjPB3B]{Daemon Intruso}"],
        [116, "Materialização"], [117, "1D4 daemones com estatísticas como"], [118, "@UUID[Actor.2s83T1c7L64AbJdi]{Gigavali Nascido da Mácula}"],
        [120, "Materialização"], [121, "1D8 daemones com estatísticas como"], [122, "@UUID[Actor.2s83T1c7L64AbJdi]{Gigavali Nascido da Mácula}"],
        [124, "Materialização"], [125, "1 daemon com estatísticas como"], [126, "@UUID[Actor.kAixeuiCbxTBXAun]{Escarnecedor}"],
        [128, "Materialização"], [129, "1 daemon com estatísticas como"], [130, "@UUID[Actor.GoMkJXd7ub3TaPWj]{Besta Maculada Primitiva}"],
        [131, "Combatendo a Natureza Corrompida"],
        [132, "O ritual Canção da Natureza sempre pode ser usado para atravessar áreas de natureza corrompida; quando for usado, os protegidos não sofrerão os efeitos de Corrupção Virulenta ou Retaliação, e os daemones caçadores da área manterão distância."],
        [133, "A maioria dos lugares também pode ser temporariamente purificada ou curada com rituais como Rito de Santificação e Exorcismo, mas isso exige que o místico realmente esteja na área e permaneça seguro durante a realização do ritual. Fazer isso significa que a Corrupção Virulenta é neutralizada por um período de um dia até um ano inteiro (o Mestre de Jogo decide), após o qual retorna ao (a)normal. Quanto de verdade há nas lendas sobre cerimônias antigas e poderosas com poder de realmente curar a natureza corrompida é debatido — e sem nenhum proveito, já que o conhecimento desses rituais há muito foi esquecido."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "04 Corrupted Nature");
    }],
    ["05 Darkling", (html) => {
      const hunter = entry.actors["Darkling, Hunter"];
      const leader = entry.actors["Darkling, Leader"];
      const background = visibleNodesFromHtml(hunter.background);
      const appearance = visibleNodesFromHtml(hunter.appearance);
      if (background.length !== 2 || appearance.length !== 1) throw new Error("Unexpected translated Darkling actor text structure.");
      const replacements = new Map([
        [1, "Sombriano"], [2, "EXISTEM SERES"], [3, appearance[0]], [4, "OS POUCOS RELATOS"], [5, background[0]], [6, "COMO CONSEQUÊNCIA"], [7, background[1]],
        [8, "A quem possa interessar,"], [9, "A joia neste frasco é sua. Só peço em troca que entregue a carta ao mestre Ildered, meu marido, no Octógono de Corvênia."],
        [10, "Amados, querida família, nunca mais voltarei. Parti em busca da felicidade, e a encontrei no lugar mais peculiar, nas circunstâncias mais estranhas."],
        [11, "A jornada pela floresta nos custou muitas vidas, tantas que apenas quatro de nós finalmente chegaram a Água Branca e continuamos em direção ao Campo do Crepúsculo. Se esse campo realmente existe, e se está cheio de Cardo do Crepúsculo, nunca saberei, porque dois dias rio acima caímos direto na emboscada de meus empregadores. Não ouvimos nada, não vimos nada, não sentimos o menor mal-estar, até que as flechas se alojaram em nossas pernas, impedindo-nos de fugir."],
        [12, "Inumanos esguios apareceram de fora da vegetação, nos desarmaram e nos amarraram em uma fileira. Meus colegas foram comidos em algumas semanas, mas você me conhece — minha teimosa curiosidade deve tê-los divertido, ou deixado curiosos, porque eu ainda vivo, como sua obediente escrava, serva e médica. Não tenho mais medo; tudo o que resta é uma sensação harmoniosa, quase eufórica, de finalmente realmente viver, como a vida deveria ser."],
        [13, "Esqueça-me, assim como eu esquecerei de vocês. Saibam que estou feliz."], [14, "Hedla, sua mãe e esposa"], [15, "Carta encontrada em uma garrafa de vidro flutuando no Lago Volgoma"],
        [16, hunter.name], [17, "@UUID[Actor.hP0UnuFQ0xnSGwdR]{Sombriano Caçador}"], [18, "Linguagem dos Sombrianos"],
        [19, "Os Sombrianos se comunicam com uma combinação de gestos e sons, onde os últimos são suficientes para transmitir mensagens funcionais, enquanto os primeiros agregam julgamentos de valor, emoções e detalhes. Um efeito disso é que as piadas dos Sombrianos são frequentemente formuladas de modo que os sons digam uma coisa e os gestos digam outra."],
        [20, "Para aprender a língua dos Sombrianos, um personagem precisa da habilidade Mestre do Saber no nível adepto, mas também de um professor ou muito tempo gasto com alguém que realmente conhece a língua dos Sombrianos — como um grupo de Sombrianos ou possivelmente um ex-cativo."],
        [21, "SOMBRIANO CAÇADOR"], [22, "Raça"], [23, hunter.race], [24, "Resistência"], [25, "Desafiadora"], [26, "Traços"], [27, "Mateiro, Resistência Mística (II), Regeneração (I)"],
        [28, "Preciso"], [30, "Astuto"], [32, "Discreto"], [34, "Persuasivo"], [36, "Rápido"], [38, "Resoluto"], [40, "Vigoroso"], [42, "Vigilante"],
        [44, "Habilidades"], [45, "Acrobacias (novato), Atirador (adepto), Sexto Sentido (mestre), Maestria em Armas de Haste (novato)"],
        [46, "Armas"], [47, "Vigilante/Preciso"], [48, "Arco 5 (contundente), Lança 5 (contundente, longa)"], [49, "Armadura"],
        [50, "Nenhuma (regenera 2 de Vitalidade por turno, exceto dano profano)"], [51, "Defesa"], [53, "Vitalidade"], [55, "Limiar de Dor"], [57, "Sombra"], [58, hunter.shadow], [59, "Táticas"], [60, hunter.tactics],
        [61, leader.name], [62, "@UUID[Actor.AhkwcsD3bFsy8uvk]{Sombriano Líder}"],
        [63, "Símbolos esculpidos na face da rocha do Lago Volgoma; o primeiro pedido de socorro conhecido de um humano capturado por Sombrianos."],
        [64, "SOMBRIANO LÍDER"], [65, "Raça"], [66, leader.race], [67, "Resistência"], [68, "Forte"], [69, "Traços"], [70, "Mateiro, Resistência Mística (III), Regeneração (I)"],
        [71, "Preciso"], [73, "Astuto"], [75, "Discreto"], [77, "Persuasivo"], [79, "Rápido"], [81, "Resoluto"], [83, "Vigoroso"], [85, "Vigilante"],
        [87, "Habilidades"], [88, "Acrobacias (novato), Líder (mestre), Atirador (mestre), Sexto Sentido (mestre)"], [89, "Armas"], [90, "Vigilante"], [91, "Arco 5 (ignora Armadura)"],
        [92, "Armadura"], [93, "Nenhuma (regenera 2 de Vitalidade por turno, exceto dano profano)"], [94, "Defesa"], [96, "Vitalidade"], [98, "Limiar de Dor"], [100, "Sombra"], [101, leader.shadow], [102, "Táticas"], [103, leader.tactics],
        [104, "Adorno Protetivo"],
        [105, "O Adorno Protetivo é um artefato menor desenvolvido pelos Sombrianos ao longo dos séculos, possibilitando que eles se movam por terrenos corrompidos. Pode ser feito de qualquer material natural; seu poder está na estrutura da trança e nas melodias cantadas enquanto ela está sendo feita."],
        [106, "O efeito do artefato é que cada vez que seu transportador sofre corrupção temporária, o resultado da rolagem de efeito é modificado por –1, embora nunca seja tão baixo quanto zero. Por outro lado, o poder do adorno protege o transportador das energias místicas do mundo, resultando em uma modificação de –3 em todos os Testes de sucesso que podem potencialmente resultar em corrupção."],
        [107, "Configuração de Aventura"], [108, "SABE-SE QUE É POSSÍVEL"],
        [109, "que um líder entre os Sombrianos se afeiçoe por uma presa capturada, seja um ser cultural ou uma fera. No primeiro caso, não é uma questão do Sombriano pensar que pode aprender com o cativo. Claro, a presa pode contribuir com a comunidade, mas, fora isso, a relação entre as partes é semelhante à do dono e do animal de estimação."],
        [110, "Os personagens podem receber, ou decidir assumir, a missão de rastrear uma pessoa desaparecida, talvez até mesmo Hedla, a autora da carta na página anterior. Quando, após uma jornada cheia de acontecimentos, eles encontram a pessoa, os Sombrianos provavelmente hesitarão — os estranhos parecem durões demais para serem considerados uma presa. Em uma reunião tensa em que o cativo atua como intérprete, fica claro que o líder não deixará o escravo ir, a menos que os personagens ajudem o grupo de caça a lidar com uma ameaça local (por exemplo, uma abominação, um morto-vivo ou um troll soberano)."],
        [111, "Se os personagens concordarem, eles logo enfrentarão o próximo revés: o cativo quer permanecer e apenas fingiu cooperar para obter a ajuda deles para lidar com a ameaça! Os personagens decidem partir sem a pessoa que procuravam, ou recorrerão à violência e à força?"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "05 Darkling");
    }],
    ["06 Death Prince", (html) => {
      const actor = entry.actors["Death Prince"];
      const background = visibleNodesFromHtml(actor.background);
      const appearance = visibleNodesFromHtml(actor.appearance);
      if (background.length !== 2 || appearance.length !== 1) throw new Error("Unexpected translated Death Prince actor text structure.");
      const replacements = new Map([
        [1, "Príncipe da Morte"], [2, "LENDAS ANTIGAS, ASSIM"], [3, appearance[0]], [4, "O LORDE DA MORTE"], [5, background[0]], [6, "UMA VEZ LIVRE, O"], [7, background[1]],
        [8, "Lista de Príncipes da Morte Procurados"], [9, "Kelira Homril:"],
        [10, "Cavaleira viajante que supostamente busca vingança contra a Igreja do Sol, particularmente contra os indivíduos que marcaram sua família como hereges. Foi vista pela última vez perto de Yndaros."],
        [11, "Mandar do Sangue e Fogo:"], [12, "Príncipe da morte treinado misticamente que fugiu depois que os Mantos Negros mataram sua amante perto de Kastor. Há rumores de que Mandar se estabeleceu no sul da Davokar, povoando seu domínio com súditos bestiais."],
        [13, "Feliar, o Terrível:"], [14, "Um príncipe da morte secular que, de acordo com testemunhas (embora não confiáveis), perseguiu o povo através dos Titãs e reuniu um exército de goblins e trolls. Se for verdade, seu plano de longo prazo é provavelmente uma invasão em grande escala, provavelmente começando no sul."],
        [15, "O Inominado:"], [16, "Diz-se que o príncipe da morte que foi libertado após a morte do Juiz Abigal, um dos seguidores mais próximos dos Lordes Negros, está operando em Ambria. Se ele está caçando o assassino de seu mestre ou buscando vingança contra os colegas sobreviventes do mestre, não está claro."],
        [17, "Segmentos obscuros de escrita cuneiforme encontrados em Odaban. Podem ser a respeito do último governante da cidade, que pode ter sido morto por um príncipe da morte conhecido como Escudo Relâmpago, ou possivelmente Guarda Relâmpago."],
        [18, "Por muito tempo viajei com o falador bardo Tulgalo e sua amante, uma cavaleira cuja armadura era coberta de runas. O bardo se referiu à cavaleira como Baronesa Kelira Homril; a cavaleira não disse uma palavra e manteve a viseira abaixada mesmo no calor mais escaldante. Isso não me pareceu particularmente estranho, já que os cavaleiros do Reino da Ordem são notoriamente disciplinados, não muito diferentes dos templários de Prios."],
        [19, "Nem fiquei perturbado com a compostura extraordinária da cavaleira. Quando fomos atacados pelos ladrões da Bruxa do Gelo nas fronteiras dos Titãs, ela levou golpes e golpes como ninguém que eu já tenha visto. Nem mesmo o Pansar mais endurecido poderia permanecer de pé após tal espancamento, mas Tulgalo simplesmente atribuiu isso ao poder sagrado que os cavaleiros do Reino da Ordem extraem de sua profunda fé nos Jovens Deuses. Embora esta resposta me tenha ofendido, como seguidor de Prios, não perguntei mais nada."],
        [20, "Somente quando chegamos a Yndaros e seguimos caminhos separados é que minhas faculdades críticas entraram em ação. Com crescente desconfiança, fui para a seção aberta das Torres Trigêmeas, onde descobri o verdadeiro estado das coisas: o feudo de Homril, perto da fronteira sul do Reino da Ordem, foi devastado no Ano 4 por abominações furiosas das vastidões do Mastodonte, e a Baronesa Kelira morreu defendendo suas terras. Imediatamente notifiquei os liturgos na Catedral dos Mártires e recebi a resposta desconcertante de que eles estão caçando esse príncipe da morte desde que Mestre Malesio — que mais tarde foi exposto como feiticeiro — morreu e Kelira Homril se tornou sua própria princesa sombria."],
        [21, "História registrada por Perela, tabeliã do Legado da Rainha em Forte do Cardo"], [22, "Configuração de Aventura"], [23, "OS PERSONAGENS JOGADORES"],
        [24, "chegaram a um castelo ou propriedade maior pertencente a um nobre, como convidados ou talvez como emissários de alguma facção adequada. Certa noite, um cortejo fúnebre chega à propriedade, carregando o cadáver da cavaleira Aridna em uma maca. Karmalo, o escudeiro da falecida cavaleira, explica que sua senhora morreu queimada enquanto lutava contra uma monstruosidade cuspidora de fogo. Ele pede a proteção do nobre e ajuda para trazer Aridna para casa."],
        [25, "O cadáver é colocado na capela local durante a noite. À meia-noite, um grupo de violentinos se reúne silenciosamente nas cumeeiras do telhado. Pouco depois, o assentamento é atacado por mortos-vivos, e mais: assim que a batalha atinge seu auge, a cavaleira morta se levanta e se junta a seu escudeiro igualmente morto-vivo Karmalo (disfarçado durante o dia pelo ritual Vida Falsa) na tentativa de abrir o portão por dentro!"],
        [26, "O nome completo da cavaleira é Aridna Kaora. Ela foi morta em Alberetor pelos Lordes Negros, quando os avós do atual dono do castelo/propriedade traíram o esconderijo de sua família. Agora ela veio em busca de vingança e para tomar a residência do traidor como sua nova fortaleza. Talvez a oposição seja tão avassaladora que os personagens sejam forçados a fugir; talvez eles tragam os nobres consigo? E talvez uma série de aventuras futuras possa girar em torno deles, expulsando a princesa morta-viva e limpando a região dos mortos-vivos."],
        [27, "Novo Ritual: Vida Falsa"], [28, "O místico tece um véu sobre uma criatura morta-viva, ocultando assim todos os sinais de morte durante o dia seguinte. Enquanto o ritual estiver em vigor, o morto-vivo parecerá vivo para qualquer pessoa em sua presença, exceto que sua sombra permanece a mesma — um Teste de ["],
        [29, "Vigilante"], [31, "Discreto"], [32, "] bem-sucedido com a habilidade"], [33, "Visão de Bruxa"], [34, "revela que a pessoa está de fato completamente corrompida."],
        [35, actor.name], [36, "@UUID[Actor.bnoueD1HbazhP8fZ]{Príncipe da Morte}"], [37, "PRÍNCIPE DA MORTE"], [38, "Raça"], [39, actor.race], [40, "Resistência"], [41, "Forte"],
        [42, "Traços"], [43, "Companheiros (II, um dragoul, uma revoada de Violentinos), Frio da Tumba (II), Morto-vivo (II)"],
        [44, "Preciso"], [46, "Astuto"], [48, "Discreto"], [50, "Persuasivo"], [52, "Rápido"], [54, "Resoluto"], [56, "Vigoroso"], [58, "Vigilante"],
        [60, "Habilidades"], [61, "Punho de Ferro (adepto), Homem-de-armas (mestre), Golpe de Regresso (adepto), Ritualista (adepto: Rito de Profanação, Vida Falsa, Levantar os Mortos), Força da Empunhadura Dupla (mestre)"],
        [62, "Armas"], [63, "Vigoroso"], [64, "Espada bastarda 10 (arma bastarda, precisa, reanimadora), ignora Armadura"], [65, "Armadura"], [66, "Placas completas 5"],
        [67, "Defesa"], [69, "Vitalidade"], [71, "Limiar de Dor"], [73, "Sombra"], [74, actor.shadow], [75, "Táticas"], [76, actor.tactics]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "06 Death Prince");
    }],
    ["07 Dragon", (html) => {
      const drakworm = entry.actors.Drakworm;
      const dragon = entry.actors.Dragon;
      const background = visibleNodesFromHtml(drakworm.background);
      const appearance = visibleNodesFromHtml(drakworm.appearance);
      if (background.length !== 2 || appearance.length !== 1) throw new Error("Unexpected translated Dragon actor text structure.");
      const replacements = new Map([
        [1, "Dragão"], [2, "ASSIM FALOU AROALETA"],
        [3, "“… e toda serpente ouviu o chamado; fileira por fileira, linha por linha, cobriam a encosta junto à caverna aberta; as mais fortes no topo, as mais fracas nas sombras do vale. Fofar, o Colossal, o Destruidor, Senhor dos Dragões, deixou que as chamas lavassem a multidão que se curvava, até onde alcançava. Então, nenhum rosnado foi ouvido…”"],
        [4, "DE ACORDO COM A MAIORIA"], [5, background[0]], [6, "NA VERDADE,"], [7, background[1]], [8, "LINNORMES ADORMECEM"], [9, appearance[0]],
        [10, "Configuração de Aventura"], [11, "A EVOLUÇÃO DE UM LINNORME"],
        [12, "para um dragão deve ser introduzida passo a passo. Talvez comece com os personagens jogadores procurando por um linnorme conhecido e razoavelmente amigável, na busca por conhecimento sobre alguma ruína, artefato ou verdade mística. Quando eles chegam, são forçados a combater lacaios que a serpente reuniu antes de seu sono. Depois de muitas provações, eles alcançam o covil subterrâneo do linnorme bem a tempo de testemunhar seu renascimento — na forma de um faminto Drakorme."],
        [13, "A segunda etapa pode ser introduzida assim que eles retornarem a Ambria com a história do ocorrido. A maioria das pessoas ri e descarta todas as “evidências” como uma farsa, mas uma Mestre da Ordem (ou similar) reage de maneira diferente. Aparentemente, ela enviou uma pequena expedição às Corvos ou Titãs cerca de seis meses atrás, e recentemente recebeu uma mensagem de pombo-correio. Estava escrito com a mão trêmula, completamente incoerente, mas uma das poucas palavras que dava para ler era “dragão”. Com referência à experiência anterior e ao retorno triunfante dos personagens jogadores, ela se pergunta se eles estão dispostos a acompanhá-la em busca da expedição desaparecida…"],
        [14, "Honorável Eumenos,"], [15, "O sorriso desdenhoso do Irmão Almagast e as acusações mal disfarçadas sobre nossa tendência de subestimar o Escuro provaram ser justificadas, tão condizentes quanto as advertências proferidas pelo caçador de tesouros enlouquecido."],
        [16, "Chegamos ao desfiladeiro onde ele encontrou o artefato, o Espelho Solar. Todos em nossa companhia confiaram na avaliação que você, estimado irmão, compartilhou comigo e com o Localizador de Rotas — que a besta da qual o caçador de tesouros falou em seu sono deve ter sido um linnorme, e que seu discurso sobre “bafo de fogo” e “asas que rugem” foram exageros causados pelo medo. Mas estávamos errados, muito errados."],
        [17, "Eu as ouço agora, as asas rugindo, e vi a sombra da criatura. Daqui a alguns instantes, quando deixarmos este abrigo, todos morreremos. Mas quando a fome é a única alternativa, a escolha não é uma escolha real. Com a graça de Prios, a besta ainda pode se mostrar razoável; caso contrário, nos encontraremos novamente, ajoelhados ao lado do Provedor das Leis."],
        [18, "Sua serva obediente, Irmã Disera"], [19, "Carta que pode ser encontrada em uma caverna perto de uma torre em ruínas ao sul das Corvos"],
        [20, "O Nobre Esforço dos Linnormes"],
        [21, "Muitos linnormes estão convencidos de que a exaltação é algo que você ganha, ao invés de algo que simplesmente acontece. Durante o último milênio, a maioria dos linnormes da Davokar viveu como outros predadores, mas seu comportamento mudou radicalmente na década passada. Com base na presunção de que o ritmo da vida é ditado pelas ações do indivíduo, muitos linnormes começaram a caçar oponentes dignos, reunindo súditos como bestas e trolls, e até mesmo desafiando uns aos outros para provar sua força. Outros, tendo vivido uma vida tão longa, desenvolveram um medo profundamente enraizado da morte e fazem tudo o que podem para evitar a perigosa dormência."],
        [22, "Não está claro se realmente existe uma conexão entre o poder de um indivíduo e a exaltação, mas para os linnormes isso é considerado um fato — até porque pode-se dizer que quase todos os indivíduos que entraram no sono têm, ou tiveram, grande poder sobre seus arredores. Sim, mesmo em casos incertos, sempre podem ser feitas interpretações que reforcem essa ideia."],
        [23, drakworm.name], [24, "@UUID[Actor.87VdFSryVqli28Hz]{Drakorme}"], [25, "DRAKORME"], [26, "Raça"], [27, drakworm.race], [28, "Resistência"], [29, "Forte"],
        [30, "Traços"], [31, "Armadurado (III), Colossal (I), Enfeitiçar (III), Vida Longa, Robusto (III), Tenaz (I), Asas (I), Sabedoria das Eras (I)"],
        [32, "Preciso"], [34, "Astuto"], [36, "Discreto"], [38, "Persuasivo"], [40, "Rápido"], [42, "Resoluto"], [44, "Vigoroso"], [46, "Vigilante"],
        [48, "Habilidades"], [49, "Excepcionalmente Resoluto (adepto), Excepcionalmente Vigoroso (adepto), Punho de Ferro (mestre), Guerreiro Natural (mestre)"],
        [50, "Armas"], [51, "Vigoroso"], [52, "Mordida 14, ou dois ataques no mesmo alvo 12/8"], [53, "Armadura"], [54, "Escamas 8"], [55, "Defesa"], [57, "Vitalidade"], [59, "Limiar de Dor"], [61, "Sombra"], [62, drakworm.shadow], [63, "Táticas"], [64, drakworm.tactics],
        [65, dragon.name], [66, "@UUID[Actor.9MeKa4o9AG6p4IxB]{Dragão}"], [67, "DRAGÃO"], [68, "Raça"], [69, dragon.race], [70, "Resistência"], [71, "Poderosa"],
        [72, "Traços"], [73, "Armadurado (III), Colossal (II), Sopro Mortal (II), Devorador (I), Vida Longa, Arma Natural (III), Robusto (III), Tenaz (II), Asas (II), Sabedoria das Eras (III)"],
        [74, "Preciso"], [76, "Astuto"], [78, "Discreto"], [80, "Persuasivo"], [82, "Rápido"], [84, "Resoluto"], [86, "Vigoroso"], [88, "Vigilante"],
        [90, "Habilidades"], [91, "Excepcionalmente Resoluto (mestre), Excepcionalmente Vigoroso (mestre), Punho de Ferro (mestre), Guerreiro Natural (mestre), Inabalável (mestre)"],
        [92, "Armas"], [93, "Vigoroso"], [94, "Mordida 17 (longa), ou dois ataques no mesmo alvo 15/11"], [95, "Armadura"], [96, "Escamas 8"], [97, "Defesa"], [99, "Vitalidade"], [101, "Limiar de Dor"], [103, "Sombra"], [104, dragon.shadow], [105, "Táticas"], [106, dragon.tactics],
        [107, "Sabedoria das Eras"], [108, "@UUID[Item.PlCHUpi49GvxxyjI]{Sabedoria das Eras}"],
        [109, "Através dos séculos, a raça acumulou uma vasta sabedoria coletiva; um poço profundo de conhecimento e discernimento que muitos indivíduos podem acessar através da meditação, para resolver problemas que se apresentam. Fazer isso não está isento de riscos; no crepúsculo do mundo, o processo gera corrupção. A Sabedoria das Eras dá corrupção temporária como se fosse um poder místico."],
        [110, "Novato"], [111, "Turno Completo."], [112, "A criatura se perde em um curto transe. Com um Teste de"], [113, "Resoluto"],
        [114, "bem-sucedido, ela obtém acesso ao nível novato de uma habilidade opcional, excluindo Tradições Místicas,"], [115, "Ritualista"], [116, "e"], [117, "Poder Místico"],
        [118, ". Somente uma habilidade de cada vez pode ser acessada dessa maneira; mudar para outra requer um novo transe. A capacidade pode ser usada para o resto da cena, antes de desaparecer da memória."],
        [119, "Adepto"], [120, "Ativa."], [121, "Como Novato, mas a conexão mais próxima com a memória coletiva torna o transe ainda mais curto."],
        [122, "Mestre"], [123, "Ativa."], [124, "Como Adepto, mas o indivíduo pode cavar mais fundo na memória coletiva. Com um Teste de"], [125, "Resoluto"], [126, "bem-sucedido, ele ganha acesso ao nível adepto de uma habilidade opcional."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "07 Dragon");
    }],
    ["08 Ettermite", (html) => {
      const actor = entry.actors["Ettermite Swarm"];
      const background = visibleNodesFromHtml(actor.background);
      if (background.length !== 1) throw new Error("Unexpected translated Ettermite actor text structure.");
      const replacements = new Map([
        [1, "Ettermita"], [2, "NAS RARAS"], [3, background[0]],
        [4, "OUTROS ESTUDOS LEVARAM"],
        [5, "a várias técnicas para chegar perto o suficiente para colher o ettercopal, mas raramente são eficazes e a tarefa é, como consequência, altamente letal. No mercado negro de Forte do Cardo, às vezes, você pode encontrar um elixir chamado Sonífero de Etter, que diz ser capaz de deixar todo um enxame de ettermitas sonolentos — por um curto período de tempo. Essas poções estão obviamente em alta demanda, e o preço é sempre alto quando (e se) elas puderem ser encontradas."],
        [6, "O INTERESSANTE"],
        [7, "é que Sonífero de Etter parece surgir em pequenas quantidades e em intervalos tão regulares que dificilmente pode vir de achados na floresta — indicando que talvez exista um alquimista na cidade com acesso à receita em questão. A caça ao referido alquimista e sua receita levou a uma onda de assassinatos e torturas nas partes sombrias do Forte, o que é facilmente compreendido: quem possuir os meios e a capacidade de produzir Sonífero de Etter ficará muito rico, talvez tão rico quanto o próprio Campo Noturno, se não mais rico ainda."],
        [8, "O boato se espalhou como fogo pela Praça Antiga: “Há uma colônia ettermita no meio do caminho entre Odaban e as Colunas de Haganor!” A notícia mal tinha sido divulgada quando os primeiros corpos caíram na sarjeta, vítimas de rivais caçando Sonífero de Etter para tornar os infernais ettermitas sonolentos. Foi nessa época que me envolvi, como investigador especial do Comandante."],
        [9, "Minha missão ingrata era deter a onda de assassinatos, uma tarefa realmente desafiadora quando tais somas de táleres e tantos sonhos estão em jogo. Mas sou um servo leal da Coroa e obviamente fiz o meu melhor. Por um momento, quando descobri como os rumores começaram, realmente acreditei que poderia ter sucesso — um caçador de fortunas chamado Broona havia retornado da área designada com ettercopal em uma mochila; no entanto, não de qualquer colônia ettermita, mas do covil de um troll soberano. Achei-me astuto quando espalhei esta notícia, convencido de que isso poria fim aos assassinatos. Mas, por infelicidade!"],
        [10, "Outro boato, igualmente prejudicial, rapidamente se enraizou: o Prefeito Campo Noturno tentou silenciar o caso com informações falsas, na esperança de reivindicar a riqueza da colônia para si. Numerosas expedições de caça ao tesouro partiram para a floresta e poucas delas retornaram. Se foram ettermitas ou qualquer outra coisa que as matou eu honestamente não sei, mas nenhum influxo de ettercopal jamais foi notado — isso eu acompanhei cuidadosamente como parte da investigação."],
        [11, "Trecho do diário de bordo do Capitão Tallios, Forte do Cardo"],
        [12, actor.name], [13, "@UUID[Actor.e8iVMiB8Ud0ZEoZF]{Enxame de Ettermita}"],
        [14, "Colhendo Ettercopal"],
        [15, "Qualquer um que consiga se aproximar de um pilar de ettermita (e possua as ferramentas apropriadas), pode a cada turno minerar e ensacar um pedaço de ettercopal. No entanto, é aconselhável procurar as peças mais puras possíveis."],
        [16, "Tentar extrair o ettercopal exige um Teste de"], [17, "Vigilante"], [18, "a cada turno; aqueles com a habilidade"], [19, "Mestre do Saber"], [20, "podem rolar contra"], [21, "Astuto"],
        [22, ". Um Teste bem-sucedido fornece uma peça no valor de 1D4+1 táler; uma falha significa que vale 1 táler."],
        [23, "Quantas peças podem ser extraídas depende do tamanho do pilar, que por sua vez depende de quantos enxames o pilar abriga. Você pode esperar que um pilar específico seja feito de [50+1D10] peças por enxame residente."],
        [24, "ENXAME DE ETTERMITA"], [25, "Raça"], [26, actor.race], [27, "Resistência"], [28, "Forte"], [29, "Traços"],
        [30, "Arma Natural (II), Observador, Venenoso (II), Tenaz (II), Enxame (III), Veloz (III), Asas (III)"],
        [31, "Preciso"], [33, "Astuto"], [35, "Discreto"], [37, "Persuasivo"], [39, "Rápido"], [41, "Resoluto"], [43, "Vigoroso"], [45, "Vigilante"],
        [47, "Habilidades"], [48, "Nenhuma"], [49, "Armas"], [50, "Preciso"], [51, "Mordida 4, e veneno 3 por 3 turnos"],
        [52, "Armadura"], [53, "Um quarto do dano, de acordo com Enxame III"], [54, "Defesa"], [56, "Vitalidade"], [58, "Limiar de Dor"],
        [60, "Sombra"], [61, actor.shadow], [62, "Táticas"], [63, actor.tactics],
        [64, "Elixires"], [65, "Os seguintes elixires estão associados às ettermitas."], [66, "Soro de Etter"],
        [67, "Ettercopal pode ser usado para outras coisas além de objetos decorativos e galanterias. Alquimistas instruídos podem usar copal pulverizado para preparar um soro geralmente eficaz contra venenos, naturalmente muito difícil de encontrar e também muito caro (Fraco 3 táleres; Moderado 6 táleres; Forte 12 táleres)."],
        [68, "É preciso um Teste de"], [69, "Astuto"],
        [70, "bem-sucedido para o soro ter efeito. Se bem-sucedido, o efeito fica ativo por uma cena inteira e sua força varia de acordo com a habilidade do alquimista, de acordo com as regras de antídotos equivalentes (consulte a página 153 do Livro Básico)."],
        [71, "Sonífero de Etter"],
        [72, "Uma dose de Sonífero de Etter é considerada um elixir mestre e normalmente custa 12 táleres por dose. Ele vem em forma de um líquido, geralmente envolto em um recipiente de cerâmica que deve ser jogado no pilar de ettermita. Um Teste de"],
        [73, "Preciso"], [74, "bem-sucedido significa que o elixir entra em efeito, uma falha que o recipiente erra e é esmagado contra o chão, gastando a dose."],
        [79, "Configuração de Aventura"], [80, "OS PERSONAGENS JUNTO"],
        [81, "com um ou mais grupos rivais descobrem simultaneamente o paradeiro de uma colônia de ettermitas. Inicialmente, todos eles competirão pela única dose de Sonífero de Etter atualmente disponível no assentamento em que estão; por sugestão, os grupos chegam ao seu dono quase ao mesmo tempo, levando a um combate, uma negociação ou outras complicações."],
        [82, "Então começa a corrida pela floresta. Informações confiáveis, um ótimo guia e escolhas sábias na hora de traçar a viagem podem ser decisivos para que os personagens cheguem primeiro, seguido de perto pelos concorrentes. Na chegada, o problema de colher (ou, se os personagens quiserem, proteger) o copal deve ser resolvido. Se os personagens chegarem primeiro, os rivais provavelmente atacarão a colônia à distância, esperando tornar os ettermitas agressivos; se os rivais forem os primeiros, cabe aos personagens estabelecer um plano de ação."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "08 Ettermite");
    }],
    ["09 Glimmer", (html) => {
      const actor = entry.actors.Glimmer;
      const background = visibleNodesFromHtml(actor.background);
      if (background.length !== 4) throw new Error("Unexpected translated Glimmer actor text structure.");
      const replacements = new Map([
        [1, "Cintilante"],
        [2, "Parecia que seria uma luta fácil. Tínhamos caçado os refugiados em direção ao leste, até o sopé das Corvos. Lá, eles se abrigaram em um castelo em ruínas, provavelmente exaustos e com suprimentos limitados. Já sabíamos que eles estavam preparados para lutar para ter acesso à Terra Prometida, então nos aproximamos com muito cuidado, pouco antes do amanhecer, armas em punho."],
        [3, "Eles nos viram chegando e responderam com flechas, que interromperam nosso avanço e nos forçaram a nos esconder atrás de nossos escudos, mais ou menos na metade da encosta. Assim que os ataques de projéteis começaram a diminuir, nos levantamos e atacamos. Nesse exato momento, o sol nasceu e seus primeiros raios refletiram na ponta da última flecha dos refugiados."],
        [4, "Admito, corri, como um covarde, como um tolo. Honestamente, prefiro aceitar minha punição a ter um encontro com o Cintilante. Mais tarde, quando ousei voltar, a cena era exatamente como os gritos e o barulho haviam sugerido. Todos estavam mortos, patrulheiros e refugiados — quebrados, espancados, sem vida. Melhor a forca do que isso, melhor a forca..."],
        [5, "Transcrição do interrogatório do acusado de deserção em Mergile"],
        [6, "COMO ACONTECE COM MUITAS"], [7, background[0]], [8, "UMA MONSTRUOSIDADE QUE"], [9, background[1]],
        [10, "SE A ORDO MAGICA"], [11, background[2]], [12, "PARA AQUELES QUE"], [13, background[3]],
        [14, actor.name], [15, "@UUID[Actor.9lthwpzHVj6NZDGb]{Cintilante}"], [16, "CINTILANTE"],
        [17, "Raça"], [18, actor.race], [19, "Resistência"], [20, "Desafiadora"], [21, "Traços"],
        [22, "Dano Alternativo (II, Resoluto), Forma de Espírito (II), Veloz (III), Aterrorizar (II)"],
        [23, "Preciso"], [25, "Astuto"], [27, "Discreto"], [29, "Persuasivo"], [31, "Rápido"], [33, "Resoluto"], [35, "Vigoroso"], [37, "Vigilante"],
        [39, "Habilidades"], [40, "Espelhamento (mestre)"], [41, "Armas"], [42, "Preciso"], [43, "Corte horrível 4 (causa dano em Resoluto, ignora Armadura)"],
        [44, "Armadura"], [45, "Metade do dano, conforme Forma de Espírito II"], [46, "Defesa"], [48, "Vitalidade"], [50, "Limiar de Dor"],
        [52, "Sombra"], [53, actor.shadow], [54, "Táticas"], [55, actor.tactics],
        [56, "Configuração de Aventura"], [57, "COMO SUGESTÃO"],
        [58, "o Cintilante é usado principalmente como um fator complicador, e não como o inimigo principal de uma aventura. Não importa se os personagens estão em uma caça ao tesouro lutando contra rivais e/ou bestas, se eles caçam cultistas em algum ninho de colonos livres, ou se eles estão em uma caçada a monstros comuns, as chances são de que um Cintilante esteja nas proximidades."],
        [59, "Talvez eles inicialmente encontrem as vítimas da criatura ou ouçam sobre sua fúria de algum residente ou viajante local? Talvez um personagem com a habilidade Mestre do Saber ou Saber de Bestas perceba a gravidade da situação? Nesse caso, pode ser necessário formar alianças para combater o Cintilante. Outra opção é, claro, fazer o Cintilante aparecer bem no meio de um encontro violento entre os personagens e seus competidores/presas."],
        [60, "Esperança Cintilante, Taubio"], [61, "Uma luz cintilante, um vislumbre de esperança,"], [62, "de que não vacilaremos, de que enfrentaremos."],
        [63, "Um brilho lustroso, uma cintilação tão pura, prometendo"], [64, "bons tempos para sempre."],
        [65, "Mas me responda, ó luz esplêndida,"], [66, "para quem você brilha na escuridão da noite?"],
        [67, "Você assassinou meu amigo, meu avô e o idoso,"], [68, "matou qualquer outro, e eu estou sozinho."],
        [69, "É por acaso, seu objetivo final, colocar todos"], [70, "os humanos, mortos em um buraco; para"],
        [71, "limpar este domínio, de mulher e homem, que cobiça"], [72, "e tem fome e leva tudo o que pode."],
        [73, "Se for esse o caso, observe minhas palavras,"], [74, "cesse sua proteção aos mamíferos e pássaros!"],
        [75, "Você está lutando em vão, sim, isso é verdade,"], [76, "porque as mulheres e os homens vão devorá-lo."],
        [77, "Amuleto Cintilante"], [78, "Qualquer um realizando o ritual"], [79, "Armadilha da Alma"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "09 Glimmer");
    }],
    ["10 Glint", (html) => {
      const glint = entry.actors.Glint;
      const aboar = entry.actors["Glint-Carrier, Aboar"];
      const guard = entry.actors["Glint-Carrier, Guard Warrior"];
      const appearance = visibleNodesFromHtml(glint.appearance);
      const background = visibleNodesFromHtml(glint.background);
      if (appearance.length !== 1 || background.length !== 2) throw new Error("Unexpected translated Glint actor text structure.");
      const replacements = new Map([
        [1, "Faísca"],
        [2, "“Você ouviu o que aconteceu com aquele desbravador que nos levou pelo caminho errado no ano passado, Aranman?”"],
        [3, "“Não exatamente, apenas que a guarda da cidade o espancou até a morte fora dos Salões de Symbaroum.”"],
        [4, "“Ele estava possuído! Não, não possuído, mas infectado. Ou infestado. Um parasita grande como uma maçã estava alojado em sua garganta e tinha... você sabe, tomado conta...”"],
        [5, "“Oh, certo, uma Faísca. Deixe-me adivinhar, ele foi descrito como sendo incomumente quieto ultimamente, e ficou notavelmente magro, e a guarda da cidade o acusou de tentativa de homicídio, uma ou mais dessas coisas?”"],
        [6, "“Sim, exatamente! Mas o que? Uma Faísca? Você sabe o que é isso?”"],
        [7, "“Claro, todo mundo que se aventurou na Davokar sabe. Faíscas são parasitas; elas cavam dentro do crânio. Hah, elas existem em quase todos os lugares na floresta.”"],
        [8, "“Oh, bem... Certo, isso basta!”"], [9, "“Basta para?”"],
        [10, "“Por Prios, você nunca mais me verá pisar naquela maldita Davokar novamente!”"],
        [11, "Conversa ouvida na Praça do Sapo em Forte do Cardo"],
        [12, "A FAÍSCA É"], [13, appearance[0]], [14, "A FAÍSCA ESPERA"], [15, background[0]], [16, "AS SECREÇÕES DE"], [17, background[1]],
        [18, "UMA CRIATURA INFECTADA"], [19, "por uma faísca ganha os traços monstruosos"], [20, "Tenaz"], [21, "e"], [22, "Veloz"],
        [23, ", e se já os tiver, seu nível nesses traços aumenta em +1 (mas nunca pode ser superior ao Nível III). Todos os seres com uma boca grande o suficiente para a faísca forçar seu caminho podem ser infectados, mas criaturas totalmente corruptas parecem ser imunes a essa infestação em particular. Também deve ser notado que as criaturas metamorfas chamadas Bestiaals parecem ter uma relação especial com as faíscas; consulte"],
        [24, "Bestiaal"], [25, "para mais informações sobre o assunto."],
        [26, "Revelando Portadores de Faísca"],
        [27, "Ao encontrar um portador de faísca, em combate ou nas ruas de um dos assentamentos fronteiriços de Ambria, é possível perceber que algo não está certo com a criatura. Se o sol estiver alto, pode ser o pescoço deformado que desperta suspeitas; se a noite cair, o parasita brilhante pode ser visto colorindo a boca do portador de vermelho. Como de costume, um Teste de ["],
        [28, "Vigilante"], [29, "←"], [30, "Discreto"], [31, "] deve ser feito, usando o valor de"], [32, "Discreto"], [33, "da faísca."],
        [34, glint.name], [35, "@UUID[Actor.alFyObQxAoEN1vPj]{Faísca}"], [36, "FAÍSCA"], [37, "Raça"], [38, glint.race], [39, "Resistência"], [40, "Desafiadora"],
        [41, "Traços"], [42, "Armadurado (II), Carapaça (II), Infestação (II), Arma Natural (II), Asas (II)"],
        [43, "Preciso"], [45, "Astuto"], [47, "Discreto"], [49, "Persuasivo"], [51, "Rápido"], [53, "Resoluto"], [55, "Vigoroso"], [57, "Vigilante"],
        [59, "Habilidades"], [60, "Nenhuma"], [61, "Armas"], [62, "Preciso"], [63, "Mordida 4"], [64, "Armadura"], [65, "Concha dura 3"],
        [66, "Defesa"], [68, "Vitalidade"], [70, "Limiar de Dor"], [72, "Sombra"], [73, glint.shadow], [74, "Táticas"], [75, glint.tactics],
        [76, aboar.name], [77, "@UUID[Actor.zcIGliRWIicUAWXZ]{Gigavali Portador de Faísca}"], [78, "GIGAVALI PORTADOR DE FAÍSCA"],
        [79, "Raça"], [80, aboar.race], [81, "Resistência"], [82, "Desafiadora"], [83, "Traços"],
        [84, "Armadurado (II), Arma Natural (II), Robusto (III), Tenaz (I), Veloz (I)"],
        [85, "Preciso"], [87, "Astuto"], [89, "Discreto"], [91, "Persuasivo"], [93, "Rápido"], [95, "Resoluto"], [97, "Vigoroso"], [99, "Vigilante"],
        [101, "Habilidades"], [102, "Punho de Ferro (adepto)"], [103, "Armas"], [104, "Vigoroso"], [105, "Presas 10"],
        [106, "Armadura"], [107, "Couraça 7"], [108, "Defesa"], [110, "Vitalidade"], [112, "Limiar de Dor"],
        [114, "Sombra"], [115, aboar.shadow], [116, "Táticas"], [117, aboar.tactics],
        [118, guard.name], [119, "@UUID[Actor.yUoRVmiEODEV85pr]{Guarda Guerreiro Portador de Faísca}"],
        [120, "que esperava nos campos verdes de lorem ipsum deve ser a cena mais notável e horripilante que já presenciei em minhas viagens."],
        [121, "O único crime do homem foi ter atravessado um lodo que segundo os tabus do clã Enoai é terreno proibido. Ele estava amarrado a uma árvore; então sua boca foi violentamente aberta e um inseto grande como o punho de um homem se enfiou em sua garganta abaixo. Lá ele ficou por dois dias inteiros, completamente silencioso após os primeiros gritos de tormento, antes de ser jogado em uma fogueira furiosa."],
        [122, "Tenho dificuldade em compreender a resposta que minhas perguntas geraram, mas aparentemente este é um ritual realizado para apaziguar a escuridão da floresta, na esperança de que ela deixe o clã em paz. Eles chamaram o inseto de Inseto Brilhante, indicando que é uma forma de abominação, mas"],
        [123, "GUARDA GUERREIRO PORTADOR DE FAÍSCA"], [124, "Raça"], [125, guard.race], [126, "Resistência"], [127, "Desafiadora"], [128, "Traços"], [129, "Mateiro, Tenaz (I), Veloz (I)"],
        [130, "Preciso"], [132, "Astuto"], [134, "Discreto"], [136, "Persuasivo"], [138, "Rápido"], [140, "Resoluto"], [142, "Vigoroso"], [144, "Vigilante"],
        [146, "Habilidades"], [147, "Punho de Ferro (mestre), Homem-de-Armas (adepto), Força da Empunhadura Dupla (mestre)"],
        [148, "Armas"], [149, "Vigoroso"], [150, "Machado 11 (impacto profundo)"], [151, "Armadura"], [152, "Brunea 4"],
        [153, "Defesa"], [155, "Vitalidade"], [157, "Limiar de Dor"], [159, "Sombra"], [160, guard.shadow], [161, "Táticas"], [162, guard.tactics],
        [163, "Configuração de Aventura"], [164, "UM HOMEM EMACIADO"],
        [165, "chega cambaleando em uma cidade ou vila que recentemente experimentou um combate entre os residentes e alguma força hostil (possivelmente cultistas enlouquecidos, elfos ou trolls furiosos famintos). O homem logo morre e é jogado na vala comum onde os inimigos caídos também foram enterrados. Ali, uma faísca se solta para ir caçar, depois de ter colocado uma larva no ventre do antigo hospedeiro."],
        [166, "A faísca segue para o acampamento em busca de diaristas, idosos e indigentes que vivem próximos ao assentamento, onde infesta uma série de desamparados que rapidamente passam fome e são jogados na vala comum. Finalmente, a faísca é exposta por um ex-caçador de tesouros, e o mendigo que a carrega é capturado e queimado, junto com ela."],
        [167, "Os personagens chegam ao local cerca de um mês depois, no momento em que meia dúzia de faíscas se empanturraram, ficando gordas e grandes o suficiente para ir à caça — desta vez, dentro dos muros do assentamento, procurando hospedeiros mais resistentes..."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "10 Glint");
    }],
    ["13 King Toad", (html) => {
      const older = entry.actors["King Toad, Older"];
      const young = entry.actors["King Toad, Young"];
      const background = visibleNodesFromHtml(older.background);
      const appearance = visibleNodesFromHtml(older.appearance);
      if (background.length !== 4 || appearance.length !== 1) throw new Error("Unexpected translated King Toad actor text structure.");
      const olderContinuation = appearance[0].indexOf("têm armas adicionais");
      if (olderContinuation < 0) throw new Error("Could not split translated older King Toad appearance.");
      const replacements = new Map([
        [1, "Sapo-Rei"],
        [2, "Foi quando nos afastamos da emboscada que chegamos à margem do rio. Tudo estava de acordo com o planejado, pois tínhamos nosso barco esperando na água, pronto para nos pegar caso houvesse inimigos à espreita na escuridão da floresta."],
        [3, "Kalara sinalizou para o barco, que levantou âncora enquanto eu mantinha o inimigo que se aproximava afastado com flechas certeiras. Eu estava tão concentrado na tarefa que quase caí no rio, mas Kalara me segurou no último momento. Antes que eu pudesse agradecê-la, ela foi arrastada a uma velocidade tremenda, direto para as águas lamacentas."],
        [4, "A criatura no rio era simplesmente enorme, como uma sombra negra nas profundezas. Atraiu minha amiga com sua língua e a engoliu inteira. Gritei para que a tripulação do navio voltasse, mas eles não o fizeram; logo o barco flutuou sobre a sombra subaquática negra. A língua da criatura atingiu o corrimão, arrebatando o timoneiro. A capitã ficou paralisada de horror quando a língua emergiu mais uma vez, arrastando ela e o barco para as profundezas."],
        [5, "Por que sobrevivi eu não sei. Talvez o monstro estivesse ocupado mastigando o casco do barco e os corpos de meus amigos. A última coisa que vi foram dois olhos enormes sob a superfície, pálidos com um brilho dourado, me observando friamente. Não posso mais visitar a Praça do Sapo e seu maldito esqueleto de sapo sem ouvir o eco do rangido e estalo que ocorreu quando nosso barco foi mastigado em pedaços..."],
        [6, "Eleono, ex-caçador de troféus de Kurun"],
        [7, "ASSIM FALOU AROALETA"],
        [8, "“...e cresceu o ódio entre irmão e irmã, Manaud, o Guloso, e Manaua, o Colérico, enviaram monstro contra monstro em uma batalha furiosa. Por duas luas as pessoas sofreram, ensanguentados, comidos, esmagados. Então a batalha acabou; o vencedor ferido um deus para o povo, temendo sempre a fome do derrotado...”"],
        [9, "DE TODOS OS"], [10, background[0].slice("De todos os ".length)],
        [11, "ALGUNS ESTUDIOSOS AFIRMAM"], [12, background[1].slice("Alguns estudiosos afirmam ".length)],
        [13, "SEJA QUAL FOR A VERDADE"], [14, background[2].slice("Seja qual for a verdade ".length)],
        [15, "OS SAPOS-REI MAIS VELHOS E MUITO MAIORES"], [16, appearance[0].slice(olderContinuation)],
        [17, "Pernas de Sapo como uma Iguaria"],
        [18, "A elite ambriana está sempre em busca de novas experiências culinárias, de preferência aquelas que não podem ser facilmente adquiridas e com preços, portanto, astronômicos. A carne das coxas do sapo-rei atende a esse requisito e, se bem cozida, também tem uma estrutura suave como manteiga e um sabor delicioso. Melhor servida com purê de raízes e molho de alho."],
        [19, "Configuração de Aventura"], [20, "OS PERSONAGENS JOGADORES"],
        [21, "chegam a um assentamento livre na fronteira com Davokar Escura, por iniciativa própria ou em busca de alguma pessoa/expedição desaparecida. As casas são construídas sobre estacas em um pântano, construídas não em torno de alguma praça pública, mas em torno de um lago lamacento."],
        [22, "O assentamento é habitado por ambrianos que, após cruzarem os Titãs, optaram por deixar o reino para trás e se dedicar ao aspecto do Desbravador conhecido como Caçador. Agora eles adoram o sapo-rei na lagoa como uma encarnação do deus, coexistindo pacificamente com ele e seus seguidores mais jovens — os sapos os protegem contra os perigos da floresta, em troca de sua reverência e servilismo."],
        [23, "Os personagens jogadores são recebidos no assentamento e convidados para um banquete onde são oferecidos javalis selvagens, nabos, molho roka e frutas silvestres. E bebidas. Muitas e muitas bebidas, que mais tarde naquela noite são enriquecidas com uma droga para dormir (como Orvalho de Zangão, página 122 do Guia Avançado do Jogador). Um Teste de Vigilante bem-sucedido indica que o gosto da bebida é um pouco diferente; um Teste de Astuto com Veneneficista ou Alquimia revela exatamente o que foi adicionado."],
        [24, "Tontos ou não, os personagens jogadores são finalmente empurrados para o pântano, onde os sapos-rei menores podem aparecer em qualquer lugar na tentativa de atraí-los para o centro do assentamento..."],
        [25, older.name], [26, "@UUID[Actor.EkdzIVa3LrC1RiD5]{Sapo-Rei Adulto}"], [27, "SAPO-REI ADULTO"],
        [28, "Raça"], [29, older.race], [30, "Resistência"], [31, "Difícil"], [32, "Traços"],
        [33, "Anfíbio, Arma Natural (II), Colossal (I), Companheiros (III; três sapos-rei jovens), Devorador (III), Língua Enredadora, Robusto (III), Tenaz (III)"],
        [34, "Astuto"], [36, "Discreto"], [38, "Persuasivo"], [40, "Preciso"], [42, "Rápido"], [44, "Resoluto"], [46, "Vigoroso"], [48, "Vigilante"],
        [50, "Habilidades"], [51, "Punho de Ferro (adepto)"], [52, "Armas"], [53, "Vigoroso"], [54, "Mordida 10"],
        [55, "Armadura"], [56, "Pele 4"], [57, "Defesa"], [59, "Vitalidade"], [61, "Limiar de Dor"],
        [63, "Sombra"], [64, older.shadow], [65, "Táticas"], [66, older.tactics],
        [67, young.name], [68, "@UUID[Actor.Hjg3VxOwV38Mrdrw]{Sapo-Rei Jovem}"], [69, "SAPO-REI JOVEM"],
        [70, "Raça"], [71, young.race], [72, "Resistência"], [73, "Ordinária"], [74, "Traços"],
        [75, "Anfíbio, Arma Natural (I), Língua Enredadora, Robusto (I), Tenaz (I)"],
        [76, "Astuto"], [78, "Discreto"], [80, "Persuasivo"], [82, "Preciso"], [84, "Rápido"], [86, "Resoluto"], [88, "Vigoroso"], [90, "Vigilante"],
        [92, "Habilidades"], [93, "Punho de Ferro (novato)"], [94, "Armas"], [95, "Vigoroso"], [96, "Mordida 5"],
        [97, "Armadura"], [98, "Pele 2"], [99, "Defesa"], [101, "Vitalidade"], [103, "Limiar de Dor"],
        [105, "Sombra"], [106, young.shadow], [107, "Táticas"], [108, young.tactics],
        [109, "O Rei do Volgoma"],
        [110, "Uma das lendas mais populares sobre o sapo-rei diz respeito ao Rei do Volgoma. Seja em tavernas ambrianas ou ao redor de fogueiras bárbaras, histórias são contadas sobre um monstro marinho gigante que foi repetidamente avistado no Lago Volgoma — tão grande quanto um navio de dois mastros, com uma boca que pode engolir um veleiro inteiro, tripulação e tudo. Muitos até consideram a existência do monstro um fato, e não um conto de fadas, devido ao grande número de relatos consistentes e ao fato de que as observações foram feitas continuamente ao longo da história."],
        [111, "Entre aqueles que levam a lenda a sério estão Mestre Lona no Capítulo de Kurun da Ordo Magica, Barão Olagai Haraag e Aldamei, filho mais novo da viúva Baronesa Edindra Mederen. Todos eles contrataram grupos de caçadores de monstros para encontrar evidências da existência do monstro, de preferência algo que indique exatamente onde no Lago Volgoma o Rei tem seu palácio subaquático. Se alguém realmente conseguir matar a criatura, é seguro assumir que esses três estarão preparados para ir muito longe em uma guerra de lances pela carcaça!"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "13 King Toad");
    }],
    ["18 Nightmare", (html) => {
      const nightmare = entry.actors.Nightmare;
      const appearance = visibleNodesFromHtml(nightmare.appearance);
      const background = visibleNodesFromHtml(nightmare.background);
      if (appearance.length !== 1 || background.length !== 2) throw new Error("Unexpected translated Nightmare actor text structure.");
      const replacements = new Map([
        [1, nightmare.name], [2, "PESADELOS SÃO CARNIÇAIS DESENCARNADOS"], [3, appearance[0].slice("Pesadelos são carniçais desencarnados ".length)],
        [4, "ASSIM FALOU AROALETA"],
        [5, "“... e enquanto o corpo e o poder eram dela, os olhos e o desejo não eram; palavras e ações, consolo e luxúria, eram de um espírito faminto. Mas cego para sua querida e amada, o suserano não pôde ver, o olhar estranho, as garras cortantes, que logo trouxeram sua vida até o fim...”"],
        [6, "OS ANFITRIÕES LEVAM"], [7, background[0].slice("Os anfitriões levam ".length)],
        [8, "BANIR UM PESADELO"], [9, background[1].slice("Banir um pesadelo ".length)],
        [10, "Tio Janos sempre foi um homem peculiar, um pouco esquisito, mas não de um jeito ameaçador. É só que ele é diferente, entende? Um pouco interessado demais no macabro, talvez, mas não mais do que qualquer estudioso entediado comum. Você sabe como esses ratos ávidos podem ser, isolados da realidade, do sangue, do fedor e da miséria. Tenho visto muitos deles em meu círculo familiar. Minha mãe era em muitos aspectos também. Ela nem mesmo me deu à luz e, portanto, nunca experimentou fisicamente a conexão entre vida, dor e sangue. Para ela, os fluidos corporais estariam associados exclusivamente a desejos doentios e à morte."],
        [11, "Claro que me incomodou quando meu querido tio começou a conviver com os poetas no cemitério; eles se encontravam à noite, recitando poesia sobre sepulturas abertas e vazias ou, pior ainda, para os cadáveres. A partir daí, talvez não fosse um passo tão grande entrar também nos mausoléus, e fazer o mesmo na proximidade dos mortos. Então algo aconteceu; o quê eu não sei. A Patrulha da Cidade foi chamada ao cemitério depois que alguém abriu uma cova; logo depois, um dos poetas foi encontrado morto em uma cripta vazia. Foi quando resolvi confrontar meu tio, e fui vê-lo."],
        [12, "Encontrei-o emaciado, exausto, dando sinais de loucura, com hematomas nas mãos e sujeira sob as unhas. Ainda assim, garantiu-me que estava bem e que já não tinha nada a ver com os poetas. Para verificar se ele estava falando a verdade, esperei do lado de fora da sua casa e, como se suspeitava, ele saiu pela janela do quarto vestindo apenas sua camisola. Eu o chamei e, quando ele se virou para mim, fiquei petrificada. Acredite em mim, os olhos que me fitavam das órbitas do tio Janos não eram dele."],
        [13, "Liveta, Adepta da Ordem, em seu relato aos Mantos Negros"],
        [14, "Configuração de Aventura"], [15, "UM VELHO AMIGO,"],
        [16, "mentor ou alguma outra pessoa querida pede ajuda aos personagens. Depois de um período de pesadelos cada vez piores, ele desenvolveu um hábito bastante indesejável de sonambulismo e pensa que pode estar possuído — a questão é: por quem ou o quê e por quê?"],
        [17, "Logo fica claro para os personagens que seu amigo não está mais em seu juízo perfeito; estudar livros proibidos e visitar ruínas malévolas o corrompeu além do que é saudável. Aproximando-se da escuridão, o amigo também ficou extremamente curioso sobre o que a força possuidora poderia desejar. Claro, ele gostaria de se livrar do carniçal, mas não imediatamente — não até que alguém tenha resolvido o mistério sobre o que o carniçal está procurando sob a cidade!"],
        [18, "Para os personagens, isso se torna um dilema. Eles podem obrigar o amigo a passar todas as noites na companhia do pesadelo ou preparar um Exorcismo traiçoeiro para salvar o amigo contra sua vontade."],
        [19, "O cenário mais empolgante seria, claro, se os personagens sucumbissem ao mesmo fascínio sobre o que o carniçal está procurando. Talvez os pesadelos do amigo estejam de alguma forma ligados a um dos objetivos do grupo de jogo, ou pelo menos ao de algum personagem individual?"],
        [20, nightmare.name], [21, "@UUID[Actor.8XM0ztoQ1eTras8a]{Pesadelo}"], [22, "PESADELO"],
        [23, "Raça"], [24, nightmare.race], [25, "Resistência"], [26, "Desafiadora"], [27, "Traços"],
        [28, "Assombração (III), Dano Alternativo (I), Forma de Espírito (III)"],
        [29, "Astuto"], [31, "Discreto"], [33, "Persuasivo"], [35, "Preciso"], [37, "Rápido"], [39, "Resoluto"], [41, "Vigoroso"], [43, "Vigilante"],
        [45, "Habilidades"], [46, "Dominação (mestre)"], [47, "Armas"], [48, "Persuasivo"],
        [49, "Toque da morte 3, causa dano a Resoluto, ignora Armadura"], [50, "Armadura"], [51, "Metade do dano de acordo com Forma de Espírito III"],
        [52, "Defesa"], [54, "Vitalidade"], [56, "Limiar de Dor"], [58, "Sombra"], [59, nightmare.shadow], [60, "Táticas"], [61, nightmare.tactics],
        [62, "Os Presentes do Pesadelo"],
        [63, "Uma pessoa possuída pelo pesadelo retém todos os traços e habilidades, mas pode usar o valor Resoluto do espírito possuidor pela duração da posse. Além disso, o hospedeiro adquire os traços Percepção Noturna e Arma Natural (I) enquanto seu corpo está sendo controlado pelo pesadelo, este último na forma de garras curtas e grossas."],
        [64, "“Ouçam, ouçam, o Canibal da Boêmia capturado! Ontem à noite, depois de dez vítimas mutiladas e parcialmente devoradas, Jorval, o bardo romântico por trás do poema popular ‘Para descansar em seus braços’, foi pego em flagrante, cravando os dentes na coxa de um jovem morto. Embora afirme ser inocente, ele admite às vezes ter acordado com sangue no rosto; pensando que era apenas uma hemorragia nasal noturna."],
        [65, "Amigos e rivais em estado de choque; Kurto, o Poeta Poderoso, foi ouvido gritando sua mais recente sátira ‘Digerindo seus braços’ fora das Profundezas dos Titãs pouco antes do amanhecer. Apesar da negativa do acusado, o Comandante Alvo Pescoço de Aço não tem dúvidas de que o Boêmio Canibal foi pego; execução agendada para amanhã no Praça do Triunfo.”"],
        [66, "Pregoeiro em Yndaros"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "18 Nightmare");
    }],
    ["19 Night Swarmers", (html) => {
      const swarm = entry.actors["Night Swarmers, Swarm"];
      const cloud = entry.actors["Night Swarmers, Murder Cloud"];
      const background = visibleNodesFromHtml(swarm.background);
      if (background.length !== 3) throw new Error("Unexpected translated Night Swarmers actor text structure.");
      const replacements = new Map([
        [1, "Enxameador Noturno"],
        [2, "A PERSONIFICAÇÃO DA CORRUPÇÃO"], [3, background[0].slice("A personificação da corrupção, ".length)],
        [4, "COMO CRIATURAS ISOLADAS"], [5, background[1].slice("Como criaturas isoladas, ".length)],
        [6, "AS DECLARAÇÕES DE TESTEMUNHAS"], [7, background[2].slice("As declarações de testemunhas ".length)],
        [8, "Premonição Crepitante"],
        [9, "Não importa se é um enxame ou uma nuvem assassina, os enxameadores noturnos permanecem adormecidos no solo, em rachaduras nas paredes ou sob a casca das árvores até que um alvo vivo esteja ao seu alcance. A partir do momento em que são despertados, são necessários dois turnos para o coletivo se preparar — até então, o enxame está disperso demais para atacar ou ser atacado."],
        [10, "Um Teste de Vigilante bem-sucedido leva à descoberta do som crepitante e sussurrante que vem dos movimentos dos enxameadores noturnos; combinado com Mateiro ou Saber de Bestas, também fornece ideias sobre o que realmente está para acontecer. Durante o segundo turno, todos os presentes podem ver os enxameadores emergirem, levantarem voo e começarem a se reunir. Claro, os intrusos podem optar por fugir; o mestre de jogo determina (ou rola 1D6 para decidir) quantos turnos eles têm que correr antes que os perseguidores parem de caçá-los."],
        [11, "Foi inacreditável! Chegamos ao lendário Templo da Serpente de Syravan sem baixas, na verdade sem sofrer nenhum tipo de ferimento, infecção ou veneno. Mestre Muldar parecia uma criança no Dia da Rainha. Ele pulou ao pé da colina e gritou palavrões para sua mãe, que aparentemente nunca acreditou ou apoiou suas ambições, dizendo que os tesouros seriam a morte dele. Rapaz, ela estava certa..."],
        [12, "Esperamos até a manhã seguinte para subir a encosta e entrar pelas vinhas que cobrem a entrada. Muitos de nós ouvimos imediatamente — o clique, o esmagamento e o deslizar das pedras caindo. Mas Muldar não quis ouvir e não deu ouvidos aos nossos avisos. Ele se recusou a permitir que voltássemos. Eu fui o único que desobedeceu."],
        [13, "Assim que vi as criaturas minúsculas e pálidas emergirem do chão, das paredes e da vegetação, virei-me e corri. Antes mesmo de chegar à entrada, as criaturas se reuniram em vários enxames famintos que logo atacaram meus companheiros. Pouco tempo depois, uivos e gritos abomináveis ecoaram do alto do morro. Se os homens de Muldar tivessem despertado alguma coisa ou se os uivos viessem deles... Bem, prefiro não saber..."],
        [14, "Trecho do relato do místico Galfenio à Mãe Mehira"],
        [15, "Configuração de Aventura"], [16, "ENXAMEADORES NOTURNOS SÃO"],
        [17, "principalmente um obstáculo ou fator complicador durante as viagens na Davokar, especialmente quando o personagem jogador está explorando ruínas ou viajando em regiões onde o Pacto de Ferro já lutou contra as divindades perversas e criações abomináveis de Symbaroum. Mas é claro que eles podem receber um papel mais proeminente."],
        [18, "Talvez alguém esteja realizando escavações particulares sob uma cidade menor ou posto avançado, e acabe por se deparar com um covil de enxameadores noturnos. Os personagens podem estar lá quando isso ocorre ou serem encarregados de investigar o que aconteceu e, nesse caso, chegar em um assentamento que está deserto, exceto por nascidos da mácula, sejam humanos ou animais, que saem à noite."],
        [19, "Outra opção é fazer com que uma bruxa vingativa obtenha acesso a um elo místico que a permita possuir um enxame e enviá-lo para atacar os residentes em um assentamento livre ou posto avançado que a tenha desagradado. A posse pode ser revelada com a habilidade Visão de Bruxa e um Teste de Vigilante bem-sucedido, após o qual o poder possuidor pode ser rastreado e tratado."],
        [20, swarm.name], [21, "@UUID[Actor.cxVbfdsZE8LgRcfg]{Enxameadores Noturnos}"], [22, "ENXAMEADORES NOTURNOS"],
        [23, "Raça"], [24, swarm.race], [25, "Resistência"], [26, "Desafiadora"], [27, "Traços"],
        [28, "Asas (II), Ataque Corruptivo (II), Ataque Perfurante (II), Enxame (II), Percepção Noturna, Pés Leves, Regeneração (III)"],
        [29, "Astuto"], [31, "Discreto"], [33, "Persuasivo"], [35, "Preciso"], [37, "Rápido"], [39, "Resoluto"], [41, "Vigoroso"], [43, "Vigilante"],
        [45, "Habilidades"], [46, "Guerreiro Natural (adepto)"], [47, "Armas"], [48, "Preciso"],
        [49, "Mordida 0 (penetração: 5), dois ataques no mesmo alvo, 1D6 corrupção temporária"],
        [50, "Armadura"], [51, "Metade do dano de acordo com Enxame II, regenera 4 de Vitalidade por turno exceto dano por fogo"],
        [52, "Defesa"], [54, "Vitalidade"], [56, "Limiar de Dor"], [58, "Sombra"], [59, swarm.shadow], [60, "Táticas"], [61, swarm.tactics],
        [62, cloud.name], [63, "@UUID[Actor.eNOIHlYeSCm3trkn]{Nuvem Assassina de Enxameadores Noturnos}"],
        [64, "NUVEM ASSASSINA DE ENXAMEADORES NOTURNO"], [65, "Raça"], [66, cloud.race], [67, "Resistência"], [68, "Difícil"], [69, "Traços"],
        [70, "Asas (III), Ataque Corruptivo (III), Ataque Perfurante (III), Aura Nociva (I, corrupção temporária), Enxame (III), Percepção Noturna, Pés Leves, Regeneração (III)"],
        [71, "Astuto"], [73, "Discreto"], [75, "Persuasivo"], [77, "Preciso"], [79, "Rápido"], [81, "Resoluto"], [83, "Vigoroso"], [85, "Vigilante"],
        [87, "Habilidades"], [88, "Guerreiro Natural (adepto)"], [89, "Armas"], [90, "Preciso"],
        [91, "Mordida 0 (penetração: 6), dois ataques no mesmo alvo, 1D8 corrupção temporária"],
        [92, "Armadura"], [93, "Um quarto de dano de acordo com Enxame III, regenera 4 de Vitalidade por turno exceto dano por fogo"],
        [94, "Defesa"], [96, "Vitalidade"], [98, "Limiar de Dor"], [100, "Sombra"], [101, cloud.shadow], [102, "Táticas"], [103, cloud.tactics],
        [104, "Se encontrar Enxameadores Noturnos, fuja para salvar sua vida! Se não puder fugir, ataque com fogo. Se não tiver fogo, engula Seiva Púrpura enquanto se enrole como um maníaco. E se você foi para Davokar Escura sem Seiva Púrpura, é o seu funeral!"],
        [105, "Conselho do Mestre Cornélio"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "19 Night Swarmers");
    }],
    ["21 Scorner", (html) => {
      const scorner = entry.actors.Scorner;
      const appearance = visibleNodesFromHtml(scorner.appearance);
      const background = visibleNodesFromHtml(scorner.background);
      if (appearance.length !== 1 || background.length !== 2) throw new Error("Unexpected translated Scorner actor text structure.");
      const replacements = new Map([
        [1, scorner.name], [2, "A ABOMINAÇÃO DAEMONICA"], [3, appearance[0].slice("A abominação daemonica ".length)],
        [4, "ASSIM FALOU AROALETA"],
        [5, "“... e Kasion e Bruto apontaram suas lâminas, no tirano nobre, para o coração preto prateado. No crepúsculo da sala do trono havia rebeldes e príncipe, mas também um perigo à espreita; o sangue dos rivais se fundiu, lentamente onde corpos quebrados logo caíram...”"],
        [6, "FONTES MENOS CONFIÁVEIS"], [7, background[0].slice("Fontes menos confiáveis ".length)],
        [8, "A JULGAR PELAS CANÇÕES,"], [9, background[1].slice("A julgar pelas canções, ".length)],
        [10, "Evocar Escarnecedor"],
        [11, "Feiticeiros podem invocar Escarnecedores realizando uma versão do ritual Convocar Daemon (veja a página 88 do Guia Avançado do Jogador)."],
        [12, "Eu nunca deveria ter insultado o Barão Oramei. Os rumores sobre ele estar aliado a feiticeiros não são nem um pouco exagerados; isso eu posso testemunhar nestas horas finais de minha miserável vida. As tropas do Barão estão cercando meu castelo, e as fortificações que outrora ergui para minha proteção são agora as paredes de minha câmara mortuária. Eles mataram meu alquimista primeiro, com uma flecha, então agora eles podem apenas sentar e esperar enquanto a magia da morte do Barão nos mata aqui, um por um; nos esmaga em sacos de pele deformados cheios de ossos quebrados e pulverizados."],
        [13, "Escrevo isto sozinho em meu quarto, com esposa e filhos sendo caçados no corredor, como oferendas inúteis à abominação. Não vai se encerrar com eles. Estou vestindo uma armadura que não me protegerá, estou trancado atrás de uma porta que não impedirá, e sobre a mesa repousa a espada de minha mãe, que dificilmente pode me salvar de um inimigo que não pode ser visto. O abraço da abominação logo esmagará meus pulmões e quebrará minha espinha, enquanto eu me sento com a espada em uma das mãos e a caneta na outra. Que todos os seres abomináveis do outro mundo assombrem o Barão de Haaras por toda a eternidade."],
        [14, "Despedida do Barão Saludo, ano –25, Alberetor"],
        [15, "Escritos cuneiformes no Templo Índigo que, de acordo com alguns, indicam que o primeiro Escarnecedor se impôs no mundo através de uma gravura espelhada e parodicamente distorcida do ritual simbolista Guardião Rúnico."],
        [16, "Coleção de símbolos esculpidos em uma placa de piso em uma das ruínas mais bem preservadas de Odaban; supostamente descreve a grave tentativa de assassinato fracassada do Príncipe Almanthor. O príncipe morreu e os rebeldes também."],
        [17, "Configuração de Aventura"], [18, "O ESCARNECEDOR PODE"],
        [19, "ser usado de várias maneiras, uma das mais interessantes sendo ilustrada pela carta do Barão Saludo na página anterior: os personagens estão em um local atacado por um Escarnecedor invisível e sorrateiro contra o qual eles têm que lutar para salvar a si mesmos e a qualquer outra pessoa presente no edifício ou estrutura. Se o mestre de jogo quiser expandir o cenário, os personagens podem ter recebido um pedido de socorro de dentro do local, e então tenham que passar pela força sitiante antes de resgatar os residentes e organizar um contra-ataque."],
        [20, "Outra opção é que os personagens fiquem em um local mais aberto, expostos aos ataques de um Escarnecedor. Talvez eles tenham que primeiro combater a criatura, para depois explicar sua presença? Se for, deve ser bem fácil de descobrir de onde vem a abominação. Poderia ser um demonologista ou um culto malicioso? Ou talvez uma ferida purulenta no mundo tenha se aberto perto ou mesmo dentro do assentamento?"],
        [21, scorner.name], [22, "@UUID[Actor.kAixeuiCbxTBXAun]{Escarnecedor}"], [23, "ESCARNECEDOR"],
        [24, "Raça"], [25, scorner.race], [26, "Resistência"], [27, "Difícil"], [28, "Traços"],
        [29, "Abraço Esmagador (III), Arma Natural (III), Aterrorizar (II, se visível, parcialmente ou total), Invisibilidade (III), Robusto (II), Tenaz (III)"],
        [30, "Astuto"], [32, "Discreto"], [34, "Persuasivo"], [36, "Preciso"], [38, "Rápido"], [40, "Resoluto"], [42, "Vigoroso"], [44, "Vigilante"],
        [46, "Habilidades"], [47, "Punho de Ferro (adepto)"], [48, "Armas"], [49, "Vigoroso"], [50, "Tentáculos 10 (longa), e Abraço Esmagador 4"],
        [51, "Armadura"], [52, "Carne dura 3"], [53, "Defesa"], [55, "Vitalidade"], [57, "Limiar de Dor"],
        [59, "Sombra"], [60, scorner.shadow], [61, "Táticas"], [62, scorner.tactics],
        [63, "Minha linda moça,"], [64, "como um escarnecedor"], [65, "para mim, tão perto de"], [66, "mim sempre, mesmo"],
        [67, "quando não posso ver."], [68, "Meu coração você"], [69, "quebrou, minha estrutura"], [70, "óssea também, naquele abraço mais doce, quando cedi a você."],
        [71, "Verso da canção de amor Beleza Desdenhada"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "21 Scorner");
    }],
    ["22 Skullbiter", (html) => {
      const hatchling = entry.actors["Skullbiter, Hatchling"];
      const crusher = entry.actors["Skullbiter, Crusher"];
      const queen = entry.actors["Skullbiter, Queen"];
      const replacements = new Map([
        [1, "Morde-crânio"], [2, "OS ASSASSINOS BLINDADOS"],
        [3, "conhecidos pelos magos do cajado como Bestas de Carapaça, e pelos clãs como Morde-crânios, provavelmente têm seu local de origem em algum lugar perto do castelo dos místicos empunhadores de cajados. É lá que eles costumam aparecer e demonstrar suas táticas de batalha, tão simples quanto devastadoras: encolha-se atrás de sua carapaça e role direto para — e através — da linha defensiva do inimigo, até o coração da força adversária. Lá, eles se empinam, mostrando suas mandíbulas. Uma besta de carapaça encolhida não é facilmente ferida, fato que os magos do cajado podem atestar. É preciso esperar pacientemente que eles se levantem e depois atacar com força."],
        [4, "PARECE QUE"],
        [5, "as bestas de carapaças não podem ser corrompidas, mas sofrem dano físico de corrupção de uma forma que lembra os anões. Alguns estudiosos afirmam que eles realmente são anões transmodificados, enquanto a maioria simplesmente acredita que as bestas e os anões são filhos da mesma ciência perturbada — que foram criados através de métodos semelhantes, sem estarem relacionados de qualquer outra forma."],
        [6, "EM TODO CASO,"],
        [7, "o fato de sofrerem danos por corrupção pode ser usado contra eles, principalmente ao buscar rotas acima do solo que são tão corrompidas a ponto de serem contagiosas e, portanto, prejudiciais às bestas de carapaça. Além disso, os místicos que são capazes de usar a corrupção com sucesso como uma arma podem, é claro, fazê-lo contra os morde-crânios, mesmo que os magos do cajado nunca considerem essa possibilidade ou tolerem que alguém recorra a tais métodos."],
        [8, "BESTAS DE CARAPAÇA VÊM"],
        [9, "em tamanhos diferentes. Como filhotes, eles são do tamanho de porcos e, depois de encherem a barriga com a carne de seus inimigos, não demoram a crescer como um cavalo, em verdadeiros trituradores. Muito mais tarde, tendo atingido sua força total, eles param de crescer, mas usam os nutrientes dos inimigos mortos para colocar ovos tão grandes quanto (e facilmente confundidos com) pedregulhos. Esses ovos são uma ameaça para os aventureiros, pois tendem a eclodir assim que criaturas de sangue quente passam."],
        [10, "A passagem oriental para os templos incendiados está fechada. Existem bestas de carapaça à espreita no subsolo. Eles romperam nossa linha de frente depois de apenas duas ondas de ataque. Estou surpreso por termos resistido ao primeiro ataque esmagador; tal era o seu poder blindado. Uma vez que eles romperam, quando estavam em nosso meio, era o mago do cajado contra besta de carapaça, duelo após duelo. Todos nós sabemos como essas batalhas geralmente terminam."],
        [11, "Recuei, o bastão girando, em direção a um pilar quebrado cujo topo agora serve como minha escrivaninha. Eu sou o único que restou. Há cajados abandonados, cajados quebrados, espalhados pelo chão abaixo. As feras arrastavam suas vítimas esmagadas para as tocas. Seus próprios mortos também, para fortalecer os sobreviventes por meio do canibalismo a sangue frio. Eu não posso deixar de sentir um certo respeito por este inimigo. Como alguém disse: é como se eles tivessem sido criados para lutar contra magos do cajado. Mesmo que não tenham sido criados para esse fim, certamente estão muito bem equipados para resistir ao poder de nossos bastões, romper as fileiras de nossos guerreiros e atacar diretamente nossa carne pateticamente fraca."],
        [12, "O sol está se pondo lentamente e os violentinos estão se reunindo. Devo voltar para baixo e arriscar a fúria das bestas de carapaça, ou ser bicado até a morte por uma centena de bicos gananciosos assim que a noite cair."],
        [13, "Um dos muitos relatos de ataques de bestas de carapaça que são mantidos nos arquivos do castelo dos magos do cajado, nas profundezas da Davokar."],
        [14, "A Arena dos Magos do Cajado"],
        [15, "Embora existam algumas indicações de que as bestas de carapaça estão se espalhando para o sul, e tanto os clãs quanto os ambrianos são ensinados a reconhecer seus rastros, os magos do cajado ainda são os que mais sofrem com a criatura em questão. Magos do cajado individuais até observaram que a besta de carapaça é a maior razão pela qual eles ainda não localizaram Symbar e que estão obstruindo todas as tentativas de mapear as ruínas do norte da Davokar."],
        [16, "Para remediar a situação, os magos do cajado criaram uma arena em uma parte isolada de seu castelo, para treinar seus guerreiros e místicos para resistir à ameaça. Lá eles estão criando bestas de carapaça para estudo, e os magos do cajado e guerreiros são ensinados a lutar contra elas em situações de combate controladas — apenas na forma de filhotes, é claro, mas ainda é muito útil para encontros futuros."],
        [17, hatchling.name], [18, "@UUID[Actor.UAQXgTC5f8HzqVej]{Morde-crânio, Filhote}"], [19, "MORDE-CRÂNIO FILHOTE"],
        [20, "Raça"], [21, hatchling.race], [22, "Resistência"], [23, "Ordinária"], [24, "Traços"],
        [25, "Arma Natural (I), Armadurado (I), Carapaça (I), Herança Natural, Pés Leves, Robusto (I), Violento (I)"],
        [26, "Preciso"], [28, "Astuto"], [30, "Discreto"], [32, "Persuasivo"], [34, "Rápido"], [36, "Resoluto"], [38, "Vigoroso"], [40, "Vigilante"],
        [42, "Habilidades"], [43, "Punho de Ferro (novato)"], [44, "Armas"], [45, "Vigoroso"], [46, "Mordida 5"],
        [47, "Armadura"], [48, "Carapaça 4"], [49, "Defesa"], [51, "Vitalidade"], [53, "Limiar de Dor"], [55, "Sombra"], [56, hatchling.shadow], [57, "Táticas"], [58, hatchling.tactics],
        [59, crusher.name], [60, "@UUID[Actor.Mmq1yN476IvvXa1M]{Morde-crânio, Triturador}"], [61, "MORDE-CRÂNIO TRITURADOR"],
        [62, "Raça"], [63, crusher.race], [64, "Resistência"], [65, "Difícil"], [66, "Traços"],
        [67, "Arma Natural (II), Armadurado (III), Carapaça (III), Herança Natural, Pés Leves, Robusto (III), Violento (III)"],
        [68, "Preciso"], [70, "Astuto"], [72, "Discreto"], [74, "Persuasivo"], [76, "Rápido"], [78, "Resoluto"], [80, "Vigoroso"], [82, "Vigilante"],
        [84, "Habilidades"], [85, "Guerreiro Natural (adepto), Punho de Ferro (novato)"], [86, "Armas"], [87, "Vigoroso"],
        [88, "Mordida 9/5, dois ataques no mesmo alvo"], [89, "Armadura"], [90, "Carapaça 8"], [91, "Defesa"], [93, "Vitalidade"], [95, "Limiar de Dor"],
        [97, "Sombra"], [98, crusher.shadow], [99, "Táticas"], [100, crusher.tactics],
        [101, queen.name], [102, "@UUID[Actor.VY9IPXFBwZN8OE3U]{Morde-crânio, Rainha}"], [103, "MORDE-CRÂNIO RAINHA"],
        [104, "Raça"], [105, queen.race], [106, "Resistência"], [107, "Poderosa"], [108, "Traços"],
        [109, "Arma Natural (III), Armadurado (III), Carapaça (III), Companheiros (III, três bestas de carapaça filhotes), Herança Natural, Pés Leves, Resistência Mística (III), Robusto (III), Tenaz (II), Violento (III)"],
        [110, "Preciso"], [112, "Astuto"], [114, "Discreto"], [116, "Persuasivo"], [118, "Rápido"], [120, "Resoluto"], [122, "Vigoroso"], [124, "Vigilante"],
        [126, "Habilidades"], [127, "Acrobacias (adepto), Excepcionalmente Vigoroso (adepto), Guerreiro Natural (mestre), Punho de Ferro (mestre)"],
        [128, "Armas"], [129, "Vigoroso"], [130, "Mordida 17/11 (longa), dois ataques no mesmo alvo"], [131, "Armadura"], [132, "Carapaça 8"],
        [133, "Defesa"], [135, "Vitalidade"], [137, "Limiar de Dor"], [139, "Sombra"], [140, queen.shadow], [141, "Táticas"], [142, queen.tactics],
        [143, "Configuração de Aventura"], [144, "Ninho de Ovos, Armadilha"],
        [145, "Aqueles que chegam a uma Ação de Movimento de um aglomerado de ovos devem passar por um Teste de Discreto (não modificado); outra opção é destruir o ninho com armas e poderes, no caso este deve sofrer um total de 15 de dano em um único turno (Armadura 2). Se qualquer uma dessas tentativas falhar, 1D4 filhotes de besta de carapaça são liberados e atacam imediatamente."],
        [146, "OS MORDE-CRÂNIOS SÃO PRINCIPALMENTE"],
        [147, "uma ameaça para aqueles que tentam se infiltrar na Davokar Escura, mas é claro que é tentador que eles também apareçam em áreas mais civilizadas — com a ajuda de agentes involuntários ou malévolos. Estudiosos podem ter encontrado os ovos e, convencidos de que seriam capazes de lidar com tal ameaça, os levaram a um assentamento para estudo. Isso leva a um massacre catastrófico: o assentamento logo se torna um poço de procriação para bestas de carapaça recém-nascidas — uma ameaça que, se não for tratada imediatamente, resulta em um ataque esmagador de morde-crânios adultos e, mais tarde, em uma rainha morando em algum lugar abaixo do assentamento, o que basicamente significa que o lugar está condenado."],
        [148, "Um cenário semelhante pode ser causado por alguém — um culto de monstros ou agentes de um atacante cheio de ódio — contrabandeando ovos de morde-crânios para o meio de seus inimigos e depois observando de longe, onde o assentamento ou castelo é devastado pelos predadores."],
        [149, "Em ambos os casos, os personagens podem se envolver quando alguém é morto por um filhote, após o que devem descobrir o que está acontecendo com base nas pistas disponíveis — ou seja, o cadáver, rastros no chão e o ovo vazio. Tal cenário terá o maior efeito se ambientado em um lugar do qual os personagens gostem ou dependam; isso intensificaria o drama e fortaleceria a vontade dos personagens de resolver a situação."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "22 Skullbiter");
    }],
    ["17 Nefarani", (html) => {
      const nefarani = entry.actors.Nefarani;
      const replacements = new Map([
        [1, "Nefarani"], [2, "AO QUE TUDO INDICA,"],
        [3, "os Nefarani são o que resta de uma guarda guerreira que foi criada em Symbar para combater os inimigos cada vez mais numerosos do imperador. Desde a queda de Symbaroum, eles vagaram pelo norte da Davokar, onde foram contratados por vários chefes bárbaros para matar monstros ou batalhar com outros clãs. Como os nefarani se comunicam em total silêncio, ninguém sabe como eles decidem para onde ir ou por quem lutar. No entanto, é claro que eles estão constantemente procurando alguém para servir e que não ficarão com o mesmo mestre por mais de uma grande batalha."],
        [4, "NAS ÚLTIMAS DÉCADAS,"],
        [5, "os nefarani trilharam caminho para o sul e lutaram em batalhas entre bárbaros e ambrianos, geralmente — mas nem sempre — ao lado dos bárbaros. Embora todos possam falar, e o farão com estranhos se necessário, eles são representados coletivamente por uma porta-voz, recentemente identificada como Asenath. Em combate, esta mulher não é mais líder do que qualquer outra, o que levou os estrategistas militares ambrianos a concluir que os nefarani lutam da maneira como falam: silenciosamente e, de alguma forma, coletivamente. Alguns estudiosos cogitam até a hipótese de que nefarani é na verdade o nome de um espírito poderoso que possuiu todo um exército de guerreiros."],
        [6, "DE QUALQUER FORMA,"],
        [7, "os nefarani são conhecidos por não envelhecerem como os outros, e só morrerão pelas lâminas de seus inimigos. Sem nenhum novo nefarani nascendo ou sendo criado, eles estão desaparecendo lentamente. No entanto, aqueles que ainda estão vivos ganham poder com cada irmão ou irmã caídos, ficando mais fortes ao longo do tempo. De acordo com estudiosos que os estudaram de perto, há uma crença generalizada entre os nefarani de que o último de sua espécie finalmente terá uma visão sobre o propósito maior de sua existência coletiva — uma visão que, com a força combinada dos irmãos caídos, irá ajudá-lo a determinar o destino do mundo."],
        [8, "HOJE, 27 NEFARANI"],
        [9, "são tudo o que resta da força original de aproximadamente mil guerreiros. A força individual deles já é considerável, e sempre que um é morto, os que sobrevivem ficam mais fortes, conforme mostra a Tabela 4."],
        [10, "Tabela 4: A Resistência Individual dos Nefarani"], [11, "NÚMERO DE VIVOS"], [12, "ESTATÍSTICAS ADICIONAIS PARA CADA NEFARANI INDIVIDUAL"],
        [14, "Resistência Desafiadora: As estatísticas especificadas originalmente"],
        [16, "Resistência Difícil: Atualize para Punho de Ferro (mestre), adicione Excepcionalmente Vigoroso (mestre) e Inabalável (mestre). Vigoroso 18 (–8), Vitalidade 18/9"],
        [18, "Resistência Poderosa: 10 × mestre, incluindo Acrobacias (mestre), Amoque (mestre), Excepcionalmente Rápido (mestre), Excepcionalmente Resoluto (mestre), Regeneração (III)"],
        [20, "Resistência Lendária: 20 × mestre, incluindo Armadurado (III), Combate Mortal (III), Excepcionalmente Astuto (mestre), Excepcionalmente Vigilante (mestre), Reflexos Rápidos (III), Robusto (III)"],
        [21, "Eles lutaram em formação cerrada, movendo-se como um grande corpo, ao invés de como indivíduos. Eles lutaram sem palavras ou ordens faladas; grunhidos de esforço e gemidos de dor eram tudo o que vinham deles. Somente quando um deles caiu é que eles gritaram. Primeiro um chamou o nome do caído, depois os outros fizeram o mesmo, todos ao mesmo tempo. Eles então lutaram em silêncio, embora, se possível, ainda mais freneticamente. ¶ Eles eram poucos, nós éramos muitos — matamos todos eles, ao custo de pesadas baixas. Ouvi rumores de que existem mais como eles; que o que lutamos foi apenas a retaguarda de uma força maior. Bahiti, Teremun, Madaai, Hadar, Idona. Sim, mesmo agora, meu amado às vezes me acorda enquanto, suando frio, eu grito seus nomes durante o sono."],
        [22, "Coronel Alusa, na batalha no Charco de Karo no ano 8."],
        [23, "TRAÇO ÚNICO: LIGAÇÃO SANGUÍNEA NEFARANI"],
        [24, "Os nefarani estão ligados por um vínculo de sangue místico, uma força unificadora que remonta ao tempo de sua criação. O laço de sangue tem os seguintes efeitos:"],
        [25, "Conexão mística:"],
        [26, "Os nefarani podem falar uns com os outros telepaticamente, desde que estejam fisicamente ao alcance da voz um do outro — eles podem “sussurrar” para um indivíduo específico, “falar” para que o nefarani mais próximo a eles possa ouvir ou “gritar” e alcançar todos os nefarani dentro da distância normal de audição. Eles também podem sentir a presença de outros nefarani dentro da mesma distância e preferem não se afastar mais do que isso sozinhos; no entanto, eles podem, é claro, fazê-lo em grupos, se a missão assim o exigir. Os nefarani se comunicam e coordenam suas lutas por meio dessa conexão mística, tudo em completo silêncio."],
        [27, "Poder dos caídos:"], [28, "Toda vez que um nefarani morre, três coisas acontecem."],
        [29, "Todos os nefarani ao alcance da voz recuperam imediatamente 1D6 de"], [30, "Vitalidade"],
        [32, "Todos os nefarani presentes gritam o nome dos caídos, o que afeta os inimigos presentes como se eles tivessem sofrido um ataque místico: todos eles têm uma segunda chance de falhar em todos os Testes de sucesso. O efeito é automático durante o primeiro turno e dura até que o inimigo individual passe em um Teste de"], [33, "Resoluto"],
        [35, "Por fim, todos os nefarani, não importa a distância, recebem parte da força vital do caído, dado que cada indivíduo restante fica cada vez mais forte à medida que seus números coletivos diminuem. Por meio desse processo, os nefarani restantes desenvolvem traços monstruosos (entre outras coisas)."],
        [36, "Configuração de Aventura"], [37, "OS NEFARANI PODEM"],
        [38, "ser usados como adversários difíceis para personagens orientados para o combate, ou como um mistério em si. Esta semente de aventura se concentra no último, mas também oferece potencial para o primeiro — dependendo de como os personagens decidem enfrentar a situação."],
        [39, "Os personagens se encontram em um local sitiado quando de repente os nefarani aparecem, oferecendo-se para ajudar o inimigo; uma batalha é iminente, e com os nefarani envolvidos, os defensores provavelmente não prevalecerão. Surpreendentemente, os nefarani não participam do primeiro ataque, mas discretamente enviam uma negociadora (Asenath) para falar com os personagens, que presumivelmente se destacaram na primeira batalha e claramente não fazem parte da força principal dos defensores. Acontece que os nefarani não desejam lutar aqui, mas alguém na área sequestrou um de seus irmãos e eles o querem de volta antes do anoitecer. Caso contrário, os nefarani irão atacar e recuperá-lo eles mesmos. Se os personagens perguntarem como Asenath pode ter tanta certeza de que seu irmão de sangue está lá, ela responde: “Ele clama por mim do subsolo. Eles estão roubando o sangue dele.”"],
        [40, "A verdade é que um manto negro/feiticeiro/alquimista panzer ambriano/místico local capturou um nefarani para, através da alquimia, extrair a resposta para o mistério de seu poderoso laço de sangue; um segredo que muitos pagariam quase tudo para aprender. Os companheiros do místico tentarão inicialmente lutar contra os personagens, mas quando isso não parece mais uma opção viável, o místico oferece aos personagens uma parte de sua riqueza futura com a condição de que eles não devolvam o prisioneiro; uma oferta que, se aceita, significa batalha contra os nefarani, ou pelo menos uma intensa fuga do local condenado."],
        [41, nefarani.name], [42, "@UUID[Actor.l4u9reYd8LcmU5qw]{Nefarani}"], [43, "NEFARANI"],
        [44, "Raça"], [45, nefarani.race], [46, "Resistência"], [47, "Desafiadora"], [48, "Traços"], [49, "Ligação Sanguínea Nefarani, Vida Longa"],
        [50, "Preciso"], [52, "Astuto"], [54, "Discreto"], [56, "Persuasivo"], [58, "Rápido"], [60, "Resoluto"], [62, "Vigoroso"], [64, "Vigilante"],
        [66, "Habilidades"], [67, "Combatente de Escudo (mestre), Homem-de-Armas (mestre), Punho de Ferro (adepto)"],
        [68, "Armas"], [69, "Vigoroso"], [70, "Espada 7"], [71, "Armadura"], [72, "Armadura laminada 5 (reforçada)"],
        [73, "Defesa"], [74, "–5 (escudo)"], [75, "Vitalidade"], [77, "Limiar de Dor"], [79, "Sombra"], [80, nefarani.shadow], [81, "Táticas"], [82, nefarani.tactics],
        [83, "O Último dos Nefarani"],
        [84, "O que acontece quando restar apenas um único nefarani vivo ainda é desconhecido. Se tal situação ocorrer, cabe ao mestre de jogo decidir o que melhor se adequa ao seu grupo de jogo e campanha, mas sugerimos o seguinte:"],
        [85, "O último nefarani percebe que ninguém jamais poderia substituir o último imperador de Symbaroum e se retira para Symbar para garantir que o Trono de Espinhos permaneça vago."],
        [86, "O último tem uma visão sobre certa pessoa sendo escolhida para se sentar no Trono de Espinhos em Symbar, e se junta a ela para garantir que a profecia seja cumprida."],
        [87, "Uma variante do #2, onde o escolhido não deseja se sentar no trono de Symbar. O último nefarani não aceitará isso, e sequestra a referida pessoa e a leva para Symbar para completar a missão."],
        [88, "O último tem uma visão sobre um mundo sem humanos e sem corrupção, e inicia um expurgo abrangente."],
        [89, "Armas Variadas"],
        [90, "O mestre de jogo pode muito bem substituir Combatente de Escudo por Ataque Gêmeo ou Força da Empunhadura Dupla em alguns dos nefarani que os personagens encontram, para tornar o desafio mais variado."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "17 Nefarani");
    }],
    ["20 Ravenous Willow", (html) => {
      const young = entry.actors["Ravenous Willow, Young Strangler"];
      const old = entry.actors["Ravenous Willow, Old Crusher"];
      const replacements = new Map([
        [1, "Salgueiro Voraz"],
        [2, "Papai queria me mostrar Davokar. Ele disse que devemos compreender a floresta, agora que vivemos à sua sombra. Ele disse que devemos ver através das mentiras espalhadas por elfos e bruxas; sim, até mesmo pela nossa própria igreja do sol, para evitar que pessoas simples confundam a beleza selvagem da floresta com algo diferente das sedutoras ilusões da Noite Eterna."],
        [3, "Conseguimos um lugar num pequeno veleiro ao norte de Kastor e desembarcamos na margem norte logo após chegarmos ao rio Eanor. Deveríamos passar três dias no escuro, não mais. Mas seria apenas uma noite para mim e uma eternidade para o pai. Ele foi morto naquela primeira noite."],
        [4, "Os últimos raios de sol brilhavam através da folhagem, brilhando em algo ao pé de uma árvore alta e torta, com os galhos completamente nus. Meu pai riu, dizendo que a descoberta fortaleceu sua convicção — que Davokar está cheia de tesouros da outrora gloriosa Symbaroum; que os tesouros estão simplesmente espalhados, esperando para serem encontrados por andarilhos destemidos. Ele correu a última parte, e isso salvou minha vida, pois assim que ele os alcançou, os objetos tentadores desapareceram num piscar de olhos e a árvore ganhou vida. Meu pai mal havia desembainhado a espada e os galhos fortes o abraçaram, apertando-o com tanta força que sua armadura de aço cedeu. Eu corri. Corri. Corri..."],
        [5, "Neta do Barão Erlamei Elderras depois de voltar da Davokar"],
        [6, "O SALGUEIRO VORAZ"],
        [7, "é uma criatura sugadora de sangue semelhante a uma árvore que, por razões óbvias, é facilmente ignorada na floresta Davokar. Uma análise de relatos de testemunhas oculares indica que tanto o tamanho quanto a aparência podem variar consideravelmente. Isso pode estar ligado à idade e ao estado nutricional do indivíduo — que podem parecer velhos e doentes (ou até mortos) até se banquetearem com os sucos quentes de suas presas, quando folhas vermelhas de repente brotam de seus galhos e a casca ganha um aspecto brilhante saudável. Muitos também sugerem que eles podem desenvolver diferentes tipos de habilidades, talvez como resultado de onde brotaram pela primeira vez ou do que costumam comer."],
        [8, "OS MESMOS RELATOS"],
        [9, "afirmam que essas criaturas da floresta sempre vivem sozinhas, longe de outras de sua espécie, possivelmente porque a competição por comida seria muito grande. Parece que eles podem ficar parados por semanas, esperando que pássaros, esquilos e, às vezes, até animais maiores se aproximem. Em seguida, eles envolvem seus galhos semelhantes a tentáculos ao redor da vítima, estrangulando-a ou quebrando seus ossos, antes de se alimentar de seu sangue."],
        [10, "OS SALGUEIROS VORAZES SE MOVEM"],
        [11, "lentamente, mas, novamente, eles não precisam ser rápidos, pois eles (ou pelo menos alguns deles) podem capturar suas presas com Vinhas Emaranhadoras ou tentar bloquear sua fuga com suas raízes. Também é dito que o monstro tem a habilidade de atrair criaturas por meios místicos; para enfeitar seus galhos com a ilusão de frutas cobiçadas, ou polvilhar o solo com touceiras suculentas ou objetos reluzentes de ouro que, eles aprenderam, algumas presas acham totalmente irresistíveis."],
        [12, "Detectando Salgueiros Vorazes"],
        [13, "Os Patrulheiros da Rainha aprenderam, a um custo alto, como distinguir os salgueiros vorazes de outras vegetações: eles nunca estão completamente imóveis; mesmo no ar parado, seus galhos às vezes tremem e o tronco da árvore se contorce ou range ameaçadoramente. Uma pessoa com a habilidade Mestre do Saber ou a dádiva Mateiro reage a tais sinais se o jogador passar em um Teste de Vigilante. Outros também podem sentir que algo está errado com um [Vigilante –5] bem-sucedido."],
        [14, "Configuração de Aventura"], [15, "COMO OUTROS EXEMPLOS"],
        [16, "da flora predatória da Davokar, o salgueiro voraz pode muito bem ser encontrado nas viagens dos personagens jogadores, mas a tortuosa árvore assassina também pode servir como o principal oponente em cenários menores."],
        [17, "Uma opção é deixar o salgueiro voraz ser posicionado dentro de uma ruína que os personagens jogadores irão visitar em busca de um tesouro, conhecimento ou um determinado artefato. Com o traço Muralha de Raízes, tentará então isolar um ou dois deles do resto do grupo, num pátio ou espaço aberto semelhante."],
        [18, "Uma alternativa é deixar um salgueiro voraz ser adorado por algum culto, cujos membros estão sequestrando pessoas para serem oferecidas como sacrifícios. O culto pode ter como base uma cidade ou vila na fronteira da Davokar, ou habitar um posto avançado em algum lugar nas profundezas da floresta. De qualquer forma, a aventura pode culminar em uma batalha com a divindade vestida de casca de árvore."],
        [19, young.name], [20, "@UUID[Actor.oBAZYGHbOIpRUHDr]{Salgueiro Voraz, Estrangulador Jovem}"], [21, "SALGUEIRO VORAZ ESTRANGULADOR JOVEM"],
        [22, "Raça"], [23, young.race], [24, "Resistência"], [25, "Difícil"], [26, "Traços"],
        [27, "Abraço Esmagador (III), Arma Natural (III), Armadurado (III), Miragem, Muitas-cabeças (I), Muralha de Raízes (II), Robusto (III)"],
        [28, "Preciso"], [30, "Astuto"], [32, "Discreto"], [34, "Persuasivo"], [36, "Rápido"], [38, "Resoluto"], [40, "Vigoroso"], [42, "Vigilante"],
        [44, "Habilidades"], [45, "Nenhuma"], [46, "Armas"], [47, "Preciso"], [48, "Ramos nodosos 9 (longa)"],
        [49, "Armadura"], [50, "Casca grossa 8"], [51, "Defesa"], [53, "Vitalidade"], [55, "Limiar de Dor"], [57, "Sombra"], [58, young.shadow], [59, "Táticas"], [60, young.tactics],
        [61, old.name], [62, "@UUID[Actor.xLlcxkGfcsYVoqMF]{Salgueiro Voraz, Velho Esmagador}"],
        [63, "Miragem"], [64, "A criatura tem um dom místico e pode criar ilusões para atrair presas em potencial. A presa deve passar num Teste de [Vigilante←Persuasivo] para ver através da ilusão."],
        [65, "SALGUEIRO VORAZ VELHO ESMAGADOR"], [66, "Raça"], [67, old.race], [68, "Resistência"], [69, "Poderosa"], [70, "Traços"],
        [71, "Abraço Esmagador (III), Arma Natural (III), Armadurado (III), Colossal (I), Destruidor (III), Miragem, Muitas-cabeças (II), Muralha de Raízes (III), Robusto (III), Tenaz (II)"],
        [72, "Preciso"], [74, "Astuto"], [76, "Discreto"], [78, "Persuasivo"], [80, "Rápido"], [82, "Resoluto"], [84, "Vigoroso"], [86, "Vigilante"],
        [88, "Habilidades"], [89, "Amoque (mestre), Excepcionalmente Preciso (mestre)"], [90, "Armas"], [91, "Preciso"], [92, "Ramos nodosos 11 (destruidora, longa)"],
        [93, "Armadura"], [94, "Casca grossa 7"], [95, "Defesa"], [97, "Vitalidade"], [99, "Limiar de Dor"], [101, "Sombra"], [102, old.shadow], [103, "Táticas"], [104, old.tactics]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "20 Ravenous Willow");
    }],
    ["23 Sly River Hunter", (html) => {
      const hunter = entry.actors["Sly River Hunter"];
      const background = visibleNodesFromHtml(hunter.background);
      if (background.length !== 3) throw new Error("Unexpected translated Sly River Hunter actor text structure.");
      const replacements = new Map([
        [1, hunter.name],
        [2, "O pior que já vi no rio? Bem, foi há muito tempo, mas lembro-me como ontem — o barulho, os gritos, o sangue."],
        [3, "Acho que não tinha mais de oito ou nove anos. Mamãe me mandou para a beira do rio com a vara de pescar e um pedido de uma dúzia de trutas para o jantar. Foi um dia legal. O Rio Eanor corria caudaloso e forte, o sol brilhava em sua superfície; um dia que eu imediatamente soube que terminaria em uma surra, pois tanto o tempo quanto a água sugeriam que eu não pegaria muita coisa."],
        [4, "Pouco antes do sol estar no auge, um pequeno veleiro veio deslizando com o riacho. Jovem como eu era, eu ainda conhecia as correntes do rio tão bem quanto o interior das minhas pálpebras, então eu imediatamente vi que algo estava errado — como se a embarcação puxasse para bombordo. Além disso, raspou contra o Recife de Arfert, apesar do alto nível da água. A tripulação não estava inconsciente. Um menino, não mais velho que eu, correu para a amurada segurando um gancho; ele se inclinou para fora e cutucou o casco, com o gancho como uma lança. Isso foi apenas quando o barco flutuante passou por mim..."],
        [5, "Duas garras gigantescas surgiram da água, agarraram o pescoço do menino e apertaram de modo que o sangue espirrou em todas as direções antes de puxá-lo para baixo. O pânico explodiu. A tripulação fugiu para a outra amurada, mas então as garras apareceram lá para quase cortar uma mulher em duas. Com os olhos arregalados, observei os membros da tripulação sendo puxados para baixo da superfície, um por um, e um pouco mais abaixo no riacho, o barco virou."],
        [6, "Quantos estavam a bordo, não sei. Talvez dez. Talvez quinze. O que eu absolutamente sei, é que nenhum deles voltou a pôr os pés em terra..."],
        [7, "A memória de infância do pescador Svanne, contada na cozinha de sopa de Kastor"],
        [8, "MUITAS BESTAS CAÇAM"], [9, background[0].slice("Muitas bestas caçam ".length)],
        [10, "A ESTRATÉGIA USUAL"], [11, background[1].slice("A estratégia usual ".length)],
        [12, "APESAR DE SEU PERIGO"], [13, background[2].slice("Apesar de seu perigo ".length)],
        [14, "Conhecendo os Caçadores do Rio"],
        [15, "A enorme e vagamente transparente fera do rio é muito difícil de detectar através da ondulação da superfície; mesmo olhando diretamente para ela — é preciso um Teste contra [Vigilante –5] para notá-lo. O mesmo vale para observar os finos talos oculares que ele usa para espionar a superfície e selecionar suas vítimas. Em ambos os casos, uma busca ativa e verbalizada é necessária para que os jogadores sejam autorizados a rolar os Testes."],
        [16, hunter.name], [18, "Táticas."], [19, hunter.tactics],
        [20, "@UUID[Actor.TLaoXWRKNJn4Q7f6]{Caçador Astuto do Rio}"], [21, "CAÇADOR ASTUTO DO RIO"],
        [22, "Raça"], [23, hunter.race], [24, "Resistência"], [25, "Desafiadora"], [26, "Traços"],
        [27, "Anfíbio, Arma Natural (III), Armadurado (III), Garras Preênseis (III)"],
        [28, "Preciso"], [30, "Astuto"], [32, "Discreto"], [34, "Persuasivo"], [36, "Rápido"], [38, "Resoluto"], [40, "Vigoroso"], [42, "Vigilante"],
        [44, "Habilidades"], [45, "Nenhuma"], [46, "Armas"], [47, "Preciso"],
        [48, "Garras 5 (longa), Mandíbulas roedoras 2, requer que a vítima seja mantida pelas garras e puxada pelo caçador."],
        [49, "Armadura"], [50, "Escudos de quitina 4"], [51, "Defesa"], [53, "Vitalidade"], [55, "Limiar de Dor"], [57, "Sombra"], [58, hunter.shadow], [59, "Táticas"], [60, hunter.tactics],
        [61, "Configuração de Aventura"], [62, "O CAÇADOR DO RIO"],
        [63, "é perfeito para apimentar viagens aquáticas em Ambria e Davokar, mas também é possível transformar a criatura no ato principal em uma ou duas aventuras menores."],
        [64, "Uma possibilidade é que os personagens sejam contatados (direta ou indiretamente) pelo pai de um jovem nobre que foi morto por um caçador do rio muito grande. Esse fornecedor de missões teme que algum grupo de caça capture a fera e que sua carne seja servida em uma das recepções sociais para as quais ele ou ela é frequentemente convidado. O fornecedor da missão está preparado para pagar um alto salário (em táleres, itens ou serviços) para que os personagens cheguem primeiro ao assassino, matem-no e queimem a carcaça."],
        [65, "Desta forma, os personagens são atraídos para a caça intensa de um caçador do rio cuja fama atraiu até um punhado de outros grupos de caça. Os personagens podem tentar manter-se isolados, mas arriscarão que outros grupos unam forças com o objetivo de afugentar ou derrotar qualquer rival. No entanto, se escolherem prosseguir, eles precisam pensar sobre as coisas, porque pelo menos alguns dos concorrentes trabalha em nome de empregadores bem-nascidos!"],
        [66, "Patê de Caçador"], [67, "Um quilo de carne de rabo de caçador do rio"], [68, "Carne de 10 a 12 pernas de âncora"],
        [69, "Um punhado de endro"], [70, "Uma xícara de creme"], [71, "Tempero a gosto"], [72, "Molho"], [73, "Meia cebola"],
        [74, "Dois copos de água"], [75, "Três xícaras de caldo de peixe"], [76, "Uma pitada de suco cítrico"], [77, "Especiarias picantes"],
        [78, "Guarnição"], [79, "Um orbe de ovas de caçador do rio"], [80, "Um talo de endro"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "23 Sly River Hunter");
    }],
    ["24 Spite", (html) => {
      const spite = entry.actors.Spite;
      const appearance = visibleNodesFromHtml(spite.appearance);
      const background = visibleNodesFromHtml(spite.background);
      if (appearance.length !== 1 || background.length !== 2) throw new Error("Unexpected translated Spite actor text structure.");
      const replacements = new Map([
        [1, spite.name], [2, "O GRANDE INSETO"], [3, appearance[0].slice("O grande inseto ".length)],
        [4, "GADLAG, ADEPTO DA"], [5, background[0].slice("Gadlag, Adepto da ".length)],
        [6, "O FATO DE"], [7, background[1].slice("O fato de ".length)],
        [8, "Rancores crescidos têm a tendência de buscar membros hibernantes ou encasulados do povo ancião, afundando seus ferrões farpados na parte de trás do pescoço da vítima. O inseto então abandona a parte traseira de seu próprio corpo, deixando assim sua prole para trás para prosperar e evoluir."],
        [9, "A infestação se manifesta em um saco amniótico vermelho, inchado e purulento bem no pescoço do hospedeiro, com uma protuberância bifurcada ao longo de sua garganta, projetando-se da pele em ambos os lados da laringe. As larvas então crescem dentro desse saco preso, enquanto o corpo do hospedeiro é envenenado e sua mente e sentidos nublados — estes últimos a tal ponto que a criatura não tem mais o autocontrole e a consciência necessários para perceber a infestação do rancor."],
        [10, "O veneno no sangue do hospedeiro proporciona condições perfeitas para a maturação das larvas, mas também parece ser a maior fragilidade do inseto. Testes mostraram que um antídoto forte pode neutralizar a toxina, eliminando assim, de forma eficaz e imediata, o parasita. A picada, o saco amniótico e as larvas podem então ser removidos por um Médico treinado, embora isso geralmente resulte em muita dor e ferimentos graves."],
        [11, "Trecho do ensaio do Adepto Galdag “A natureza e o perigo do rancor”"],
        [12, "Configuração de Aventura"], [13, "HÁ RUMORES DE QUE"],
        [14, "um bando de assassinos cruéis está invadindo as fazendas de algum baronato na fronteira com Davokar. Os personagens jogadores recebem, ou assumem, a tarefa de caçar este grupo. A primeira parada pode ser uma estalagem solitária que foi atacada algumas noites atrás. Acontece que os assassinos estavam calmos ao chegar, mas ficaram com raiva quando alguns dos clientes os encararam e uma garçonete perguntou se havia algo em que ela poderia ajudá-los — eles mataram ou feriram o máximo que puderam antes de desaparecerem na noite, dirigindo-se para “leste”."],
        [15, "A próxima parada pode ser uma propriedade rural. A família que vivia lá foi assassinada, assim como todos os empregados e os trabalhadores rurais a seu serviço, e os cadáveres atraíram predadores ou alguma outra ameaça. Depois de uma busca minuciosa na propriedade, os personagens encontram um dos assassinos com o parasita ainda em seu pescoço (pode ser identificado com Mestre do Saber ou Saber de Bestas e um Teste de Astuto bem-sucedido). Um rastro de sangue leva a uma direção correta e pode ser rastreado com Mateiro ou talentos semelhantes."],
        [16, "Finalmente, os personagens alcançam os assassinos infestados. Talvez eles tenham se enclausurado dentro de um forte menor na fronteira, junto com um ou mais reféns? Os personagens devem entrar sem desencadear a agressão dos loucos paranoicos, de preferência de uma forma que lhes permita neutralizar os assassinos sem usar força letal. A questão é até que ponto o grupo pode ser considerado responsável por ações realizadas sob a influência do rancor..."],
        [17, "Doença de Rancor"],
        [18, "O veneno que o rancor libera na corrente sanguínea de seu hospedeiro entra em vigor no turno após o início do processo. A primeira coisa que acontece é que o hospedeiro fica paranoico, confuso e agressivo; ele vê todos ao seu redor como uma ameaça potencial, ignora completamente a infestação e ganha a habilidade Amoque no nível adepto. Se a pessoa em questão já tiver essa habilidade, o nível é aumentado ou diminuído para adepto."],
        [19, "Além disso, o veneno pode infectar a vítima com uma doença que destrói lentamente sua capacidade mental. A doença do rancor conta como uma doença moderada (consulte a página 169), mas afeta o Astuto do hospedeiro em vez de Vigoroso. Enquanto o efeito permanecer ativo, a vítima corre o risco de se tornar cada vez menos inteligente, antes que finalmente — quando o Astuto chegar a 0 — morre de alguma forma espetacular (por exemplo, pulando de um penhasco, batendo de cabeça em uma parede de pedra, esfaqueando o próprio olho)."],
        [20, "A infestação dura 10+1D6 dias. Se o hospedeiro sobreviver por tanto tempo, ele ainda pode ser morto quando as larvas irromperem pelo saco amniótico e partirem, o que causaria tanto dano quanto possível se um Médico conseguisse abortar a infestação prematuramente"],
        [21, "(consulte"], [22, "Infestação"],
        [24, spite.name], [25, "@UUID[Actor.7bFPMzVmyT9JN1bE]{Rancor}"], [26, "Relatório de incidente"],
        [27, "Testemunhas afirmam que a mulher estava pálida, suja, babando e emitindo sons guturais que às vezes lembravam um porco fuçando, às vezes um ganso zangado ou um touro no cio. Ela estava pulando para cima e para baixo, agitando os punhos e atacando qualquer um que se aproximasse. Eventualmente, o Guarda Lerk viu além da sujeira e a reconheceu como Lea, uma das assistentes de Aperto Dourado. Ele se aproximou da mulher desarmado, tentando acalmá-la, o que explica como ela conseguiu pular para frente e morder sua garganta. Não vi outra opção a não ser ordenar que meus homens atirassem. Ela morreu gargarejando com cinco setas de besta atravessadas em seu corpo."],
        [28, "Líder de Esquadrão Pellio"], [29, "Guarda da Cidade, Forte do Cardo"], [30, "RANCOR"],
        [31, "Raça"], [32, spite.race], [33, "Resistência"], [34, "Desafiadora"], [35, "Traços"],
        [36, "Arma Natural (III), Asas (II), Infeccioso (II), Infestação (I)"],
        [37, "Preciso"], [39, "Astuto"], [41, "Discreto"], [43, "Persuasivo"], [45, "Rápido"], [47, "Resoluto"], [49, "Vigoroso"], [51, "Vigilante"],
        [53, "Habilidades"], [54, "Ataque Furtivo (novato)"], [55, "Armas"], [56, "Preciso"], [57, "Ferrão 5 (+4 quando em Vantagem)"],
        [58, "Armadura"], [59, "Nenhuma"], [60, "Defesa"], [62, "Vitalidade"], [64, "Limiar de Dor"], [66, "Sombra"], [67, spite.shadow], [68, "Táticas"], [69, spite.tactics]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "24 Spite");
    }],
    ["27 World Serpent", (html) => {
      const tunneler = entry.actors["World Serpent, Tunneler"];
      const wallower = entry.actors["World Serpent, Wallower"];
      const replacements = new Map([
        [1, "Serpente do Mundo"],
        [2, "Posso informar que a colônia Terras Livres não existe mais. O que lá encontramos não é fácil de descrever, mas agora que tive tempo de organizar os meus pensamentos, tentarei explicar o que deve ter acontecido à colônia. Chacina. Massacre. Aniquilação total."],
        [3, "Como posso saber com certeza o que aconteceu? Bem, porque vi com meus próprios olhos a serpente daemoníaca rastejante que devorava os habitantes, seu gado e a maior parte de suas casas. Se você não acredita em mim, posso lhe mostrar minha perna direita, que traz a marca de suas três fileiras de dentes. Ela atravessou minha armadura e me jogou de lado, aparentemente desinteressada por um pedaço de carne revestida de aço."],
        [4, "Meus companheiros não tiveram tanta sorte. Consegui resgatar Hagha da barriga da criatura com um golpe certeiro, mas ela não está em condições de testemunhar, pois o ácido gástrico da serpente queimou seus olhos e a experiência de ser engolida inteira destruiu sua mente — ainda não se sabe se sua loucura é temporária ou permanente."],
        [5, "Telema Iesel, cavaleira e líder da expedição de resgate às Terras Livres"],
        [6, "ASSIM FALOU AROALETA"],
        [7, "“... e o príncipe do oeste marchou bravamente, cantando horror, cantando medo, para enfrentar o poderoso Uron em batalha; a serpente, a maior, consumida pelo pavor, atingiu o mundo em medo trêmulo. Por nove dias inteiros, o terror foi total, até que Uron recuou envergonhado.”"],
        [8, "AS CRIATURAS COMUMENTE"],
        [9, "conhecidas como serpentes do mundo obviamente não são a verdadeira Serpente do Mundo, mas podem muito bem ser sua enorme descendência. Essas monstruosidades escavadoras de túneis devoram indiscriminadamente todas as formas de vida que ficam em seu caminho, sejam patrulheiros explorando o Submundo ou os habitantes dos reinos dos trolls que existem lá embaixo. Elas raramente aparecem na superfície, mas quando o fazem, costumam exterminar colônias inteiras ou postos avançados, tanto de pessoas quanto de animais. Tudo o que resta em seu rastro é um assentamento desolado e uma rede de túneis que levam ao Submundo."],
        [10, "O ESPECIALISTA NÃO OFICIAL"],
        [11, "da Ordo Magica no Submundo, Mestre Argoi, talvez esteja certo ao supor que as serpentes do mundo podem sentir vibrações acima do solo, pelo menos aquelas que são fortes e sincronizadas o suficiente. Isso explicaria por que dois batalhões ambrianos em marcha foram atacados por serpentes do mundo durante a guerra contra Haloban e seus Jezitas, e também porque duas grandes expedições para ruínas foram visitadas por convidados indesejados enquanto tentavam abrir caminho para os níveis ocultos do porão. Mas, mesmo que isso seja verdade, ainda seria preciso muito azar para encontrar uma serpente do mundo na superfície."],
        [12, "A MAIORIA DOS ATAQUES"],
        [13, "relatados desde o êxodo ambriano através dos Titãs, direcionados a bárbaros ou ao próprio povo da Rainha, ocorreram abaixo do solo, ou pelo menos em minas e cavernas conectadas ao Submundo. As declarações das testemunhas são muitas e consistentes, detalhando como as serpentes engolem humanos, ogros e trolls inteiros, com equipamento e tudo. Esses encontros também deram origem a heróis inesperados, como o escudeiro ambriano Begomo Fatiador de Cobras e o guerreiro bárbaro Vaivana, que libertaram seus comandantes da barriga de uma serpente depois de desferir um golpe mortal."],
        [14, "O que aconteceria se a própria Serpente do Mundo realmente existisse e voltasse à vida é horrível demais para imaginar..."],
        [15, "Novo ritual:"], [16, "Canto da Serpente do Mundo (Canto de Troll)"],
        [17, "O cantor troll usa seu registro mais profundo e canta uma canção que pode invocar uma Serpente do Mundo ou mandá-la embora. A primeira é praticamente suicídio, e só é usada quando a morte já está garantida e o cantor troll deseja cumprir sua condenação levando consigo o máximo de inimigos possível. A última é frequentemente usada pelos cantores da corte dos trolls, para deter o avanço de uma Serpente do Mundo através de seu reino."],
        [18, tunneler.name], [19, "@UUID[Actor.kZIV5h6dODMRwEsg]{Serpente do Mundo, Tuneladora}"],
        [20, "Mapa de tecido encontrado nas águas primaveris do Rio Eanor perto da Estalagem Vau Cinza. Várias expedições partiram na esperança de encontrar o sistema de túneis e sua ruína submersa."],
        [21, "SERPENTE DO MUNDO TUNELADORA"], [22, "Raça"], [23, tunneler.race], [24, "Resistência"], [25, "Difícil"], [26, "Traços"],
        [27, "Arma Natural (II), Colossal (II), Destruidor (III), Devorador (III), Escavador (I), Robusto (III), Senso de Vida (II), Tenaz (II)"],
        [28, "Preciso"], [30, "Astuto"], [32, "Discreto"], [34, "Persuasivo"], [36, "Rápido"], [38, "Resoluto"], [40, "Vigoroso"], [42, "Vigilante"],
        [44, "Habilidades"], [45, "Excepcionalmente Vigoroso (novato), Punho de Ferro (adepto)"], [46, "Armas"], [47, "Vigoroso"], [48, "Mordida 10 (destruidora)"],
        [49, "Armadura"], [50, "Pele espessa 4"], [51, "Defesa"], [53, "Vitalidade"], [55, "Limiar de Dor"], [57, "Sombra"], [58, tunneler.shadow], [59, "Táticas"], [60, tunneler.tactics],
        [61, wallower.name], [62, "@UUID[Actor.oQaDQ7zbohbz3Zpw]{Serpente do Mundo, Chafurdante}"], [63, "SERPENTE DO MUNDO CHAFURDANTE"],
        [64, "Raça"], [65, wallower.race], [66, "Resistência"], [67, "Poderosa"], [68, "Traços"],
        [69, "Arma Natural (III), Armadurado (III), Colossal (III), Destruidor (III), Devorador (III), Escavador (II), Robusto (III), Senso de Vida (II), Tenaz (III)"],
        [70, "Preciso"], [72, "Astuto"], [74, "Discreto"], [76, "Persuasivo"], [78, "Rápido"], [80, "Resoluto"], [82, "Vigoroso"], [84, "Vigilante"],
        [86, "Habilidades"], [87, "Excepcionalmente Vigoroso (mestre), Punho de Ferro (mestre)"], [88, "Armas"], [89, "Vigoroso"], [90, "Mordida 13 (longa, destruidora)"],
        [91, "Armadura"], [92, "Pele semelhante a uma armadura 8"], [93, "Defesa"], [95, "Vitalidade"], [97, "Limiar de Dor"], [99, "Sombra"], [100, wallower.shadow], [101, "Táticas"], [102, wallower.tactics],
        [103, "Configuração de Aventura"], [104, "A CANTORA TROLL E"],
        [105, "artífice Axalgha foi capturada por um grupo de cultistas e levada para seu esconderijo, talvez em algum lugar no interior ambriano ou perto de algum posto avançado na floresta. Lá ela é forçada a criar todos os tipos de objetos para o culto — máscaras mortuárias, focos místicos, pedras da alma, adagas rituais e assim por diante. Percebendo que não sobreviverá ao cativeiro, Axalgha finalmente reúne coragem para realizar um último e desesperado ato: ela “canta a serpente do mundo”. Os cultistas não suspeitam que algo esteja errado, já que a troll sempre canta enquanto cria seus artefatos."],
        [106, "Os personagens jogadores estão perto do local onde a cantora troll é mantida em cativeiro, quando de repente a serpente do mundo irrompe no solo com força devastadora; ela devora um punhado de pessoas e gado em vários lugares perto da ruína supostamente assombrada onde o culto tem seu esconderijo, bem como dois cultistas no nível mais baixo da ruína. Ela então se retira para digerir sua refeição, mas um Teste de Astuto bem-sucedido com Saber de Bestas revela que certamente voltará."],
        [107, "Desde que não fujam imediatamente da cena, os personagens podem descobrir o que fez a serpente surgir. Ao identificar onde ocorreram os ataques, a ruína pode ser apontada como particularmente suspeita. Eles também podem capturar o cultista apavorado que deixa o esconderijo vestindo seu manto cerimonial e máscara mortuária, na esperança de escapar do perigo. Quando eles entendem o que aconteceu, é possível para eles enfrentarem a serpente em combate aberto, ou lutar/esgueirar-se até Axalgha. Se eles puderem garantir a segurança da cantora troll, ela pode cantar para a serpente partir. Mas, nesse caso, os personagens devem distraí-la por tempo suficiente para que a música seja executada sem interrupção!"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "27 World Serpent");
    }],
    ["26 Vengeful Terrain", (html) => {
      const undine = entry.actors["Choking Undine"];
      const fury = entry.actors["Hunger Fury"];
      const sylph = entry.actors["Ire Sylph"];
      const gnome = entry.actors["Gobbling Gnome"];
      const replacements = new Map([
        [1, "Terreno Vingativo"], [2, "TERRENO VINGATIVO É"],
        [3, "o nome coletivo de vários fenômenos diferentes com uma origem comum: quando a corrupção toma conta do mundo físico, às vezes gera elementais odiosos e atingidos pela mácula. Alguns estudiosos apresentaram a teoria de que cada pedaço de terreno vingativo é na verdade um encantamento vivo, consistindo em um poder místico que ganhou vida e vontade própria, e que permanece vivo graças à força vital ou à corrupção reivindicada das vítimas."],
        [4, "PELO QUE SE SABE,"],
        [5, "o terreno vingativo só aparece perto da natureza corrompida (veja a página 22) ou em lugares onde grandes cerimônias místicas foram realizadas, deixando um legado odioso. Além disso, há caçadores de bruxas que afirmam ter encontrado escrituras redigidas por feiticeiros, indicando que elementais negros podem ser conjurados através da prática de rituais horríveis, envolvendo assassinatos sacrificiais. Isso também é evidenciado por certos mosaicos e murais encontrados nas ruínas da Davokar, retratando místicos que parecem invocar elementais vingativos em combate. Tais poderes seriam de fato ferramentas poderosas nas mãos erradas, deixando todos os caçadores de bruxas ansiosos para encontrá-los e destruí-los."],
        [6, "Dorme meu pequeno biscoito de amêndoa"], [7, "Fogo te persegue, para a morte"], [8, "Água te banha, para a morte"],
        [9, "Vento te empurra, para a morte"], [10, "Terra te devora, para a morte"], [11, "Os sonhos te manterão protegido"],
        [12, "Cantiga infantil gravada em uma boneca de bronze encontrada no túmulo de um príncipe"],
        [13, "ENTRE OS RELATOS"],
        [14, "mais ou menos críveis que supostamente falam de encontros com terrenos vingativos, os estudiosos da Ordo Magica conseguiram separar quatro tipos especiais, chamados Asfixia Ondulante, Fúria Faminta, Gnomo Devorador e Ira da Sílfide. A fúria é descrita como fogo vivo, brilhando no chão ou movendo-se entre materiais inflamáveis, esperando que as criaturas vivas sejam incineradas; a ondulante aparece na forma de água que borbulha e gira quando deveria estar parada, e que ataca todos os que se aproximam na tentativa de forçar seu caminho para dentro de seus pulmões para afogá-los."],
        [15, "O GNOMO DEVORADOR"],
        [16, "é descrito como “solo ciumento e assassino que lentamente sobe e desce”, e diz-se que se abre sob os pés de suas vítimas e depois se fecha em um abraço esmagador. Finalmente, a Ira da Sílfide, que parece ser capaz de se esconder em qualquer lugar, esperando para levantar criaturas que passam no ar e jogá-las contra superfícies duras com a intenção de matar, ou pelo menos machucá-las severamente."],
        [17, "Conjurar Terreno Vingativo, ritual"],
        [18, "É verdade que os clérigos de Symbar podiam conjurar terrenos vingativos, mesmo que chamassem o fenômeno de Elementais Negros. Desde então, as formas do ritual caíram no esquecimento, pelo menos de acordo com as descobertas da Ordo Magica. Mas talvez ainda haja alguns que mantêm vivo esse conhecimento, ou que o encontraram descrito em um códice ritual ou coleção de fórmulas?"],
        [19, "O procedimento requer que o místico realize um sacrifício mortal, direcionando a corrupção resultante para o local do sacrifício e, assim, despertando-o para uma desmorte cheia de ódio. O terreno vingativo é então vinculado a este local e, portanto, funcionará principalmente como um guardião ou armadilha mística. O criador do fenômeno não corre o risco de ser vitimado por sua ira, e o mesmo vale para todos que estiveram presentes no momento do ritual ou que se encontram ao lado do ritualista — se ele ou ela assim o desejar."],
        [20, "Como mencionado anteriormente, para o terreno ganhar vida, é necessário o sacrifício de sangue de um ser cultural e também um Teste de"], [21, "Resoluto"],
        [22, "bem-sucedido. O místico decide que tipo de terreno é criado, desde que o elemento possa ser encontrado no local. Para uma asfixia, é necessário um corpo permanente de água ou lama, enquanto a fúria exige lava (alternativamente, uma fogueira continuamente abastecida com combustível); o Gnomo Devorador requer terreno sólido e a Ira da Sílfide um local ou passagem acessível pelos ventos."],
        [23, "Configuração de Aventura"], [24, "OS PERSONAGENS JOGADORES QUE"],
        [25, "se movem em ambientes corrompidos podem se deparar com um terreno vingativo de várias maneiras e com bastante frequência. No entanto, pode haver outras configurações mais interessantes para o mestre de jogo desenvolver..."],
        [26, "Um exemplo pode ser que os personagens estejam caçando o líder de um culto sombrio, na Davokar ou possivelmente em uma das cidades de Ambria. Quando eles se aproximam do esconderijo dos cultistas, torna-se evidente que eles realizaram o ritual Conjurar Terreno Vingativo em lugares estratégicos. E não só isso: os próprios cultistas são imunes à ira dos elementais, e usam isso o máximo possível ao lutar contra os intrusos."],
        [27, "Como sugestão, os membros do culto podem ser um grupo heterogêneo devotado à Noite Eterna, esperando ser recompensado quando a escuridão finalmente cair. Ou pode ser um grupo excepcionalmente corrupto dentro da Ordo Magica, cujos membros estão realizando experiências com elementais negros, e que estão tolamente afirmando estarem trabalhando em um ramo místico pouco compreendido que eles sozinhos são corajosos e inteligentes o suficiente para explorar."],
        [28, undine.name], [29, "@UUID[Actor.zKXmFyRQRMPSwqAF]{Asfixia Ondulante}"], [30, "ASFIXIA ONDULANTE"],
        [31, "Raça"], [32, undine.race], [33, "Resistência"], [34, "Desafiadora"], [35, "Traços"], [36, "Regeneração (III), Tenaz (III)"],
        [37, "Preciso"], [39, "Astuto"], [41, "Discreto"], [43, "Persuasivo"], [45, "Rápido"], [47, "Resoluto"], [49, "Vigoroso"], [51, "Vigilante"],
        [53, "Habilidades"], [54, "Excepcionalmente Astuto (novato), Excepcionalmente Preciso (novato), Onda de Afogamento*"], [55, "Armas"], [56, "Preciso"], [57, "Afogamento 3"],
        [58, "Armadura"], [59, "Nenhuma, regenera 4 de Vitalidade por turno, exceto dano de fogo"], [60, "Defesa"], [62, "Vitalidade"], [64, "Limiar de Dor"], [66, "Sombra"], [67, undine.shadow],
        [68, "Táticas"], [69, `${undine.tactics} * Funciona como Estrangulador (novato), mas não requer uma Vantagem`],
        [70, fury.name], [71, "@UUID[Actor.nsYAlXnNb4qvrpr2]{Fúria Faminta}"], [72, "FÚRIA FAMINTA"],
        [73, "Raça"], [74, fury.race], [75, "Resistência"], [76, "Desafiadora"], [77, "Traços"], [78, "Aura Nociva (II), Forma de Espírito (II)"],
        [79, "Preciso"], [81, "Astuto"], [83, "Discreto"], [85, "Persuasivo"], [87, "Rápido"], [89, "Resoluto"], [91, "Vigoroso"], [93, "Vigilante"],
        [95, "Habilidades"], [96, "Alma de Fogo (mestre), Cascata de Enxofre (mestre)"], [97, "Armas"], [99, "Nenhuma"],
        [100, "Armadura"], [101, "Metade do dano de acordo com Forma de Espírito II"], [102, "Defesa"], [104, "Vitalidade"], [106, "Limiar de Dor"], [108, "Sombra"], [109, fury.shadow], [110, "Táticas"], [111, fury.tactics],
        [112, sylph.name], [113, "@UUID[Actor.9aYQtR2W196xIn7t]{Ira da Sílfide}"], [114, "IRA DA SÍLFIDE"],
        [115, "Raça"], [116, sylph.race], [117, "Resistência"], [118, "Desafiadora"], [119, "Traços"], [120, "Forma de Espírito (III)"],
        [121, "Preciso"], [123, "Astuto"], [125, "Discreto"], [127, "Persuasivo"], [129, "Rápido"], [131, "Resoluto"], [133, "Vigoroso"], [135, "Vigilante"],
        [137, "Habilidades"], [138, "Arremesso Mental (mestre), Excepcionalmente Resoluto (adepto)"], [139, "Armas"], [141, "Nenhuma"],
        [142, "Armadura"], [143, "Metade do dano de acordo com Forma de Espírito III"], [144, "Defesa"], [146, "Vitalidade"], [148, "Limiar de Dor"], [150, "Sombra"], [151, sylph.shadow], [152, "Táticas"], [153, sylph.tactics],
        [154, gnome.name], [155, "@UUID[Actor.YOm2V9pG15Hd5T6t]{Gnomo Devorador}"], [156, "GNOMO DEVORADOR"],
        [157, "Raça"], [158, gnome.race], [159, "Resistência"], [160, "Desafiadora"], [161, "Traços"], [162, "Arma Natural (II), Armadurado (I), Escavador (III), Robusto (II)"],
        [163, "Preciso"], [165, "Astuto"], [167, "Discreto"], [169, "Persuasivo"], [171, "Rápido"], [173, "Resoluto"], [175, "Vigoroso"], [177, "Vigilante"],
        [179, "Habilidades"], [180, "Guerreiro Natural (adepto), Punho de Ferro (novato)"], [181, "Armas"], [182, "Vigoroso"], [183, "Punhos 8/5, dois ataques no mesmo alvo"],
        [184, "Armadura"], [185, "Corpo rochoso resistente 5"], [186, "Defesa"], [188, "Vitalidade"], [190, "Limiar de Dor"], [192, "Sombra"], [193, gnome.shadow], [194, "Táticas"], [195, gnome.tactics]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "26 Vengeful Terrain");
    }],
    ["25 Troll Shadow", (html) => {
      const troll = entry.actors["Troll Shadow"];
      const appearance = visibleNodesFromHtml(troll.appearance);
      const background = visibleNodesFromHtml(troll.background);
      if (appearance.length !== 1 || background.length !== 3) throw new Error("Unexpected translated Troll Shadow actor text structure.");
      const replacements = new Map([
        [1, troll.name], [2, troll.name],
        [3, "Essas criaturas, reconhecidas por seu físico esquelético e aparência doentia, devem ser evitadas sempre que possível. Sozinhos, eles são apenas uma distração, mas em grupos eles se tornam uma ameaça crescente; eles roubam tudo o que podem encontrar, muitas vezes destruindo o que não entendem. Em grupos maiores eles geram algum tipo de poder místico que é uma séria ameaça à integridade de um esquadrão de patrulheiro."],
        [4, "Também deve ser dito que trolls sombrios raramente têm qualquer conhecimento que valha a pena coletar ou usar, a menos que alguém esteja em busca de um artefato, pois essas formas de vida lamentáveis parecem capazes de detectar o cheiro de tais itens. A desvantagem é que a pouca ajuda que se recebe tem um custo maior do que a missão pode pagar."],
        [5, "A regra básica é simples: mantenha uma distância segura, ou aumente a distância deixando algo pequeno para eles comerem ou se ocuparem."],
        [6, "Melhor matá-los à primeira vista,"], [7, "ou você vai se arrepender!"],
        [8, "DA PUPA"], [9, appearance[0].slice("Da pupa ".length)],
        [10, "MESMO QUE OS TROLLS SOMBRIOS"], [11, background[0].slice("Mesmo que os trolls sombrios ".length)],
        [12, "O Fascínio dos Cambiantes"],
        [13, "Uma das coisas mais estranhas sobre os trolls sombrios é que eles, por qualquer motivo, não podem deixar de se apaixonar por cada cambiante que cruza seu caminho. Se o cambiante for indiferente ou desdenhoso, os admiradores perdem o interesse após 1D4 meses — a única maneira de se livrar deles antes disso é matá-los, a menos que eles sintam o cheiro de um artefato livre (veja a caixa de texto Sentindo artefatos)."],
        [14, "Por outro lado, se o cambiante receber os admiradores, ele (ou ela) pode usá-los como se fosse Privilegiado em relação aos trolls sombrios — o cambiante tem uma segunda chance de vencer em todos os desafios sociais e só precisa passar por um Teste ao pedir algo difícil ou perigoso."],
        [15, "POR MAIS INCÔMODOS"], [16, background[1].slice("Por mais incômodos ".length)],
        [17, "QUALQUER QUE SEJA A VERDADE,"], [18, background[2].slice("Qualquer que seja a verdade, ".length)],
        [19, "Sentindo Artefatos"],
        [20, "A única coisa que os trolls sombrios amam mais do que os cambiantes são os artefatos místicos, o que leva alguns estudiosos a concluir que eles foram na verdade criados com o propósito de farejar itens místicos perdidos ou criados secretamente."],
        [21, "Exatamente como isso é feito não está claro, mas coletivos de trolls sombrios são indubitavelmente atraídos aos chamados “artefatos livres” — isto é, artefatos que nunca tiveram um mestre, ou cujos mestres morreram ou quebraram seu vínculo com tais objetos. A distância até o artefato parece ser significativa, pois quanto maior o coletivo, mais longe o item pode estar — o alcance da habilidade do coletivo é de um quilômetro para cada membro individual."],
        [22, "Caçadores de tesouros sem escrúpulos (particularmente cambiantes) podem usar este dom, desde que eles consigam atrair ou capturar pelo menos quatro indivíduos. Quando esses trolls sombrios se reúnem em um coletivo, eles serão instintivamente atraídos para o artefato livre mais próximo, sem saber exatamente o que ou onde ele está. Se o artefato for encontrado e vinculado a um mestre, eles imediatamente começarão a procurar por outro."],
        [23, troll.name], [24, "@UUID[Actor.pjhzNf6MRFXdXJXd]{Troll Sombrio}"], [25, "TROLL SOMBRIO"],
        [26, "Raça"], [27, troll.race], [28, "Resistência"], [29, "Fraca"], [30, "Traços"], [31, "Poder Coletivo"],
        [32, "Preciso"], [34, "Astuto"], [36, "Discreto"], [38, "Persuasivo"], [40, "Rápido"], [42, "Resoluto"], [44, "Vigoroso"], [46, "Vigilante"],
        [48, "Habilidades"], [49, "Nenhuma"], [50, "Armas"], [51, "Preciso"], [52, "Faca 3 (curta)"], [53, "Armadura"], [54, "Nenhuma"],
        [55, "Defesa"], [57, "Vitalidade"], [59, "Limiar de Dor"], [61, "Sombra"], [62, troll.shadow], [63, "Táticas"], [64, troll.tactics],
        [65, "Configuração de Aventura"], [66, "Alahara Caminha de Novo"],
        [67, "Se o grupo de jogadores jogou a aventura A Marca da Besta, e a cambiante Alahara permaneceu viva, ela pode muito bem ser aquela que orquestra a busca dos trolls sombrios pelo artefato oculto na Bruxa & Familiar. Outros candidatos adequados são Klagander e/ou Sibela de Ira do Guardião. Afinal, reuniões com antagonistas familiares costumam ser apreciadas na mesa de jogo!"],
        [68, "OS PERSONAGENS SE"],
        [69, "envolvem em uma situação em que um proprietário está tendo problemas com “pragas” em sua propriedade; pode ser um lugar na Davokar ou em uma cidade onde os esgotos permitem que os trolls sombrios se movam livremente pela área. Os trolls sombrios se interessaram pelo local porque podem sentir a presença de um artefato dentro ou embaixo de uma construção."],
        [70, "Uma opção é fazer com que o cenário ocorra na estalagem da Bruxa & Familiar em Forte do Cardo. Nesse caso, tudo começou com alguns trolls sombrios incomodando os hóspedes à noite, batendo na fundação, no telhado e nas paredes do porão da casa. Mas com o tempo, seus números cresceram e agora há o suficiente deles para se tornar um problema real; usando seus poderes, eles estão levando tanto o grupo quanto os hóspedes a vasculhar os níveis mais baixos do prédio ou derrubar paredes em busca de compartimentos ocultos. Por fim, a situação chega a tal ponto que um hóspede é morto depois de rastejar pela entrada no porão e, conforme a passagem se alargava, caiu para sua morte."],
        [71, "Uma maneira de resolver o problema é localizar o esconderijo dos trolls sombrios nos esgotos; outra é usar seu amor pelos cambiantes para conduzi-los para longe da cidade. Talvez seja possível negociar com eles ou dar-lhes um artefato? Ou eles estão de fato sendo comandados por um cambiante que os levou para a estalagem ou os encontrou lá, e agora usa seu fascínio para conduzi-los na caça ao artefato?"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "25 Troll Shadow");
    }],
    ["14 Living Thorns", (html) => {
      const familiar = entry.actors["Living Thorns, Familiar"];
      const wild = entry.actors["Living Thorns, Wild"];
      const background = visibleNodesFromHtml(wild.background);
      const appearance = visibleNodesFromHtml(wild.appearance);
      if (background.length !== 2 || appearance.length !== 1) throw new Error("Unexpected translated Living Thorns actor text structure.");
      const replacements = new Map([
        [1, "Espinhos Vivos"], [2, "EXISTEM MUITOS TIPOS"], [3, background[0].slice("Existem muitos tipos ".length)],
        [4, "ESPINHOS VIVOS SÓ"], [5, appearance[0].slice("Espinhos vivos só ".length)],
        [6, "RELATÓRIOS DAS PARTES"], [7, background[1].slice("Relatórios das partes ".length)],
        [8, "Configuração de Aventura"], [9, "ESPINHOS VIVOS PROVAVELMENTE APARECERÃO"],
        [10, "durante as viagens dos personagens na Davokar, para apimentar uma aventura que seja sobre algo totalmente diferente. Eles podem, por exemplo, rastejar até um acampamento e atacar logo após o amanhecer, quando os personagens acordarem e se perguntarem por que o local parece diferente da noite anterior. Alternativamente, eles encontram algum antagonista que pode controlar ou é aliado de um grupo de criaturas espinhosas, como a bruxa da narrativa anterior."],
        [11, "Outra opção é que os personagens se encontrem em uma situação em que alguém está usando espinhos vivos como um exército particular — possivelmente um feiticeiro, bruxa ou morto-vivo com a capacidade de escravizar outros seres. Pode ser algum líder de culto que os próprios personagens mataram ou expulsaram em direção à Davokar, mas se isso não se encaixar em sua história em particular, eles podem estar envolvidos em impedir uma ação retaliatória contra algum conhecido ou fornecedor de missões."],
        [12, "“Espinhos vivos? Como algum tipo de cipó estrangulador? Tolices e fantasias. Pode ser a coisa mais estúpida que eu já ouvi!” Além de um palavrão herético no momento da surpresa, essas foram as últimas palavras do Mestre da Ordem Ulagra em vida."],
        [13, "Tínhamos viajado muito pela Davokar Selvagem e estávamos irremediavelmente perdidos. Nossos suprimentos foram diminuindo e o que encontramos na mata só nos deixou mais doentes e confusos - um sinal claro de que havíamos entrado no escuro: mesmo que a floresta parecesse relativamente clara e harmoniosa, ela era traiçoeira em muitos aspectos. Justamente quando temíamos que tudo estivesse perdido, nosso guia avisou que não estávamos sozinhos. Apenas momentos depois, todos nós pudemos vê-la: uma bruxa, sentada em uma enorme pedra coberta de musgo, como se estivesse em transe, ouvindo o vento sussurrar nas folhas."],
        [14, "Ela olhou para cima quando nos aproximamos. Nada além de um arbusto espinhoso nos separava dela. Mestre Ulagra abriu a boca e perguntou... não, ele ordenou que a bruxa nos ajudasse. Quando ela não reagiu, nosso honrado Mestre da Ordem ficou ofendido e com raiva, ameaçando queimá-la na pedra, até invocando um orbe de fogo sulfuroso entre as mãos para sublinhar a ameaça. O guia, sussurrando e suplicando, tentou acalmar a ira ardente do piromante, mas em vão. Nem mesmo a informação de que o arbusto espinhoso na base da pedra estava se movendo em resposta à ameaça teve qualquer efeito além da já citada arenga paternalista sobre loucuras e fantasias."],
        [15, "O relato da caçadora de fortunas Salmara depois que ela foi encontrada por um grupo de Patrulheiros da Rainha"],
        [16, "Cantiga da Natureza"],
        [17, "O personagem que conhece o ritual Cantiga da Natureza pode usá-lo para atravessar campos inteiros de espinhos vivos. Enquanto a música continuar, eles apenas balançam ao som da melodia, sem atacar ou se mover."],
        [18, "Espinhos Vivos como Familiar"],
        [19, "As bruxas do caminho Verde podem usar espinhos vivos como familiares (consulte o ritual Familiar, página 142 do Livro Básico). Tal familiar obedece à vontade da bruxa, ou seja, não compartilha o ritmo circadiano dos espécimes selvagens. Em vez disso, o familiar se move, cambaleante e sinuoso, a seguir a bruxa; ele age quando é comandado e descansa quando a bruxa o faz."],
        [20, "@UUID[Actor.CCO2LU3UtjMU7I9x]{Espinhos Vivos Familiar}"], [21, "ESPINHOS VIVOS FAMILIAR"],
        [22, "Raça"], [23, familiar.race], [24, "Resistência"], [25, "Ordinária"], [26, "Traços"],
        [27, "Abraço Esmagador (II), Arma Natural (I), Muitas-cabeças (I)"],
        [28, "Astuto"], [30, "Discreto"], [32, "Persuasivo"], [34, "Preciso"], [36, "Rápido"], [38, "Resoluto"], [40, "Vigoroso"], [42, "Vigilante"],
        [44, "Habilidades"], [45, "Armadilha de Raízes* (novato)"], [46, "Armas"], [47, "Galhos resistentes 3"], [48, "Preciso"],
        [49, "Armadura"], [50, "Nenhuma"], [51, "Defesa"], [53, "Vitalidade"], [55, "Limiar de Dor"], [57, "Sombra"], [58, familiar.shadow],
        [59, "Táticas"], [60, `${familiar.tactics} * Como Vinhas Emaranhadoras, mas com Vigoroso como base para Testes de sucesso.`],
        [61, wild.name], [62, "@UUID[Actor.jpw2KGhwQqlgp7sn]{Espinhos Vivos Selvagem}"], [63, "ESPINHOS VIVOS SELVAGEM"],
        [64, "Raça"], [65, wild.race], [66, "Resistência"], [67, "Desafiadora"], [68, "Traços"],
        [69, "Abraço Esmagador (III), Arma Natural (II), Muitas-cabeças (II)"],
        [70, "Astuto"], [72, "Discreto"], [74, "Persuasivo"], [76, "Preciso"], [78, "Rápido"], [80, "Resoluto"], [82, "Vigoroso"], [84, "Vigilante"],
        [86, "Habilidades"], [87, "Armadilha de Raízes* (adepto)"], [88, "Armas"], [89, "Preciso"], [90, "Galhos resistentes 4"],
        [91, "Armadura"], [92, "Nenhuma"], [93, "Defesa"], [95, "Vitalidade"], [97, "Limiar de Dor"], [99, "Sombra"], [100, wild.shadow],
        [101, "Táticas"], [102, `${wild.tactics} * Como Vinhas Emaranhadoras, mas com Vigoroso como base para Testes de sucesso.`]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "14 Living Thorns");
    }],
    ["11 Gwann", (html) => {
      const gwann = entry.actors.Gwann;
      const slaughterer = entry.actors["Gwann, Slaughterer"];
      const appearance = visibleNodesFromHtml(gwann.appearance);
      const background = visibleNodesFromHtml(gwann.background);
      if (appearance.length !== 1 || background.length !== 2) throw new Error("Unexpected translated Gwann actor text structure.");
      const slaughtererShadow = slaughterer.shadow.replace(/\s*\(corrupção: 0\)$/, "");
      const replacements = new Map([
        [1, "Gwann"],
        [2, "Chegamos no Descampado tarde da noite. Tudo estava quieto. Muito quieto. Os maciços portões de carvalho, dignos de um forte ambriano, estavam intactos. A paliçada, erguendo-se sobre poderosos aterros, permanecia inteira. Inicialmente, nossos gritos e batidas no portão ficaram sem resposta e não podíamos fazer nada além de esperar, indecisos com o escurecimento da Davokar em nossas costas."],
        [3, "Um dos batedores farejou o ar e resfolegou: “O fedor, você pode sentir o cheiro?” Antes que tivéssemos tempo de responder, uma voz fraca e trêmula se ouviu da portaria: “Suba, rapidamente, suba!” Uma corda foi abaixada e nos apressamos a subir. À luz do sol poente, no topo da paliçada, vimos as muitas pilhas de terra ao redor do assentamento — e dentro dele. “Gwann”, nosso batedor mais experiente murmurou e cuspiu três vezes por cima do ombro. “Isso explica o fedor; este lugar está condenado e nós junto com ele”."],
        [4, "Do diário da missionária Hulandra, encontrado em seu cadáver desnutrido"],
        [5, "ENTRE AS MONSTRUOSIDADES"], [6, appearance[0].slice("Entre as monstruosidades ".length)],
        [7, "MESMO QUE O"], [8, background[0].slice("Mesmo que o ".length)],
        [9, "RELATOS MENOS CONFIÁVEIS"], [10, background[1].slice("Relatos menos confiáveis ".length)],
        [11, gwann.name], [12, "@UUID[Actor.Vb3MXGgdiEVfzQpq]{Gwann}"], [13, "Sinais de Gwann"],
        [14, "É preciso um"], [15, "Vigilante"],
        [16, "Teste para perceber a presença de pilhas de gwann ou as marcações de território fedorentas da besta. Para entender o que é, um personagem com a dádiva"],
        [17, "Mateiro"], [18, "deve passar em um Teste de"], [19, "Astuto"], [20, ", enquanto qualquer um com a habilidade"],
        [21, "Saber de Bestas"], [22, "sabe automaticamente o que cria as pilhas e as marcações."],
        [23, "GWANN"], [24, "Raça"], [25, gwann.race], [26, "Resistência"], [27, "Ordinária"], [28, "Traços"],
        [29, "Combate Mortal (I), Escavador (II), Senso de Vida (II), Robusto (I)"],
        [30, "Astuto"], [32, "Discreto"], [34, "Persuasivo"], [36, "Preciso"], [38, "Rápido"], [40, "Resoluto"], [42, "Vigoroso"], [44, "Vigilante"],
        [46, "Habilidades"], [47, "Nenhuma"], [48, "Armas"], [49, "Preciso"], [50, "Garras 4"],
        [51, "Armadura"], [52, "Pele espessa 2"], [53, "Defesa"], [55, "Vitalidade"], [57, "Limiar de Dor"],
        [59, "Sombra"], [60, gwann.shadow], [61, "Táticas"], [62, gwann.tactics],
        [63, "Configuração de Aventura"], [64, "OS PERSONAGENS JOGADORES"],
        [65, "são de alguma forma atraídos para um peculiar mistério de assassinato, onde as vítimas foram dilaceradas pelas garras do assassino; um assassino que parece ter atacado do subsolo apenas para desaparecer em túneis desmoronados. A princípio, nenhuma conexão pode ser encontrada entre as vítimas, mas uma investigação mais aprofundada revela que todos eles lidaram com um determinado artefato — o caçador de tesouros que o encontrou, o antiquário que o certificou, o colecionador que o comprou, o ladrão que o roubou, e o místico que contratou o ladrão."],
        [66, "O assassino é um dos enormes gwanns que os membros dos clãs chamam de Matadores, e é controlado por um illgoblin ou um troll que deseja recuperar o artefato feito pelo troll. A solução pode ser observar uma provável próxima vítima e aguardar o ataque, na esperança de matar a fera assassina e então seguir seus túneis (ainda não desmoronados) para encontrar o mestre. Como alternativa, os personagens podem descobrir quem está com o artefato e de alguma forma reivindicá-lo, para entregá-lo ao gwann — ou seu mestre, se possível. Simplesmente matar a criatura não vai parar os assassinatos; apenas leva a uma pausa na matança, até que o mestre localize e vincule um novo Matador a ser enviado na mesma missão sangrenta."],
        [67, "Tintura de Gwann"],
        [68, "As glândulas do gwann podem ser extraídas de seu conteúdo fedorento, e tal Gwannoreum é cobiçado por alquimistas e fabricantes de perfumes. Gwanns mortos podem ser ordenhados por alguém com Mateiro que passe em um Teste de Astuto, resultando em uma dose de gwannoreum no valor de 1 táler. Um gwann vivo (como um familiar) pode ser ordenhado uma vez por aventura."],
        [69, "Um alquimista de nível adepto (ou mestre) tem o conhecimento para misturar gwannoreum com álcool e refinar a substância em Tintura de Gwann. Uma dose moderada feita por um especialista custa 3 táleres e dá aos sentidos do usuário uma vantagem sobre-humana — em termos de regras, qualquer um que consuma uma dose ganha as habilidades do traço Senso de Vida no Nível II pelo resto da cena (consulte a página 170 para detalhes). Um Alquimista mestre pode refinar ainda mais a substância e preparar um elixir que normalmente custa 9 táleres e dá ao usuário Nível III no mesmo traço."],
        [70, slaughterer.name], [71, "@UUID[Actor.JKOjhppHC7hnkpZD]{Gwann Matador}"], [72, "GWANN MATADOR"],
        [73, "Raça"], [74, slaughterer.race], [75, "Resistência"], [76, "Difícil"], [77, "Traços"],
        [78, "Arma Natural (III), Armadurado (II), Combate Mortal (II), Escavador (III), Senso de Vida (II), Robusto (II)"],
        [79, "Astuto"], [81, "Discreto"], [83, "Persuasivo"], [85, "Preciso"], [87, "Rápido"], [89, "Resoluto"], [91, "Vigoroso"], [93, "Vigilante"],
        [95, "Habilidades"], [96, "Guerreiro Natural (adepto), Punho de Ferro (adepto)"], [97, "Armas"], [98, "Vigoroso"],
        [99, "Garras 11/8 (longa), dois ataques no mesmo alvo"], [100, "Armadura"], [101, "Pele espessa 6"], [102, "Defesa"],
        [104, "Vitalidade"], [106, "Limiar de Dor"], [108, "Sombra"], [109, slaughtererShadow], [110, "(corrupção: 0)"],
        [111, "Táticas"], [112, slaughterer.tactics],
        [113, "Tintura Falsa de Gwann"],
        [114, "De acordo com a medicina tradicional, diz-se que a tintura de Gwann cura tudo, desde calafrios a dor de dente e também alivia a gota, acaba com os soluços, revive os desejos carnais que falham e previne abortar a gravidez. Os charlatães costumam vender a Tintura Falsa de Gwann (diluída dez vezes a partir do original) a 1 táler por dose, e é preciso passar no Teste de Vigilante com a dádiva Mateiro para distinguir o falso do genuíno. Um personagem com a habilidade Alquimia faz a distinção diretamente, sem o Teste."],
        [115, "O elixir diluído ainda tem efeito, mas é naturalmente muito mais fraco — uma dose dá ao usuário uma segunda chance de passar em todos os Testes contra Vigilante, durante a cena que se segue após o consumo."],
        [116, "Gwann como Familiar"],
        [117, "Aparentemente, místicos podem se ligar a gwanns de tamanho normal com o ritual Familiar, mas de acordo com as bruxas da Davokar isso só era possível para trolls e ogros. Se isso tem a ver com a besta ter uma conexão especial com essas raças, ou se existem espécimes que podem ser convencidos a entrar em uma conexão espiritual com um ser humano, resta saber."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "11 Gwann");
    }],
    ["12 Illgoblin", (html) => {
      const illgoblin = entry.actors["Illgoblin, Necromage Servant"];
      const background = visibleNodesFromHtml(illgoblin.background);
      if (background.length !== 2) throw new Error("Unexpected translated Illgoblin actor text structure.");
      const replacements = new Map([
        [1, "Illgoblin"], [2, "ALGUNS GOBLINS OPTAM"], [3, background[0].slice("Alguns goblins optam ".length)],
        [4, "NO ENTANTO, EXISTEM"], [5, background[1].slice("No entanto, existem ".length)],
        [6, "O resultado da batalha era certo antes de começar. O grande número de trolls furiosos e enxames de goblins que separou nossa coluna tornou impossível formar uma defesa unificada. Os atacantes vinham com uma espécie de poder sombrio, como se fossem fortalecidos por algo, ou alguém. Às vezes eu pensava ter ouvido as palavras rimadas de uma criança balbuciante, como uma antiga canção de ninar forçando meus guerreiros a atacar seus camaradas."],
        [7, "Divididos, caímos, grupo por grupo. Eu era um daqueles que estavam enfeitiçados e me vi ajoelhado diante de uma parede de trolls e goblins, mal conseguindo me mover. Com toda a minha força de vontade, levantei meu livro de orações como um escudo, mas nenhuma palavra saiu de meus lábios. Os inimigos se afastaram para dar lugar a uma pequena criatura. A criança que rima. Um goblin? Não, um ex-goblin."],
        [8, "Seus olhos eram os de uma serpente, sua língua bifurcada, a luz dançava em sua pele escamosa. Seu olhar era hipnótico e sua voz sibilante ao falar: “Você viaja pela terra do Rei Serpente Gadraaltos; metade do que você colher em torno da Pedra de Gadraal recairá sobre o governante, sendo a morte a penalidade para sonegadores de impostos. Lembre sua rainha desse simples fato e nossos reinos irão prosperar, lado a lado”. A criatura, que se chamava Squagmatus, deixou-me partir depois de ter usado suas garras para esculpir os estatutos fiscais de seu mestre em meu peito."],
        [9, "Trecho do Protocolo de interrogatório da Justiça do Exército com o pregador Frendola, acusado de deserção e covardia"],
        [10, "Configuração de Aventura"], [11, "OS PERSONAGENS ESTÃO"],
        [12, "caçando tesouros e precisam de um guia. Um dos poucos disponíveis é a goblin Gammy Gulda, que de acordo com rumores em torno da Praça do Sapo conhece a rota para onde os personagens estão indo. O problema é que ela é um illgoblin; seu verdadeiro objetivo é levar os personagens ao covil de seu mestre, um antigo necromago."],
        [13, "Gammy Gulda faz o possível para esconder suas feições bestiais e tenta fazer o papel de um goblin um tanto tragicômico — um ex-caçador de fortunas que, gravemente ferido por um gigavali, não pode mais procurar tesouros, mas ajuda os outros nas matas."],
        [14, "Durante a jornada pela Davokar, Gulda manterá a farsa de um goblin relativamente incompetente, mas ela auxilia os personagens quando parece apropriado — ela quer ganhar a confiança deles e quer que eles cheguem vivos ao destino. Quando eles chegarem perto da necrópole do mestre, ela irá se esgueirar para realizar o ritual"],
        [15, "Círculo Mágico"], [16, ", para entrar em contato com o necromago e descrever os personagens da melhor maneira possível, para dar-lhe uma chance de se preparar. Um personagem que consegue seguir Gulda quando ela realiza o ritual vai ouvi-la descrever todos eles. Além disso, se este personagem conhece a habilidade"],
        [17, "Ritualista"], [18, ", ele ou ela será capaz de identificar o ritual que ela realiza; qualquer pessoa com conhecimento em tradição mística alcançará o mesmo intuito após um Teste de"],
        [19, "Astuto"], [20, "bem-sucedido."], [21, "Se Gulda for descoberta, ela agirá desesperada e mentirá (pode ser revelado se um personagem passar num Teste de ["],
        [22, "Vigilante"], [23, "←"], [24, "Persuasivo"], [25, "]) sobre a “aparição mantendo minha família cativa”. Seu objetivo continua o mesmo: conduzir os personagens até o necromago."],
        [26, "Jogando com um Illgoblin"],
        [27, "Os jogadores podem optar por criar um personagem illgoblin ou até mesmo fazer com que seu personagem goblin entre em um pacto e se torne um illgoblin em jogo. A aparência do personagem adota uma ou duas características reminiscentes de seu mestre — substitua o traço Vida Curta pela dádiva Sangue Negro e o fardo Bestial (consulte o Guia Avançado do Jogador, páginas 55 e 56). Além disso, o jogador e o mestre de jogo devem concordar sobre quais dons o personagem pode ganhar ao entrar no pacto, com base em quem é o mestre e o que ele deseja alcançar. Fora isso, o acordo segue as regras de Criação de Pactos do Guia Avançado do Jogador (página 100)."],
        [28, illgoblin.name], [29, "@UUID[Actor.dWCJeoW5mUuy859W]{Illgoblin, Serva de um Necromago}"], [30, "ILLGOBLIN, SERVA DE UM NECROMAGO"],
        [31, "Raça"], [32, illgoblin.race], [33, "Resistência"], [34, "Desafiadora"], [35, "Traços"],
        [36, "Bestial, Frio da Tumba (II), Instinto de Sobrevivência (II), Mateiro, Sangue Negro"],
        [37, "Astuto"], [39, "Discreto"], [41, "Persuasivo"], [43, "Preciso"], [45, "Rápido"], [47, "Resoluto"], [49, "Vigoroso"], [51, "Vigilante"],
        [53, "Habilidades"], [54, "Caminhada Espiritual (adepto), Feitiçaria (adepto), Ritualista (novato: Círculo Mágico), Sopro Sombrio (adepto)"],
        [55, "Armas"], [56, "Nenhuma"], [57, "Armadura"], [58, "Toga de bruxa 2 (+2 de Instinto de Sobrevivência)"], [59, "Defesa"],
        [61, "Vitalidade"], [63, "Limiar de Dor"], [65, "Sombra"], [66, illgoblin.shadow], [67, "Táticas"], [68, illgoblin.tactics],
        [69, "Poderes Criadores de Pactos"],
        [70, "A Tabela 3 na página 57 descreve um punhado de poderes possíveis — com objetivos, punições e recompensas — para serem usados diretamente ou como inspiração ao criar illgoblins que fazem pactos."],
        [71, "Tabela 3: PODERES CRIADORES DE PACTOS"], [72, "Poder"], [73, "Características"], [74, "Possível Objetivo"], [75, "Punição*"], [76, "Presentes Típicos"],
        [77, "Arquítroll"], [78, "Características de troll, frequentemente chifres"], [79, "Recuperar artefatos (feitos por trolls) de caçadores de tesouros e monstros"],
        [80, "Mente nublada até que uma mudança seja feita"], [81, "Traços monstruosos associados a trolls; a tradição mística Canto do Troll; pode se ligar a um Gwann com o ritual Familiar"],
        [82, "Linnorme"], [83, "Atributos de serpentes"], [84, "Conquistar ou defender um determinado território"],
        [85, "Risco de ficar encantado em momentos inoportunos, até que uma mudança seja feita"], [86, "Traços monstruosos associados a serpentes; poderes e rituais relacionados com o controle da mente e da vontade; pode se ligar a um Kanaran com o ritual Familiar"],
        [87, "Necromago"], [88, "Sinais de morte"], [89, "Atrair caçadores de tesouros para seu covil para expandir seu exército de servos mortos-vivos"],
        [90, "“Rigor mortis” até que correções sejam feitas"], [91, "Traços monstruosos associados aos mortos-vivos; a tradição mística Feitiçaria (Necromancia)"],
        [92, "Aranha Rainha"], [93, "Atributos aracnídeos"], [94, "Prender mortais à sua teia de intrigas"],
        [95, "Mordida venenosa que permanece até que o illgoblin mude de atitude"], [96, "Traços monstruosos associados a aranhas; pode se ligar a um Ferrão-gotejante com o ritual Familiar"],
        [97, "Elfo do Inverno"], [98, "Características sobrenaturais como pele branca como a neve, falta de íris"], [99, "Proteger uma área tabu dos caçadores de tesouros"],
        [100, "Pesadelos até que uma mudança seja feita"], [101, "Traços monstruosos associados aos elfos; poderes e rituais condizentes com o objetivo e temperamento do elfo do inverno; pode se vincular a um Baiagorn com o ritual Familiar"],
        [102, "* Todas as punições têm o mesmo efeito: o illgoblin não pode gastar Experiência de forma alguma; não pode aprender coisas, vincular-se a artefatos ou fazer novas rolagens se esta regra opcional estiver em prática. A punição é suspensa assim que o illgoblin começa a agir de acordo com a vontade do mestre, de uma forma agradável."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "12 Illgoblin");
    }],
    ["15 Managaal", (html) => {
      const adult = entry.actors["Managaal, Adult"];
      const spawn = entry.actors["Managaal, Spawn"];
      const background = visibleNodesFromHtml(adult.background);
      if (background.length !== 2) throw new Error("Unexpected translated Managaal actor text structure.");
      const replacements = new Map([
        [1, "Managaal"],
        [2, "Ficamos em fila, silenciosos e excitados. Todos nós fomos marcados pela corrupção; todos nós esperávamos nos livrar dos estigmas, sonhando em poder andar sem disfarces, sem máscara, sem medo. O pensamento fez meu coração bater mais rápido. A criatura diante de nós estava acorrentada à parede, como um morcego gigante preso por alfinetes. Ele se contorceu e sibilou; estendia-se em nossa direção com a língua espinhosa brincando em sua fauce predatória. Estava com sede e estávamos dispostos. A fila avançava continuamente, enquanto um a um fomos lambidos até sangrar pela criatura. O senhor da morte de nosso Mestre estava pronto para separar o monstro e o cultista, para que o último não fosse lambido até a morte. Era quase a minha vez, mas a mulher diante de mim se recusou a se separar do beijo do monstro. O Mestre viu o perigo e clamou ao seu senhor da morte para separar os dois; o fio da espada enferrujada cortou a cabeça e o ombro da mulher, e a criatura puxou a língua para trás para salvá-la. Então nosso Mestre nos repreendeu para que nunca permitíssemos que a besta se empanturrasse. E depois disso, você atacou, então nunca recebi o beijo de limpeza. Que você quer me queimar, eu sei. Mas o que você fará com a besta maculada?"],
        [3, "Transcrição do interrogatório dos mantos negros com Aramo, cultista sobrevivente"],
        [4, "O BESTIAL MANAGAAL"], [5, background[0].slice("O bestial Managaal ".length)],
        [6, "ATÉ QUE UM"], [7, background[1].slice("Até que um ".length)],
        [8, "O MANAGAAL É"],
        [9, "muito raro, mas não deixa de ser relativamente bem conhecido, pois é mencionado em várias fontes symbarianas. Por um lado, há descrições de sua origem e métodos de caça, mas também há referências à criação de um artefato chamado Água Profana. Diz-se que destilar o sangue de um managaal é uma maneira de criar tal artefato e, para esse propósito, uma cria recém-nascida é supostamente suficiente, mas um adulto é ainda melhor."],
        [10, "Agrilhoando um Managaal"],
        [11, "Um managaal capturado pode ser preso no mesmo tipo de círculo que os daemones, de acordo com o ritual Convocar Daemon na página 88 do Guia Avançado do Jogador. Esses círculos, juntamente com quaisquer restrições físicas, são quebrados se o managaal vomitar uma cria negra (consulte a caixa de texto Criar Managaal)."],
        [12, "Criar Managaal"],
        [13, "Uma vez que um managaal está cheio de corrupção acumulada, ele vomita um novo managaal, uma prole sombria. Este ato sombrio de criação esvazia o managaal da corrupção, e ele fica tão enlouquecido de fome que imediatamente e automaticamente quebra todos os grilhões físicos e místicos que atualmente o prendem."],
        [14, "Configuração de Aventura"], [15, "UM CULTO EM"],
        [16, "uma das cidades de Ambria conseguiu capturar um managaal e pretende usá-lo ao máximo, primeiro para se purificar da corrupção e depois para criar Água Profana."],
        [17, "A primeira fase ocorre conforme o planejado, mas quando a destilação começa, um dos cultistas (talvez o Mestre Alquimista ou o Artífice) sofre um golpe de corrupção e se torna completamente corrupto. E mais, o cultista nascido da mácula foge para a cidade."],
        [18, "Os personagens estão visitando o assentamento quando a abominação recém-despertada fica louca. Depois de derrotar a criatura, eles descobrem estranhas perfurações em seu pescoço, axilas e virilha. Alguém com a dádiva Mateiro pode testemunhar que essas feridas não foram feitas por nenhum animal comum; qualquer um com a habilidade Saber de Bestas pode, depois de passar num Teste de Astuto, relembrar as descrições de uma estranha besta que dizem sugar corrupção de outros, chamada Managaal."],
        [19, "A aventura continua com os personagens tentando encontrar a fonte da corrupção, seja seguindo o rastro físico da besta maculada ou investigando o indivíduo que acabou nascendo da mácula. No caso do último, trata-se provavelmente de um alquimista ou criador de artefatos de renome, o que significa que entrevistas ou invasões em casas de pessoas de seu círculo de conhecidos (ou o uso de rituais) podem levar os personagens à capela escura dos cultistas. Uma complicação — ou uma oportunidade para grupos que têm dificuldade de avançar — é que o culto está precisando de um novo alquimista/artífice e decide sequestrar um. Talvez até um dos personagens pode se tornar o alvo, se ele ou ela dominar as habilidades necessárias?"],
        [20, "ARTEFATO: ÁGUA PROFANA"],
        [21, "Água Profana consiste em pura corrupção, como uma Água do Crepúsculo ao contrário (página 186 do Livro Básico). Parece mercúrio negro e emite vapores escuros de corrupção se não estiver contida em um frasco de vidro, cristal ou material semelhante."],
        [22, "A única maneira de se vincular a este artefato é aceitar um ponto de corrupção permanente."],
        [23, "Luz Negra."], [24, "Nas mãos de quem aceitou a Escuridão, o frasco pode irradiar com a escuridão do Abismo, escurecendo assim uma área mesmo que o sol esteja alto no céu. Isso significa que um local (por exemplo, uma sala interna ou uma clareira na floresta) fica escuro para o restante da cena, escuro como uma noite sem estrelas ou luar."],
        [25, "Ação:"], [26, "Livre"], [27, "Corrupção:"], [28, "Nenhuma"],
        [29, "Revelações da Noite."], [30, "O líquido pode ser pingado em tecido vivo. Cada gota concede 1D12 de Experiência para ser usada como o receptor desejar, ao custo de um de corrupção permanente. Quando todas as gotas são usadas, o frasco está vazio e o artefato gasto."],
        [31, "Ação:"], [32, "Ativa"], [33, "Corrupção:"], [34, "1 corrupção permanente/gota"],
        [35, "Sinergia Negra."], [36, "Aquele que se curva diante da supremacia das Trevas pode usar sua escuridão para aumentar os poderes da Feitiçaria. Uma vez por cena, a sinergia pode adicionar +1 nível ao dado de efeito."],
        [37, "Ação:"], [38, "Reação"], [39, "Corrupção:"], [40, "Nenhuma"],
        [41, "Salvação da Escuridão."], [42, "O mestre do artefato pode esmagar o frasco com um pensamento, liberando assim sua escuridão. Todas as criaturas presentes com pelo menos 1 corrupção (temporária ou permanente) imediatamente sofrem 1D12 de corrupção permanente. Seres que já têm corrupção permanente são afetados apenas se o resultado for maior do que a corrupção atual — se for, eles sofrem a diferença. Se o resultado for igual ou inferior ao valor de corrupção atual, nada acontecerá. Isso também afeta o próprio mestre se ele tiver alguma corrupção; apenas criaturas com corrupção zero estão a salvo de danos."],
        [43, "Ação:"], [44, "Livre"], [45, "Corrupção:"], [46, "1D12 (veja a descrição)"],
        [47, "Criando Água Profana"], [48, "Para usar um managaal com o propósito de criar Água Profana, a criatura deve estar pelo menos meio cheia de corrupção ["],
        [49, "Resoluto"], [50, "/2]. Além disso, é necessário um códice ou manuscrito que descreva o procedimento real — fontes de conhecimento que podem ser encontradas nas ruínas escuras da Davokar ou compradas de cultistas e feiticeiros pelo preço de uma pequena fortuna."],
        [51, "Leva um dia inteiro para ferver lentamente o sangue da criatura até a espessura desejada; então, um Mestre Alquimista e um Mestre Artífice (podem ser o mesmo indivíduo) devem fazer um Teste de Astuto. Se ambos os Testes forem bem-sucedidos, dez gotas de Água Profana são criadas se o managaal for um adulto, ou cinco se for uma prole. Se qualquer uma das jogadas chegar ao resultado 20, o indivíduo em questão sofre 1D12 de corrupção permanente."],
        [52, adult.name], [53, "@UUID[Actor.tghJ4u0h7dFypaWb]{Managaal Adulto}"], [54, "MANAGAAL ADULTO"],
        [55, "Raça"], [56, adult.race], [57, "Resistência"], [58, "Difícil"], [59, "Traços"],
        [60, "Arma Natural (III), Asas (I), Coletor de Corrupção (III), Enfeitiçar (II), Robusto (II), Sede de Sangue (III)"],
        [61, "Astuto"], [63, "Discreto"], [65, "Persuasivo"], [67, "Preciso"], [69, "Rápido"], [71, "Resoluto"], [73, "Vigoroso"], [75, "Vigilante"],
        [77, "Habilidades"], [78, "Acrobacias (novato), Dominação (novato), Guerreiro Natural (novato), Líder (novato)"],
        [79, "Armas"], [80, "Persuasivo"], [81, "Mordida 9"], [82, "Armadura"], [83, "Pele dura 3"], [84, "Defesa"],
        [86, "Vitalidade"], [88, "Limiar de Dor"], [90, "Sombra"], [91, adult.shadow], [92, "Táticas"], [93, adult.tactics],
        [94, spawn.name], [95, "@UUID[Actor.F9jknnx7ofmb9FMn]{Prole Managaal}"], [96, "PROLE MANAGAAL"],
        [97, "Raça"], [98, spawn.race], [99, "Resistência"], [100, "Desafiadora"], [101, "Traços"],
        [102, "Arma Natural (II), Asas (I), Coletor de Corrupção (II), Diminuto, Sede de Sangue (II)"],
        [103, "Astuto"], [105, "Discreto"], [107, "Persuasivo"], [109, "Preciso"], [111, "Rápido"], [113, "Resoluto"], [115, "Vigoroso"], [117, "Vigilante"],
        [119, "Habilidades"], [120, "Acrobacias (novato), Dominação (novato), Guerreiro Natural (novato), Líder (novato)"],
        [121, "Armas"], [122, "Persuasivo"], [123, "Mordida 5"], [124, "Armadura"], [125, "Nenhuma"], [126, "Defesa"],
        [128, "Vitalidade"], [130, "Limiar de Dor"], [132, "Sombra"], [133, spawn.shadow], [134, "Táticas"], [135, spawn.tactics]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "15 Managaal");
    }],
    ["16 Marlit", (html) => {
      const marlit = entry.actors.Marlit;
      const appearance = visibleNodesFromHtml(marlit.appearance);
      const background = visibleNodesFromHtml(marlit.background);
      if (appearance.length !== 1 || background.length !== 2) throw new Error("Unexpected translated Marlit actor text structure.");
      const replacements = new Map([
        [1, marlit.name],
        [2, "A rastreadora provou ser digna de seu salário — ela sentiu o cheiro depois de uma mera tarde na floresta. A julgar pelos rastros, era um marlit relativamente pequeno, mas “grande o suficiente para fazer uma capa esplêndida”, como disse Bardel, nosso líder."],
        [3, "Nós seguimos a criatura durante a tarde e noite adentro. Ela se moveu erraticamente para o nordeste, em áreas úmidas que retardaram nosso progresso. Naturalmente, o marlit em si não teve problemas ao se deslocar pela folhagem, mas depois de um tempo notamos que ele começou a se mover em um círculo amplo. Demorou algum tempo até descobrirmos o porquê, antes que Bardel e nossa guia descobrissem outras trilhas marlit nas copas das árvores: nossa presa pretendida não estava mais sozinha."],
        [4, "Após alguns resmungos e olhares preocupados, Bardel explicou o que estava acontecendo. Não éramos mais caçadores, mas presas, e aqueles que nos caçavam eram grandes e numerosos. A reviravolta foi sinistra, para dizer o mínimo; assustador o bastante para deixar Dumdum ansioso."],
        [5, "Bardel tentava tranquilizar o ogro quando o primeiro grito ecoou pela floresta. Boquiabertos em uma mistura de surpresa e susto, vimos nosso rastreador sendo içado do chão por várias línguas enredadoras. Eu corri! Todos correram. Apenas eu e Tugvar escapamos..."],
        [6, "Eleono, ex-caçador de troféus de Kurun"],
        [7, "O CAÇADOR MAGISTRAL CHAMADO"], [8, appearance[0].slice("O caçador magistral chamado ".length)],
        [9, "É BEM POSSÍVEL"], [10, background[0].slice("É bem possível ".length)],
        [11, "COMO A PELE DO LAGARTO"], [12, background[1].slice("Como a pele do lagarto ".length)],
        [13, "Seção 8:24, Caçadores famosos de marlit e sua passagem"], [14, "Aneas de Mark"],
        [15, "De origem humilde e fanfarrão, conhecido principalmente por seus poemas auto-envolventes e por ter matado e esfolado a fera cuja pele agora é usada pelo prefeito Campo Noturno como uma capa de caça. A morte do caçador tornou-se conhecida quando seu carregador de lança, Maltuld, voltou sozinho de uma viagem de caça, carregando o lóbulo da orelha direita de seu mestre — o que restou após a automutilação que Aneas realizou quando foi puxado para a folhagem."],
        [16, "Jonhor de Baiaga"],
        [17, "O belo bárbaro Jonhor — imensamente popular entre homens e mulheres; também querido pelo estranho ogro — tornou-se a estrela caçadora de monstros mais brilhante de Kastor por um período de três anos, até sua morte. No momento de seu desaparecimento, admiradores preocupados saíram em busca na mata, mas voltaram de mãos vazias, exceto pelo peculiar colete de couro de Jonhor e alguns pedaços desconexos de sua pele tatuada."],
        [18, "Ulhaaka"],
        [19, "Brusca, mas conceituada tutora na arte de caçar monstros, da tribo Karabaddokk, mas ativa até a sua morte em Forte do Cardo. Ela morreu durante uma viagem de campo com alunos de caça, incluindo os jovens Mateo Derego e Alvio Argona, oficialmente após ter defendido seus alunos de um enorme marlit. No entanto, há rumores de que os restos mortais exibiam facadas em vez de marcas de mordidas, e também que um dos jovens nobres voltou sem sua espada de esgrima."],
        [20, "Fredo: O Açougueiro"],
        [21, "Empresário falador que fundou a alfaiataria Trajes de Marlit de Fredo em Yndaros e que gostava de viajar em busca de matéria-prima e emoções. Diz-se que ele morreu por causa de uma aposta, depois de ter afirmado que era capaz de matar um marlit adulto com nada além dos dentes. Por mais desagradável que seja, tudo o que resta dele são seus quatro dentes de ouro, encontrados e escavados por seus filhos de um pedaço fumegante de excremento marlit."],
        [22, "Trecho de “Vítimas da Davokar”, registro estabelecido no Legado da Rainha em Forte do Cardo"],
        [23, marlit.name], [24, "@UUID[Actor.sljDiXUxJoORG0sv]{Marlit}"], [25, "MARLIT"],
        [26, "Raça"], [27, marlit.race], [28, "Resistência"], [29, "Ordinária"], [30, "Traços"],
        [31, "Arma Natural (I), Língua Enredadora, Robusto (I)"],
        [32, "Astuto"], [34, "Discreto"], [36, "Persuasivo"], [38, "Preciso"], [40, "Rápido"], [42, "Resoluto"], [44, "Vigoroso"], [46, "Vigilante"],
        [48, "Habilidades"], [49, "Punho de Ferro (adepto)"], [50, "Armas"], [51, "Vigoroso"], [52, "Mordida 7"],
        [53, "Armadura"], [54, "Pele de marlit 2"], [55, "Defesa"], [57, "Vitalidade"], [59, "Limiar de Dor"],
        [61, "Sombra"], [62, marlit.shadow], [63, "Táticas"], [64, marlit.tactics],
        [65, "A Camuflagem do Marlit"],
        [66, "O marlit vivo tem melhores propriedades de camuflagem do que a capa que pode ser feita de sua pele: +3 (em vez de +1) em Discreto ao rolar Testes para se esgueirar e/ou se esconder. Para caçadores e outros viajantes da floresta, isso significa que eles têm um modificador de -3 ao tentar descobrir uma fera réptil furtiva fazendo um Teste contra Vigilante, além da modificação que vem do valor da criatura em Discreto."],
        [67, "Configuração de Aventura"], [68, "UM AMBRIANO RICO,"],
        [69, "como por exemplo o Conde Arnon Melion ou um de seus parentes próximos, está se preparando para sediar um baile de máscaras e quer tornar o evento memorável para os convidados proeminentes — a Rainha, os duques e a maior parte da elite do reino. A ideia é preparar trajes extraordinários para todos, costurados com pele marlit que muda de cor."],
        [70, "O fornecedor da missão comprou informações de uma fonte confiável, detalhando o paradeiro de um dos maiores grupos de marlits do sul da Davokar. Ele quer enviar um grupo de caça para o local, apoiado com a experiência necessária para viajar para longe na floresta. Os personagens podem participar da expedição, que inicialmente ocorre de forma tranquila — até chegar ao destino."],
        [71, "Aparentemente, o bando está sob a proteção do Pacto de Ferro. Quando a caça real está em andamento, projéteis, bem como poderes místicos são usados na defesa dos lagartos. Mesmo que o grupo de caça consiga matar o punhado de guardiões presentes na área, eles agora têm que se apressar: reforços estão chegando dos Salões das Mil Lágrimas. Se as coisas correrem muito mal, os personagens chamarão a atenção dos elfos, o que pode causar problemas mais tarde nas suas vidas aventureiras..."],
        [72, "Marlit, marlit, sua lebre amarela,"], [73, "você não serviria como espantalho,"], [74, "você dispara como um coelho, ora aqui,"], [75, "ora ali, com medo de sua própria sombra."],
        [76, "Você é a mais baixa das criaturas"], [77, "já nascidas, indesejados como úlceras e"], [78, "balbúrdias. Você não é digno de nada além"], [79, "de ódio e desprezo, até que você se transforme em uma jaqueta."],
        [80, "Sátira assinada por Elnar Perneta, Corvênia"]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "16 Marlit");
    }]
  ])],
  ["Section 2: Monsters & Adversaries", new Map([
    ["01 Introduction Adversaries", (html) => {
      const replacements = new Map([
        [1, "O que é a Noite Eterna? Ou, mais precisamente, onde ela se encontra? Os manuscritos do Portador da Luz, ditados por Prios e registrados pelo Padre Abramar, ensinam que as criaturas da Noite Eterna são aquelas que afastam o rosto do sol e induzem outros a fazer o mesmo — desviando assim, o poder proveniente da fé e da confiança do espírito humano — por isso, são os culpados pela decadência de Prios."],
        [2, "De acordo com o exposto, a Noite Eterna deve ser entendida como uma vida sem Prios, uma existência sem luz. Onde confiança e fé estão ancoradas em algo que não seja o Uno e as leis do sol. Com isso, chega-se à conclusão de que a Noite Eterna já está aqui, entre nós, em cada alma pronta para obedecer a outras ordens que não sejam as do Provedor das Leis."],
        [3, "A batalha contra as Hordas da Noite Eterna não é algo que nos espera em um futuro distante. Ela já está em curso, em toda ação e em cada respiração. Repreenda a si mesmo como castiga o próximo, para sempre escolher a obediência. Não por medo, nem por esperança de recompensa, mas com alegria, na certeza de que o certo também é verdadeiro e mantém a Noite Eterna à distância."],
        [4, "Trecho de Hordas da Noite Eterna, Padre Almagast"], [5, "Introdução"], [6, "AMBRIA, DAVOKAR E AS CORDILHEIRAS"],
        [7, "são habitadas por criaturas que consideram a área que ocupam como delas — seu vale, sua vila, seu pântano ou sua caverna. Qualquer um que afirme o contrário ou que tente interferir no lugar de alguma maneira indesejável é considerado um adversário, ou até mesmo um inimigo. Se, além disso, for estranho de uma forma que o torne difícil de entender e se comunicar, também corre o risco de ser considerado um monstro."],
        [8, "ESTA SEÇÃO CONTÉM"],
        [9, "breves descrições e estatísticas de um grande número de criaturas, muitas das quais provavelmente veriam umas às outras como adversários e monstros. É de se esperar que um guarda da cidade em Ambria ou um guia do ermo da Davokar chame o Verme Maculado de monstro. Contudo, não se esqueça que o Verme Maculado, de acordo com sua própria lógica bestial, provavelmente considera os exploradores e outros que invadem seu território como intrusos monstruosos; inimigos que devem ser combatidos, expulsos ou, de preferência, destruídos. Como Mestre de Jogo, é seu trabalho retratar essa ampla variedade de criaturas e como elas se relacionam com os personagens jogadores."],
        [10, "A seção é organizada por temas relacionados principalmente ao habitat, mas que, no caso dos humanos, também são baseados na afiliação com facções. Embora quase noventa monstros e adversários (ou possíveis aliados) sejam descritos neste livro, a lista não é exaustiva. Em vez disso, nossa esperança é que esse conteúdo sirva como ponto de partida para o Mestre de Jogo se basear ao criar seus próprios desafios e aventuras, e que seja abordado com criatividade. A Guarda da Cidade descrita aqui é apenas um exemplo, assim como a Bruxa da Aldeia e o Verme Maculado. Se o Mestre de Jogo quiser mudar traços, habilidades e outros detalhes (por exemplo, para dar ao indivíduo uma natureza mais singular ou ajustar seus valores para melhor se adequar aos personagens jogadores), é claro que está tudo bem!"],
        [11, "O mesmo se aplica ao criar novos tipos de monstros e adversários. Por exemplo, ao substituir a Metamorfose e Guerreiro Natural da Bruxa da Aldeia por Abraço da Natureza e Vinhas Emaranhadoras, você obtém uma bruxa que escolheu o caminho verde da bruxaria em vez do vermelho. E com a adição de Morto-Vivo (II), o Javali Rochoso pode se tornar um morto-vivo temível, esmagador, que ataca vorazmente uma vila ou uma comunidade de mineração nas montanhas. Aqui não há certo ou errado; apenas encontros mais ou menos emocionantes!"],
        [12, "A seção começa com um capítulo dedicado principalmente aos humanos, ou pelo menos seres civilizados, e depois disso o foco muda para os habitantes das florestas, montanhas e Submundo. Algumas criaturas foram baseadas nos módulos publicados anteriormente, diretamente ou com modificações, enquanto outros adversários são inteiramente novos, dotados dos traços introduzidos na Seção III."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "Section 2 Introduction");
    }],
    ["08 Beasts and Monsters", (html) => {
      const replacements = new Map([
        [1, "Bestas e Monstros"],
        [2, "Onde o homem se destaca na capacidade de desenvolver intelecto, razão e pensamento estratégico, as Hordas da Noite Eterna são vastamente inferiores. De fato, tais seres das trevas nascem absolutamente incapazes de adquirir qualidades que caracterizam o ser humano aculturado, concedido aos membros de nossa nobre raça por Prios, o Uno."],
        [3, "Em vez disso, as bestas das trevas estão cheias de fome, fogo e impulso inato para o mal. Eles não se importam com a própria condição, nem com os arredores; seu único objetivo e propósito é saciar luxúrias e satisfazer desejos. Isso é verdade independentemente de seu tamanho, forma ou postura — três propriedades que podem variar mesmo entre criaturas que, fora isso, são semelhantes."],
        [4, "Na verdade, o castigo combinado com recompensas pode, pela graça de Prios, obrigar jakaar, goblin e bestiaal a resistir temporariamente à tirania de seus desejos. Mas isso nunca deve ser visto como algo além de uma vitória passageira frente à noite, assim como os perigos da má interpretação nunca devem ser subestimados. Um único erro pode muito bem fazer com que os crédulos sejam devorados, esmagados, corrompidos, enredados, enfeitiçados ou queimados em cinzas fumegantes."],
        [5, "Trecho de Hordas da Noite Eterna, Padre Almagast"], [6, "OS CINCO"],
        [7, "títulos deste capítulo se referem a diferentes tipos de ermos. No entanto, deve-se notar que as bestas que habitam o mundo do jogo tendem a se deslocar entre diferentes áreas de caça. Uma criatura que normalmente habita o Submundo poderia muito bem ser forçada a aparecer na superfície, e as bestas geralmente encontradas nas hidrovias da região às vezes podem ser encontradas em terra seca ou rastejando pelos pântanos da floresta."]
      ]);
      return translateVisibleHtmlByIndex(html, replacements, "Section 2 Beasts and Monsters");
    }]
  ])]
]);

const changedJournals = new Set();
function resolvePageKey(journal, legacyKey, journalKey) {
  if (Object.hasOwn(journal.pages, legacyKey)) return legacyKey;
  const matches = Object.keys(journal.pages).filter((key) => key.replace(/^[^.]+\./, "") === legacyKey);
  if (matches.length !== 1) {
    throw new Error(`Could not uniquely resolve page '${journalKey}.${legacyKey}'.`);
  }
  return matches[0];
}

for (const [journalKey, pages] of changes) {
  const journal = entry.journals[journalKey];
  if (!journal?.pages) throw new Error(`Missing journal '${journalKey}'.`);
  const beforePageKeys = Object.keys(journal.pages);
  for (const [pageKey, transform] of pages) {
    const page = journal.pages[resolvePageKey(journal, pageKey, journalKey)];
    if (!page || typeof page.text !== "string") throw new Error(`Missing page '${journalKey}.${pageKey}'.`);
    page.text = transform(page.text);
  }
  if (JSON.stringify(Object.keys(journal.pages)) !== JSON.stringify(beforePageKeys)) throw new Error(`Page keys changed in '${journalKey}'.`);
  changedJournals.add(journalKey);
}

function locateJournalObjects(text) {
  const locations = new Map();
  let index = 0;
  function ws() { while (/\s/.test(text[index] ?? "")) index += 1; }
  function str() {
    const start = index++;
    while (index < text.length) {
      if (text[index] === "\\") index += 2;
      else if (text[index++] === '"') return JSON.parse(text.slice(start, index));
    }
    throw new Error("Unterminated string.");
  }
  function value(path) {
    ws();
    const start = index;
    const token = text[index];
    if (token === "{") object(path);
    else if (token === "[") array(path);
    else if (token === '"') str();
    else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1;
    if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "journals") {
      locations.set(path[3], { start, end: index });
    }
  }
  function object(path) {
    index += 1; ws();
    if (text[index] === "}") { index += 1; return; }
    while (index < text.length) {
      const key = str(); ws();
      if (text[index++] !== ":") throw new Error(`Expected colon at ${index - 1}.`);
      value([...path, key]); ws();
      if (text[index] === "}") { index += 1; return; }
      if (text[index++] !== ",") throw new Error(`Expected comma at ${index - 1}.`);
      ws();
    }
  }
  function array(path) {
    index += 1; ws();
    if (text[index] === "]") { index += 1; return; }
    let number = 0;
    while (index < text.length) {
      value([...path, number++]); ws();
      if (text[index] === "]") { index += 1; return; }
      if (text[index++] !== ",") throw new Error(`Expected comma at ${index - 1}.`);
      ws();
    }
  }
  value([]); ws();
  if (index !== text.length) throw new Error(`Unexpected trailing data at ${index}.`);
  return locations;
}

const locations = locateJournalObjects(source);
const replacements = [...changedJournals].map((key) => {
  const location = locations.get(key);
  if (!location) throw new Error(`Could not locate journal '${key}'.`);
  return { ...location, value: entry.journals[key] };
});
const eol = source.includes("\r\n") ? "\r\n" : "\n";
let output = source;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  const lineStart = source.lastIndexOf("\n", replacement.start - 1) + 1;
  const indent = source.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
  const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`);
  output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end);
}
const reparsed = JSON.parse(output).entries?.[ENTRY];
if (!reparsed || JSON.stringify(reparsed) !== JSON.stringify(entry)) throw new Error("Serialized data mismatch.");
if (!checkOnly && output !== source) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: output !== source, journalsChanged: changedJournals.size }, null, 2));
