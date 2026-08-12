const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const actors = data.entries?.[ENTRY]?.actors;
if (!actors) throw new Error(`Missing '${ENTRY}' actors.`);
const originalActors = JSON.stringify(actors);

const translations = {
  "Grumpa, aka Xavagunda": {
    occupation: "Místico Autodidata",
    quote: "\"Você me ajudou, irei ajudar você\""
  },
  "Autumn Elf": {
    shadow: "Amarelo e vermelho como folhas no outono, com leves faixas de marrom ferrugem",
    appearance: "<p>Dizem que o sono entre verão e outono pode durar até cinquenta anos. Os elfos que acordam estão mais altos e com um temperamento mais ameno que seus parentes mais jovens — como o especialista em elfos Mestre Goncai em Forte do Cardo descreveu:<em> “O Elfo do Outono é velho o suficiente para apreciar a seriedade do mundo, e ainda assim, jovem o suficiente para se importar com a passagem do tempo”</em>. São os Elfos na fase do outono que assumem a responsabilidade pela liderança e a comunicação com o mundo exterior, por exemplo, o emissário Elori em Yndaros ou Gealóna que recebeu permissão para viver e trabalhar no capítulo da Ordo Magica em Agrella.</p>",
    background: "<p>De acordo com algumas estimativas, os elfos do outono vivem cerca de quatrocentos anos. Durante esse período, o elfo cresce até dois metros e dez, fica muito poderoso e, frequentemente, igualmente sábio. É evidente que suas opiniões sobre os ambrianos variam, pois alguns são vistos liderando hordas de Elfinos em ataques contra assentamentos ambrianos enquanto outros iniciam relações mais diplomáticas ou mesmo colaborativas. Mas a despeito de como eles se sentem quanto aos humanos, os elfos do outono são oponentes formidáveis para qualquer um que os deixe irritados, e não apenas por sua profunda compreensão de como manipular as energias místicas do mundo.</p>",
    tactics: "Elfos do outono lideram seus irmãos à distância, apoiando aliados com seus poderes místicos."
  },
  "Rage Troll, Famished": {
    race: "Troll",
    shadow: "Vermelho brilhante, como sangue arterial cheio de vida",
    appearance: "<p>Troll Enfurecido é o nome ambriano para o tipo mais comum dessa raça bestial. Em altura, eles são comparáveis aos ambrianos e bárbaros, mas sua constituição corporal é mais similar à de um urso ou talvez até mais ao do tipo grotesco de touro que foi visto puxando carroças do inimigo durante a Grande Guerra.</p>",
    background: "<p>Trolls furiosos podem ser encontrados isolados ou em grupos. Os primeiros frequentemente são descritos como extremamente famintos e agressivos, ao ponto de atacar aldeias fortificadas sozinhos. Os que vivem em grupos são provavelmente tão famintos e perigosos quanto seus parentes solitários, mas não são tão impulsivos; talvez por serem mais sábios, talvez porque se permitiram ser disciplinados pelo líder do grupo. Independentemente da razão, não há dúvidas de que muitas colônias, entrepostos e caravanas tenham sido massacrados por um grupo de trolls furiosos liderados por algum Troll Soberano.</p>",
    tactics: "O Troll Enfurecido faminto ataca um alvo por vez, até que todos estejam mortos."
  },
  "Rage Troll, Group Living": {
    race: "Troll",
    shadow: "Vermelho sangue",
    appearance: "<p>Troll Enfurecido é o nome ambriano para o tipo mais comum dessa raça bestial. Em altura, eles são comparáveis aos ambrianos e bárbaros, mas sua constituição corporal é mais similar à de um urso ou talvez até mais ao do tipo grotesco de touro que foi visto puxando carroças do inimigo durante a Grande Guerra.</p>",
    background: "<p>Trolls furiosos podem ser encontrados isolados ou em grupos. Os primeiros frequentemente são descritos como extremamente famintos e agressivos, ao ponto de atacar aldeias fortificadas sozinhos. Os que vivem em grupos são provavelmente tão famintos e perigosos quanto seus parentes solitários, mas não são tão impulsivos; talvez por serem mais sábios, talvez porque se permitiram ser disciplinados pelo líder do grupo. Independentemente da razão, não há dúvidas de que muitas colônias, entrepostos e caravanas tenham sido massacrados por um grupo de trolls furiosos liderados por algum Troll Soberano.</p>",
    tactics: "Os Trolls Furiosos gregários atacam em grupos, tentando cercar o alvo. Então a fúria amoque normalmente resolve o resto."
  },
  "Liege Troll": {
    race: "Troll",
    shadow: "Vermelho profundo com faixas tênues de ferrugem",
    appearance: "<p>Os terrores que os ambrianos chamam de Trolls Soberanos são bem mais incomuns que os trolls furiosos. E isso é uma coisa boa! De acordo com os registros, esses gigantes têm cerca de três metros de altura, astutamente calculistas e decididamente brutais; com humanos e bestas assim como com seus próprios seguidores.</p>",
    background: "<p>Além de alguns relatos questionáveis, os trolls soberanos nunca são vistos sozinhos; eles receberam seu nome por estarem sempre cercados por uma corte de cinco a vinte trolls furiosos devotados, preparados para fazer qualquer coisa por seu mestre. Nas lendas bárbaras, os trolls soberanos frequentemente surgem como líderes tribais, cruéis e dominadores, de fato, mas com a habilidade de planejar, organizar e dar ordens aos trolls furiosos. Mas mesmo que possa existir verdade nisso, não há nada que indique que eles tenham preocupações maiores do que encher suas próprias barrigas. Trolls Soberanos não constroem comunidades; eles exploram seus parentes menores em busca de conforto pessoal e na defesa contra outros perigos na floresta — pelo menos a julgar das observações reunidas pelo Mestre Argoi em Kurun.</p>",
    tactics: "O troll soberano envia Trolls Furiosos para testar a força do oponente, então ataca o alvo fisicamente mais fraco — preferencialmente um místico já que eles são tanto fracos quanto perigosos."
  },
  "Arch Troll": {
    race: "Troll",
    shadow: "Vermelho azulado, como o sangue anóxico das veias mais profundas",
    appearance: "<p>Os titãs vaguejantes comumente chamados de Arquitrolls não têm muito mais do que alguns traços faciais em comum com trolls menores. Além disso, as escassas observações que foram escritas discordam em tudo exceto ao descrevê-los como tendo uma altura entre dois e três homens. Além disso, os arquitrolls têm sido retratados como sendo magros ou gordos, curvados ou eretos, estúpidos ou sábios; alguns os descrevem como tendo chifres, outros como tendo um cabelo longo e oleoso.</p>",
    background: "<p>Os ambrianos e bárbaros que alegam ter encontrado com um arquitroll e sobreviveram para contar a história dizem que fizeram de uma entre duas formas; ou eles deram meia-volta e fugiram por suas vidas, ou foram soltos depois de realizar algum tipo de serviço. Sobre o último, o Grão Mestre Seldonio transcreveu uma entrevista com um caçador de fortunas sem nome que clamou ter sobrevivido a dois encontros com arquitrolls: da primeira vez ao responder uma série de charadas; da segunda ao cantar uma canção de ninar para um arquitroll exausto ainda que irritantemente animado até ele dormir.</p>",
    tactics: "O arquitroll prefere enfeitiçar o alvo, esperando aprender mais sobre ele. Se não for possível, ele libera seu poder destrutivo e rasga um oponente por vez com suas garras."
  },
  "Self-Taught Witchhunter": {
    race: "Humano",
    appearance: "<p>Os Caçadores de Bruxas são especializados em lutar contra abominações, cultistas e outros males que obtêm suas forças da escuridão da Davokar. Alguns não passam de charlatões; capangas brutais e inescrupulosos que vagam de aldeia em aldeia e coletam pagamentos para expor \"o mal\" por trás de tudo, de colheitas ruins a poços secos e surtos violentos de gripe; frequentemente algum pobre excêntrico ou forasteiro que é completamente inocente. Outros sabem o que estão fazendo...</p>",
    background: "<p>Os caçadores de bruxas ensinados ou pertencentes a ordem dos Frades do Crepúsculo e para quem a luta contra a escuridão é um chamado em vez de uma profissão são temidos por todos. Entre as piores coisas que podem acontecer a um ambriano honesto é ser culpado por \"andar na escuridão\", e é por isso que todos tomam cuidado para não acabar na mira deles. Os caçadores de bruxas tendem a ser rápidos em tomar vantagem de sua posição; onde quer que vaguem, eles vivem e comem de graça e podem esperar tudo, de emendas nas roupas ao cuidado com armas. O famoso Manto Negro Edo Adeio uma vez disse: \"Eu sou a muralha que deixa as pessoas dormirem, eu sou a lâmina que espelha a luz mais clara de Prios; quem então sou eu para recusar as ofertas feitas por aqueles que querem me servir?\"</p>",
    tactics: "O caçador de bruxas dispara um virote, e então ataca o alvo com machado e escudo — sendo o alvo uma abominação, ao menos aos olhos do caçador de bruxas..."
  },
  "Black Cloak": {
    appearance: "<p>Os Caçadores de Bruxas são especializados em lutar contra abominações, cultistas e outros males que obtêm suas forças da escuridão da Davokar. Alguns não passam de charlatões; capangas brutais e inescrupulosos que vagam de aldeia em aldeia e coletam pagamentos para expor \"o mal\" por trás de tudo, de colheitas ruins a poços secos e surtos violentos de gripe; frequentemente algum pobre excêntrico ou forasteiro que é completamente inocente. Outros sabem o que estão fazendo...</p>",
    background: "<p>Os caçadores de bruxas ensinados ou pertencentes a ordem dos Frades do Crepúsculo e para quem a luta contra a escuridão é um chamado em vez de uma profissão são temidos por todos. Entre as piores coisas que podem acontecer a um ambriano honesto é ser culpado por \"andar na escuridão\", e é por isso que todos tomam cuidado para não acabar na mira deles. Os caçadores de bruxas tendem a ser rápidos em tomar vantagem de sua posição; onde quer que vaguem, eles vivem e comem de graça e podem esperar tudo, de emendas nas roupas ao cuidado com armas. O famoso Manto Negro Edo Adeio uma vez disse: \"Eu sou a muralha que deixa as pessoas dormirem, eu sou a lâmina que espelha a luz mais clara de Prios; quem então sou eu para recusar as ofertas feitas por aqueles que querem me servir?\"</p>",
    tactics: "O Manto Negro revela abominações com o uso de rituais, mas se houver pouco tempo, ele atira com a besta e avança com a espada. É melhor matar um inocente do que ver uma abominação escapar, esse é o lema de um Manto Negro."
  },
  "Village Warrior": {
    race: "Humano (bárbaro)",
    tactics: "Guerreiros da Aldeia estão acostumados com táticas de guerrilha e começam arremessando suas lanças antes de pegar seus machados. Se as chances estão diminuindo, se afastam do combate corporal e recuam enquanto arremessam lanças adicionais no inimigo."
  },
  "Etterherd": {
    shadow: "Púrpura esverdeado",
    appearance: "<p>Do tamanho de um punho, os segue-rebanhos caçam em bandos, venenosos o suficiente para matar um homem adulto e agressivos o suficiente para de fato tentar.</p>",
    background: "<p>Quando o bando consegue uma presa, as aranhas cavam o corpo para pôr seus ovos. A carcaça é, depois, devorada por dentro e finalmente estoura quando uma nova geração de segue-rebanhos está pronta para ver a luz do dia.</p><p>Os bárbaros dos clãs nortistas de Gaoia e Enoai têm lutado com esses bandos por um longo tempo, mas o problema está espalhado por toda a Davokar. Em anos recentes, ataques a comboios viajando ao longo do Doudram, Eanor e Malgomor têm se tornado cada vez mais frequentes; os segue-rebanhos espreitam nas copas das árvores que se inclinam sobre os rios e atacam os corpos quentes em barcos que passam por baixo.</p>",
    tactics: "O enxame de aranhas se reúne ao redor de sua presa, mordendo e mordendo até que esteja morta. Então procura o próximo alvo para repetir o procedimento."
  },
  "Tricklesting": {
    shadow: "Cinza esverdeado, como os líquenes barbados da floresta",
    appearance: "<p>Os venenosos ferrão-gotejantes constroem suas colônias no subsolo, frequentemente na fronteira entre os territórios de caça dos clãs e as profundezas da floresta. Muito pouco é conhecido sobre esses caçadores construtores de teias, eles parecem capazes de crescer até um metro de diâmetro, são mestres em se mover silenciosamente, são escaladores talentosos e mais rápidos que lobos em distâncias curtas. De acordo com as bruxas, eles também possuem algum tipo de consciência primitiva e podem se comunicar uns com os outros em uma linguagem completamente desenvolvida baseada em sussurros, assobios e cliques.</p>",
    background: "<p>Ferrão-gotejantes frequentemente caçam em bandos de três a cinco aranhas, seja espreitando andarilhos solitários ou primeiro os prendendo em suas teias resistentes. As teias algumas vezes são tecidas verticalmente entre árvores, difíceis de detectar na penumbra da floresta. Outras vezes as teias verticais são usadas para levar o andarilho a desviar para um campo minado de teias ocultas no chão, camufladas com folhas e galhos. Também deve ser mencionado que ferrão-gotejantes eventualmente são acompanhados por segue-rebanhos que aproveitam a oportunidade de atacar presas rejeitadas pelas aranhas maiores.</p>",
    tactics: "A Ferrão-Gotejante usa suas teias para capturar alvos, então dança ao redor dele para flanqueá-lo e matá-lo com mordidas. Conforme o primeiro cai, ela continua no próximo, e no próximo..."
  },
  "Mare Cat": {
    shadow: "Verde escurecido",
    appearance: "<p>O Pesadelino é odiado e temido com razão em aldeias ao longo da fronteira sul da Davokar. Eles caçam em grupos de cerca de dez indivíduos e atacam à noite se espremendo por rachaduras em muralhas ou cavando sob elas.</p>",
    background: "<p>Diferente de outros predadores felinos, tais como o imenso Kotka ou a Besta Feérica, os pesadelinos sem pelo são armados com um veneno terrível secretado de glândulas sobre as presas; uma toxina potente e altamente concentrada que atinge altos preços onde pode ser comprada.</p><p>Sozinho, espécimes exilados têm sido avistados tão ao sul como em Redina, mas o pesadelino é essencialmente um predador florestal e a maior população fora da Davokar pode ser encontrada nas matas de Seragon e Mervidun.</p>",
    tactics: "Os pesadelinos espreitam seus alvos para surpreendê-los, então se movem durante o combate para manter a vantagem ao flanquear as vítimas."
  },
  "Baiagorn": {
    shadow: "Verde como as agulhas de pinheiro do ano passado",
    appearance: "<p>Semelhante a um urso, o baiagorn não é muito grande nem muito forte, mas é um dos lutadores mais ferozes das matas.</p>",
    background: "<p>Normalmente ele vaga sozinho, mas não tem medo de atacar presas significativamente maiores; ele nunca foge do perigo e, graças ao seu temperamento agressivo, frequentemente acaba vencendo mesmo as lutas mais difíceis.</p><p>O clã Baiaga, que emprega seu nome dessas bestas ursídeas de cabeça quente, desenvolveu um método para domar baiagorns e os ensina algum nível de controle. Junto a um lutador humano talentoso, um baiagorn pode ser muito efetivo; as bestas atacam e absorvem os primeiros golpes enquanto o bárbaro mantém distância esperando que o inimigo exponha um ponto fraco. Mas um urso solitário dificilmente é uma ameaça a um guerreiro talentoso; para isso provavelmente seria necessária uma fêmea com alguns filhotes.</p>",
    tactics: "Um baiagorn calmo é uma criatura cuidadosa, mas se agitado ou ferido, se transforma em uma tempestade rosnante de garras que atacam o inimigo ou presa mais próxima."
  },
  "Aboar": {
    shadow: "Vermelho profundo, com faixas tênues de ferrugem no vermelho",
    appearance: "<p>Javalis selvagens não são uma visão rara para viajantes na Davokar, especialmente a leste do território do clã Vajvod, onde são caçados por sua carne e presas. Também são os vajvods que criaram a tradição de uma vez por ano durante o inverno quando a neve facilita o rastreio, enviar um grupo de guerreiros selecionados para as profundezas da Davokar, para caçar o Gigavali.</p>",
    background: "<p>Esse suíno gigante mítico tem fama de ser parente dos trolls soberanos e até mesmo sobrepujá-los no tocante a esperteza e brutalidade. Em apenas duas ocasiões houve relatos críveis de aldeias, entrepostos ou viajantes que foram atacados por um gigavali; talvez porque todas as testemunhas em potencial tenham morrido nos outros ataques. Por outro lado, está longe de ser incomum ouvir fazendeiros e outros que trabalhem perto da Davokar contarem coisas estranhas; ocasiões em que eles subitamente perceberam estar sendo observados por um gigavali, parado no limite da floresta ou em algum ponto de suas fazendas. E nenhum desses contadores de histórias tem a menor dúvida sobre o intelecto racional e calculista oculto por trás da testa desse porco monstruoso.</p>",
    tactics: "O Gigavali usa finta para tentar afastar o inimigo de seu território; se isso falha, o gigantesco javali confia que suas presas, reflexos e couro grosso sejam o suficiente para vencer qualquer agressor."
  },
  "Kanaran": {
    race: "Réptil",
    shadow: "Verde brilhante, como a copa de uma árvore durante o auge do verão",
    appearance: "<p>Com até seis metros de comprimento, a serpente chamada Kanaran ou Restritora se especializa em atacar humanoides, especialmente humanos.</p>",
    background: "<p>Ela prefere atacar vítimas dormindo e tem a habilidade de estrangular e engolir sua presa tão silenciosamente que quaisquer companheiros da vítima nunca acordam; gerando muitos contos admonitórios para serem contados junto à sugestão de nunca ficar sem um vigia noturno quando viajar na Davokar.</p><p>Mas a kanaran também pode ser uma ameaça real para humanos despertos. Enroladas pela serpente, impedida de usar braços e armas, a vítima não tem chance de se defender e acaba sufocada até a morte. Ainda pior é o fato de que a astuta cobra pode manobrar uma vítima enrolada para se proteger de quem tentar roubar sua comida.</p>",
    tactics: "A kanaran espreita vítimas solitárias e as estrangula. Cobras desesperadas podem atacar indivíduos viajando com um grupo e então usar o alvo como escudo durante o ataque; nesses casos a kanaran normalmente estrangula a companhia inteira antes de começar a comer."
  },
  "Lindworm": {
    race: "Réptil",
    shadow: "Verde esmeralda, como as folhas de um carvalho antigo, hipnoticamente se movendo com uma brisa de verão",
    appearance: "<p>Os ambrianos que alegam ter encontrado ou lutado com um linnorme e sobrevivido para contar a história são poucos. Eles não têm asas ou pernas, mas dizem que partilham alguns traços com os dragões das fábulas, pois ambos são astutos e capazes de utilizar poderes místicos. De fato, as histórias mostram algumas variações, que podem ser interpretadas como evidências que espécimes individuais diferem uns dos outros tanto em termos de inteligência quanto de habilidades mágicas.</p>",
    background: "<p>Um exemplo amplamente conhecido, ainda que não confirmado do tipo inteligente é a serpente que se diz agir como um tipo de guia espiritual para o nortista clã Gaoia. O Chefe Rábaiamon, assim como o guardião do clã, afirmam que suas decisões são guiadas por um linnorme antigo e infinitamente sábio chamado Avô Lint. Mas a despeito de algumas visitas com promessas de compensações cada vez mais vultuosas, os representantes da Ordo Magica não puderam se encontrar com o oráculo; um fato que faz os mais céticos entre os magos questionarem a existência da serpente.</p>",
    tactics: "O linnorme é velho e dissimulado e não lutará se souber que não pode vencer ou que não ganha nada com isso. Ele prefere enfeitiçar suas vítimas para aprender sobre elas, descobrindo assim qual delas é a mais forte. Depois disso, a serpente não tem medo de deixar suas presas encerrarem a discussão."
  },
  "Violing": {
    race: "Criatura alada",
    shadow: "Verde enegrecido, como piche borbulhando na superfície de uma poça",
    appearance: "<p>Enormes bandos de corvos imensos conhecidos como violentinos ou os Manchados, vagam pela Davokar assim como pelas terras baixas e pelas montanhas. Tais bandos frequentemente podem ser ouvidos à distância, pousados em árvores e gritando uns para os outros.</p>",
    background: "<p>Muitos caçadores de fortunas têm testemunhado sobre ataques de trolls furiosos precedidos pelos gritos de violentinos; que os gritos dos trolls começam quando os pássaros ficam em silêncio. Também é dito que bruxas podem antever onde uma batalha ou disputa irá ocorrer ao ler o crocitar do bando, como se os pássaros possuíssem a habilidade de predizer surtos de violência. Talvez seja como alguns alegam: que um violentino nasce quando um corvo normal é ignorante o suficiente para comer a carcaça de uma abominação corrompida...</p><p>E não é só o grito do bando que deve ser tomado como um mau presságio; o mesmo vale para o seu silêncio. Algumas vezes os violentinos decidem caçar uma presa viva, e quando isso acontece, andarilhos não recebem qualquer aviso exceto um silêncio tumular que ocorre quando as árvores ficam cheias de formas escuras paradas, observando a vítima se aproximar com olhos vermelho sangue. Outros contos falam de situações em que vários bandos se uniram e atacaram assentamentos maiores nas terras baixas. Brejonegro foi vítima de um ataque desses há dois anos. Testemunhas oculares afirmam que o céu inteiro sobre o Forte do Cardo ficou negro quando milhares de violentinos dançaram no ar por alguns instantes antes de atacarem.</p>",
    tactics: "Os violentinos cercam seus alvos, acertando-os com seus bicos até que caiam ou recuando se o enxame diminuir. Quando múltiplos enxames se reúnem, geralmente se juntam para atacar a mesma vítima."
  },
  "Dragon Fly": {
    race: "Criatura alada",
    shadow: "Verde brilhante",
    appearance: "<p>A enganadoramente bonita Mosca Dragão é, provavelmente, a assassina mais astuta da floresta. Quando totalmente crescida, ela é grande como um humano bem constituído e suas presas, cheias de dentes afiados como agulhas, podem se abrir o suficiente para devorar um goblin inteiro. Seus dois pares de asas emitem um zumbido suave que frequentemente é camuflado pelo som das folhas, então os desatentos podem chegar bem perto da caçadora planando antes de descobri-la. Frequentemente tarde demais, já que os ataques e recuos velozes da Mosca Dragão podem exaurir até o guerreiro mais resistente.</p>",
    background: "<p>A pessoa que está para se aventurar na Davokar pela primeira vez e que é sábia o suficiente para pedir conselhos sempre recebe o mesmo aviso: o que parece ser um pedido de ajuda pode ser o chamado atraente de um predador. Existem numerosas criaturas na Davokar que usam essa técnica, uma das quais é a mosca dragão; elas podem alterar sua voz para parecer uma criança humana, chorando e implorando por ajuda. Contudo, eles não dominaram a habilidade de pronunciar palavras humanas, então no caso delas, você só deve se preocupar com gritos sem palavras.</p>",
    tactics: "A mosca dragão usa sua excelente habilidade de voo, passando pelo alvo, mordendo e continuando a voar para fora do alcance de quaisquer contra-ataques. Ela não é muito esperta, mas é astuta o suficiente para atacar primeiro as pessoas com armas à distância."
  },
  "Blight Born Aboar": {
    shadow: "Uma massa preto-púrpura que sangra lágrimas negras da mais profunda corrupção",
    tactics: "O gigavali acometido pela mácula grunhe na ânsia de enterrar suas presas em carne quente, e nunca hesita."
  },
  "Frost Light": {
    shadow: "Cinza pálido com flocos negros",
    appearance: "<p>Quando a noite cai sobre as regiões na fronteira da Davokar, as Luzes Gélidas vêm flutuando pelo ar: pequenos e disformes corpos de luz azul pálida e cintilante à procura do calor dos vivos. Às vezes chegam em grandes multidões que viajam sem ser atrapalhados por muralhas e cercas.</p>",
    background: "<p>Os bárbaros alegam que as luzes gélidas são as almas de crianças não nascidas, desesperadamente buscando proximidade, e que elas não percebem que seu toque é prejudicial. Um evento que suporta essa crença ocorreu em Yndaros no ano passado, quando as anteriormente raras vítimas de luzes gélidas se multiplicaram depois de um surto da Doença Pálida que interrompeu muitas gestações prematuramente.</p>",
    tactics: "As luzes gélidas são atraídas pelo calor e sugam a força de qualquer um que toquem. Elas não tomam qualquer decisão tática em sua caçada por conforto e corpos quentes."
  },
  "Dragoul": {
    race: "Morto-Vivo",
    shadow: "Cinza amarelado como pele morta, com pontos negros que crescem conforme o corpo morto-vivo apodrece lentamente",
    appearance: "<p>Que os mortos podem ser ressuscitados não é novidade para os ambrianos, que encontraram tais criaturas aos milhares na Grande Guerra. Com obscuros poderes místicos, os Lordes Negros despertaram guerreiros caídos para a vida e os forçaram a confrontar seus antigos aliados.</p>",
    background: "<p>Os ambrianos ainda usam o nome dos Lordes Negros para os mortos que andam, Dragouls, a despeito do fato de que os mortos andarilhos das Terras Prometidas sejam diferentes dos horrores antigos. Durante a Grande Guerra, Pansars e teurgos encontraram os mortos-vivos no campo de batalha, sempre despertados por algum usuário de poderes místicos maléficos. Mas atualmente parece que eles podem aparecer em qualquer lugar, assim que alguém morre; um nobre doente em sua cama, uma vítima de roubo em um beco de uma cidade ou um grupo de guerreiros de clã recentemente morto sob as copas da Davokar.</p><p>Felizmente, esses acontecimentos horríveis são raros até o momento, mas o fato de existirem tem feito alguns teurgos anunciarem que o fim do mundo está próximo. Para os bárbaros, os dragouls são um novo tipo de horror, mais aterrorizantes que as abominações que eles conhecem e aprenderam a combater. E como os dragouls apareceram pouco depois das primeiras intrusões ambrianas na Davokar, os sulistas receberam a culpa por esse desafio indesejado na vida já complicada na mata.</p>",
    tactics: "O morto-vivo avança de acordo com a vontade de seu criador ou a sua própria, sempre caçando por carne quente e sangue fresco."
  },
  "Necromage": {
    shadow: "Cinza escuro, como nuvens de tempestade no frio céu noturno",
    appearance: "<p>Um necromago nasce quando um feiticeiro morre e não é enterrado apropriadamente, pelo menos se você levar em conta os mitos da velha Symbaroum. Como quer que surjam, muitos exploradores bárbaros e ambrianos podem atestar a existência desse ser espectral, frequentemente com a voz trêmula de medo.</p>",
    background: "<p>Os etéreos, meio transparentes e transmorfos necromagos parecem gostar de se transformar em uma imagem espelhada e sem cores daqueles com quem se encontram. Dizem que eles estão principalmente à procura de companhia; que tentam atrair viajantes para seus covis esperando por um pouco de companhia, até que ficam cansados e consomem a alma do convidado. Existem outros contos descrevendo o que acontece quando a atração falha, que o necromago ataca, deixando suas vítimas insanas com gritos mortais antes de partir sua carne e espírito em pedaços com suas garras.</p>",
    tactics: "O necromago chama suas vítimas dobrando suas vontades, em seguida aterrorizando-as e finalizando-as com suas garras quando elas estiverem indefesas."
  },
  "Cryptwalker": {
    shadow: "Como o céu noturno sem nuvens, com uma luz suave que não faz nada além de fazer a escuridão parecer mais escura",
    appearance: "<p>As ruínas de Symbaroum são bem espalhadas e cemitérios, tumbas e mausoléus podem ser encontrados em qualquer lugar na Davokar. O que muitos caçadores de tesouros percebem tarde demais é que as tumbas frequentemente são assombradas por andarilhos da cripta; sombras que espreitam seus corpos apodrecidos ou embalsamados e que reagem raivosamente a invasões.</p>",
    background: "<p>Também existem exemplos de andarilhos da cripta que deixaram suas tumbas e vagaram diretamente para áreas populosas, seja porque se perderam ou em busca de algum caçador de tesouros que saqueou seu local de descanso. No Ano 15, tal tragédia ocorreu em Kastor; mais de cem pessoas morreram quando algo descrito como um \"Rei Espectro\" alcançou um saqueador de tumbas no mercado, durante o banquete da colheita.</p>",
    tactics: "O andarilho da cripta assume que o inimigo terá dificuldade em feri-lo, até que se prove o contrário. De uma forma ou de outra, ele usa seu poder de frio da tumba para paralisar inimigos e então finalizá-los com suas espadas."
  },
  "Flaming Servant (Template)": {
    background: "<p><strong>SERVO FLAMEJANTE</strong><br /><strong>Tradição: </strong>Magismo<br />O Místico desperta uma feroz criatura flamejante e a vincula a um traje metálico (armadura média ou pesada). O servo então caminha ao lado do Místico como um guarda-costas ardente e fumegante, que se incendeia e vira um guerreiro flamejante em batalha. O Místico pode ter somente um Servo Flamejante vinculado a si de cada vez, e caso o Servo Flamejante caia em batalha, a armadura deve ser reparada por um ferreiro para que o ritual possa ser lançado sobre a mesma armadura novamente.</p><p>O Servo Flamejante é controlado pelo jogador como se fosse um personagem adicional. Ele ganha Experiência como um personagem jogador e a perde quando morre (não é permitido Testes de Morte).</p>"
  },
  "Patron Saint (Template)": {
    background: "<p><strong>SANTO PATRONO</strong><br /><strong>Tradição: </strong>Teurgia<br />O Místico é acompanhado por um espírito guardião, a alma de um Templário caído que recebeu a missão honrosa de, mais uma vez, servir um escolhido do Deus Sol. O mártir protetor se manifesta como um guerreiro de luz que normalmente é invisível, mas que começa a brilhar quando o perigo se aproxima, e protege seu escolhido até sua segunda morte. Um Místico pode ter somente um Santo Patrono vinculado a si mesmo de cada vez, e se o santo for derrotado de qualquer forma, um novo deve ser convocado.</p><p>Um Santo Patrono é controlado pelo jogador como um personagem adicional. Ele ganha Experiência como um personagem jogador e a perde quando morre (não é permitido fazer Testes de Morte).</p>"
  },
  "Death Lord": {
    tactics: "<p>Anda em linha reta em direção ao alvo ou fica atento ao seu mestre.</p>"
  },
  "Guardian Daemon": {
    manner: "Bufa e arranha o chão",
    stigmas: "<p>O daemon permanecerá dentro de sua área de proteção e bloqueará a passagem fazendo pleno uso de suas longas garras. Se o inimigo recorrer ao uso de ataques à distância, o daemon entrará em combate corpo a corpo o mais rápido possível.</p>"
  },
  "Knowledgeable Daemon": {
    shadow: "Calma escuridão, como uma poça de betume líquido",
    manner: "Bajula e chia",
    stigmas: "<p>O daemon manterá sua distância e tentará curvar a vontade de sua vítima; quando o alvo não consegue mais resistir, o daemon consome sua alma. O maior desejo do daemon é curvar a vontade do místico invocador e depois o Escravizar — tornando possível para o daemon permanecer livre no mundo, até que o místico morra ou seja salvo da escravidão.</p>"
  },
  "Rune Guardian": {
    race: "Ser Místico",
    tactics: "<p>Obedece aos comandos do seu mestre, buscando os melhores meios para cumprir.</p>"
  },
  "Servant Daemon": {
    tactics: "<p>Relutantemente obedece aos comandos do seu mestre.</p>"
  },
  "Thorn Beasty": {
    race: "Rastejador",
    shadow: "Igual à do místico",
    tactics: "<p>Se move rapidamente com movimentos bruscos em direção à meta ou tarefa designada.</p>",
    manner: "Farfalha e crepita"
  },
  "Vindictive Daemon": {
    shadow: "Como uma nuvem negra e oleosa dançando em ventos fortes",
    tactics: "<p>O daemon tentará esperar até que a vítima esteja em um local que seja adequado ao daemon, preferivelmente uma enorme área aberta ou um grande salão. Ele pode esperar nas sombras ou nas vigas sob o telhado para ganhar <em>Vantagem</em>. Então ele ataca.</p>",
    manner: "Fareja e espia"
  },
  "Bartolom, Wizard of Ordo Magica": {
    shadow: "Cobre ardente"
  },
  "Fenya, goblin treasure-hunter": {
    shadow: "Vermelho como sangue oxigenado (Corrupção: 1)"
  },
  "Orlan of the House Daar": {
    shadow: "Prata cintilante"
  },
  "Keler": {
    occupation: "Ladrão de segunda categoria",
    manner: "Olhos furtivos, gagueja",
    tactics: "Keler dispara sua besta e empunha sua adaga se encurralado. Mas assim que ficar evidente que ele será ferido, ele solta suas armas e implora por sua vida."
  }
};

