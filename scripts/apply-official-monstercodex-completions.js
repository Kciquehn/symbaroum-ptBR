const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const ENTRY = "Symbaroum Monster Codex";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const entry = data.entries?.[ENTRY];
if (!entry?.actors || !entry?.items) throw new Error(`Missing '${ENTRY}' data.`);

const actorNames = {
  "Blight Worm": "Verme Maculado",
  "Chasm Stag": "Besouro do Abismo",
  "Intruder Daemon": "Daemon Intruso",
  "The Black Plague Termites": "Cupins da Peste Negra",
  "The Wily": "Matreiro",
  "Cave Ray": "Arraia das Cavernas",
  "Drilling Leech": "Sanguessuga Perfuradora",
  "Hammer Eel": "Enguia Martelo",
  "Nipper": "Beliscador",
  "Guard Dog": "Cão de Guarda",
  "Horse": "Cavalo",
  "Horse, battle-trained": "Cavalo de Batalha",
  "Moose": "Alce",
  "Rock Buck": "Bode das Rochas",
  "Brimstone Oak": "Carvalho-Enxofre",
  "Killer Shrub": "Arbusto Assassino",
  "Beamon": "Urstro",
  "Blood Cat": "Felino Sangrento",
  "Fey Beast": "Besta Feérica",
  "Hunger Wolf": "Lobo Faminto",
  "Jakaar, Battle-trained": "Jakaar de Batalha",
  "Jakaar, Wild": "Jakaar Selvagem",
  "Mosey Munk": "Urso Fétido",
  "Stone Boar": "Javali Rochoso",
  "Fray Spider": "Aranha Peluda",
  "Hunting Spider": "Aranha Caçadora",
  "Spider Queen": "Aranha Rainha",
  "Crypt Lord": "Lorde da Cripta",
  "Lostling": "Perdido",
  "Snow Wraith": "Aparição da Neve",
  "Wraith": "Aparição",
  "Blaze Bug": "Besouro Brilhante",
  "Crystal Flies": "Moscas de Cristal",
  "Hornet": "Vespa",
  "Wraith Owl": "Coruja Espectral"
};

const embeddedNames = {
  "Blight Worm": {
    "Exceptionally Accurate": "Excepcionalmente Preciso",
    "Snake Scales": "Escamas ofídicas"
  },
  "Chasm Stag": { "Shell": "Carapaça" },
  "Intruder Daemon": { "Tough Daemon Hide": "Couro Grosso de Daemon" },
  "The Black Plague Termites": {
    "Chitin Shell": "Carapaça de quitina",
    "Mandibles": "Mandíbulas"
  },
  "Drilling Leech": { "Slimy Skin": "Pele viscosa" },
  "Hammer Eel": { "Swimmer": "Nadador", "Scaly Skin": "Pele escamosa" },
  "Nipper": { "Chitin Shields": "Escudos de quitina" },
  "Skullan": {
    "Bite (Paralyzing Venom)": "Mordida (Veneno Paralisante)",
    "Warty Skin": "Pele verruguenta"
  },
  "Darak": { "Robust Hide": "Couro robusto", "Horns": "Chifres" },
  "Moose": { "Horns": "Chifres", "Robust Hide": "Couro robusto" },
  "Orahaug": { "Tough Skin": "Pele grossa" },
  "Rock Buck": { "Thick Hide": "Couro grosso", "Horns": "Chifres" },
  "Brimstone Oak": {
    "Harmful Aura": "Aura Nociva",
    "Bark": "Casca",
    "Flaying Branches": "Ramos esfoladores"
  },
  "Kelder": {
    "Bloodlust": "Sede de Sangue",
    "Mycelial threads (piercing 4)": "Fios de micélio (penetrante: 4)",
    "Tough Bark": "Casca grossa"
  },
  "Killer Shrub": { "Bark": "Casca", "Thorny Branches": "Galhos espinhosos" },
  "Beamon": { "Thick Fur": "Pelagem espessa", "Paws": "Patas" },
  "Blood Cat": { "Bloodlust": "Sede de Sangue", "Tough Skin": "Pele resistente" },
  "Kotka": { "Thick Hide": "Couro grosso" },
  "Mosey Munk": {
    "Harmful Aura (Acidic)": "Aura Nociva (ácida)",
    "Thick Fur": "Pelagem espessa"
  },
  "Stone Boar": { "Robust Hide": "Couro robusto", "Head butt": "Cabeçada" },
  "Vearon": { "Lizard Scales": "Escamas de lagarto" },
  "Fray Spider": { "Chitin Shields": "Carapaça de quitina" },
  "Spider Queen": { "Carapace Plates": "Placas de carapaça" },
  "Crypt Lord": { "Mummified Skin": "Pele Mumificada" },
  "Lostling": { "Sweeping attack": "Ataque amplo" },
  "Snow Wraith": { "Ice Nails": "Unhas de gelo", "Frozen Skin": "Pele congelada" },
  "Blaze Bug": { "Deadly Breath (Lightning)": "Sopro Mortal (relâmpago)", "Shell": "Concha" },
  "Crystal Flies": { "Strangling": "Estrangulamento" },
  "Hornet": { "Sting (piercing 4)": "Ferrão (perfurante 4)" },
  "Raskaal": {
    "Bloodlust": "Sede de Sangue",
    "Grappling Claws": "Garras preênseis",
    "Rough Skin": "Pele áspera"
  },
  "Wraith Owl": { "Robust Feathers": "Penas robustas", "Talons": "Garras" }
};

