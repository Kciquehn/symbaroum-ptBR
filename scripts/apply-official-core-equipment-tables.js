const fs = require("fs");

const SOURCE_FILE = "C:/Fontes de Symbaroum/tmp/core-source-documents.json";
const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const checkOnly = process.argv.includes("--check");

const sourcePack = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"))[0].value;
const sourceText = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(sourceText);
const entry = data.entries?.[ENTRY];
if (!entry?.journals || !entry?.items) throw new Error("Missing Core source or translation data.");

const translations = new Map();
function add(english, portuguese) {
  if (!english || !portuguese || english === portuguese) return;
  const previous = translations.get(english);
  if (previous && previous !== portuguese) throw new Error(`Ambiguous translation for '${english}'.`);
  translations.set(english, portuguese);
}

for (const sourceItem of sourcePack.items ?? []) {
  const translated = entry.items[sourceItem.name] ?? entry.items[sourceItem._id];
  add(sourceItem.name, translated?.name);
}

const official = {
  "Buildings": "Construções", "BUILDING": "CONSTRUÇÃO", "COST": "CUSTO", "Croft": "Campo murado",
  "Farm": "Fazenda", "Watch tower, wood": "Torre de vigia de madeira", "Watch tower, stone": "Torre de vigia de pedra",
  "Fort, wood": "Forte de madeira", "Estate": "Propriedade", "Fort, stone": "Forte de pedra", "Keep": "Fortaleza",
  "Castle": "Castelo", "Transport": "Transporte", "TRANSPORT": "TRANSPORTE", "Canoe": "Canoa", "Cart": "Carroça",
  "Galley": "Navio", "Mule": "Mula", "Riding horse": "Cavalo de Montaria", "Light": "Leve", "Heavy": "Pesado",
  "Rowing boat": "Barco a remo", "River boat": "Barco a vapor", "Sleigh": "Trenó", "Wagon": "Vagão",
  "Farm Animals": "Animais de Fazenda", "FARM ANIMALS": "ANIMAIS DE FAZENDA", "Bull": "Touro", "Chicken": "Galinha",
  "Cow": "Vaca", "Dog": "Cachorro", "Donkey": "Burro", "Ox": "Boi", "Pig": "Porco", "Rooster": "Galo",
  "Sheep": "Ovelha", "Tools": "Ferramentas", "TOOL": "FERRAMENTA",

  "Weapons": "Armas", "WEAPON": "ARMA", "DAMAGE": "DANO", "QUALITY": "QUALIDADE", "Heavy Weapon": "Arma Pesada",
  "Bastard Sword, two-handed": "Espada Bastarda, duas mãos", "Precise": "Precisa", "Deep Impact": "Impacto Profundo",
  "Jointed": "Articulada", "Long": "Longa", "Blunt": "Contundente", "Projectile Weapon": "Arma de Projétil",
  "10 arrows or bolts": "10 flechas ou virotes", "Single-Handed Weapon": "Arma de Uma Mão", "Flexible": "Flexível",
  "Steel Shield": "Escudo de Aço", "Balanced": "Equilibrada", "Short Weapon": "Arma Curta", "Short": "Curta",
  "Throwing Weapon": "Arma de Arremesso", "Unarmed Attack": "Ataque Desarmado", "Battle Claw": "Garra de Batalha",
  "51 shillingr": "1 xelim",

  "Armor": "Armaduras", "ARMOR": "ARMADURA", "PROTECTION": "PROTEÇÃO", "Impeding (−2)": "Obstrutiva (−2)",
  "Impeding (−3)": "Obstrutiva (−3)", "Impeding (−4)": "Obstrutiva (−4)", "Cumbersome": "Desajeitada",

  "Alchemical Elixirs": "Elixires alquímicos", "Alchemical Elixir": "ELIXIR ALQUÍMICO", "Antidote": "Antídoto",
  "Weak": "Fraco", "Moderate": "Moderado", "Strong": "Forte", "Poison": "Veneno",

  "Equipment": "Equipamentos", "Field equipment (Free for new characters),": "Equipamento de campo (gratuito para novos personagens),",
  "containing:": "contendo:", "Fishing line and hook": "Linha e anzol de pesca",

  "Occupation": "Proventos", "OCCUPATION": "OCUPAÇÃO", "DAILY INCOME": "RENDA DIÁRIA", "Artisan": "Artesão",
  "Knight, freelance": "Cavaleiro fidalgo autônomo", "Laborer, countryside": "Trabalhador, interior",
  "Laborer, town": "Trabalhador, cidade", "Sellsword": "Mercenário", "Rider": "Ginete", "Knight": "Cavaleiro fidalgo",
  "Clothing": "Roupas", "CLOTHES": "ROUPAS",
  "Robe": "Robe", "Expenses": "Despesas", "SERVICE": "SERVIÇO", "Bed and two meals per day": "Cama e duas refeições por dia",
  "Countryside hayloft": "Pombal no interior", "Inn, countryside": "Taverna, interior", "Inn, town": "Taverna, cidade",
  "Camp Life, per day": "Vida no campo, por dia", "Foot soldier": "Soldado de infantaria", "Feast, per person": "Banquete, por pessoa",
  "Food &amp; drink, countryside": "Comida e Bebida, interior", "(×10 in a town)": "(×10 em uma cidade)",
  "Beer/Ale": "Cerveja", "Bread": "Pão", "Casserole": "Caçarola", "Cheese": "Queijo", "Meat": "Carne",
  "Stew": "Ensopado", "Wine": "Vinho", "Containers": "Recipientes", "CONTAINER": "RECIPIENTE", "Chest": "Baú",
  "Small": "Pequeno", "Large": "Grande", "Services": "Serviços", "Bath, at an inn": "Banho em estalagem",
  "Mystic, ritual": "Místico, ritual", "Road/city toll": "Pedágio de estrada/cidade", "Washing of clothes": "Lavanderia",

  "1 orteg": "1 ortega", "2 ortegs": "2 ortegas", "3 ortegs": "3 ortegas", "4 ortegs": "4 ortegas",
  "5 ortegs": "5 ortegas", "7 ortegs": "7 ortegas", "8 ortegs": "8 ortegas", "10 ortegs": "10 ortegas",
  "15 ortegs": "15 ortegas", "1 shilling": "1 xelim", "2 shilling": "2 xelins", "2 shillings": "2 xelins",
  "3 shilling": "3 xelins", "3 shillings": "3 xelins", "4 shillings": "4 xelins", "5 shilling": "5 xelins",
  "5 shillings": "5 xelins", "6 shillings": "6 xelins", "7 shillings": "7 xelins", "1 thaler": "1 táler",
  "2 thaler": "2 táleres", "2 thalers": "2 táleres", "3 thaler": "3 táleres", "3 thalers": "3 táleres",
  "4 thaler": "4 táleres", "4 thalers": "4 táleres", "5 thaler": "5 táleres", "5 thalers": "5 táleres",
  "6 thaler": "6 táleres", "6 thalers": "6 táleres", "7 thaler": "7 táleres", "7 thalers": "7 táleres",
  "8 thaler": "8 táleres", "8 thalers": "8 táleres", "10 thaler": "10 táleres", "10 thalers": "10 táleres",
  "12 thaler": "12 táleres", "15 thaler": "15 táleres", "15 thalers": "15 táleres", "25 thaler": "25 táleres",
  "25 thalers": "25 táleres", "40 thaler": "40 táleres", "40 thalers": "40 táleres", "50 thaler": "50 táleres",
  "50 thalers": "50 táleres", "100 thaler": "100 táleres", "200 thaler": "200 táleres", "400 thaler": "400 táleres",
  "500 thaler": "500 táleres", "1 000 thaler": "1.000 táleres", "2 000 thaler": "2.000 táleres",
  "5 000 thaler": "5.000 táleres", "10 000+ thaler": "10.000+ táleres", "10+ thaler": "10+ táleres", "1+ shilling": "1+ xelins",
  "1 shilling/day": "1 xelim/dia", "1 shilling + cost for any alchemical preparations": "1 xelim + custo para quaisquer preparações alquímicas",
  "2–4 ortegs": "2–4 ortegas", "2–6 ortegs": "2–6 ortegas", "5–10 ortegs": "5–10 ortegas", "1–10 shillings": "1–10 xelins",
  "1–5 ortegs": "1–5 ortegas", "1–5 shillings": "1–5 xelins", "1–2 ortegs": "1–2 ortegas", "1–4 ortegs": "1–4 ortegas",
  "2–7 ortegs": "2–7 ortegas", "2–5 thaler": "2–5 táleres"
  ,
  "Way of Travel &amp; Time": "Meios de Viagem &amp; Tempo", "WAY OF TRAVEL": "MEIO DE VIAGEM",
  "THE PLAINS OF AMBRIA": "AS PLANÍCIES DE AMBRIA", "LIGHT DAVOKAR": "DAVOKAR ILUMINADA", "DARK DAVOKAR": "DAVOKAR ESCURA",
  "Day's march": "Dia de Marcha", "Forced march*": "Marcha forçada*", "Death march**": "Marcha mortal**",
  "Day's ride": "Dia de Cavalgada", "Forced ride*": "Cavalgada forçada*", "Death ride**": "Cavalgada mortal**",
  "*Forced march/ride means that no natural healing will occur while traveling.": "*Marcha/cavalgada forçada significa que nenhuma cura normal ocorrerá enquanto viaja.",
  "**Death march/ride involves an actual risk to one’s life and wellbeing.": "**Marcha/cavalgada mortal envolve risco real para a vida e bem-estar da pessoa.",
  "All who travel at this speed suffer at least 1 point of": "Todos que viajam a essa velocidade perdem pelo menos 1 ponto de",
  "Toughness": "Vitalidade", "each day, and must make a": "por dia, e devem fazer um Teste de", "Strong": "Vigoroso",
  "test in order to not suffer an additional 1D6 points of damage. A roll with the outcome 20 means that the traveler has been mortally damaged in an accident during its journey.": "para não sofrer 1D6 de dano adicional. A rolagem de um 20 significa que o viajante foi mortalmente ferido em um acidente durante sua jornada.",

  "Settlement &amp; Equipment": "Assentamentos &amp; Equipamentos", "SETTLEMENT": "ASSENTAMENTO", "SINGLE ITEM": "UM ITEM",
  "NUMBER OF ITEMS": "NÚMERO DE ITENS", "Lonely farm": "Fazenda solitária", "Solitary village": "Aldeia solitária",
  "Ordinary village": "Aldeia comum", "Trade station": "Estação mercante", "Ambrian town": "Cidade ambriana",
  "Thistle Hold": "Forte do Cardo", "Yndaros": "Yndaros", "30 thaler": "30 táleres", "1000 thaler": "1.000 táleres",
  "10000 thaler": "10.000 táleres",

  "Bribes": "Subornos", "LEVEL OF RISK": "NÍVEL DE RISCO", "MEANING": "SIGNIFICADO", "SIZE OF BRIBE": "TAMANHO DO SUBORNO",
  "Low": "Baixo", "To do one’s job faster": "Fazer seu trabalho mais rápido",
  "One tenth of the person’s daily income. If this becomes less than an orteg, then the greasing is done with food or something similar.": "Um décimo da renda diária da pessoa. Caso isso seja menos que uma ortega, então o suborno é feito com comida ou algo similar.",
  "Moderate": "Moderado", "To break a rule": "Quebrar uma regra", "One day’s income": "Um dia de renda", "High": "Alto",
  "To break a law": "Quebrar uma lei",
  "10–100 day’s income, as well as a good chance to go unnoticed for the bribed person. Very few established persons commit crimes with a possible death sentence or exile just for money.": "10–100 dias de renda, assim como uma boa chance da pessoa subornada se safar. Muito poucas pessoas estabelecidas cometem crimes com uma possível sentença de morte ou exílio apenas por dinheiro.",

  "Marks of Corruption": "Marcas de Corrupção", "EXAMPLES OF STIGMAS": "EXEMPLOS DE ESTIGMAS",
  "A festering wound that does not heal": "Uma ferida purulenta que não se cura",
  "Discolored skin, blemishes and severe rashes": "Pele descolorada, manchas e erupções severas",
  "Boils in mouth and throat, that burst at inappropriate times": "Bolhas na boca e garganta, que estouram em momentos inapropriados",
  "Fangs, or nails in the shape of claws or talons": "Presas ou unhas na forma de garras",
  "A birthmark that with imagination may look like a dark rune or an evil symbol": "Uma marca de nascença que, com imaginação, pode parecer uma runa sombria ou um símbolo maligno",
  "Eyes that glitter in the dark": "Olhos que brilham no escuro", "Eyes that actually blacken with anger, hunger or lust": "Olhos que de fato escurecem com raiva, fome ou luxúria",
  "A faint odor of decay follows the person, despite him or her looking healthy": "Um leve odor de decomposição segue a pessoa, a despeito dela parecer saudável",
  "Breath that stinks of sulfur": "Hálito que fede a enxofre", "Veins that bulge black when experiencing anger or other strong emotions": "Veias que pulsam negras quando experimenta raiva ou outras emoções fortes",
  "Dark streaks in the blood, visible when the creature bleeds": "Riscos negros no sangue, visíveis quando a criatura sangra",
  "Cold as a corpse or feverishly hot without any signs of sickness or disease": "Frio como um cadáver ou febril sem qualquer sinal de doenças",
  "Speaks in a unknown evil-sounding language while sleeping": "Fala em uma língua desconhecida que soa maligna enquanto dorme",
  "Degeneration of sight; relying on other senses instead, like smell and touch": "Degeneração da visão; dependendo de outros sentidos, como cheiro e toque",
  "Taste for cadavers, must feed on something rancid every day to avoid starvation": "Gosto por cadáveres, deve comer algo rançoso todos os dias para evitar a fome",
  "Taste for raw meat, must feed on fresh meat every day to avoid starvation": "Gosto por carne crua, deve se alimentar de carne fresca todos os dias para evitar a fome",
  "Thirst for warm blood, must drink warm blood every day to not be thirsty": "Sede de sangue quente, deve beber sangue quente todo dia para não ficar sedento"
};
// The printed tables are authoritative when their wording differs from an
// individual item entry (for example, a shortened equipment label).
for (const [english, portuguese] of Object.entries(official)) translations.set(english, portuguese);

