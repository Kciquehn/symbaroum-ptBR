const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json";
const ENTRY = "Symbaroum Game Masters Guide";
const checkOnly = process.argv.includes("--check");

const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const items = data.entries?.[ENTRY]?.items;
if (!items) throw new Error(`Missing '${ENTRY}' items.`);

const paragraph = (introduction, focus, partial, full, sideEffect) =>
  `<p>${introduction}<br /><br /><strong>Foco Cerimonial:</strong> ${focus}<br /><br /><strong>Efeito Parcial:</strong> ${partial}<br /><br /><strong>Efeito Completo:</strong> ${full}<br /><br /><strong>Efeito Colateral Único:</strong> ${sideEffect}</p>`;

const ceremonies = {
  "Firestorm": {
    tradition: "Magismo",
    description: paragraph(
      "Qualquer coisa combustível pega fogo imediatamente, parcial ou inteiramente. Lufadas de vento forte começam a alimentar as chamas, fazendo com que as chamas se espalhem em todas as direções.",
      "Um pedaço de madeira de lei calcinado, do tamanho do antebraço de um humano.",
      "Toda a matéria orgânica dentro da área de efeito é banhada em calor escaldante, mas apenas o que está seco ou quase seco pega fogo — como lenha, grama morta, têxteis e a casca de árvores vivas. Um décimo de todos na área morrem imediatamente das queimaduras, e há uma boa chance de todas as estruturas queimarem até o chão. Personagens jogadores (e personagens do mestre importantes) sofrem imediatamente 1d8 pontos de dano de fogo (ignora Armadura) e devem passar em um Teste de Rápido para extinguir as chamas em suas armaduras/roupas. Então eles devem escapar do incêndio com outro Teste de Rápido — falha inflige outro 1d8 de pontos de dano de fogo (ignora Armadura).",
      "Todo o material orgânico dentro da área de efeito pega fogo imediatamente, inclusive a pele de criaturas vivas. Qualquer combustível e todas as criaturas vivas exceto os personagens jogadores e personagens do mestre importantes são destruídos pelo inferno. Estes últimos sofrem 1d8 de dano de fogo por turno (ignora Armadura) até que apaguem as chamas de seus corpos com um sucesso em um Teste de [Rápido –5]. Ao fugir da área, todos inevitavelmente sofrem 1d8 de dano de fogo (ignora Armadura) e outro 1d8 a menos que passem em um Teste de Rápido.",
      "As energias ardentes pairam na área e podem incandescer quando menos se espera. Qualquer um viajando pela área de efeito deve rolar 1d10; caso tire 1 ele é atingido por um vento ardente que causa 1d8 de dano (ignora Armadura) e ateia fogo em suas roupas e armadura. Qualquer um que permaneça na área rola 1d10 a cada dia com o mesmo efeito."
    )
  },
  "Tidal Wave": {
    tradition: "Bruxaria",
    description: paragraph(
      "A água de um rio ou lago se afasta da costa e forma uma onda esmagadora que varre a terra, devastando estruturas e criaturas.",
      "O casco de um caranguejo eremita, sem rachaduras e perfeitamente simétrico.",
      "A onda gigante devasta toda a área de efeito, mas perde poder pois a água não tem mais de um metro de profundidade. Todos os objetos menores sofrem a força total da onda e são varridos a menos que estejam presos com segurança; criaturas vivas também correm o risco de serem derrubadas e varridas pela força da correnteza — que afeta automaticamente um décimo de todos na área. Personagens jogadores (e personagens do mestre importantes) sofrem imediatamente 1d8 pontos de dano de esmagamento (ignora Armadura) e devem passar em um Teste de Vigoroso para evitarem cair — caso falhem, eles são levados pela correnteza e sofrem 1d10 de dano de esmagamento (ignora Armadura) ao caírem na água.",
      "A onda avança sobre a costa, com vários metros de altura, esmagando tudo em seu caminho. Mesmo as estruturas de pedra mais resistentes desabam, parcial ou completamente, e todas as criaturas vivas são levadas pela correnteza. Personagens jogadores (e personagens do mestre importantes) têm uma chance de sobreviver ao escalar algo sólido, como uma árvore grande ou bloco ancorado na terra — mas é necessário um Teste de Rápido seguido por um Teste de Vigoroso para que se segurem e prendam a respiração. Caso sejam bem-sucedidos, eles sofrem apenas 2d8 de dano de esmagamento (ignora Armadura) de objetos lhes atingindo. Caso falhem, o dano suportado é 4d8 (ignora Armadura) e os personagens são varridos pela água.",
      "A energia cinética paira na área e ondas menores podem aparecer sem aviso. Qualquer grupo ou pessoa perto da costa deve rolar 1d10; caso alguém role um 1, todos são atingidos por uma onda que causa 1d8 de dano (ignora Armadura) e afunda todas as embarcações ancoradas ou encalhadas lá."
    )
  },
  "Summon Daemon Court": {
    tradition: "Feitiçaria",
    description: paragraph(
      "O Além-mundo e o mundo dos vivos se mesclam quando a corte inteira de um príncipe daemon é convocada na área de efeito da cerimônia que, neste caso, envolve o círculo cerimonial.",
      "Um ou vários crânios de pessoas outrora amadas pelo Oficiante.",
      "Uma parte do Além-mundo se materializa e substitui a natureza comum da área. Todos na área (exceto o Oficiante) são afetados como se estivessem no Além-mundo (veja a página 41). A corte permanece no mundo dos vivos por um único dia, não importando quantos crânios foram usados como foco cerimonial.",
      "Como o efeito parcial, exceto que todos que participaram da cerimônia são protegidos da corrupção do lugar; eles também têm os daemones para protegê-los de invasores em potencial.<br /><br />A corte permanece no mundo por uma quantidade de dias igual à quantidade de crânios usados como foco cerimonial. Durante este tempo, o Oficiante pode pedir um favor por dia ao Príncipe Daemon. Caso o favor envolva um participante da cerimônia fazendo um pacto com o príncipe, a resposta é sempre sim; favores de naturezas diferentes podem ser concedidos caso o Oficiante passe em um Teste de [Resoluto –8]. Caso o favor seja negado, o Oficiante pode pedir o mesmo favor no próximo dia, desde que existam dias restantes. O Príncipe Daemon nunca concede um favor que necessite que ele saia de seu trono.",
      "A cada ano a área temporariamente se transforma em Natureza Corrompida (veja a página 70 no Códice de Monstros de Symbaroum) durante os dias em que a corte daemon esteve lá. No meio da natureza maculada, onde o trono do Príncipe Daemon outrora esteve, há um portal para o Além-mundo."
    )
  },
  "Insect Swarm": {
    tradition: "Bruxaria",
    description: paragraph(
      "O Oficiante atrai todos os insetos voadores existentes no alcance de um dia de marcha e os reúne em uma nuvem barulhenta sobre o lugar onde a cerimônia é executada. As energias corrompem as criaturas aladas e as doenças carregadas por algumas se espalham para todas. O enorme enxame que é finalmente direcionado para as vítimas indefesas na área alvejada é perigoso o bastante por si só, com ferrões venenosos e milhares de mandíbulas vorazes, mas também espalha a corrupção além de doenças mortais.",
      "Uma gema do tamanho de um olho humano, cortada para lembrar o olho multifacetado de uma mosca.",
      "Metade do enxame se dispersa durante o trajeto até a área alvejada, onde então se separa em vários enxames menores. Criaturas presentes podem tentar lutar com cada enxame individual, mas todos que os encaram em combate corpo a corpo são expostos a uma Doença Forte (veja o Códice de Monstros, página 169) ou alguma outra moléstia potencialmente letal. Além disso, o efeito corruptivo transforma 1d6 vítimas em nascidos da mácula, enquanto a doença Forte se instala na área afetada.",
      "O enxame inteiro alcança seu alvo, zumbindo e estalando conforme ataca todas as criaturas vivas. A única forma de permanecer vivo é se esconder em um lugar com paredes/portas grossas e sem a menor rachadura ou abertura de ar. Personagens (e personagens do mestre importantes) presentes na área afetada podem rolar um Teste de [Astuto –5] para se protegerem; caso o Teste falhe, o enxame rasga a carne dos ossos e, caso seja um sucesso, eles ainda são atacados pelo enxame, mas por um intervalo de tempo mais curto, sofrendo 1d6 de dano, 1d4 de corrupção temporária e expondo-se a uma doença Forte.",
      "O enxame se divide, mas permanece na área como colônias de abominações aladas. Todas as criaturas vivas se movendo pelo terreno devem passar em um Teste de Discreto uma vez por dia ou atrair 1d4 enxames com as estatísticas especificadas abaixo."
    )
  },
  "Earthquake": {
    tradition: "Magismo",
    description: paragraph(
      "O poder da cerimônia parte a terra, destrói estruturas e abre fissuras no chão. Os seres vivos apanhados pelo violento terremoto seriam muito sortudas se conseguissem sobreviver a este pesadelo.",
      "Um pedaço de rocha-mãe do tamanho de um punho.",
      "O solo treme e sacode tão violentamente que estruturas de madeira, barro ou similares inevitavelmente desabam; o mesmo ocorre em estruturas de pedra (o Mestre de Jogo decide ou rola 1d6 por estrutura, onde um resultado de 1 significa desabamento). Rachaduras menores se abrem no chão, apenas para fechar quando o terremoto acaba; qualquer um pego na rachadura fica muito ferido e preso até que outros o escavem. Personagens jogadores (e personagens do mestre importantes) devem passar em um Teste de Rápido para evitarem tropeçar em uma rachadura ou ficarem presos por rochas e árvores caindo. Falha significa que eles sofrem 1d10 de dano (ignora Armadura).",
      "O solo se eleva vários metros no ar, derrubando árvores e abrindo feridas profundas no solo por toda a área de efeito. Todas as estruturas desabam e quase todos na área serão mortos pelas árvores ou pedras caindo, ou ao cair para a morte dentro do abismo. Personagens jogadores (e personagens do mestre importantes) devem passar em um Teste de [Rápido –5] para evitar as fissuras ou materiais de estruturas em queda. Caso falhem, são esmagados até a morte.",
      "A terra na área continua se movendo. Quaisquer grupos ou pessoas passando por ali devem rolar 1d10; um resultado 1 significa que uma série de 1d6 terremotos ocorrem, cada um com o mesmo efeito que o ritual Tremor (veja a página 95 do Guia Avançado do Jogador)."
    )
  },
  "Lava Lake": {
    tradition: "Magismo",
    description: paragraph(
      "Rachaduras se abrem no solo, até o núcleo líquido da terra, trazendo fumaça devastadoramente quente e lava para a superfície. Qualquer um que não consiga fugir sofre uma morte terrível.",
      "Uma lasca de obsidiana do coração de um vulcão adormecido.",
      "Fissuras abissais se abrem no solo dentro da área de efeito e uma fumaça quente e venenosa flui das profundezas. Um décimo das pessoas na área são mortas antes de terem tempo de fugir. Personagens jogadores (e personagens do mestre importantes) inevitavelmente sofrem 1d8 de dano do calor (ignora Armadura) e devem passar em um Teste de Vigoroso para não serem afetados por um veneno Forte (dano 4 por 4 turnos). Então a lava vem borbulhando, cobrindo o chão e destruindo tudo na área.",
      "A lava brota junto com a fumaça, apenas momentos depois das fendas se abrirem. Quase ninguém pode escapar, mas personagens jogadores (e personagens do mestre importantes) podem ser capazes de fazê-lo: com sucesso em um Teste de Vigoroso, eles evitam serem envenenados pela fumaça (veja acima); caso os personagens também passem em um Teste contra [Rápido –5] eles são atingidos apenas por um respingo de lava que causa 1d12 de dano (ignora Armadura). Os que falharem no último Teste encontram seu fim no lago de lava que continua a preencher a área de efeito.",
      "Nenhum, fora o terreno se transformar em uma planície de lava solidificada e resfriada."
    )
  },
  "Mass Curse": {
    tradition: "Bruxaria",
    description: paragraph(
      "Uma aldeia ou assentamento que irritar o praticante de bruxaria errado poderá em breve enfrentar um destino terrível que, a longo prazo, pode comprometer as vidas de todos os seus habitantes, ou pelo menos tornar as vidas deles insuportavelmente difíceis.",
      "A coluna de um anfíbio.",
      "A cerimônia possui o mesmo efeito que o ritual Tormento (veja a página 95 do Guia Avançado do Jogador) e todos na área sofrem o efeito desejado. A diferença é que a cerimônia não requer um elo místico com as vítimas e o efeito não pode ser cancelado por Quebrar Vínculo — o Oficiante deve morrer para isto acontecer.",
      "Como o efeito parcial, mas o Oficiante pode controlar quem dentro da área sofre ou não o efeito.",
      "Nenhum."
    )
  },
  "Mass Healing": {
    tradition: "Teurgia",
    description: paragraph(
      "O mundo sob os céus de Prios é cheio de poder, e servos fiéis do Deus Sol podem canalizar esta energia para cuidar dos feridos e dos enfermos — curando seus ferimentos e purificando seus corpos.",
      "Um símbolo do sol santificado.",
      "Todas as criaturas vivas dentro da área de efeito (exceto Abominações ou Mortos-Vivos) recuperam imediatamente 5d6 de Vitalidade e são curadas de todos os venenos e doenças.",
      "Como o efeito parcial, mas o Oficiante pode sentir a aura ao redor de cada indivíduo na área e, desta forma, ter completo controle sobre quem será ou não abençoado pelo presente de Prios.",
      "Nenhum, mas A Vida Acaba é um efeito colateral comum."
    )
  },
  "Mass Resurrection": {
    tradition: "Feitiçaria",
    description: paragraph(
      "Místicos sombrios sempre preferiram escravos mortos-vivos em vez de seguidores vivos, cuja lealdade pode fraquejar e cujos corpos precisam de alimentação. A cerimônia Ressurreição em Massa foca suas energias em campos de batalha inteiros com o propósito de erguer, de uma só vez, um exército de Dragouls, vinculados à vontade do Oficiante — parte do motivo de ter se tornado um costume reunir e queimar os mortos depois de cada batalha.",
      "Um sacrifício na forma de um ser cultural, cujo coração é lentamente incinerado no processo.",
      "Todos os cadáveres no campo de batalha são reanimados (estatísticas de um Dragoul, página 230 do Livro Básico), mas o Oficiante controla apenas metade deles e deve direcioná-los na batalha contra os outros. Quando a poeira se assenta, o exército tem apenas um terço do tamanho que poderia ter tido — provavelmente não sendo grande o bastante para alcançar o objetivo da cerimônia (veja abaixo).",
      "O Oficiante reanima e toma controle de todos os cadáveres no campo de batalha, criando um exército grande o bastante para alcançar o objetivo da cerimônia. Isto poderia incluir atacar uma fortaleza, destruir uma aldeia, defender a fortaleza do próprio místico ou encarar outra força hostil no campo de batalha.",
      "Nenhum, mas os efeitos colaterais Fuga da Morte e Os Mortos Despertam são bem comuns."
    )
  },
  "Monster Control": {
    tradition: "Feitiçaria",
    description: paragraph(
      "Uma criatura imensamente poderosa é arrancada de seu lar e instantaneamente realocada para a área de efeito através de um portal no tempo e no espaço, e agora está sob o controle absoluto do oficiante. Pelo menos inicialmente...",
      "Uma garra, dente ou fragmento similar do corpo do mesmo tipo de criatura que está para ser convocada.",
      "A cerimônia é bem-sucedida e um monstro com estatísticas que correspondem à resistência Poderosa é convocado para a área de efeito. O Oficiante possui controle completo sobre as ações da criatura, mas apenas por 10 turnos — depois dos quais o monstro recupera o controle. O Mestre de Jogo decide o que o monstro faz em seguida, mas no primeiro turno depois do despertar, ele provavelmente estará confuso demais para agir.",
      "A cerimônia convoca uma besta gigante com estatísticas equivalentes à resistência Lendária (veja a página 99 deste livro). O Oficiante possui controle completo sobre as ações da criatura por um dia, após o qual o Oficiante faz um Teste contra o Resoluto do monstro [Resoluto←Resoluto] a cada dia para ver se o controle é mantido. Quando o Oficiante perde o controle, o monstro não têm memória do que ocorreu.",
      "O monstro sofre 1d8 de corrupção temporária ao ser convocado. Caso ele fique completamente corrompido por isso, o controle é imediatamente rompido e a criatura se transforma em uma abominação, com tudo o que isso significa em termos de novos traços e fome insaciável. Pior ainda: o monstro é tomado pela sede de vingança e reconhece instintivamente a assinatura mística do Oficiante que o convocou — ele pode sentir a direção e distância do místico sempre que aquela pessoa usa habilidades/rituais místicos."
    )
  },
  "Daemonic Tunnel": {
    tradition: "Feitiçaria",
    description: paragraph(
      "A cerimônia escava um túnel através do Além-mundo e cria um atalho entre dois lugares no mundo dos vivos. O túnel vai do local da cerimônia até qualquer lugar no mundo regular onde o foco cerimonial tenha sido colocado. Criaturas que fiquem paradas no círculo cerimonial podem atravessar o túnel e, desta forma, ignorar a distância e obstáculos físicos no mundo regular.",
      "Um cilindro de cristal feito de areia do Além-mundo.",
      "O portal desaba antes do esperado e apenas metade das criaturas dentro do túnel conseguem atravessar (veja Efeito Completo). Os que não conseguem sair a tempo são jogados no Além-mundo.",
      "O portal é amplo o suficiente para quatro criaturas de tamanho humano marchando ombro a ombro e dura tempo o bastante para oito fileiras de criaturas de tamanho humano passarem através dele. Apenas duas criaturas com o traço Robusto III podem passar lado a lado e apenas quatro fileiras conseguirão atravessar a tempo. Quanto a criaturas com o traço Colossal, apenas dois indivíduos podem se espremer pelo túnel antes que ele desabe.",
      "Às vezes o túnel emerge espontaneamente como resultado de um eco mágico, sugando criaturas de um lado e cuspindo-as de outro. Isto pode acontecer uma vez por dia, afetando todos dentro da linha de visão do lugar onde o túnel começa ou termina, em uma rolagem de 1 em 1d20. Todos na zona de perigo devem passar em um Teste de [Vigoroso –5] para evitarem ser sugados; o traço Robusto adiciona +2 por nível e o traço Colossal nega inteiramente o efeito. Também há uma chance de 1 em 1d10 do túnel desabar tão rapidamente que todos sugados por ele sejam jogados no Além-mundo."
    )
  },
  "Pest Wind": {
    tradition: "Feitiçaria",
    description: paragraph(
      "Patógenos dormentes e insetos portadores de doenças se unem em um vento rodopiante que varre a área de efeito como uma névoa escura e barulhenta.",
      "Um pedaço de carne de uma criatura cultural assolada por uma doença Forte.",
      "Todos na área são expostos a uma doença Forte (veja o Códice de Monstros de Symbaroum, página 169).",
      "Como o efeito parcial, com a adição da doença ser particularmente virulenta: todos os Testes para contrair e se recuperar da doença são feitos contra [Vigoroso –5]. Além disso, o avanço da doença é bem agressivo. Imediatamente depois de contraí-la, o afligido experimentará vômitos, câimbras, diarreia ou outros sintomas que impedem a pessoa de fazer qualquer coisa que não sejam ações reativas enquanto durar a moléstia.",
      "A doença fica dormente na área, aguardando para se espalhar. Qualquer um que se aventure lá deve rolar 1d10; caso role 1, a pessoa é exposta a uma doença Forte, seja transmitida pelo ar ou através de contato físico."
    )
  },
  "Rage": {
    tradition: "Magismo",
    description: paragraph(
      "Uma fúria cega consome todas as criaturas vivas, enviando-as em um frenesi sanguinário e compelindo-as a atacar tudo e todos ao redor com intento assassino.",
      "Um pedaço de carvão, que começa a ficar cada vez mais quente durante a cerimônia.",
      "A fúria afeta todos e permanece incontrolável por um turno. Depois disso, metade das criaturas dentro da área conseguem controlar sua raiva e saem do frenesi. Personagens jogadores (e personagens do mestre importantes) fazem um Teste de Resoluto no começo do segundo turno depois que o efeito ocorre — um sucesso cancela imediatamente o efeito. Eles devem, então, tentar lidar com os que não conseguiram, que permanecem enfurecidos até o fim da cena.",
      "Como o efeito parcial, mas a fúria é muito mais difícil de se sobrepujar. Isso só é possível depois de três turnos e apenas um décimo das criaturas na área obtém sucesso. Personagens jogadores (e personagens do mestre importantes) fazem um Teste contra [Resoluto –5] no começo do quarto turno depois que o efeito ocorre para controlar sua raiva.",
      "Nenhum."
    )
  },
  "Create Corrupted Nature": {
    tradition: "Feitiçaria",
    description: paragraph(
      "Uma área é encharcada em energias corruptivas, a ponto de ficar permanentemente danificada e escurecida. O fenômeno é como o descrito no Códice de Monstros de Symbaroum, na página 70.",
      "Um punhado de sementes de plantas corrompidas.",
      "A área é corrompida, mas de forma fora do controle do Oficiante. Consulte as tabelas na página 73 do Códice de Monstros de Symbaroum para determinar quais e quantos efeitos ocorrem.",
      "O Oficiante pode decidir de qual forma a área afetada é corrompida, escolhendo até seis efeitos da Tabela 3: Perigos na Natureza Corrupta na página 73 do Códice de Monstros de Symbaroum.",
      "A vingança caprichosa da natureza faz metade dos efeitos (arredondados para cima) ocorrerem ao redor do círculo cerimonial em vez de na área pretendida."
    )
  },
  "Starfall": {
    tradition: "Magismo",
    description: paragraph(
      "O Oficiante convoca rochas ardentes do céu e as arremessa em uma área específica. As pessoas que não são atingidas diretamente podem ser mortas pela onda de choque ou outro efeito colateral que segue os pedregulhos.",
      "Um fragmento de meteorito, pelo menos do tamanho de um punho.",
      "Uma chuva espalhada de dez rochas menores cai sobre a área afetada. Um décimo de todas as criaturas presentes no momento perecem de acertos diretos ou do efeito ardente na área; o resto tem chances de sobreviver. Personagens (e personagens do mestre importantes) situados na área podem rolar um Teste de Rápido — caso falhem, são mortos instantaneamente; caso obtenham sucesso, eles sofrem 2d6 de dano de esmagamento (armadura protege normalmente).",
      "Um pedregulho do tamanho de um ogro e um grande número de rochas menores cai no centro da área afetada. Estruturas próximas são destruídas, danificadas ou incendiadas e metade de todas as criaturas na área perecem imediatamente. Personagens (e personagens do mestre importantes) situados na área podem rolar um Teste de [Rápido –5] — caso falhem, são mortos instantaneamente; caso obtenham sucesso, eles sofrem 2d6 de dano de esmagamento (armadura protege normalmente).",
      "O impacto das rochas caindo agita as forças elementais e gera espíritos do fogo que imediatamente tentam possuir as criaturas sobreviventes na área. Os vivos devem passar em um Teste de Resoluto ou seus corpos são tomados por destrutivos elementais do fogo. Estas criaturas assumem os atributos de seus hospedeiros, com as adições apontadas abaixo e atacam todo o objeto potencialmente inflamável ao redor — estruturas, plantas e criaturas vestindo roupas. Caso o corpo hospedeiro fique inconsciente ou seja atingido por muita água (pelo menos cinco litros em um turno), o espírito é banido e deixa de existir; o mesmo acontece se o corpo hospedeiro morrer."
    )
  },
  "Resurrect": {
    tradition: "Teurgia",
    description: paragraph(
      "Uma criatura morta ou morta-viva (não abominação) é trazida de volta dos mortos e fica completamente viva mais uma vez, com ou sem efeitos colaterais...",
      "Um elo pessoal (um frasco de sangue, um tufo de cabelo ou um item adorado) de um indivíduo que signifique muito para o falecido; pode ser um descendente, um amante ou um parente próximo.",
      "A pessoa morta volta à vida, mas com a corrupção permanente ainda persistindo dentro dela [Limiar de Corrupção –1] e com grandes lacunas na memória — metade das habilidades da pessoa são esquecidas (o Mestre de Jogo escolhe quais ou deixa o acaso decidir). O indivíduo ressuscitado também é mais frágil que antes: 1d10 é rolado a cada vez que o Limiar de Dor é excedido; caso role 1, o indivíduo ressuscitado morre imediatamente.",
      "O falecido retorna à vida e é essencialmente o mesmo que era no momento da morte, só que perfeitamente saudável e sem ferimentos. Mas a fragilidade da carne não pode ser evitada: 1d10 é rolado a cada vez que o Limiar de Dor é excedido; caso role 1, o indivíduo ressuscitado morre imediatamente.",
      "Erguer os mortos é, obviamente, um ato de imensa violência contra a Criação e pode, por isso, ter repercussões maiores do que outras cerimônias. A quantidade de corrupção infligida nos participantes da cerimônia é dobrada, de 5d6 para 10d6. A forma de distribuição destes pontos é calculada da forma normal."
    )
  }
};