const actorFields = {
  "Arach, Exalted": {
    background: "<p>Os predatórios aracs compreendem os restos mortais dos súditos do Rei Aranha, sobreviventes do reino que foi finalmente esmagado pelos primeiros Altos Chefes de Karvosti. A existência dos aracs está intimamente ligada ao Rei Aranha e era comumente assumido que eles haviam sido destruídos junto com seu governante. No entanto, nos últimos anos tem havido relatos de grupos de exploradores mais ou menos confiáveis afirmando que os aracs ainda vivem e atuam nas partes mais profundas da Davokar. Alguns dizem ter encontrado grupos de caça aracs na floresta ou vasculhando artefatos em alguma ruína; outros testemunham que membros de seu grupo foram sequestrados, presumivelmente para serem usados como escravos ou comidos. De acordo com os rumores mais loucos, pirâmides habitadas foram encontradas, tão grandes quanto a de Serand, mas não mapeadas, afundadas e cobertas por uma densa floresta.</p><p>Esses relatórios e rumores esporádicos, mas que ocorrem com frequência, desencadearam especulações sobre o povo do Rei Aranha estar pronto para se levantar novamente. Uma lenda contada entre os clãs adverte exatamente sobre isso: que os aracs ressuscitarão seu monarca caído e lançarão uma nova guerra de conquista, espalhando medo e morte na Davokar. Mas tal desenvolvimento é altamente improvável. A maioria dos relatos de testemunhas oculares descreve os aracs como certamente perigosos, mas basicamente nada mais do que os lamentáveis restos de uma raça outrora gloriosa, agora vagando pela floresta como outras feras predadoras.</p>"
  },
  "Arach, Poisoner": {
    background: "<p>Os predatórios aracs compreendem os restos mortais dos súditos do Rei Aranha, sobreviventes do reino que foi finalmente esmagado pelos primeiros Altos Chefes de Karvosti. A existência dos aracs está intimamente ligada ao Rei Aranha e era comumente assumido que eles haviam sido destruídos junto com seu governante. No entanto, nos últimos anos tem havido relatos de grupos de exploradores mais ou menos confiáveis afirmando que os aracs ainda vivem e atuam nas partes mais profundas da Davokar. Alguns dizem ter encontrado grupos de caça aracs na floresta ou vasculhando artefatos em alguma ruína; outros testemunham que membros de seu grupo foram sequestrados, presumivelmente para serem usados como escravos ou comidos. De acordo com os rumores mais loucos, pirâmides habitadas foram encontradas, tão grandes quanto a de Serand, mas não mapeadas, afundadas e cobertas por uma densa floresta.</p><p>Esses relatórios e rumores esporádicos, mas que ocorrem com frequência, desencadearam especulações sobre o povo do Rei Aranha estar pronto para se levantar novamente. Uma lenda contada entre os clãs adverte exatamente sobre isso: que os aracs ressuscitarão seu monarca caído e lançarão uma nova guerra de conquista, espalhando medo e morte na Davokar. Mas tal desenvolvimento é altamente improvável. A maioria dos relatos de testemunhas oculares descreve os aracs como certamente perigosos, mas basicamente nada mais do que os lamentáveis restos de uma raça outrora gloriosa, agora vagando pela floresta como outras feras predadoras.</p>"
  },
  "Bestiaal, Clawing Fighter": {
    background: "<p>De acordo com seus próprios contos, a antiga raça de metamorfos que se autodenominam bestiaais começou como aliada dos humanos de Symbaroum, mas acabou se tornando seus escravos e inimigos. A julgar por alguns dos fragmentos de mosaicos encontrados em Odaban, supostamente contando sobre o cerco de Symbar, os bestiaais lutaram contra os humanos, ao lado dos elfos. Os estudiosos levaram muitos anos para perceber que as criaturas de múltiplas formas retratadas nos mosaicos eram da mesma raça, às vezes aladas, às vezes não; às vezes altas e robustas, outras vezes minúsculas e aparentemente inofensivas. A forma natural de um bestiaal — aquela que eles acordam todas as manhãs e assumem no momento da morte — é semelhante a um humano com feições bestiais, pelagem rala e uma cauda sem pelos. Por causa de sua habilidade de metamorfose, eles podem assumir uma variedade de formas e traços, ajustando-se assim às exigências da situação.</p><p>Após a queda de Symbaroum, os metamorfos se isolaram entre as Corvos. Ultimamente eles reapareceram em regiões ocupadas por humanos — primeiro em Vajvod, depois se espalhando para o oeste e sul. Sua agenda, se é que eles realmente têm uma em comum, é desconhecida. Os indivíduos encontrados na Davokar Iluminada e nos assentamentos e postos avançados da fronteira ambriana parecem agir sozinhos ou em pequenos grupos, como caçadores, ou mais precisamente: como predadores. De acordo com muitas histórias horríveis, nem mesmo os humanos estão a salvo de seus apetites.</p>"
  },
  "Bestiaal, Glint-Carrier": {
    background: "<p>De acordo com seus próprios contos, a antiga raça de metamorfos que se autodenominam bestiaais começou como aliada dos humanos de Symbaroum, mas acabou se tornando seus escravos e inimigos. A julgar por alguns dos fragmentos de mosaicos encontrados em Odaban, supostamente contando sobre o cerco de Symbar, os bestiaais lutaram contra os humanos, ao lado dos elfos. Os estudiosos levaram muitos anos para perceber que as criaturas de múltiplas formas retratadas nos mosaicos eram da mesma raça, às vezes aladas, às vezes não; às vezes altas e robustas, outras vezes minúsculas e aparentemente inofensivas. A forma natural de um bestiaal — aquela que eles acordam todas as manhãs e assumem no momento da morte — é semelhante a um humano com feições bestiais, pelagem rala e uma cauda sem pelos. Por causa de sua habilidade de metamorfose, eles podem assumir uma variedade de formas e traços, ajustando-se assim às exigências da situação.</p><p>Após a queda de Symbaroum, os metamorfos se isolaram entre as Corvos. Ultimamente eles reapareceram em regiões ocupadas por humanos — primeiro em Vajvod, depois se espalhando para o oeste e sul. Sua agenda, se é que eles realmente têm uma em comum, é desconhecida. Os indivíduos encontrados na Davokar Iluminada e nos assentamentos e postos avançados da fronteira ambriana parecem agir sozinhos ou em pequenos grupos, como caçadores, ou mais precisamente: como predadores. De acordo com muitas histórias horríveis, nem mesmo os humanos estão a salvo de seus apetites.</p>"
  },
  "Bestiaal, Winged Hunter": {
    background: "<p>De acordo com seus próprios contos, a antiga raça de metamorfos que se autodenominam bestiaais começou como aliada dos humanos de Symbaroum, mas acabou se tornando seus escravos e inimigos. A julgar por alguns dos fragmentos de mosaicos encontrados em Odaban, supostamente contando sobre o cerco de Symbar, os bestiaais lutaram contra os humanos, ao lado dos elfos. Os estudiosos levaram muitos anos para perceber que as criaturas de múltiplas formas retratadas nos mosaicos eram da mesma raça, às vezes aladas, às vezes não; às vezes altas e robustas, outras vezes minúsculas e aparentemente inofensivas. A forma natural de um bestiaal — aquela que eles acordam todas as manhãs e assumem no momento da morte — é semelhante a um humano com feições bestiais, pelagem rala e uma cauda sem pelos. Por causa de sua habilidade de metamorfose, eles podem assumir uma variedade de formas e traços, ajustando-se assim às exigências da situação.</p><p>Após a queda de Symbaroum, os metamorfos se isolaram entre as Corvos. Ultimamente eles reapareceram em regiões ocupadas por humanos — primeiro em Vajvod, depois se espalhando para o oeste e sul. Sua agenda, se é que eles realmente têm uma em comum, é desconhecida. Os indivíduos encontrados na Davokar Iluminada e nos assentamentos e postos avançados da fronteira ambriana parecem agir sozinhos ou em pequenos grupos, como caçadores, ou mais precisamente: como predadores. De acordo com muitas histórias horríveis, nem mesmo os humanos estão a salvo de seus apetites.</p>"
  },
  "Coloss": {
    background: "<p>A cerimônia mística utilizada pelas bruxas nesse contexto é um segredo bem preservado, conhecido apenas pelas mais experientes entre eles — as Huldra, os Guardiões dos clãs e seus iguais. Ao falar com forasteiros, os iniciados afirmam que os colossos vieram com o Pacto de Ferro do oeste, por isso eles tendem a usar o nome élfico para a criatura, eliend, tanto quanto dizem colosso.</p><p>O ato de criação começa com uma bruxa que se equilibra à beira de se tornar nascida da mácula, e que voluntariamente concorda em ser sacrificada para continuar lutando. Durante a cerimônia que transforma a bruxa em um híbrido de carne e madeira, o sujeito é limpo de toda corrupção e despojado de memórias e vontade. Tudo o que resta é a fome indisciplinada do colosso e um desejo de servir a bruxa a quem o ritual o vincula.</p><p>Isso também explica por que os espécimes selvagens são tão raros. Colossos solitários são sempre o resultado de sua bruxa ser morta ou impedida de cuidar de sua criação. Tais indivíduos são instintivamente atraídos para lugares onde animais ou seres culturais se reúnem, com o objetivo de encontrar um novo mestre, digno de sua lealdade e assistência. Frequentemente, eles permanecem em uma área por um longo período de tempo e, se não receberem ajuda para satisfazer sua fome de carne fresca, mais cedo ou mais tarde atacarão — para se alimentar antes de viajarem para algum outro lugar.</p>"
  },
  "Darkling, Hunter": {
    background: "<p>Os poucos relatos que falam dessas criaturas são consistentes em algumas questões, sejam eles provenientes de supostos encontros ou conversas com conhecedores bárbaros. Os Sombrianos não parecem discriminar entre os seres culturais e as feras selvagens, o que significa que os humanos, assim como os elfos e os trolls, são contados entre suas presas. Além disso, sua característica mais estranha e marcante é a resistência à influência mística — característica que algumas bruxas afirmam ter a ver com elas, por tradição e necessidade, vivendo em total harmonia com Wyrtha, sem tentar cultivar, refinar ou manipular a natureza.</p><p>Como consequência, os Sombrianos são caçadores-coletores genuínos, e sua caça ocorre tanto na floresta quanto no Submundo. Eles usam armas simples, como arcos, lanças e armadilhas, muitas vezes sem metal, dando-lhes a qualidade Contundente. No entanto, os líderes às vezes têm pontas de ferro do pântano ou armas herdadas de presas mortas.</p>"
  },
  "Darkling, Leader": {
    background: "<p>Os poucos relatos que falam dessas criaturas são consistentes em algumas questões, sejam eles provenientes de supostos encontros ou conversas com conhecedores bárbaros. Os Sombrianos não parecem discriminar entre os seres culturais e as feras selvagens, o que significa que os humanos, assim como os elfos e os trolls, são contados entre suas presas. Além disso, sua característica mais estranha e marcante é a resistência à influência mística — característica que algumas bruxas afirmam ter a ver com elas, por tradição e necessidade, vivendo em total harmonia com Wyrtha, sem tentar cultivar, refinar ou manipular a natureza.</p><p>Como consequência, os Sombrianos são caçadores-coletores genuínos, e sua caça ocorre tanto na floresta quanto no Submundo. Eles usam armas simples, como arcos, lanças e armadilhas, muitas vezes sem metal, dando-lhes a qualidade Contundente. No entanto, os líderes às vezes têm pontas de ferro do pântano ou armas herdadas de presas mortas.</p>"
  },
  "Death Prince": {
    background: "<p>O lorde da morte é incapaz de ferir seu mestre, mas se ele ou ela morrer de outra coisa, o morto-vivo é libertado das correntes da servidão. Esses senhores da morte livres são geralmente chamados de Príncipes da Morte e são muito raros, o que é uma sorte, pois só podem ser descritos como particularmente aterrorizantes. A libertação do príncipe da morte desbloqueia as energias sombrias que estavam presas no ritual que o criou; o poder está então sob o controle do príncipe, para ser usado contra qualquer um que o desagrade.</p><p>Uma vez livre, o príncipe da morte também desenvolve uma fome feroz de poder, possivelmente como uma reação à escravidão que sofreu enquanto seu mestre ainda vivia. Eles são normalmente atraídos para lugares onde há humanos ou bestas para subjugar, onde eles podem se coroar soberanos e começar a espalhar seu terror sombrio. Mas também há histórias sobre príncipes da morte que, após serem libertados, traçaram suas memórias até lugares que já foram importantes para eles, antes de sua morte e subsequente reanimação. O ciúme ardente que surge sempre que o príncipe da morte descobre que outras pessoas colocaram as mãos em sua propriedade ceifou muitas vidas em Ambria, Davokar e na outrora grande Alberetor — vidas que muitas vezes são reanimadas e recrutadas à força para o crescente exército do príncipe da morte.</p>"
  },
  "Dragon": {
    background: "<p>De acordo com a maioria das autoridades em Ambria, os dragões são coisa do passado e muitos duvidam que tais criaturas tenham existido. Os poucos que discordam simplesmente se recusam a concordar com a grande maioria ou se referem a fontes obscuras — conversas com antigos arquitrolls, exames de fragmentos de ossos desenterrados ou escrituras recuperadas de ruínas decadentes, preferencialmente esculpidas em tipos ambíguos de escrita cuneiforme. No entanto, neste caso, como em muitos outros, a maioria está errada e os supostos maníacos certos.</p><p>Na verdade, chegou a ocorrer que um dragão foi dissecado no Vivissectório em Yndaros, ainda no inverno do Ano 19, embora em seu estágio larval — o estágio que tanto em Ambria quanto na Davokar nomeiam como Linnorme. Nem mesmo os próprios linnormes sabem por que nenhum deles evoluiu para estágios de vida superiores nas últimas centenas de anos, assim como nenhum deles pode explicar por que isso começou a acontecer novamente. Supostamente, o primeiro tinha a ver com a queda de Symbaroum e a intervenção do Pacto de Ferro; provavelmente, o último desenvolvimento está conectado ao escurecimento acelerado da Davokar.</p>"
  },
  "Drakworm": {
    background: "<p>De acordo com a maioria das autoridades em Ambria, os dragões são coisa do passado e muitos duvidam que tais criaturas tenham existido. Os poucos que discordam simplesmente se recusam a concordar com a grande maioria ou se referem a fontes obscuras — conversas com antigos arquitrolls, exames de fragmentos de ossos desenterrados ou escrituras recuperadas de ruínas decadentes, preferencialmente esculpidas em tipos ambíguos de escrita cuneiforme. No entanto, neste caso, como em muitos outros, a maioria está errada e os supostos maníacos certos.</p><p>Na verdade, chegou a ocorrer que um dragão foi dissecado no Vivissectório em Yndaros, ainda no inverno do Ano 19, embora em seu estágio larval — o estágio que tanto em Ambria quanto na Davokar nomeiam como Linnorme. Nem mesmo os próprios linnormes sabem por que nenhum deles evoluiu para estágios de vida superiores nas últimas centenas de anos, assim como nenhum deles pode explicar por que isso começou a acontecer novamente. Supostamente, o primeiro tinha a ver com a queda de Symbaroum e a intervenção do Pacto de Ferro; provavelmente, o último desenvolvimento está conectado ao escurecimento acelerado da Davokar.</p>"
  },
  "Ettermite Swarm": {
    background: "<p>Nas raras colinas e cordilheiras sem árvores encontradas na Davokar, os exploradores às vezes encontram pilares enormes e incrivelmente bonitos feitos de um tipo raro de pedra preciosa, geralmente da cor marrom dourado, mas às vezes azul esverdeado brilhante ou até mesmo um hipnótico e profundo marrom escuro. O precioso material de construção, chamado Ettercopal, sempre atraiu caçadores de tesouros, corajosos o bastante para enfrentar os moradores dos pilares — enxames de ettermitas carnívoros, alados e compridos. Estudos mostraram que o copal é realmente produzido pelos próprios ettermitas, a partir de uma mistura de seu veneno e seiva de árvore.</p>"
  },
  "Glint": {
    background: "<p>A faísca espera até que um hospedeiro adequado se aproxime. Quando isso acontece, ataca com o objetivo de entrar pela boca para se alojar como um cisto pulsante na garganta. Vítimas adormecidas são preferidas, mas mesmo uma criatura totalmente acordada pode ser o alvo. Uma vez na garganta, ela envia seus órgãos de controle através das partes mais macias do palato, até o cérebro do hospedeiro, para assumir o controle do corpo como um meio de satisfazer seus próprios objetivos e fome. O principal objetivo de uma faísca é encontrar hospedeiros mais adequados; muitos no mesmo local, se possível. O último explica por que tanto as faíscas quanto os hospedeiros portadores de faísca às vezes são encontrados longe das partes mais escuras da Davokar.</p><p>As secreções de uma faísca contribuem para a força e rapidez do hospedeiro, mas sua colocação na garganta também impede o portador de beber e comer — levando à morte por fome em uma a duas semanas. Quando o hospedeiro morre, seja de fome ou por alguma outra causa, a faísca deixa o cadáver e começa a caçar uma nova vítima. Porém, antes de partir, coloca uma larva na cavidade abdominal da carcaça; uma larva que se alimenta da carne podre e nasce como uma nova faísca em cerca de um mês.</p>"
  },
  "Gwann": {
    background: "<p>Mesmo que o número de vítimas de gwann em Ambria esteja crescendo, é claro que são as colônias, postos avançados e viajantes da floresta que levam a pior. Você deve aprender a ler os sinais. Os dois avisos mais evidentes são as pilhas de gwann, criadas quando a fera escava a terra para construir sua rede de túneis subterrâneos, e o fedor horrível da secreção que usa para demarcar seu território. Além disso, todos os que têm a infelicidade de se deparar com um gwann devem aprender a não baixar a guarda mesmo depois, do que parece ser, o golpe mortal ser desferido — a luta de morte da criatura pode ser quase tão mortal quanto os ataques de um indivíduo vivo.</p><p>Relatos menos confiáveis indicam que o gwann pode ser domado, e que tanto os exploradores ambrianos quanto os guerreiros dos clãs encontraram trolls acompanhados por bestas aparentemente leais e obedientes. Há também histórias que falam de visitas a assentamentos subterrâneos de trolls, onde os gwanns tem sido usados como animais de estimação e guardas. Mas, considerando o caráter muitas vezes solitário e geralmente agressivo dessa criatura, essas são provavelmente mentiras ou equívocos; caso contrário, os trolls devem conhecer algum meio especial e místico para quebrar e domar sua fome e vontade.</p>"
  },
  "Gwann, Slaughterer": {
    background: "<p>Mesmo que o número de vítimas de gwann em Ambria esteja crescendo, é claro que são as colônias, postos avançados e viajantes da floresta que levam a pior. Você deve aprender a ler os sinais. Os dois avisos mais evidentes são as pilhas de gwann, criadas quando a fera escava a terra para construir sua rede de túneis subterrâneos, e o fedor horrível da secreção que usa para demarcar seu território. Além disso, todos os que têm a infelicidade de se deparar com um gwann devem aprender a não baixar a guarda mesmo depois, do que parece ser, o golpe mortal ser desferido — a luta de morte da criatura pode ser quase tão mortal quanto os ataques de um indivíduo vivo.</p><p>Relatos menos confiáveis indicam que o gwann pode ser domado, e que tanto os exploradores ambrianos quanto os guerreiros dos clãs encontraram trolls acompanhados por bestas aparentemente leais e obedientes. Há também histórias que falam de visitas a assentamentos subterrâneos de trolls, onde os gwanns tem sido usados como animais de estimação e guardas. Mas, considerando o caráter muitas vezes solitário e geralmente agressivo dessa criatura, essas são provavelmente mentiras ou equívocos; caso contrário, os trolls devem conhecer algum meio especial e místico para quebrar e domar sua fome e vontade.</p>"
  },
  "Illgoblin, Necromage Servant": {
    background: "<p>Alguns goblins optam por desafiar seu ciclo de vida naturalmente curto, buscando a ajuda de algum poder da floresta. O pacto resultante significa que o goblin muda seu destino, da perspectiva de se tornar um troll, para a vida como servo de um ser mais poderoso. A maioria dos Illgoblins recentemente exaltados inicialmente se esforça para defender sua própria personalidade, mas sob o peso da vontade esmagadora do mestre, a maioria abandona seus sonhos para usar todas as suas habilidades e astúcia na esperança de agradar seus benfeitores.</p><p>No entanto, existem aqueles illgoblins que nunca abandonam sua independência, o que significa que sua existência se transforma em um difícil e perigoso ato de equilíbrio entre cumprir as ordens do mestre e lutar por objetivos pessoais. O mestre efetivamente tem a alma do illgoblin em suas mãos e pode punir o servo, mesmo de longe, se ele falhar em cumprir os desejos do mestre ou se comportar de alguma maneira indesejada. A punição permanece até que o illgoblin tenha remediado suas falhas ou retomado seu esforço para alcançar os objetivos do mestre. Obviamente, o mestre também pode optar por recompensar um servo leal, com presentes na forma de traços monstruosos, poderes e rituais.</p>"
  },
  "Living Thorns, Familiar": {
    background: "<p>Existem muitos tipos de flora perigosa na Davokar. Um dos exemplos mais difundidos são os espinhos que se entrelaçam e perfuram, avançando lentamente pela mata, procurando bons locais para espreitar as presas — possivelmente perto de uma clareira com grama exuberante, um corpo d’água ou alguma ruína; lugares que costumam chamar a atenção de feras e seres culturais.</p><p>Relatórios das partes norte e interior da Davokar Iluminada falam de assentamentos bárbaros cujos residentes aprenderam a domar os espinhos vivos; eles os atraem com iscas vivas e, em seguida, continuam a alimentá-los para que, com o tempo, se transformem em uma defesa perimetral viva, cercando a paliçada ou o aterro. Histórias ainda mais loucas das partes mais sombrias da Davokar descrevem ruínas, vales ou campos completamente cobertos por arbustos de espinhos vivos, mas muitos estudiosos e sabichões rejeitam essas histórias. Tantas criaturas espinhosas permanecendo juntas em um lugar por muito tempo provavelmente veriam todas elas indo para sua sepultura espinhosa por causa da fome.</p>"
  },
  "Living Thorns, Wild": {
    background: "<p>Existem muitos tipos de flora perigosa na Davokar. Um dos exemplos mais difundidos são os espinhos que se entrelaçam e perfuram, avançando lentamente pela mata, procurando bons locais para espreitar as presas — possivelmente perto de uma clareira com grama exuberante, um corpo d’água ou alguma ruína; lugares que costumam chamar a atenção de feras e seres culturais.</p><p>Relatórios das partes norte e interior da Davokar Iluminada falam de assentamentos bárbaros cujos residentes aprenderam a domar os espinhos vivos; eles os atraem com iscas vivas e, em seguida, continuam a alimentá-los para que, com o tempo, se transformem em uma defesa perimetral viva, cercando a paliçada ou o aterro. Histórias ainda mais loucas das partes mais sombrias da Davokar descrevem ruínas, vales ou campos completamente cobertos por arbustos de espinhos vivos, mas muitos estudiosos e sabichões rejeitam essas histórias. Tantas criaturas espinhosas permanecendo juntas em um lugar por muito tempo provavelmente veriam todas elas indo para sua sepultura espinhosa por causa da fome.</p>"
  },
  "Scorner": {
    background: "<p>Fontes menos confiáveis afirmam que alguns elixires alquímicos e artefatos menores podem tornar a abominação visível, mas, independentemente do método, isso dá origem a outros problemas. Supõe-se que esta monstruosidade armada com tentáculos seja tão antinatural e sobrenatural que a visão dela induz um terror que irá paralisar ou espantar todos, exceto os mais ferozes caçadores de bestas maculadas, fugindo como crianças assustadas.</p><p>A julgar pelas canções, contos e representações escritas, os encontros com Escarnecedores não são novidade, mas são raros. Se os ataques fossem mais frequentes, o conhecimento de como revelar e combater as criaturas provavelmente teria sido mais desenvolvido. Mas talvez isso esteja prestes a mudar, já que as invasões nas partes mais escuras da Davokar significam um aumento na contagem — muitas vezes combinadas com descrições de “rasgos no tecido da criação” ou “névoas de mácula espessas como mingau”…</p>"
  },
  "Spite": {
    background: "<p>Gadlag, Adepto da Ordem no capítulo de Kastor, apresentou um texto que muitos caçadores de fortunas fariam bem em estudar. Um trecho de suas descobertas pode ser lido abaixo, mas ele também enfatiza que a criatura pode ser mortal para os humanos e que suas infestações não são a única coisa com que se preocupar. Claro, o rancor pode preferir colocar suas crias em elfos e trolls hibernantes, ou mesmo em trolls conscientes cuja capacidade regenerativa promove a evolução das larvas, mas não é muito exigente na hora de escolher seu hospedeiro.</p><p>O fato de indivíduos infectados ignorarem sua própria infestação, bem como a de outras pessoas, levou a incidentes violentos em Ambria em duas ocasiões. Ambos foram causados por grupos de caçadores de fortunas que voltavam das matas, infestados com as larvas venenosas do rancor. Em uma névoa de agressão paranoica, esses grupos atacaram todos que tentaram ajudá-los e causaram grandes danos antes que pudessem ser subjugados.</p>"
  },
  "Troll Shadow": {
    background: "<p>Mesmo que os trolls sombrios pareçam originar-se da raça dos trolls, eles não têm nenhum senso de parentesco com eles, nem com goblins ou ogros. Eles parecem ter medo de quase tudo, incluindo seus próprios primos trolls, embora não de cambiantes, para quem os trolls sombrios são atraídos com grande entusiasmo. Talvez seja verdade o que algumas bruxas dizem: que os trolls sombrios veem a existência do cambiante como uma versão exaltada de sua própria deformidade. De qualquer forma, como os cambiantes residem em cidades ambrianas e assentamentos bárbaros, os trolls sombrios também podem aparecer lá, muitas vezes acompanhados por um cambiante que pode ou não ficar encantado com sua companhia.</p><p>Por mais incômodos que possam ser, os trolls sombrios têm uma habilidade benéfica e potencialmente útil: eles podem sentir a presença e, portanto, rastrear artefatos místicos. Desde que rumores dessa habilidade começaram a circular pelos assentamentos fronteiriços de Ambria, muitos caçadores de fortunas, exploradores e aproveitadores em geral tentaram usá-la para ganho pessoal. Algumas histórias descrevem caçadores de fortunas que encontraram trolls sombrios em Davokar e os seguiram até o que se revelou um tesouro repleto de riquezas incalculáveis; outros rumores falam de exploradores que capturaram e escravizaram um ou vários indivíduos para ajudar na exploração de ruínas intocadas.</p><p>Qualquer que seja a verdade, dificilmente é seguro viajar com um grupo de trolls sombrios — mesmo que algemados. Além disso, um pequeno coletivo pode causar sérios problemas, por vingança ou simplesmente para se divertir, e o efeito de tal travessura pode, é claro, ser desastroso para um grupo que se aventurou nas profundezas da floresta Davokar...</p>"
  },
  "World Serpent, Tunneler": {
    background: "<p>O especialista não oficial da Ordo Magica no Submundo, Mestre Argoi, talvez esteja certo ao supor que as serpentes do mundo podem sentir vibrações acima do solo, pelo menos aquelas que são fortes e sincronizadas o suficiente. Isso explicaria por que dois batalhões ambrianos em marcha foram atacados por serpentes do mundo durante a guerra contra Haloban e seus Jezitas, e também porque duas grandes expedições para ruínas foram visitadas por convidados indesejados enquanto tentavam abrir caminho para os níveis ocultos do porão. Mas, mesmo que isso seja verdade, ainda seria preciso muito azar para encontrar uma serpente do mundo na superfície. A maioria dos ataques relatados desde o êxodo ambriano através dos Titãs, direcionados a bárbaros ou ao próprio povo da Rainha, ocorreram abaixo do solo, ou pelo menos em minas e cavernas conectadas ao Submundo. As declarações das testemunhas são muitas e consistentes, detalhando como as serpentes engolem humanos, ogros e trolls inteiros, com equipamento e tudo. Esses encontros também deram origem a heróis inesperados, como o escudeiro ambriano Begomo Fatiador de Cobras e o guerreiro bárbaro Vaivana, que libertaram seus comandantes da barriga de uma serpente depois de desferir um golpe mortal.</p>"
  },
  "World Serpent, Wallower": {
    background: "<p>O especialista não oficial da Ordo Magica no Submundo, Mestre Argoi, talvez esteja certo ao supor que as serpentes do mundo podem sentir vibrações acima do solo, pelo menos aquelas que são fortes e sincronizadas o suficiente. Isso explicaria por que dois batalhões ambrianos em marcha foram atacados por serpentes do mundo durante a guerra contra Haloban e seus Jezitas, e também porque duas grandes expedições para ruínas foram visitadas por convidados indesejados enquanto tentavam abrir caminho para os níveis ocultos do porão. Mas, mesmo que isso seja verdade, ainda seria preciso muito azar para encontrar uma serpente do mundo na superfície. A maioria dos ataques relatados desde o êxodo ambriano através dos Titãs, direcionados a bárbaros ou ao próprio povo da Rainha, ocorreram abaixo do solo, ou pelo menos em minas e cavernas conectadas ao Submundo. As declarações das testemunhas são muitas e consistentes, detalhando como as serpentes engolem humanos, ogros e trolls inteiros, com equipamento e tudo. Esses encontros também deram origem a heróis inesperados, como o escudeiro ambriano Begomo Fatiador de Cobras e o guerreiro bárbaro Vaivana, que libertaram seus comandantes da barriga de uma serpente depois de desferir um golpe mortal.</p>"
  },
  "Marlit": {
    background: "<p>É bem possível que os marlits no norte sejam diferentes daqueles mais ao sul; que os nortistas são como membros de um grande clã ou tribo, enquanto os do sul são mais como famílias. Ou pode ser como dizem os Goeds, que quanto mais ao norte você for na floresta, mais perigosa ela se torna e maior o motivo para se manterem juntos, o que também vale para os predadores. Mestre Argoi, Mestre do Capítulo em Kurun e autoridade da Ordo Magica em estudos de trolls, afirma que pode haver ainda outra razão para a suposta diferença — que os marlits do norte se reúnem em torno de algum espírito da floresta ou besta poderosa para a qual eles fornecem comida e proteção, como por exemplo, um arquitroll ou um linnorme.</p><p>Como a pele do lagarto é procurada tanto pelos bárbaros quanto pelo povo da Rainha, muitos caçadores de monstros se especializaram na caça de marlits. Eles arriscam suas vidas, enfrentando esse predador astuto e paciente que caça em bandos e geralmente emprega o método de ter bestas-iscas errantes e solitárias que atraem caçadores imprudentes para emboscadas bem planejadas. Por outro lado, devido ao perigo, os caçadores de marlits têm status elevado em lugares como Kastor e Forte do Cardo, e eles provavelmente não hesitariam se alguém pudesse levá-los para onde um dos grandes bandos do norte se reúne.</p>"
  },
  "Skullbiter, Crusher": {
    background: "<p>Os assassinos blindados conhecidos pelos magos do cajado como Bestas de Carapaça, e pelos clãs como Morde-crânios, provavelmente têm seu local de origem em algum lugar perto do castelo dos místicos empunhadores de cajados. É lá que eles costumam aparecer e demonstrar suas táticas de batalha, tão simples quanto devastadoras: encolha-se atrás de sua carapaça e role direto para — e através — da linha defensiva do inimigo, até o coração da força adversária. Lá, eles se empinam, mostrando suas mandíbulas. Uma besta de carapaça encolhida não é facilmente ferida, fato que os magos do cajado podem atestar. É preciso esperar pacientemente que eles se levantem e depois atacar com força. Parece que as bestas de carapaças não podem ser corrompidas, mas sofrem dano físico de corrupção de uma forma que lembra os anões. Alguns estudiosos afirmam que eles realmente são anões transmodificados, enquanto a maioria simplesmente acredita que as bestas e os anões são filhos da mesma ciência perturbada — que foram criados através de métodos semelhantes, sem estarem relacionados de qualquer outra forma. Em todo caso, o fato de sofrerem danos por corrupção pode ser usado contra eles, principalmente ao buscar rotas acima do solo que são tão corrompidas a ponto de serem contagiosas e, portanto, prejudiciais às bestas de carapaça. Além disso, os místicos que são capazes de usar a corrupção com sucesso como uma arma podem, é claro, fazê-lo contra os morde-crânios, mesmo que os magos do cajado nunca considerem essa possibilidade ou tolerem que alguém recorra a tais métodos.</p>"
  },
  "Skullbiter, Queen": {
    background: "<p>Os assassinos blindados conhecidos pelos magos do cajado como Bestas de Carapaça, e pelos clãs como Morde-crânios, provavelmente têm seu local de origem em algum lugar perto do castelo dos místicos empunhadores de cajados. É lá que eles costumam aparecer e demonstrar suas táticas de batalha, tão simples quanto devastadoras: encolha-se atrás de sua carapaça e role direto para — e através — da linha defensiva do inimigo, até o coração da força adversária. Lá, eles se empinam, mostrando suas mandíbulas. Uma besta de carapaça encolhida não é facilmente ferida, fato que os magos do cajado podem atestar. É preciso esperar pacientemente que eles se levantem e depois atacar com força. Parece que as bestas de carapaças não podem ser corrompidas, mas sofrem dano físico de corrupção de uma forma que lembra os anões. Alguns estudiosos afirmam que eles realmente são anões transmodificados, enquanto a maioria simplesmente acredita que as bestas e os anões são filhos da mesma ciência perturbada — que foram criados através de métodos semelhantes, sem estarem relacionados de qualquer outra forma. Em todo caso, o fato de sofrerem danos por corrupção pode ser usado contra eles, principalmente ao buscar rotas acima do solo que são tão corrompidas a ponto de serem contagiosas e, portanto, prejudiciais às bestas de carapaça. Além disso, os místicos que são capazes de usar a corrupção com sucesso como uma arma podem, é claro, fazê-lo contra os morde-crânios, mesmo que os magos do cajado nunca considerem essa possibilidade ou tolerem que alguém recorra a tais métodos.</p>"
  },
  "Skullbiter, Hatchling": {
    background: "<p>Os assassinos blindados conhecidos pelos magos do cajado como Bestas de Carapaça, e pelos clãs como Morde-crânios, provavelmente têm seu local de origem em algum lugar perto do castelo dos místicos empunhadores de cajados. É lá que eles costumam aparecer e demonstrar suas táticas de batalha, tão simples quanto devastadoras: encolha-se atrás de sua carapaça e role direto para — e através — da linha defensiva do inimigo, até o coração da força adversária. Lá, eles se empinam, mostrando suas mandíbulas. Uma besta de carapaça encolhida não é facilmente ferida, fato que os magos do cajado podem atestar. É preciso esperar pacientemente que eles se levantem e depois atacar com força. Parece que as bestas de carapaças não podem ser corrompidas, mas sofrem dano físico de corrupção de uma forma que lembra os anões. Alguns estudiosos afirmam que eles realmente são anões transmodificados, enquanto a maioria simplesmente acredita que as bestas e os anões são filhos da mesma ciência perturbada — que foram criados através de métodos semelhantes, sem estarem relacionados de qualquer outra forma. Em todo caso, o fato de sofrerem danos por corrupção pode ser usado contra eles, principalmente ao buscar rotas acima do solo que são tão corrompidas a ponto de serem contagiosas e, portanto, prejudiciais às bestas de carapaça. Além disso, os místicos que são capazes de usar a corrupção com sucesso como uma arma podem, é claro, fazê-lo contra os morde-crânios, mesmo que os magos do cajado nunca considerem essa possibilidade ou tolerem que alguém recorra a tais métodos.</p>"
  },
  "Wraith": {
    race: "Espírito (morto-vivo)",
    shadow: "Preto brilhante, como óleo (completamente corrompido)",
    appearance: "<p>Figuras escuras e sombrias, flutuando sozinhas ou em grupos. São atraídas por seres vivos, como moscas por carne apodrecendo. Elas buscam afeto, simpatia, ajuda ou apenas alguém disposto a ouvir, sem perceber que seu toque desesperado é letal para os vivos.</p>",
    tactics: "As aparições atacam as pessoas aleatoriamente. Há 50% de chance de uma aparição individual fugir se o dano sofrido exceder a metade do seu valor de Vitalidade."
  },
  "Hunting Spider": {
    race: "Aranha (besta)",
    shadow: "Cinza-azulado, como os líquens barbados da floresta (corrupção: 2)",
    appearance: "<p>As aranhas caçadoras são do tamanho de um cachorro grande, com corpos lustrosos, pretos e sem pelos, suas pernas longas e finas.</p>",
    tactics: "As aranhas caçadoras usam sua teia pegajosa para enredar suas presas. Feito isso, eles passam a flanquear e matar uma vítima de cada vez."
  },
  "Fray Spider": {
    race: "Aranha (besta)",
    shadow: "Marrom escuro com faixas cinza, como a parede salpicada de uma montanha (corrupção: 1)",
    appearance: "<p>Cinza-acastanhadas e cobertas de pelos curtos e grossos, essas grandes monstruosidades aracnoides não têm a capacidade de tecer teias. Em vez disso, elas capturam suas presas como a maioria dos predadores de quatro patas: com velocidade, força e astúcia.</p>",
    tactics: "Contra presas mais fortes e adequadas para combate corpo a corpo, a aranha peluda começará com um rápido ataque de veneno e depois manterá distância enquanto o veneno enfraquece a vítima. Contra inimigos mais fracos, ou contra armas de longo alcance, ela confiará na sua mordida poderosa e na sua carapaça grossa."
  },
  "Spider Queen": {
    race: "Aranha (besta)",
    shadow: "Branco cintilante como neve iluminada pelo sol (corrupção: 0)",
    appearance: "<p>As Aranhas Rainhas, mães das criaturas aracnoides da Davokar, variam em aparência, mas seus corpos costumam ser do tamanho de um ogro, com pernas longas e articuladas. Normalmente, seus olhos compostos estão a cerca de um metro do chão, mas as pernas compridas permitem que se ergam acima dos mais altos e robustos aventureiros.</p>",
    tactics: "A Aranha Rainha deixa que suas crias lutem, enquanto apoia cuspindo veneno."
  },
  "Killer Shrub": {
    race: "Flora",
    shadow: "Marrom-esverdeado brilhante, como casca coriácea (corrupção: 0)",
    appearance: "<p>Caçadores de fortunas que se aventuram na Davokar Escura logo aprenderão a temer esse arbusto devorador de carne conhecido como Voragem de Galhos ou Arbusto Assassino. Essa moita não pode se mover, mas seus galhos são como tentáculos ágeis, longos o suficiente para puxar e aprisionar presas próximas.</p>",
    tactics: "Se alguma presa passa no alcance corpo a corpo, o arbusto tenta um abraço esmagador, caso contrário, ele envia suas trepadeiras para puxar a vítima suculenta. Se for atacado à distância, poderá retaliar desde que o alvo esteja a uma distância de até duas ações de movimento (consulte Língua Enredadora)."
  },
  "The Black Plague Termites": {
    race: "Abominação",
    shadow: "Preto brilhante como carvão encharcado (completamente corrompido)",
    appearance: "<p>Estes cupins vermelhos e pretos, do tamanho de polegares, atacam árvores, vivas e mortas, deixando-as vazias. Dizem que eles corrompem tudo o que tocam — as árvores que devoram, o chão por onde passam e a terra em que se aninham.</p>",
    tactics: "Um enxame de cupins defenderá instintivamente sua rainha e seu ninho; eles não têm instinto de sobrevivência e continuarão atacando até que seus inimigos fujam ou o enxame seja destruído."
  },
  "Blood Cat": {
    race: "Predador (besta)",
    shadow: "Vermelho sangue pulsante (corrupção: 0)",
    appearance: "<p>Como os pesadelinos, o Felino Sangrento não tem pelagem, com a pele em tons de laranja e roxo, e olhos amarelos que sempre parecem esbugalhados. Só querem o sangue de suas presas, e por isso sempre vêm com um ou mais seguidores ou servos, muitas vezes jakaars ou pesadelinos, que contribuem para a caça e mais tarde podem se banquetear na carcaça drenada de sangue.</p>",
    tactics: "O Felino Sangrento usa sua habilidade acrobática e seus movimentos imprevisíveis em combate corpo a corpo, mas tem dificuldade em controlar sua sede: assim que encontra um único inimigo corpo a corpo, ele tenta dominá-lo e morder seu pescoço."
  },
  "Hunger Wolf": {
    race: "Predador (besta)",
    shadow: "Amarelo-esverdeado pálido, como a grama do ano passado numa clareira da floresta (corrupção: 0)",
    appearance: "<p>Os enormes lobos famintos são exemplos das bestas mais lendárias na região da Davokar. Eles são parecidos com os jakaars, mas podem crescer tanto quanto pôneis e são tão flexíveis quanto os pesadelinos. Felizmente, eles raramente caçam em bandos, mas preferem fazer isso sozinhos ou em pares — algo pelo qual os caçadores humanos devem estar muito gratos.</p>",
    tactics: "O Lobo Faminto confia na sua esperteza e velocidade, e ataca grupos maiores de oponentes sem hesitar. Caso seja gravemente ferido, usa sua capacidade acrobática para fugir e lamber suas feridas. Mas o Lobo Faminto nunca esquece e certamente buscará vingança."
  },
  "Crypt Lord": {
    race: "Morto-vivo",
    shadow: "Descamação preta, como papel folheado e queimado (completamente corrompido)",
    appearance: "<p>Chamados de Lordes da Cripta, as criaturas mumificadas que os exploradores ambrianos às vezes encontram em suas expedições. Os sobreviventes de tais encontros descrevem como cadáveres desidratados e embalsamados, vestidos com trapos ou armaduras cujo esplendor decadente sugere que o dono já foi muito rico.</p>",
    tactics: "Começa tentando dominar/subjugar o inimigo de aparência mais perigosa que não foi afetado pelo Frio da Tumba. Em seguida, ataca seus inimigos na ordem do tamanho decrescente."
  },
  "Blight Worm": {
    race: "Abominação",
    shadow: "Azul-esverdeado pulsante e brilhante (completamente corrompido)",
    appearance: "<p>A abominação conhecida pelos clãs bárbaros como o Verme Maculado se parece muito com o kanaran, mas com uma clara diferença — a parte frontal do corpo é dividida, com duas cabeças no final. Quase todos relatam espécimes solitárias, mas certos rumores sugerem que algumas expedições foram infelizes o bastante para encontrar covas cheias dessas criaturas abomináveis se contorcendo umas contra as outras.</p>",
    tactics: "O Verme Maculado prefere atacar vítimas solitárias, de preferência adormecidas e, se possível, permanente arruinadas pela corrupção. Quando consegue atingir um alvo, envolve a presa e uma das cabeças inicia um Abraço Esmagador enquanto a outra continua a morder."
  },
  "Moose": {
    race: "Herbívoro (besta)",
    shadow: "Verde brilhante com manchas vermelhas, como uma coroa de sorveira cheia de frutas (corrupção: 0)",
    appearance: "<p>O alce é uma visão comum na Davokar Iluminada, às vezes vagando sozinho, às vezes acompanhado pelos filhotes da última ninhada.</p>",
    tactics: "Manobra habilmente para evitar ser pego no corpo a corpo, mantendo-se constantemente em movimento enquanto mantém os chifres abaixados em direção ao peito do inimigo."
  },
  "Blaze Bug": {
    race: "Criatura alada (besta)",
    shadow: "Marrom-acinzentado e granulado, como argila seca (corrupção: 0)",
    appearance: "<p>Parece que os insetos carnívoros conhecidos como Percevejos ou Besouros Brilhantes podem ser encontrados em qualquer lugar da Davokar, incluindo suas partes mais iluminadas. Cada inseto tem quase o tamanho de uma palma humana, com uma carapaça negra brilhante estampada em ouro que combina com suas asas cintilantes.</p>",
    tactics: "Esses besouros raramente atacam se houverem mais de dois inimigos, mas defenderão seu território contra grupos maiores — sempre brilhando de raiva."
  },
  "Fey Beast": {
    race: "Predador (besta)",
    shadow: "Amarelo-acastanhado, como a grama seca de um prado (corrupção: 0)",
    appearance: "<p>A besta feérica é um dos predadores mais ferozes e inabaláveis da região. Em termos de vigor e constituição física, lembra um jakaar ou um cachorro grande, mas seu pelo manchado de cinza ou marrom é definitivamente felino. Como os pesadelinos, a fera tem uma glândula venenosa logo acima de suas presas, mas enquanto o veneno do pesadelino é letal, a besta só vai paralisar a vítima. E é exatamente isso que o torna um predador tão temível: você dificilmente pode passar um dia em Forte do Cardo sem ouvir histórias de pessoas que foram comidas vivas e conscientes.</p>",
    tactics: "As bestas feéricas caçam em bandos, e preferem atacar quando superam suas vítimas à razão de dois para um. Juntas, elas caçam suas vítimas, e quando todas ficam paralisadas, o banquete começa."
  },
  "Darak": {
    race: "Herbívoro (besta)",
    shadow: "Amarelo esverdeado pálido, como feno seco (corrupção: 0)",
    appearance: "<p>Os daraks são herbívoros que vivem em matilha que normalmente vagam pelas planícies a oeste da Davokar, mas não é incomum que animais individuais sejam excluídos do rebanho. Esses nômades solitários tendem a ficar na floresta e geralmente são extremamente agressivos na defesa de seu território.</p>",
    tactics: "O Darak é grande e poderoso demais para adotar quaisquer táticas especiais — ele simplesmente esmaga o maior número possível de inimigos no caminho até o corpo a corpo, e depois continua atacando tudo o que se aproxima."
  },
  "Ferber": {
    race: "Predador (besta)",
    shadow: "Marrom claro mudando para amarelo escuro (corrupção: 0)",
    appearance: "<p>O feroz Ferber vive em famílias de quatro a dez indivíduos. O que esse mustelídeo carece de tamanho, compensa em velocidade e tremenda coragem, mas não é por isso que os bárbaros o evitam como uma praga. Eles o fazem por causa da doença que todos os ferbers adultos parecem portar, e que ameaça infectar quem eles mordem.</p>",
    tactics: "Ferbers não recuam, não importa a força do oponente. Eles preferem subjugar alvos com sua superioridade numérica, dividindo-se para que haja dois ferbers enfrentando cada oponente."
  },
  "Jakaar, Battle-trained": {
    race: "Predador (besta)",
    shadow: "Verde exuberante (corrupção: 0)",
    appearance: "<p>Bestas de batalha são bastante comuns entre os clãs da região, e nenhuma espécie é mais comum que o jakaar, uma espécie similar aos lobos. Os bárbaros domaram esses grandes canídeos por séculos e, no clã Odaiova, é muito comum toda família treinar pelo menos um jakaar para protegê-los à noite e fazer companhia durante o dia.</p>",
    tactics: "Os jakaars de batalha obedecem aos comandos de seus mestres, muitas vezes trabalhando como guarda-costas, que também podem ser enviados para atacar inimigos equipados com armas de longo alcance ou poderes místicos."
  },
  "Jakaar, Wild": {
    race: "Predador (besta)",
    shadow: "Verde como grama de primavera (corrupção: 0)",
    appearance: "<p>O jakaar é um canídeo, tão propenso a capturar suas próprias presas quanto a comer cadáveres deixados por outras bestas.</p>",
    tactics: "Os jakaars tentam ganhar Vantagem flanqueando suas presas."
  },
  "Kelder": {
    race: "Flora",
    shadow: "Verde escuro listrado e brilhante, como agulhas de pinheiro saudáveis (corrupção: 0)",
    appearance: "<p>Existem muitos rumores sobre o cedro conhecido como Kelder. É verdade que eles perfuram a pele de suas presas com finos fios de micélio, mas não conseguem adormecer suas vítimas, apenas as paralisam por um breve momento e as seguram usando suas raízes.</p>",
    tactics: "Os kelders habitam a floresta da Davokar em grupos de cinco a seis indivíduos. Eles procuram o que parecem ser locais de descanso adequados e atacam quando qualquer presa adormece, pegando-as de Surpresa."
  },
  "Lostling": {
    race: "Espírito (morto-vivo)",
    shadow: "Vermelho líquido com pontos pretos, como um coração invejoso esmagado (completamente corrompido)",
    appearance: "<p>Dizem que esses espíritos solitários vagam pela região da Davokar desde muito antes da queda de Symbaroum, como pequenas manchas de névoa, que buscam constantemente novos hospedeiros, através dos quais eles podem reviver o calor e a intimidade que desesperadamente desejam.</p>",
    tactics: "Realiza ataques amplos que, quando bem-sucedidos, permitem que ele atravesse o alvo. Sempre escolhe a vítima mais forte e robusta, tentando a possuir assim que o ataque causar dano."
  },
  "Mosey Munk": {
    race: "Predador (besta)",
    shadow: "Um enxame rastejante branco como osso, como um aglomerado de larvas contorcendo-se (corrupção: 0)",
    appearance: "<p>O grande Urso Fétido com seu padrão vermelho e preto parece ser uma espécie de urso, mas tem uma glândula venenosa tão poderosa que pode servir como arma, além de suas mandíbulas temíveis.</p>",
    tactics: "Corre direto para o corpo a corpo, onde, com seu fedor terrível e mordida poderosa, enfrenta o inimigo mais ameaçador."
  },
  "Beamon": {
    race: "Predador (besta)",
    shadow: "Castanho quase preto, como couros recém-oleados (corrupção: 0)",
    appearance: "<p>A criatura ursídea de pelagem preta conhecida pelos bárbaros como Urstro é uma alma solitária e se considera naturalmente dominante. Ela certamente tem muitos inimigos, tanto bestas quanto humanos. O Urstro é valorizado pelos bárbaros por sua carne e, para muitos clãs do norte, seu abate é um rito de maioridade. Qualquer pessoa que tenha caçado com sucesso um Urstro é considerada adulta, e aqueles que conseguem derrubar o urso bestial sozinho são considerados guerreiros totalmente treinados.</p>",
    tactics: "O Urstro confia em sua força e resistência, mas não é estúpido. Se, irremediavelmente, em menor número ou enfrentar uma resistência mais forte que o esperado, ele fugirá."
  },
  "Hornet": {
    race: "Criatura alada",
    shadow: "Laranja como o sol da tarde (corrupção: 0)",
    appearance: "<p>Ninguém sabe quantos caçadores de fortuna foram vítimas das vespas da Davokar, mas de acordo com histórias contadas nas tavernas de Forte do Cardo, esses aterradores tenazes são alguns dos assassinos mais eficazes da floresta. Eles são encontrados em todos os lugares, mas parecem gostar particularmente das magníficas ruínas de Symbaroum.</p>",
    tactics: "Um enxame de vespas defenderá instintivamente sua rainha e seu ninho; eles não têm qualquer instinto de sobrevivência e continuarão atacando até que seus inimigos fujam ou o enxame seja destruído."
  },
  "Nipper": {
    race: "Anfíbio (besta)",
    shadow: "Marrom avermelhado manchado, como a casca de crustáceo cozida (corrupção: 0)",
    appearance: "<p>O Beliscador é um tipo menor de Caçador de Rio com garras que frequentemente caça em pares ou grupos de até cinco indivíduos. Mesmo que não possa ser comparado ao seu parente mais famoso em termos de tamanho, astúcia ou potencial culinário, o Beliscador tem causado a morte de muitos que vagam pelo rio.</p>",
    tactics: "Os Beliscadores usam suas garras na barriga para se agarrarem e se moverem no convés, terra ou ponte. Eles coordenam seus ataques para obter Vantagem e, em seguida, agarram e roem lentamente suas vítimas até a morte."
  },
  "Hammer Eel": {
    race: "Anfíbio (besta)",
    shadow: "Brilhante, azul prateado bruto, como veludo colorido em água (corrupção: 0)",
    appearance: "<p>Felizmente, a imensa enguia martelo é uma visão rara nos rios de Ambria e Davokar; essa criatura prefere lagos maiores como o Volgoma. Geralmente ela caça outros anfíbios, mas se alguma crescer demais e estiver com muita fome, também poderá atacar os marinheiros lançando-se através da água, agarrando-os com suas pinças curtas, porém fortes, e puxando-os para baixo da superfície.</p>",
    tactics: "A enguia pode escolher entre agarrar e puxar a vítima para a água ou atacar diretamente com suas mandíbulas similares a de um tubarão."
  },
  "Garoug": {
    race: "Predador (besta)",
    shadow: "Branco azulado, como gelo no meio do inverno (corrupção: 0)",
    appearance: "<p>O urso gigante conhecido como Garoug pode ser encontrado principalmente nas ilhas do Lago Veloma, ou caçando em suas águas. Sua pelagem branca azulada combina com um predador de temperamento tão frio — seu olhar penetrante é suficiente para fazer até o mago mais corajoso fugir. Se os seus inimigos insistirem em lutar, o Garoug não recuará; se necessário, o grande urso morrerá protegendo seus filhotes e/ou companheira!</p>",
    tactics: "Inicialmente, o Garoug tenta assustar inimigos ou caçadores com sua aparência imponente. Se isso falhar, foca no maior de seus inimigos e ataca enquanto tenta incutir dúvidas na mente da vítima."
  },
  "Drilling Leech": {
    race: "Anfíbio (besta)",
    shadow: "Amarelo acastanhado brilhante, como sua pele viscosa (corrupção: 0)",
    appearance: "<p>A esguia Sanguessuga Perfuradora, meio cega, mas venenosa, é do tamanho de um gato e surpreendentemente ágil na água. Movendo-se em grupos, elas se acoplam ao casco dos barcos e devoram tudo, na esperança de que a tripulação caia na água. Enquanto mastigam as tábuas, as sanguessugas não se soltam, mesmo se forem atacadas, para isso devem ser detectadas primeiro. Com um teste [Vigilante –5] bem-sucedido, quem pilota o navio percebe que algo parece errado, como se o navio puxasse em uma determinada direção.</p>",
    tactics: "Uma vez que sua presa estiver na água, a sanguessuga ataca na tentativa de envenená-la. Quando isso é feito, ela se retira e aguarda o veneno agir."
  },
  "Skullan": {
    race: "Anfíbio (besta)",
    shadow: "Azul e branco vibrantes, como as correntes em uma corredeira rochosa (corrupção: 0)",
    appearance: "<p>Essa grande e verruguenta criatura verde-escura semelhante a um sapo conhecida como Skullan pode não ser tão impressionante quanto um Rei Sapo adulto, no entanto, seu veneno paralisante a torna um monstro a se temer.</p>",
    tactics: "O Skullan usa sua língua para puxar alvos das embarcações que passam; uma vez que a vítima está paralisada, o banquete pode começar!"
  },
  "Vapaya": {
    race: "Anfíbio (besta)",
    shadow: "Listras brilhantes vermelhas, verdes e amarelas, como escamas de peixe estampadas (corrupção: 0)",
    appearance: "<p>Os pais Ambrianos que se preocupam com suas crianças brincando perto da água costumam avisá-las sobre os Vapaya. Entretanto esses peixes carnívoros preferem perseguir embarcações nos rios da região, especialmente navios piratas, já que seus ataques sempre acabam com uma ou duas almas azaradas caindo ao mar.</p>",
    tactics: "Os Vapaya enxameiam uma vítima de cada vez, mordendo e mordendo até a morte."
  },
  "Snow Wraith": {
    race: "Morto-Vivo",
    shadow: "Gelo azul fraturado boiando em um lago escuro (completamente corrompido)",
    appearance: "<p>Ninguém sabe quantas caravanas estão enterradas sob a neve nas Titãs, engolidas por avalanches e deslizamentos de terra. O que se sabe, no entanto, é que os viajantes raramente permanecem onde caíram — um fato que muitas vezes fornece às caravanas posteriores surpresas desagradáveis.</p>",
    tactics: "Ataca em bandos e deixa seu sopro gelado passar sobre as vítimas paralisadas."
  },
  "Rock Buck": {
    race: "Herbívoro (besta)",
    shadow: "Redemoinho branco-acinzentado, como nas rajadas de neve (corrupção: 0)",
    appearance: "<p>As Titãs e as Corvos são o lar dessa enorme e maliciosa raça de caprinos da montanha. Eles patrulham seus territórios e defendem furiosamente seus desfiladeiros escarpados.</p>",
    tactics: "Desafia o maior dos oponentes e tenta derrubá-lo no chão."
  },
  "Brimstone Oak": {
    race: "Flora",
    shadow: "Marrom rajado em vermelho, como casca de carvalho se aquecendo no brilho das brasas (corrupção: 0)",
    appearance: "<p>Essas árvores estão relacionadas aos Carvalhos-Ferro e Kelders da Davokar, mas coexistem com um tipo de fungo que exala enxofre e fósforo. Graças a esta simbiose, o carvalho enxofre emite ondas de calor que atraem animais vivos. A mesma fonte de calor pode ser usada para produzir cascatas de fogo que matam presas e dão uma superfície crocante a elas.</p>",
    tactics: "Usa sua muralha de raízes para prender alvos, então tenta matá-los com suas cascatas ardentes."
  },
  "Wraith Owl": {
    race: "Criatura alada",
    shadow: "Tão branca quanto sua plumagem (corrupção: 0)",
    appearance: "<p>A coruja espectral recebeu esse nome por sua plumagem, que permanece branco-brilhante durante todo o ano, exceto pelos círculos marrons ou pretos ao redor dos olhos e nas pontas das penas. Elas geralmente fazem seus ninhos nas Corvos, mas algumas também se estabeleceram nas ruínas da Davokar, no alto de torres quebradas ou em outros lugares onde elas têm uma visão clara das criaturas se movendo abaixo.</p>",
    tactics: "A coruja espectral observa seus arredores do alto. Tendo avistado sua presa, ela conta com suas habilidades de voo excepcionais para fazer ataques devastadores sem se arriscar. Se a vítima não tiver uma arma longa à sua disposição, a coruja fantasma também recebe um ataque livre por turno. Se houver o risco de combate corpo a corpo, a coruja escolherá outro alvo ou simplesmente não atacará até que a situação melhore."
  },
  "Stone Boar": {
    race: "Predador (besta)",
    shadow: "Preto grisalho, como um close da sua própria pele (corrupção: 0)",
    appearance: "<p>Esse animal enorme e voraz é chamado de javali rochoso, mesmo que não tenha semelhança com outros javalis domesticados ou selvagens. Se não fosse por sua pele robusta e de couro (em alta demanda entre os fabricantes das armaduras de couro mais elegantes de Ambria), qualquer um provavelmente preferiria dar no pé antes de arriscar um confronto sangrento. Mas, na realidade, todos os javalis rochosos, tanto nas Corvos quanto nas Titãs, acabam sendo perseguidos por caçadores de monstros de Ambria.</p>",
    tactics: "Com poucas exceções, os Javalis Rochosos vivem e caçam aos pares. Eles usam sua Corrida Valente esmagadora o quanto for possível e não têm medo de sofrer ataques livres para abandonar o corpo a corpo e fazer uma nova investida."
  },
  "Kotka": {
    race: "Predador (besta)",
    shadow: "Verde brilhante como as folhas de uma bétula (corrupção: 0)",
    appearance: "<p>O poderoso kotka é um dos predadores mais temidos das Titãs. Possui pelo grosso de inverno de cor branca-amarelada com faixas negras nas costas, presas terríveis e grandes garras que podem rasgar em pedaços até a mais dura pele de ogro.</p>",
    tactics: "Os kotkas tendem a caçar em pares ou grupos de três adultos; eles geralmente espreitam rebanhos de presas e cooperam para isolar um único alvo. Eles fazem o mesmo ao enfrentar um grupo de inimigos — eles se concentram em um alvo de cada vez, tentando obter Vantagem através de flanqueamento. Naturalmente, eles atacarão primeiro o oponente maior e mais resistente."
  },
  "Crystal Flies": {
    race: "Criatura alada (besta)",
    shadow: "Branco em redemoinho, como uma tempestade de neve cortante (corrupção: 0)",
    appearance: "<p>Esses insetos branco-prateados formam colônias que parecem massas de neve, atacando criaturas para pôr ovos em seus corpos quentes.</p>",
    tactics: "Concentra-se na criatura de sangue quente mais próxima e tenta abrir caminho pela garganta, nariz e ouvidos."
  },
  "Cave Ray": {
    race: "Anfíbio (besta)",
    shadow: "Azul profundo mudando para laranja quente (corrupção: 0)",
    appearance: "<p>Uma história recorrente de expedições subterrâneas conta sobre grandes anfíbios de corpo chato espreitando nas águas escuras do Submundo. Eles caçam carpas cegas e os vearons que compartilham seu habitat, assim como outros que se aproximam.</p>",
    tactics: "A Arraia das Cavernas se lança sobre a presa para jogá-la na água. Quando submersa, a arraia tenta segurá-la até se afogar."
  },
  "Chasm Stag": {
    race: "Abominação",
    shadow: "Brilho negro estilhaçado, como uma couraça rachada (completamente corrompida)",
    appearance: "<p>Das poças estagnadas de lama maculada que às vezes surgem borbulhando pelas fendas do Submundo, nasce o insetoide Besouro do Abismo — com o tamanho de uma raposa, mas coberto por uma casca dura e tão voraz quanto outras abominações. Eles costumam se mover em grupos de três a cinco indivíduos, mas mesmo um único besouro pode causar grandes problemas, pois os Daemones Intrusos do Além Mundo parecem considerá-los valiosos e dignos de proteção.</p>",
    tactics: "Corre silenciosamente em direção aos alvos mais fracos, com o objetivo de envenená-los, e conta com os Daemones Intrusos para ajudá-los se a presa se mostrar mais difícil do que o esperado. Assim que o veneno entra em vigor, eles começam a se mover para dobrar o efeito de sua proteção."
  },
  "The Wily": {
    race: "Abominação",
    shadow: "Roxo pulsante com veias enegrecidas (completamente corrompidos)",
    appearance: "<p>A origem desses humanoides vagamente parecidos com elfos que vagam nus no Submundo, e por quanto tempo eles estão lá, é um tópico muito debatido entre os estudiosos. Eles podem ser um experimento symbariano fracassado ou membros do Pacto de Ferro que foram corrompidos e distorcidos na guerra contra Symbar. O que está claro é que eles demonstram uma terrível fome de corrupção e parecem capazes de sentir quando alguém está usando poderes ou artefatos místicos no Submundo.</p>",
    tactics: "São atraídos por pessoas usando poderes místicos ou artefatos e esperam uma oportunidade para enfeitiçá-los com seu olhar hipnótico e então beber sua corrupção."
  },
  "Orahaug": {
    race: "Verme (besta)",
    shadow: "Verde borbulhante e enfermo (corrupção: 2)",
    appearance: "<p>Houve inúmeras tentativas de capturar um desses vermes massivos com vida, na esperança de extrair a secreção extremamente corrosiva que eles usam para cavar através da terra e pedra. Talvez as duas tentativas em andamento de reproduzir Orahaugs sejam bem-sucedidas, mas é claro que há um risco de que as bestas se soltem, atacando pessoas e gado inocentes...</p>",
    tactics: "Ataca alvos que tocam o chão ou paredes de pedra. Escava e se enrola para evitar danos."
  },
  "Raskaal": {
    race: "Criatura alada (besta)",
    shadow: "Amarelo pálido, como uma mortalha envelhecida (corrupção: 3)",
    appearance: "<p>Relatos vindos dos grandes complexos de cavernas do Submundo afirmam que estas regiões são frequentemente habitadas por morcegos pálidos que podem crescer muito e são conhecidos por Odavs e Karits como Raskaals. Essas criaturas aladas são grandes o suficiente para agarrar e carregar tanto ogros quanto trolls.</p>",
    tactics: "Escolhe um alvo de cada vez, levanta-os no ar e os leva a uma área isolada para drenar o sangue deles."
  },
  "Vearon": {
    race: "Réptil (besta)",
    shadow: "Listrado cinza, como rocha atravessada por veias negras (corrupção: 1)",
    appearance: "<p>Os vearons são répteis habitantes de cavernas e podem ser encontrados em qualquer lugar do Submundo. Eles não têm olhos, são cobertos por escamas brancas leitosas que escurecem com o tempo e podem crescer até cinco metros de comprimento, do focinho à cauda.</p>",
    tactics: "Os vearons esgueiram-se até suas presas, de preferência em grupo para obter Vantagem ao flanquear. Se qualquer oponente carregar uma fonte de luz que emite calor, ele será o alvo principal."
  },
  "Intruder Daemon": {
    race: "Abominação",
    shadow: "Como uma sombra negra contra um fundo azul escuro (completamente corrompido)",
    manner: "Ferozmente leal",
    tactics: "O daemon obedece a seu mestre com desejo ardente e frenesi."
  },
  "Guard Dog": {
    race: "Cão (besta)",
    shadow: "Marrom granulado claro, como solo seco ou poeira de estrada (corrupção: 0)",
    appearance: "<p>Ao contrário dos jakaars de batalha cada vez mais comuns, o cão de guarda comum está mais focado em detectar e alertar sobre ameaças do que atacar os invasores. Praticamente todo ambriano que tem algo de valor (um negócio, uma plantação, antiguidades ou um tanto de táleres) mantém um cão de guarda treinado, seja no campo ou em um assentamento maior.</p>",
    tactics: "Os cães de guarda costumam trabalhar em pares, ajudando uns aos outros a ficar de olho na área que devem proteger. Quando intrusos aparecem, inicialmente eles latem, e depois tentam manter o inimigo ocupado até que os reforços cheguem."
  }
};