const pageSpecs = [
  ...[
    "2.09a - Weapons Table", "2.09b - Armor Table", "2.09c - Alchemical Elixirs Table",
    "2.09d - Equipment Table", "2.09e - Buildings, Transport, Animals & Tools",
    "2.09f - Occupation, Clothing, Expenses & Services"
  ].map((page) => ({ journal: "Book 2: The Players Guide", page })),
  ...[
    "3.03a - Way of Travel and Time", "3.03c - Settlement & Equipment",
    "3.03b - Bribes", "3.02a - Marks of Corruption"
  ].map((page) => ({ journal: "Book 3: The GM Guide", page }))
];

function translateVisibleText(html, label) {
  const unresolved = new Set();
  const output = html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) return part;
    const normalized = part.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim();
    if (!normalized) return part;
    const translated = translations.get(normalized);
    if (!translated) {
      if (/[A-Za-z]/.test(normalized) && !/^\d+D\d+(?:\+\d+)?$/.test(normalized) && !/^\d+km$/.test(normalized)) unresolved.add(normalized);
      return part;
    }
    const leading = part.match(/^\s*/)?.[0] ?? "";
    const trailing = part.match(/\s*$/)?.[0] ?? "";
    return `${leading}${translated}${trailing}`;
  }).join("");
  if (unresolved.size) throw new Error(`${label}: unresolved official strings: ${[...unresolved].join(" | ")}`);
  return output;
}