const coreItems = data.entries[ENTRY].items;
const exceptionalAttribute = coreItems["Exceptional Attribute"];
const acidicBlood = coreItems["Acidic Blood"];
const sword = coreItems.Sword;
const weakAntidote = coreItems["Weak Antidote"];
const mediumArmorDescription = actors["Mal-Rogan"].items["Fortified Chainmail"].description;
const lightArmorDescription = actors["Cult Follower"].items.Leather.description;

const embeddedItemTranslations = {
  "Black Cloak": {
    "Interrogation Tools": { cost: "1 táler" }
  },
  "Self-Taught Witchhunter": {
    Chainmail: { description: mediumArmorDescription },
    "Interrogation Tools": { cost: "1 táler" }
  },
  "Village Warrior": {
    "Fishing line and hook": { cost: "3 ortegas" },
    "Hunting Traps": { cost: "5 xelins" }
  },
  "Arch Troll": {
    "Exceptionally Resolute": { description: exceptionalAttribute.description },
    "Troll Skin": { description: "<p>(regenera 4 de vitalidade/turno, exceto dano de ácido ou fogo)</p>" }
  },
  "Liege Troll": {
    Claws: { description: "<p>Garras 13 (curta), 2 ataques no mesmo alvo 13/10</p>" },
    "Weak Antidote": { cost: weakAntidote.cost },
    "Troll Skin": { description: "<p>(regenera 4 de vitalidade/turno, exceto dano de ácido ou fogo)</p>" }
  },
  "Rage Troll, Group Living": {
    "Troll Skin": { description: "<p>(regenera 4 de vitalidade/turno, exceto dano de ácido ou fogo)</p>" },
    "Lucky charm": { description: "<p>Amuleto da sorte na forma de um crânio humano</p>" }
  },
  "Blight Born Aboar": {
    Tusks: { description: "<p>+1D6 em corrupção temporária</p>" }
  },
  "Blight Born Human": {
    "Acidic Blood": { description: acidicBlood.description }
  },
  Kanaran: {
    "Exceptionally Cunning": { description: exceptionalAttribute.description },
    "Exceptionally Quick": { description: exceptionalAttribute.description }
  },
  Cryptwalker: {
    "Wraith Blade": { description: sword.description }
  },
  "Frost Light": {
    "Touch of Death": { description: "<p>Ignora armadura, danifica Vigoroso</p>" }
  },
  Necromage: {
    "Wraith Claws": { description: "<p>Ignora armadura, danifica Resoluto</p>" }
  },
  "Dragon Fly": {
    Fangs: { description: "<p>2 ataques contra o mesmo alvo</p>" }
  },
  Violing: {
    Beak: { description: "<p>2 ataques contra o mesmo alvo</p>" }
  },
  "Rune Guardian": {
    "Stone Armor": { description: mediumArmorDescription }
  },
  "Ansel, theurg": {
    "Contacts (Sun Church)": { name: "Contatos (a Igreja do Sol)" },
    Lightbringer: { description: "<p>O livro sagrado de Prios</p>" }
  },
  "Karla, barbarian Ranger": {
    "Hardened Leather": { description: lightArmorDescription },
    "Fishing line and hook": { cost: "3 ortegas" }
  },
  "Magdala, barbarian witch": {
    "Animal Skin": { description: "<p>Em forma animal.</p>" }
  },
  "Orlan of the House Daar": {
    "Belt pouch": { description: "<p>Com solo da residência da família no sul.</p>" }
  },
  Dragoul: {
    "Rusty Sword": { description: sword.description },
    "Studded Leather": { description: lightArmorDescription }
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
actors["Liege Troll"].items["Crude alchemical equipment,"] ??= {
  name: "Equipamento alquímico rude"
};
const beforeItems = new Map(beforeActorKeys.map((key) => [key, Object.keys(actors[key].items ?? {})]));
for (const [key, fields] of Object.entries(translations)) {
  if (!actors[key]) throw new Error(`Missing actor '${key}'.`);
  Object.assign(actors[key], fields);
}
for (const [actorKey, itemTranslations] of Object.entries(embeddedItemTranslations)) {
  if (!actors[actorKey]) throw new Error(`Missing actor '${actorKey}'.`);
  for (const [itemKey, fields] of Object.entries(itemTranslations)) {
    if (!actors[actorKey].items?.[itemKey]) throw new Error(`Missing item '${actorKey}.${itemKey}'.`);
    Object.assign(actors[actorKey].items[itemKey], fields);
  }
}
delete actors["Guardian Daemon"].quote;
if (JSON.stringify(Object.keys(actors)) !== JSON.stringify(beforeActorKeys)) throw new Error("Actor keys changed.");
for (const [key, itemKeys] of beforeItems) if (JSON.stringify(Object.keys(actors[key].items ?? {})) !== JSON.stringify(itemKeys)) throw new Error(`Item keys changed for '${key}'.`);

const locations = locateActors(source);
const affectedActors = [...new Set([...Object.keys(translations), ...Object.keys(embeddedItemTranslations), "Liege Troll"])];
const replacements = affectedActors.map((key) => ({ ...locations.get(key), value: actors[key], key }));
if (replacements.some((replacement) => replacement.start == null)) throw new Error("Could not locate every actor.");
const eol = source.includes("\r\n") ? "\r\n" : "\n"; let output = source;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) { const lineStart = source.lastIndexOf("\n", replacement.start - 1) + 1; const indent = source.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? ""; const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`); output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end); }
output = output.replace(/^( +)(\t+)/gm, "$2");
const reparsed = JSON.parse(output).entries?.[ENTRY];
if (!reparsed || JSON.stringify(reparsed.actors) !== JSON.stringify(actors)) throw new Error("Serialized actor data mismatch.");
const wouldChange = JSON.stringify(actors) !== originalActors;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange, actorsChanged: affectedActors.length }, null, 2));