Object.assign(actorFields, {
  "Glimmer": {
    background: "<p>Como acontece com muitas das tribos bárbaras, os Vajvod contam histórias de seus inimigos que se estendem noite adentro, tempo suficiente para ver o fogo reduzido a fumaça e brasas. Apesar do medo e respeito transmitidos nessas histórias de batalhas duras, alguns inimigos custaram tantas vidas que sua menção se tornou um tabu. Admitir tais perdas seria admitir fraqueza, apesar de que falar de tais inimigos seria uma forma de alertar e preparar-se.</p><p>Uma monstruosidade que, por esse motivo, raramente é ouvida perto das fogueiras é o Cintilante. No campo de batalha, o brilho da luz do sol em alguma bugiganga, arma ou armadura pode anunciar algo mais ameaçador do que a verdade de uma batalha duramente vencida. O brilho do sol não deveria se mover com tal propósito, um clarão de luz fragmentada que gira e cintila com fria determinação. O cintilante agita-se e arde no ar com facilidade, como o clarão de espadas sem a matéria, mas com toda a malícia e intenção vil.</p><p>Se a Ordo Magica ou os mantos negros foram capazes de aprender o que os Cintilantes realmente são ou de onde eles vêm, não é algo que eles anunciaram publicamente. Aqueles que querem saber devem, portanto, confiar em lendas e rumores, como as sagas contadas entre muitos clãs que supõem alguma conexão entre as criaturas e as práticas necromânticas da antiga Symbaroum. Outros rumorem afirmam que os poucos ambrianos que chegaram às terras além das Corvos e voltaram encontraram histórias que parecem ser sobre o Cintilante, por escrito ou possivelmente em conversas com os residentes remanescentes do leste — lendas que descrevem como um exército inteiro ou força invasora foi massacrada por seres espirituais brilhantes, ou alternativamente por um solitário e onipotente Cintilante Rei.</p><p>Para aqueles que acreditam na sorte, poucos Cintilantes marcaram sua presença além das fronteiras das Corvos. No entanto, o fato deles estenderem seu alcance sugere que os Cintilantes se espalharam e que alcançam cada vez mais longe, com pouco a bloquear seu avanço. Talvez eles sejam atraídos pelo combate e derramamento de sangue; talvez isso signifique que os crescentes confrontos na região da Davokar levarão a mais sofrimento do que os envolvidos podem sequer começar a imaginar...</p>"
  },
  "Sly River Hunter": {
    background: "<p>Muitas bestas caçam nas águas turvas dos rios, mas poucas delas são tão sorrateiras quanto o Caçador Astuto do Rio. Com suas garras curtas abdominais, ele se agarra ao leito do rio, ao casco de um barco ou à parte inferior de uma doca, enquanto deixa suas longas hastes oculares espiarem a superfície. Em seguida, ele usa longas garras preênseis para puxar a presa para dentro da água, em direção a suas mandíbulas triturantes e a uma morte úmida.</p><p>A estratégia usual do caçador do rio é ficar parado no fundo do rio ou lago e, a julgar pelas vivissecções da Ordo Magica, ele se alimenta principalmente de peixes e anfíbios menores. Mas não é nada incomum que eles desenvolvam um gosto pela carne humana, ou que espécimes maiores se prendam a embarcações fluviais e abatam a tripulação pelo caminho — normalmente no ritmo de um tripulante por dia e tão discretamente que outras razões para os desaparecimentos são consideradas.</p><p>Apesar de seu perigo tortuoso, existem grupos especializados em caçar caçadores do rio. Aliás, isso tem se tornado cada vez mais comum desde que o potencial culinário da criatura foi descoberto pela nobreza de Ambria; tanto a carne quanto as enormes esferas de ovas são vendidas a um preço muito alto no reino, e dizem que a Duquesa Solar Esmerelda tem um punhado de grupos de caça particulares empregados. Os caçadores acompanham rumores sobre desaparecimentos em rios e lagos, e então usam a si mesmos como isca para atrair suas presas, prontos para lutar abaixo da superfície se necessário.</p>"
  },
  "Night Swarmers, Swarm": {
    background: "<p>A personificação da corrupção, é como Mestre Cornelio, Mestre do Capítulo em Forte do Cardo, descreve os Enxameadores Noturnos. O Padre Elfeno, primeiro Teurgo na mesma cidade, foi tão drástico em seu julgamento quando os chamou de ‘Enxames da Noite Eterna’, depois de ter sido informado sobre uma expedição catastrófica ao Templo da Serpente de Syravan; apenas um membro voltou, com graves marcas de mácula como único pagamento por seu esforço. Seja como for que você descreva essas criaturas arruinadas, não há dúvida de que qualquer caçador de fortunas que ousar se aventurar nas profundezas da Davokar corre o risco de acordá-las para uma vida fervilhante.</p><p>Como criaturas isoladas, elas não são muito impressionantes, quase da altura da palma da mão humana e finos como lascas. Mas elas nunca são encontradas sozinhas. Segundo relatos da floresta, elas reúnem-se em grande número em locais que transbordam ou irradiam corrupção, muitas vezes em ruínas assombradas ou em terrenos onde ocorreram grandes batalhas ou eventos importantes. Mestre Cornelio baseou sua análise nesses tipos de relatórios — concluindo que os Enxameadores Noturnos podem aparecer, ou melhor, nascer, como efeito de surtos massivos de energias corruptoras, e que podem sobreviver graças à escuridão persistente, para entrarem em ação quando os seres vivos entrarem em seu território.</p><p>As declarações de testemunhas coletadas no Monastério do Crepúsculo indicam que esses enxameadores são territoriais e que não irão perseguir intrusos muito longe. Além disso, os arquivos contêm informações que descrevem enxames de aproximadamente cem indivíduos e alguns locais que abrigam mais de um enxame. De acordo com rumores menos confiáveis, exploradores descuidados podem se encontrar em situações ainda piores; o que pode realmente já ter acontecido, sem nenhum sobrevivente para contar sobre isso. Histórias de advertência contadas entre vários dos clãs descrevem áreas infestadas por milhares de enxameadores que, se colocados em ação, formam praticamente uma nuvem de minúsculas mandíbulas barulhentas e pingando corrupção. Como um explorador deve se comportar se atacado por tal “nuvem assassina”, não há ninguém, nem mago nem bruxa, que ouse dizer ou mesmo oferecer sugestões.</p>"
  },
  "Night Swarmers, Murder Cloud": {
    background: "<p>A personificação da corrupção, é como Mestre Cornelio, Mestre do Capítulo em Forte do Cardo, descreve os Enxameadores Noturnos. O Padre Elfeno, primeiro Teurgo na mesma cidade, foi tão drástico em seu julgamento quando os chamou de ‘Enxames da Noite Eterna’, depois de ter sido informado sobre uma expedição catastrófica ao Templo da Serpente de Syravan; apenas um membro voltou, com graves marcas de mácula como único pagamento por seu esforço. Seja como for que você descreva essas criaturas arruinadas, não há dúvida de que qualquer caçador de fortunas que ousar se aventurar nas profundezas da Davokar corre o risco de acordá-las para uma vida fervilhante.</p><p>Como criaturas isoladas, elas não são muito impressionantes, quase da altura da palma da mão humana e finos como lascas. Mas elas nunca são encontradas sozinhas. Segundo relatos da floresta, elas reúnem-se em grande número em locais que transbordam ou irradiam corrupção, muitas vezes em ruínas assombradas ou em terrenos onde ocorreram grandes batalhas ou eventos importantes. Mestre Cornelio baseou sua análise nesses tipos de relatórios — concluindo que os Enxameadores Noturnos podem aparecer, ou melhor, nascer, como efeito de surtos massivos de energias corruptoras, e que podem sobreviver graças à escuridão persistente, para entrarem em ação quando os seres vivos entrarem em seu território.</p><p>As declarações de testemunhas coletadas no Monastério do Crepúsculo indicam que esses enxameadores são territoriais e que não irão perseguir intrusos muito longe. Além disso, os arquivos contêm informações que descrevem enxames de aproximadamente cem indivíduos e alguns locais que abrigam mais de um enxame. De acordo com rumores menos confiáveis, exploradores descuidados podem se encontrar em situações ainda piores; o que pode realmente já ter acontecido, sem nenhum sobrevivente para contar sobre isso. Histórias de advertência contadas entre vários dos clãs descrevem áreas infestadas por milhares de enxameadores que, se colocados em ação, formam praticamente uma nuvem de minúsculas mandíbulas barulhentas e pingando corrupção. Como um explorador deve se comportar se atacado por tal “nuvem assassina”, não há ninguém, nem mago nem bruxa, que ouse dizer ou mesmo oferecer sugestões.</p>"
  },
  "Managaal, Adult": {
    background: "<p>O bestial Managaal caça criaturas marcadas pela mácula, bebe seu sangue e parece ser capaz de filtrar a corrupção do sangue adicionando-a à sua própria força vital. De acordo com mitos, esses daemones notáveis foram criados pelos mestres reais de Symbaroum em uma tentativa vã, e principalmente fracassada, de se purificar da escuridão. Independente se isso é verdade ou não, a criatura tem a capacidade de libertar suas vítimas da corrupção, total ou parcialmente, mas apenas enquanto não beber até se fartar.</p><p>Até que um managaal consiga aplacar sua sede e fome, ele pode usar a corrupção acumulada como fonte de poder, para capturar mais vítimas ou fugir de situações ameaçadoras. Mas uma vez que está cheio (ou seja, quando sua corrupção acumulada é tão alta quanto seu valor de Resoluto), ele para e passa o turno seguinte vomitando um novo managaal — uma criança alada e negra, se debatendo em vômito sangrento. Dizem que essas crias escuras são muito agressivas e quase tão perigosas quanto um managaal adulto, sobretudo porque sua aparente fragilidade leva as pessoas a vê-las mais como figuras trágicas do que ameaçadoras. Pior ainda: o managaal que vomita a cria negra torna-se positivamente raivoso devido à fome de corrupção. Ai do infeliz aventureiro que por acaso estiver por perto quando a prole e seu pai forem caçar juntos!</p>"
  },
  "Managaal, Spawn": {
    background: "<p>O bestial Managaal caça criaturas marcadas pela mácula, bebe seu sangue e parece ser capaz de filtrar a corrupção do sangue adicionando-a à sua própria força vital. De acordo com mitos, esses daemones notáveis foram criados pelos mestres reais de Symbaroum em uma tentativa vã, e principalmente fracassada, de se purificar da escuridão. Independente se isso é verdade ou não, a criatura tem a capacidade de libertar suas vítimas da corrupção, total ou parcialmente, mas apenas enquanto não beber até se fartar.</p><p>Até que um managaal consiga aplacar sua sede e fome, ele pode usar a corrupção acumulada como fonte de poder, para capturar mais vítimas ou fugir de situações ameaçadoras. Mas uma vez que está cheio (ou seja, quando sua corrupção acumulada é tão alta quanto seu valor de Resoluto), ele para e passa o turno seguinte vomitando um novo managaal — uma criança alada e negra, se debatendo em vômito sangrento. Dizem que essas crias escuras são muito agressivas e quase tão perigosas quanto um managaal adulto, sobretudo porque sua aparente fragilidade leva as pessoas a vê-las mais como figuras trágicas do que ameaçadoras. Pior ainda: o managaal que vomita a cria negra torna-se positivamente raivoso devido à fome de corrupção. Ai do infeliz aventureiro que por acaso estiver por perto quando a prole e seu pai forem caçar juntos!</p>"
  },
  "Nefarani": {
    background: "<p>Ao que tudo indica, os Nefarani são o que resta de uma guarda guerreira que foi criada em Symbar para combater os inimigos cada vez mais numerosos do imperador. Desde a queda de Symbaroum, eles vagaram pelo norte da Davokar, onde foram contratados por vários chefes bárbaros para matar monstros ou batalhar com outros clãs. Como os nefarani se comunicam em total silêncio, ninguém sabe como eles decidem para onde ir ou por quem lutar. No entanto, é claro que eles estão constantemente procurando alguém para servir e que não ficarão com o mesmo mestre por mais de uma grande batalha.</p><p>Nas últimas décadas, os nefarani trilharam caminho para o sul e lutaram em batalhas entre bárbaros e ambrianos, geralmente — mas nem sempre — ao lado dos bárbaros. Embora todos possam falar, e o farão com estranhos se necessário, eles são representados coletivamente por uma porta-voz, recentemente identificada como Asenath. Em combate, esta mulher não é mais líder do que qualquer outra, o que levou os estrategistas militares ambrianos a concluir que os nefarani lutam da maneira como falam: silenciosamente e, de alguma forma, coletivamente. Alguns estudiosos cogitam até a hipótese de que nefarani é na verdade o nome de um espírito poderoso que possui todo um exército de guerreiros.</p><p>De qualquer forma, os nefarani são conhecidos por não envelhecerem como os outros, e só morrerão pelas lâminas de seus inimigos. Sem nenhum novo nefarani nascendo ou sendo criado, eles estão desaparecendo lentamente. No entanto, aqueles que ainda estão vivos ganham poder com cada irmão ou irmã caídos, ficando mais fortes ao longo do tempo. De acordo com estudiosos que os estudaram de perto, há uma crença generalizada entre os nefarani de que o último de sua espécie finalmente terá uma visão sobre o propósito maior de sua existência coletiva — uma visão que, com a força combinada dos irmãos caídos, irá ajudá-lo a determinar o destino do mundo.</p>"
  },
  "Nightmare": {
    background: "<p>Os anfitriões levam uma vida normal durante o dia, mas à noite são possuídos e forçados a cumprir as ordens do pesadelo. Os possuídos percebem essas atividades noturnas como sonhos cada vez mais selvagens, provavelmente pensando que seus pés e unhas sujas são resultado de sonambulismo — pelo menos até que o pesadelo comece a matar e devorar os cadáveres, ou quaisquer outros desejos que aquele pesadelo em particular tenha; parece variar de carniçal para carniçal. Se a vítima reagir, é claro que o hospedeiro carregará essas feridas pela manhã, como sinais claros de que algo está terrivelmente errado.</p><p>Banir um pesadelo requer que o hospedeiro seja morto ou totalmente corrompido, ou que o indivíduo seja exposto, voluntariamente ou não, a um Exorcismo purificador. Mas é claro que o pesadelo pode sair por conta própria e atingir outra pessoa, desde que o novo hospedeiro faça contato físico com o antigo. Por isso mesmo, o pesadelo às vezes seduz, ou invade a casa do que espera ser o próximo hospedeiro, a fim de chegar perto o suficiente para tocá-lo.</p>"
  },
  "Ravenous Willow, Old Crusher": {
    background: "<p>Os mesmos relatos afirmam que essas criaturas da floresta sempre vivem sozinhas, longe de outras da sua espécie, possivelmente porque a competição por comida seria muito grande. Parece que eles podem ficar parados por semanas, esperando que pássaros, esquilos e, às vezes, até animais maiores se aproximem. Em seguida, eles envolvem seus galhos semelhantes a tentáculos ao redor da vítima, estrangulando-a ou quebrando seus ossos, antes de se alimentar de seu sangue.</p><p>Os salgueiros vorazes se movem lentamente, mas, novamente, eles não precisam ser rápidos, pois eles (ou pelo menos alguns deles) podem capturar suas presas com Vinhas Emaranhadoras ou tentar bloquear sua fuga com suas raízes. Também é dito que o monstro tem a habilidade de atrair criaturas por meios místicos; para enfeitar seus galhos com a ilusão de frutas cobiçadas, ou polvilhar o solo com touceiras suculentas ou objetos reluzentes de ouro que, eles aprenderam, algumas presas acham totalmente irresistíveis.</p>"
  },
  "Ravenous Willow, Young Strangler": {
    background: "<p>Os mesmos relatos afirmam que essas criaturas da floresta sempre vivem sozinhas, longe de outras da sua espécie, possivelmente porque a competição por comida seria muito grande. Parece que eles podem ficar parados por semanas, esperando que pássaros, esquilos e, às vezes, até animais maiores se aproximem. Em seguida, eles envolvem seus galhos semelhantes a tentáculos ao redor da vítima, estrangulando-a ou quebrando seus ossos, antes de se alimentar de seu sangue.</p><p>Os salgueiros vorazes se movem lentamente, mas, novamente, eles não precisam ser rápidos, pois eles (ou pelo menos alguns deles) podem capturar suas presas com Vinhas Emaranhadoras ou tentar bloquear sua fuga com suas raízes. Também é dito que o monstro tem a habilidade de atrair criaturas por meios místicos; para enfeitar seus galhos com a ilusão de frutas cobiçadas, ou polvilhar o solo com touceiras suculentas ou objetos reluzentes de ouro que, eles aprenderam, algumas presas acham totalmente irresistíveis.</p>"
  },
  "King Toad, Older": {
    background: "<p>De todos os predadores anfíbios que espreitam nos riachos e lagoas da Davokar, o sapo-rei é provavelmente o mais famoso. A criatura, conhecida pelos clãs como Manauit, é tão desonesta quanto gulosa, e se alguém acreditar nos relatos de testemunhas oculares que circulam entre pescadores e marinheiros, eles podem crescer o suficiente para engolir embarcações menores. Alguns até afirmam que o esqueleto na Praça do Sapo deve vir de um sapo-rei de tamanho relativamente normal.</p><p>Alguns estudiosos afirmam que a criatura sapo se desenvolve em estágios, assim como os elfos e os trolls, o que explicaria por que houve tão poucos encontros relatados com indivíduos verdadeiramente gigantescos — o número de sapos-rei diminui a cada estágio de desenvolvimento, dado que muitos deles não sobrevivem à transformação. Mas outra razão para os escassos relatos pode ser, claro, que quase ninguém sobrevive a um encontro com os sapos gigantes.</p><p>Seja qual for a verdade sobre estágios e ciclos de vida, todos os que viajam pelas águas da Davokar devem ordenar a seus vigias que fiquem atentos não apenas a piratas e águas rasas, mas também a monstros sapos escondidos. Os manauits mais jovens costumam caçar em grupos de três a quatro indivíduos, geralmente à espreita na sombra da margem do rio. Eles podem crescer tanto quanto ogros e não têm problemas em capturar animais que vêm beber ou viajantes que passam em embarcações, mas quando se trata de matar suas presas, esses monstros contam com suas mandíbulas poderosas.</p><p>Os sapos-rei mais velhos e muito maiores têm armas adicionais em seu arsenal. Em primeiro lugar, eles estão sempre cercados por parentes mais jovens para ajudá-los a caçar; em segundo lugar, eles são tão grandes que podem facilmente devorar um troll soberano antes que ele tenha tempo de reagir, muito menos revidar. Os habitantes da região têm muita sorte por esses sapos-rei serem tão raros, pois haveria pouca concorrência em termos de resistência, apetite e capacidade destrutiva.</p>"
  },
  "King Toad, Young": {
    background: "<p>De todos os predadores anfíbios que espreitam nos riachos e lagoas da Davokar, o sapo-rei é provavelmente o mais famoso. A criatura, conhecida pelos clãs como Manauit, é tão desonesta quanto gulosa, e se alguém acreditar nos relatos de testemunhas oculares que circulam entre pescadores e marinheiros, eles podem crescer o suficiente para engolir embarcações menores. Alguns até afirmam que o esqueleto na Praça do Sapo deve vir de um sapo-rei de tamanho relativamente normal.</p><p>Alguns estudiosos afirmam que a criatura sapo se desenvolve em estágios, assim como os elfos e os trolls, o que explicaria por que houve tão poucos encontros relatados com indivíduos verdadeiramente gigantescos — o número de sapos-rei diminui a cada estágio de desenvolvimento, dado que muitos deles não sobrevivem à transformação. Mas outra razão para os escassos relatos pode ser, claro, que quase ninguém sobrevive a um encontro com os sapos gigantes.</p><p>Seja qual for a verdade sobre estágios e ciclos de vida, todos os que viajam pelas águas da Davokar devem ordenar a seus vigias que fiquem atentos não apenas a piratas e águas rasas, mas também a monstros sapos escondidos. Os manauits mais jovens costumam caçar em grupos de três a quatro indivíduos, geralmente à espreita na sombra da margem do rio. Eles podem crescer tanto quanto ogros e não têm problemas em capturar animais que vêm beber ou viajantes que passam em embarcações, mas quando se trata de matar suas presas, esses monstros contam com suas mandíbulas poderosas.</p><p>Os sapos-rei mais velhos e muito maiores têm armas adicionais em seu arsenal. Em primeiro lugar, eles estão sempre cercados por parentes mais jovens para ajudá-los a caçar; em segundo lugar, eles são tão grandes que podem facilmente devorar um troll soberano antes que ele tenha tempo de reagir, muito menos revidar. Os habitantes da região têm muita sorte por esses sapos-rei serem tão raros, pois haveria pouca concorrência em termos de resistência, apetite e capacidade destrutiva.</p>"
  }
});