const beforeKeys = new Map(Object.entries(entry.journals).map(([key, value]) => [key, Object.keys(value.pages ?? {})]));
const changedJournals = new Set();
let pagesChanged = 0;
for (const spec of pageSpecs) {
  const sourceJournal = sourcePack.journal.find((candidate) => candidate.name === spec.journal);
  const journal = entry.journals[spec.journal];
  const pageKey = spec.page;
  const sourcePage = sourceJournal.pages.find((page) => page.name === pageKey);
  const page = journal.pages[pageKey] ?? journal.pages[sourcePage?._id];
  if (!sourcePage || !page || typeof page.text !== "string") throw new Error(`Missing page '${pageKey}'.`);
  const english = sourcePage.text?.content ?? "";
  if (page.text !== english) continue;
  const translated = translateVisibleText(english, pageKey);
  if (translated !== english) {
    page.text = translated;
    pagesChanged += 1;
    changedJournals.add(spec.journal);
  }
}
for (const [key, keys] of beforeKeys) {
  if (JSON.stringify(Object.keys(entry.journals[key]?.pages ?? {})) !== JSON.stringify(keys)) throw new Error(`Page keys changed in '${key}'.`);
}

function locateJournals(text) {
  let index = 0;
  const found = new Map();
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "journals") found.set(path[3], { start, end: index }); }
  function object(path) { index += 1; ws(); if (text[index] === "}") { index += 1; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index += 1; ws(); if (text[index] === "]") { index += 1; return; } let item = 0; while (index < text.length) { value([...path, item++]); ws(); if (text[index] === "]") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); return found;
}

let output = sourceText;
if (pagesChanged) {
  const locations = locateJournals(sourceText);
  const eol = sourceText.includes("\r\n") ? "\r\n" : "\n";
  const replacements = [...changedJournals].map((key) => ({ ...locations.get(key), key }));
  if (replacements.some((replacement) => replacement.start == null)) throw new Error("Could not locate all changed journals.");
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    const lineStart = sourceText.lastIndexOf("\n", replacement.start - 1) + 1;
    const indent = sourceText.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
    const serialized = JSON.stringify(entry.journals[replacement.key], null, 2).replaceAll("\n", `${eol}${indent}`);
    output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end);
  }
}

const wouldChange = output !== sourceText;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange, pagesChanged }, null, 2));