function locateItemObjects(text) {
  const found = new Map();
  let index = 0;
  const whitespace = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function string() {
    const start = index++;
    while (index < text.length) {
      if (text[index] === "\\") index += 2;
      else if (text[index++] === '"') return JSON.parse(text.slice(start, index));
    }
    throw new Error("Unterminated string.");
  }
  function value(path) {
    whitespace();
    const start = index;
    const token = text[index];
    if (token === "{") object(path);
    else if (token === "[") array(path);
    else if (token === '"') string();
    else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1;
    if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "items") {
      found.set(path[3], { start, end: index });
    }
  }
  function object(path) {
    index += 1; whitespace();
    if (text[index] === "}") { index += 1; return; }
    while (index < text.length) {
      const key = string(); whitespace();
      if (text[index++] !== ":") throw new Error("Expected colon.");
      value([...path, key]); whitespace();
      if (text[index] === "}") { index += 1; return; }
      if (text[index++] !== ",") throw new Error("Expected comma.");
      whitespace();
    }
  }
  function array(path) {
    index += 1; whitespace();
    if (text[index] === "]") { index += 1; return; }
    let child = 0;
    while (index < text.length) {
      value([...path, child++]); whitespace();
      if (text[index] === "]") { index += 1; return; }
      if (text[index++] !== ",") throw new Error("Expected comma.");
      whitespace();
    }
  }
  value([]); whitespace();
  if (index !== text.length) throw new Error("Trailing content.");
  return found;
}

const beforeKeys = Object.keys(items);
for (const [key, fields] of Object.entries(ceremonies)) {
  if (!items[key]) throw new Error(`Missing item '${key}'.`);
  Object.assign(items[key], fields);
}
if (JSON.stringify(Object.keys(items)) !== JSON.stringify(beforeKeys)) throw new Error("Item keys changed.");

const locations = locateItemObjects(source);
const replacements = Object.keys(ceremonies).map((key) => ({ ...locations.get(key), value: items[key] }));
if (replacements.some((entry) => entry.start == null)) throw new Error("Could not locate every ceremony item.");
const eol = source.includes("\r\n") ? "\r\n" : "\n";
let output = source;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  const lineStart = source.lastIndexOf("\n", replacement.start - 1) + 1;
  const indent = source.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
  const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`);
  output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end);
}

const reparsed = JSON.parse(output).entries?.[ENTRY];
if (!reparsed || JSON.stringify(reparsed.items) !== JSON.stringify(items)) throw new Error("Serialized item data mismatch.");
if (!checkOnly && output !== source) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: output !== source, ceremoniesChanged: Object.keys(ceremonies).length }, null, 2));