function locateObjects(text) {
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
    if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && ["actors", "items"].includes(path[2])) {
      locations.set(`${path[2]}\0${path[3]}`, { start, end: index });
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
    let n = 0;
    while (index < text.length) {
      value([...path, n++]); ws();
      if (text[index] === "]") { index += 1; return; }
      if (text[index++] !== ",") throw new Error(`Expected comma at ${index - 1}.`);
      ws();
    }
  }
  value([]); ws();
  if (index !== text.length) throw new Error(`Unexpected trailing data at ${index}.`);
  return locations;
}

const beforeActorKeys = Object.keys(entry.actors);
const beforeItemKeys = Object.keys(entry.items);
const beforeEmbeddedKeys = new Map(beforeActorKeys.map((key) => [key, Object.keys(entry.actors[key].items ?? {})]));
const changedActors = new Set();

for (const [key, name] of Object.entries(actorNames)) {
  const actor = entry.actors[key];
  if (!actor) throw new Error(`Missing actor '${key}'.`);
  actor.name = name;
  actor.tokenName = name;
  changedActors.add(key);
}
for (const [actorKey, items] of Object.entries(embeddedNames)) {
  const actor = entry.actors[actorKey];
  if (!actor) throw new Error(`Missing actor '${actorKey}'.`);
  for (const [itemKey, name] of Object.entries(items)) {
    if (!actor.items?.[itemKey]) throw new Error(`Missing '${actorKey}' item '${itemKey}'.`);
    actor.items[itemKey].name = name;
  }
  changedActors.add(actorKey);
}
for (const [actorKey, fields] of Object.entries(actorFields)) {
  const actor = entry.actors[actorKey];
  if (!actor) throw new Error(`Missing actor '${actorKey}'.`);
  Object.assign(actor, fields);
  changedActors.add(actorKey);
}

