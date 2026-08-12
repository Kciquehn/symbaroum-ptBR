const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const ENTRY = "Symbaroum Monster Codex";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const entry = data.entries?.[ENTRY];
if (!entry?.journals) throw new Error(`Missing '${ENTRY}' journals.`);

const titles = {
  "Section 1: Hordes Of The Eternal Night": {
    "0 Introduction & Credits": "0.0 Introdução e Créditos",
    "01 Arachs": "01.01 Aracs",
    "02 Bestiaal": "01.02 Bestiaal",
    "03 Colossi": "01.03 Colossos",
    "04 Corrupted Nature": "01.04 Natureza Corrompida",
    "05 Darkling": "01.05 Sombriano",
    "06 Death Prince": "01.06 Príncipe da Morte",
    "07 Dragon": "01.07 Dragão",
    "08 Ettermite": "01.08 Ettermita",
    "09 Glimmer": "01.09 Cintilante",
    "10 Glint": "01.10 Faísca",
    "11 Gwann": "01.11 Gwann",
    "12 Illgoblin": "01.12 Illgoblin",
    "13 King Toad": "01.13 Sapo-Rei",
    "14 Living Thorns": "01.14 Espinhos Vivos",
    "15 Managaal": "01.15 Managaal",
    "16 Marlit": "01.16 Marlit",
    "17 Nefarani": "01.17 Nefarani",
    "18 Nightmare": "01.18 Pesadelo",
    "19 Night Swarmers": "01.19 Enxameadores Noturnos",
    "20 Ravenous Willow": "01.20 Salgueiro Voraz",
    "21 Scorner": "01.21 Escarnecedor",
    "22 Skullbiter": "01.22 Morde-crânio",
    "23 Sly River Hunter": "01.23 Caçador Astuto do Rio",
    "24 Spite": "01.24 Rancor",
    "25 Troll Shadow": "01.25 Troll Sombrio",
    "26 Vengeful Terrain": "01.26 Terreno Vingativo",
    "27 World Serpent": "01.27 Serpente do Mundo"
  },
  "Section 2: Monsters & Adversaries": {
    "01 Introduction Adversaries": "02.01 Introdução — Adversários",
    "02 Champions of Prios": "02.02 Campeões de Prios",
    "03 Ordo Magica": "02.03 Ordo Magica",
    "04 Lords of Ambria": "02.04 Lordes de Ambria",
    "05 People of Davokar": "02.05 Povos da Davokar",
    "06 People of the Queen": "02.06 Povo da Rainha",
    "07 Townsfolk": "02.07 Pessoas da Cidade",
    "08 Beasts and Monsters": "02.08 Bestas e Monstros",
    "09 Bright Davokar": "02.09 Davokar Iluminada",
    "10 Dark Davokar": "02.10 Davokar Escura",
    "11 Lakes and Rivers": "02.11 Lagos e Rios",
    "12 The Mountains": "02.12 As Montanhas",
    "13 The Underworld": "02.13 O Submundo"
  },
  "Section 3: Rules & Guidelines": {
    "00 Rules and Guidelines": "03.00 Regras e Diretrizes",
    "01 Monster Categories": "03.01 Categorias de Monstros",
    "02 Monsterous Traits": "03.02 Traços de Monstros",
    "03 The Creation of Monsters": "03.03 A Criação de Monstros",
    "04 Balanced Combat Resistance": "03.04 Resistência de Combate Balanceada",
    "05 Monster Chronicle": "03.05 Crônicas de Monstros",
    "06 Andriks": "03.06 Andriks"
  }
};

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

const beforeJournalKeys = Object.keys(entry.journals);
const changed = new Set();
function resolvePageKey(journal, legacyKey, journalKey) {
  if (Object.hasOwn(journal.pages, legacyKey)) return legacyKey;
  const matches = Object.keys(journal.pages).filter((key) => key.replace(/^[^.]+\./, "") === legacyKey);
  if (matches.length !== 1) {
    throw new Error(`Could not uniquely resolve page '${journalKey}.${legacyKey}'.`);
  }
  return matches[0];
}

for (const [journalKey, pages] of Object.entries(titles)) {
  const journal = entry.journals[journalKey];
  if (!journal?.pages) throw new Error(`Missing journal '${journalKey}'.`);
  const beforePageKeys = Object.keys(journal.pages);
  for (const [pageKey, name] of Object.entries(pages)) {
    journal.pages[resolvePageKey(journal, pageKey, journalKey)].name = name;
  }
  if (JSON.stringify(Object.keys(journal.pages)) !== JSON.stringify(beforePageKeys)) throw new Error(`Page keys changed in '${journalKey}'.`);
  changed.add(journalKey);
}
if (JSON.stringify(Object.keys(entry.journals)) !== JSON.stringify(beforeJournalKeys)) throw new Error("Journal keys changed.");

const locations = locateJournalObjects(source);
const replacements = [...changed].map((key) => {
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
console.log(JSON.stringify({ checkOnly, wouldChange: output !== source, journalsChanged: changed.size }, null, 2));