// Códice de Monstros, p. 53. O módulo inglês registra “Sturdy” neste
// campo, mas a edição oficial em português determina Tenaz e Veloz.
const glintInfection = "Uma criatura infectada por uma faísca ganha os traços monstruosos Tenaz e Veloz, e se já os tiver, seu nível nesses traços aumenta em +1 (mas nunca pode ser superior ao Nível III). Todos os seres com uma boca grande o suficiente para a faísca forçar seu caminho podem ser infectados, mas criaturas totalmente corruptas parecem ser imunes a essa infestação em particular. Também deve ser notado que as criaturas metamorfas chamadas Bestiaals parecem ter uma relação especial com as faíscas; consulte a página 16 para mais informações sobre o assunto.";
for (const actorKey of ["Glint", "Glint-Carrier, Aboar", "Glint-Carrier, Guard Warrior"]) {
  if (!entry.actors[actorKey]) throw new Error(`Missing actor '${actorKey}'.`);
  entry.actors[actorKey].personalGoal = glintInfection;
  changedActors.add(actorKey);
}

const translatedItemFields = ["description", "noviceDescription", "adeptDescription", "masterDescription"];
function copyEmbeddedItemFields(targetActorKey, targetItemKey, sourceActorKey, sourceItemKey = targetItemKey) {
  const target = entry.actors[targetActorKey]?.items?.[targetItemKey];
  const sourceItem = entry.actors[sourceActorKey]?.items?.[sourceItemKey];
  if (!target || !sourceItem) throw new Error(`Missing embedded item copy '${sourceActorKey}.${sourceItemKey}' -> '${targetActorKey}.${targetItemKey}'.`);
  for (const field of translatedItemFields) {
    if (sourceItem[field]) target[field] = sourceItem[field];
  }
  changedActors.add(targetActorKey);
}

copyEmbeddedItemFields("Blight Worm", "Exceptionally Accurate", "Choking Undine");
copyEmbeddedItemFields("Blood Cat", "Bloodlust", "Managaal, Adult");
copyEmbeddedItemFields("Raskaal", "Bloodlust", "Managaal, Adult");

const bloodlust = entry.actors["Managaal, Adult"].items.Bloodlust;
Object.assign(entry.actors.Kelder.items.Bloodlust, {
  description: `<p>* Manter [Vigoroso←Vigoroso] em vez de enfeitiçar</p><p>&nbsp;</p>${bloodlust.description}`,
  noviceDescription: bloodlust.noviceDescription,
  adeptDescription: bloodlust.adeptDescription,
  masterDescription: bloodlust.masterDescription
});
changedActors.add("Kelder");

const deadlyBreath = entry.items["Deadly Breath"];
const harmfulAura = entry.items["Harmful Aura"];
const tunneler = entry.items.Tunneler;
if (!deadlyBreath || !harmfulAura || !tunneler) throw new Error("Missing translated top-level monster traits.");
Object.assign(entry.actors["Blaze Bug"].items["Deadly Breath (Lightning)"], Object.fromEntries(
  translatedItemFields.map((field) => [field, deadlyBreath[field]]).filter(([, value]) => value)
));
Object.assign(entry.actors["Mosey Munk"].items["Harmful Aura (Acidic)"], Object.fromEntries(
  translatedItemFields.map((field) => [field, harmfulAura[field]]).filter(([, value]) => value)
));
// O Códice define o Nadador da Enguia Martelo com a nota oficial
// “Funciona como Escavador”; por isso os campos são copiados sem adaptação livre.
Object.assign(entry.actors["Hammer Eel"].items.Swimmer, Object.fromEntries(
  translatedItemFields.map((field) => [field, tunneler[field]]).filter(([, value]) => value)
));
changedActors.add("Blaze Bug");
changedActors.add("Mosey Munk");
changedActors.add("Hammer Eel");

const embeddedDescriptions = {
  "Goblin, Shaman": {
    "Carved Wooden Staff": "<p>O mais simples bordão, frequentemente feito de madeira que foi endurecida com fogo, tem o alcance de uma arma Longa, mas não tem o efeito de armas com ponta de ferro.</p>"
  },
  "Chasm Stag": {
    Bite: "<p>Mordida 0 (perfurante: 4), e veneno 2 por 2 turnos</p>",
    Shell: "<p>Metade do dano de acordo com Enxame II</p>"
  },
  "Intruder Daemon": { Claws: "<p>Dois ataques no mesmo alvo</p>" },
  "The Black Plague Termites": { Mandibles: "<p>Dois ataques por turno mais 1D4 de corrupção temporária</p>" },
  "The Wily": { Claws: "<p>Dois ataques no mesmo alvo</p>" },
  "Guard Dog": { Bite: "<p>Dois ataques no mesmo alvo</p>" },
  Orahaug: { Bite: "<p>Mordida 2 (curta), e ácido 5 por 5 turnos</p>" },
  Beamon: { Paws: "<p>Dois ataques no mesmo alvo</p>" },
  "Blood Cat": { Claws: "<p>Dois ataques no mesmo alvo</p>" },
  Ferber: { Claws: "<p>Dois ataques no mesmo alvo</p>" },
  Garoug: { Bite: "<p>Mordida 16/10, dois ataques no mesmo alvo</p>" },
  "Hunger Wolf": { Bite: "<p>Dois ataques no mesmo alvo</p>" },
  "Jakaar, Battle-trained": { Bite: "<p>Dois ataques no mesmo alvo</p>" },
  "Jakaar, Wild": { Bite: "<p>Dois ataques no mesmo alvo</p>" },
  Kotka: { Claws: "<p>Dois ataques no mesmo alvo</p>" },
  "Fray Spider": { Bite: "<p>Dois ataques no mesmo alvo e veneno 3 por 3 turnos</p>" },
  "Hunting Spider": { Bite: "<p>Veneno 2 por 2 turnos</p>" },
  "Spider Queen": { Bite: "<p>Veneno 4 por 4 turnos</p>" },
  Wraith: {
    "Touch of death": "<p><strong>ATAQUES DESARMADOS</strong> <br /><strong>Dano: </strong> 1D4 <br /><strong>Qualidades: </strong> Curta. A Garra de Batalha tem a qualidade Impacto Profundo.</p>\n<hr />\n<p>Ataques Desarmados são normalmente utilizados como o último recurso de seres culturais e são menos efetivos que as armas naturais de bestas e abominações em quase todos os aspectos.<br /><br />Porém, com a habilidade Guerreiro Natural, mesmo um personagem desarmado pode infligir quantidades consideráveis de dano a seus inimigos.<br />Uma cotovelada, uma mordida, um soco, uma cabeçada, um chute e também o uso de soco inglês são exemplos de ataques desarmados.</p>"
  },
  "Blaze Bug": { Shell: "<p>Metade do dano de acordo com Enxame II</p>" },
  Raskaal: { "Grappling Claws": "<p>Garras preênseis 6/4, dois ataques no mesmo alvo</p>" },
  "Wraith Owl": { Talons: "<p>Garras 8/6 (longa), dois ataques no mesmo alvo (ataque livre: um ataque, 5 de dano)</p>" }
};
for (const [actorKey, descriptions] of Object.entries(embeddedDescriptions)) {
  const actor = entry.actors[actorKey];
  if (!actor) throw new Error(`Missing actor '${actorKey}'.`);
  for (const [itemKey, description] of Object.entries(descriptions)) {
    if (!actor.items?.[itemKey]) throw new Error(`Missing '${actorKey}' item '${itemKey}'.`);
    actor.items[itemKey].description = description;
  }
  changedActors.add(actorKey);
}

if (!entry.items["Harmful Aura"]) throw new Error("Missing top-level item 'Harmful Aura'.");
entry.items["Harmful Aura"].name = "Aura Nociva";

// Códice de Monstros, p. 104: “Canto da Serpente do Mundo (Canto do Troll)”.
if (!entry.items["Sing World Serpent"]) throw new Error("Missing top-level item 'Sing World Serpent'.");
entry.items["Sing World Serpent"].tradition = "Canto do Troll";

// Ferramentas de Interrogatório também aparece no Livro Básico com este custo.
if (!entry.actors["The Whip of Prios"]?.items?.["Interrogation Tools"]) throw new Error("Missing The Whip of Prios' Interrogation Tools.");
entry.actors["The Whip of Prios"].items["Interrogation Tools"].cost = "1 táler";
changedActors.add("The Whip of Prios");

if (JSON.stringify(Object.keys(entry.actors)) !== JSON.stringify(beforeActorKeys)) throw new Error("Actor keys changed.");
if (JSON.stringify(Object.keys(entry.items)) !== JSON.stringify(beforeItemKeys)) throw new Error("Top-level item keys changed.");
for (const [key, expected] of beforeEmbeddedKeys) {
  if (JSON.stringify(Object.keys(entry.actors[key].items ?? {})) !== JSON.stringify(expected)) throw new Error(`Item keys changed for '${key}'.`);
}

const locations = locateObjects(source);
const replacements = [];
for (const key of changedActors) {
  const location = locations.get(`actors\0${key}`);
  if (!location) throw new Error(`Could not locate actor '${key}'.`);
  replacements.push({ ...location, value: entry.actors[key] });
}
for (const key of ["Harmful Aura", "Sing World Serpent"]) {
  const location = locations.get(`items\0${key}`);
  if (!location) throw new Error(`Could not locate top-level item '${key}'.`);
  replacements.push({ ...location, value: entry.items[key] });
}

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
console.log(JSON.stringify({ checkOnly, wouldChange: output !== source, actorsChanged: changedActors.size }, null, 2));
