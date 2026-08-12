const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json";
const ENTRY = "Symbaroum Adventure Collection";
const CORE_FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const MONSTER_FILE = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const ADVENTURE_SOURCE_FILE = "C:/Fontes de Symbaroum/tmp/adventure-source.json";
const CORE_SOURCE_FILE = "C:/Fontes de Symbaroum/tmp/core-source-documents.json";
const MONSTER_SOURCE_FILE = "C:/Fontes de Symbaroum/tmp/monster-source-documents.json";
const checkOnly = process.argv.includes("--check");

const translationFields = [
  "name", "description", "material", "noviceDescription", "adeptDescription", "masterDescription",
  "cost", "power0Name", "power0Description", "power1Name", "power1Description",
  "power2Name", "power2Description", "power3Name", "power3Description",
  "power4Name", "power4Description", "tradition"
];
const sourceField = {
  name: (item) => item.name,
  description: (item) => item.system?.description,
  material: (item) => item.system?.material,
  noviceDescription: (item) => item.system?.novice?.description,
  adeptDescription: (item) => item.system?.adept?.description,
  masterDescription: (item) => item.system?.master?.description,
  cost: (item) => item.system?.cost,
  tradition: (item) => item.system?.tradition
};
const normalize = (value) => value.normalize("NFKC")
  .replace(/[\u2010-\u2015\u2212]/g, "-")
  .replace(/\s+/g, " ")
  .trim()
  .toLocaleLowerCase("en-US");
const looksLikeId = (value) => /^[A-Za-z0-9]{16}$/.test(value);

const sourceText = fs.readFileSync(FILE, "utf8");
const targetData = JSON.parse(sourceText);
const target = targetData.entries?.[ENTRY];
const core = JSON.parse(fs.readFileSync(CORE_FILE, "utf8")).entries?.["Symbaroum Core Rules"];
const monster = JSON.parse(fs.readFileSync(MONSTER_FILE, "utf8")).entries?.["Symbaroum Monster Codex"];
const adventureSource = JSON.parse(fs.readFileSync(ADVENTURE_SOURCE_FILE, "utf8"));
const coreSource = JSON.parse(fs.readFileSync(CORE_SOURCE_FILE, "utf8"))[0].value;
const monsterSource = JSON.parse(fs.readFileSync(MONSTER_SOURCE_FILE, "utf8"))[0].value;
if (!target?.actors || !core?.items || !monster?.items) throw new Error("Missing expected translation entries.");
const originalTarget = JSON.stringify(target);

const candidates = new Map();
const exactFieldMemory = new Map(translationFields.map((field) => [field, new Map()]));
function addCandidate(sourceItem, translation, origin, rememberExact = true) {
  const sourceName = sourceItem?.name;
  if (!sourceName || !translation) return;
  if (rememberExact) {
    for (const field of translationFields) {
      const english = sourceField[field]?.(sourceItem);
      const portuguese = translation[field];
      if (typeof english !== "string" || !english.length || typeof portuguese !== "string" || !portuguese.length || portuguese === english) continue;
      const fieldMap = exactFieldMemory.get(field);
      const values = fieldMap.get(english) ?? new Set();
      values.add(portuguese);
      fieldMap.set(english, values);
    }
  }
  const usable = Object.fromEntries(translationFields
    .filter((field) => typeof translation[field] === "string" && translation[field].length)
    .filter((field) => translation[field] !== sourceField[field]?.(sourceItem))
    .map((field) => [field, translation[field]]));
  if (!Object.keys(usable).length) return;
  const key = normalize(sourceName);
  const list = candidates.get(key) ?? [];
  const signature = JSON.stringify(usable);
  if (!list.some((candidate) => candidate.signature === signature)) list.push({ usable, origin, signature });
  candidates.set(key, list);
}

function indexTranslatedCollection(translated, source, label, actorKey = (actor) => actor.name, rememberExact = true) {
  for (const sourceItem of source.items ?? []) addCandidate(sourceItem, translated.items?.[sourceItem.name] ?? translated.items?.[sourceItem._id], `${label}:item`, rememberExact);
  const sourceActors = new Map((source.actors ?? []).map((actor) => [actorKey(actor), actor]));
  for (const [translatedActorKey, translatedActor] of Object.entries(translated.actors ?? {})) {
    const sourceActor = sourceActors.get(translatedActorKey) ?? (source.actors ?? []).find((actor) => actor._id === translatedActorKey);
    if (!sourceActor) continue;
    for (const sourceItem of sourceActor.items ?? []) {
      const translation = translatedActor.items?.[sourceItem.name] ?? translatedActor.items?.[sourceItem._id];
      addCandidate(sourceItem, translation, `${label}:actor:${sourceActor.name}`, rememberExact);
    }
  }
}

indexTranslatedCollection(core, coreSource, "core");
indexTranslatedCollection(monster, monsterSource, "monster");
// A própria Coletânea não alimenta a memória exata: assim não propagamos
// traduções antigas cuja origem oficial ainda não foi confirmada.
indexTranslatedCollection(target, adventureSource, "adventure", (actor) => actor._id, false);

const beforeActorKeys = Object.keys(target.actors);
const beforeItemKeys = new Map(beforeActorKeys.map((key) => [key, Object.keys(target.actors[key].items ?? {})]));
const beforeTopItemKeys = Object.keys(target.items ?? {});
const changedActors = new Set();
const changedTopItems = new Set();
const unresolved = new Map();
let fieldsApplied = 0;
const appliedDetails = [];

for (const sourceActor of adventureSource.actors) {
  const actor = target.actors[sourceActor._id];
  if (!actor) throw new Error(`Missing translated actor '${sourceActor.name}' (${sourceActor._id}).`);
  for (const sourceItem of sourceActor.items ?? []) {
    const itemKey = Object.hasOwn(actor.items ?? {}, sourceItem._id) ? sourceItem._id : sourceItem.name;
    const item = actor.items?.[itemKey];
    if (!item) throw new Error(`Missing translated item '${sourceActor.name}.${sourceItem.name}' (${sourceItem._id}).`);
    const itemCandidates = candidates.get(normalize(sourceItem.name)) ?? [];
    let appliedHere = false;
    for (const field of translationFields) {
      const english = sourceField[field]?.(sourceItem);
      if (typeof item[field] === "string" && item[field].length && item[field] !== english) continue;
      const exactValues = [...(exactFieldMemory.get(field)?.get(english) ?? [])];
      const values = exactValues.length === 1
        ? exactValues
        : [...new Set(itemCandidates.map((candidate) => candidate.usable[field]).filter(Boolean))];
      if (values.length === 1) {
        item[field] = values[0];
        fieldsApplied += 1;
        appliedDetails.push({ actor: sourceActor.name, item: sourceItem.name, field, resolution: exactValues.length === 1 ? "exact-source-field" : "unique-name" });
        appliedHere = true;
      } else if (values.length > 1) {
        const key = `${sourceItem.name}:${field}`;
        const record = unresolved.get(key) ?? { item: sourceItem.name, field, occurrences: 0, values: values.length, actors: [] };
        record.occurrences += 1;
        record.actors.push(sourceActor.name);
        unresolved.set(key, record);
      }
    }
    if (appliedHere) changedActors.add(sourceActor._id);
  }
}

for (const sourceItem of adventureSource.items ?? []) {
  const itemKey = Object.hasOwn(target.items ?? {}, sourceItem._id) ? sourceItem._id : sourceItem.name;
  const item = target.items?.[itemKey];
  if (!item) throw new Error(`Missing translated top-level item '${sourceItem.name}' (${sourceItem._id}).`);
  const itemCandidates = candidates.get(normalize(sourceItem.name)) ?? [];
  for (const field of translationFields) {
    const english = sourceField[field]?.(sourceItem);
    if (typeof item[field] === "string" && item[field].length && item[field] !== english) continue;
    const exactValues = [...(exactFieldMemory.get(field)?.get(english) ?? [])];
    const values = exactValues.length === 1
      ? exactValues
      : [...new Set(itemCandidates.map((candidate) => candidate.usable[field]).filter(Boolean))];
    if (values.length === 1) {
      item[field] = values[0];
      fieldsApplied += 1;
      appliedDetails.push({ actor: "top-level collection", item: sourceItem.name, field, resolution: exactValues.length === 1 ? "exact-source-field" : "unique-name" });
      changedTopItems.add(itemKey);
    } else if (values.length > 1) {
      const key = `${sourceItem.name}:${field}`;
      const record = unresolved.get(key) ?? { item: sourceItem.name, field, occurrences: 0, values: values.length, actors: [] };
      record.occurrences += 1;
      record.actors.push("top-level collection");
      unresolved.set(key, record);
    }
  }
}

// Correspondências oficiais que não podem ser resolvidas apenas pelo nome do
// documento inglês (variantes de ficha ou itens com nomes personalizados).
const exceptionalDescription = core.items["Exceptional Attribute"]?.description;
const oneHandedDescription = core.items.Axe?.description;
const lightArmorDescription = core.items["Light Armor"]?.description;
const leader = core.items.Leader;
const tactician = core.items.Tactician;
const scalemail = core.items.Scalemail;
const acidicBlood = core.items["Acidic Blood"];
const larvaeBoil = core.items["Larvae Boil"];
const studdedLeather = core.actors["Fortune-Hunter"]?.items?.["Studded Leather"];
const chainmail = core.actors["Self-Taught Witchhunter"]?.items?.Chainmail;
if (!exceptionalDescription || !oneHandedDescription || !lightArmorDescription || !leader || !tactician || !scalemail || !acidicBlood || !larvaeBoil || !studdedLeather || !chainmail) {
  throw new Error("Missing canonical Core Rules translations for Adventure Pack overrides.");
}
const officialActorItemOverrides = [
  ["OJ0T7RGf1RbgEttX", "06HXVg8uZZL3Wy7h", { description: exceptionalDescription }],
  ["5R4awD7GrrTLS8rg", "14hyFztp0WNAtlI5", { cost: "5-10 ortegas" }],
  ["FZ8tEUDQAG7aYbjD", "036hxhMueOUcEz8o", { description: oneHandedDescription }],
  ["FZ8tEUDQAG7aYbjD", "0VOpUzv1HVMXD7kf", { description: lightArmorDescription }],
  ["uPzSQBKmpVWGPjFT", "La0Mjed99SnKcGua", { description: "<p>@Item[sJEHDaMqfSVOT5x2]{Controle de Monstros}</p>" }],
  ["eo8V2lvykhdIJRYS", "LhgYOwnF9MYWExB4", { description: exceptionalDescription }],
  ["eo8V2lvykhdIJRYS", "ZNRywzIEljrVffgl", { description: "<p>Dois ataques no mesmo alvo 12/8 ou um ataque 14</p>" }],
  ["uMRt8qun4Rl0zV8O", "x03GvZeAse1nm5Ji", { cost: "5-10 ortegas" }],
  ["GwUFLhgNaeDMedjx", "YCxVnj56vlnL3mem", { name: scalemail.name }],
  ["GwUFLhgNaeDMedjx", "eDbGchXS65w6FE7F", { description: leader.description, adeptDescription: leader.adeptDescription }],
  ["lRPggPoHHKAqfSXh", "3ZTBJjJy6MuGaQ4O", { name: tactician.name }],
  ["lRPggPoHHKAqfSXh", "OdHtMpCIjRm5ybU5", { description: core.items.Bow.description }],
  ["dyEQBBjcoVZIKkTY", "HpMbc4QpknX59grH", { description: leader.description, adeptDescription: leader.adeptDescription }],
  ["dyEQBBjcoVZIKkTY", "4hEuNpqX6CoNuAAa", { name: tactician.name }],
  ["K2UjF87flc2Xhhto", "s1H1y26Yf8MUhFlT", { description: acidicBlood.description }],
  ["K2UjF87flc2Xhhto", "zG7KTco7oOO3Zg7q", { name: "Garras" }],
  ["3UL06g4YOzcgv2Mt", "s1H1y26Yf8MUhFlT", { description: acidicBlood.description }],
  ["GzE6VETZNokAjfNY", "s1H1y26Yf8MUhFlT", { description: acidicBlood.description }],
  ["MDDtJg3T0vTeD7w3", "jS6LphnbU14jNdlQ", { name: studdedLeather.name, description: studdedLeather.description }],
  ["7asFr62zzXB1epkW", "JwsbuY6PF1gVc9m4", { name: studdedLeather.name, description: studdedLeather.description }],
  ["7asFr62zzXB1epkW", "iom6n5W6MOMIRluN", { description: leader.description, adeptDescription: leader.adeptDescription }],
  ["7asFr62zzXB1epkW", "vaoTNRPi25jqLtbl", { description: oneHandedDescription }],
  ["IXWvxtOGY1CAS5Kv", "DWbNz1g7yLsZYBzh", { name: studdedLeather.name, description: studdedLeather.description }],
  ["ZN0sGUgrNwhvVPCN", "RYaM19dKrJ3i4H6L", { name: studdedLeather.name, description: studdedLeather.description }],
  ["aSqDiLwhExrwj3Zx", "Z3dffKOHr9HYFCKF", { name: chainmail.name, description: chainmail.description }],
  ["5TkA3U4cm33PPDyV", "iIzDWVu9mWmebGqA", {
    material: larvaeBoil.material,
    noviceDescription: larvaeBoil.noviceDescription,
    adeptDescription: larvaeBoil.adeptDescription
  }],
  ["A3PhedYK8PX84qaF", "TX86UQIvf85PkDtt", { name: "Garras" }]
];
for (const [actorKey, itemKey, fields] of officialActorItemOverrides) {
  const item = target.actors[actorKey]?.items?.[itemKey];
  if (!item) throw new Error(`Missing official override target '${actorKey}.${itemKey}'.`);
  for (const [field, value] of Object.entries(fields)) {
    if (item[field] !== value) fieldsApplied += 1;
    item[field] = value;
  }
  changedActors.add(actorKey);
}

if (JSON.stringify(Object.keys(target.actors)) !== JSON.stringify(beforeActorKeys)) throw new Error("Actor keys changed.");
for (const [key, expected] of beforeItemKeys) {
  if (JSON.stringify(Object.keys(target.actors[key].items ?? {})) !== JSON.stringify(expected)) throw new Error(`Item keys changed for '${key}'.`);
}
if (JSON.stringify(Object.keys(target.items ?? {})) !== JSON.stringify(beforeTopItemKeys)) throw new Error("Top-level item keys changed.");

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
    if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && ["actors", "items"].includes(path[2])) locations.set(`${path[2]}:${path[3]}`, { start, end: index });
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

const locations = locateObjects(sourceText);
const replacements = [...changedActors].map((key) => {
  const location = locations.get(`actors:${key}`);
  if (!location) throw new Error(`Could not locate actor '${key}'.`);
  return { ...location, value: target.actors[key] };
});
for (const key of changedTopItems) {
  const location = locations.get(`items:${key}`);
  if (!location) throw new Error(`Could not locate top-level item '${key}'.`);
  replacements.push({ ...location, value: target.items[key] });
}
const eol = sourceText.includes("\r\n") ? "\r\n" : "\n";
let output = sourceText;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  const lineStart = sourceText.lastIndexOf("\n", replacement.start - 1) + 1;
  const indent = sourceText.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
  const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`);
  output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end);
}
output = output.replace(/^( +)(\t+)/gm, "$2");
const reparsed = JSON.parse(output).entries?.[ENTRY];
if (!reparsed || JSON.stringify(reparsed) !== JSON.stringify(target)) throw new Error("Serialized data mismatch.");
const wouldChange = JSON.stringify(target) !== originalTarget;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({
  checkOnly,
  wouldChange,
  actorsChanged: changedActors.size,
  topLevelItemsChanged: changedTopItems.size,
  fieldsApplied,
  appliedDetails,
  ambiguousFields: unresolved.size,
  unresolved: Object.fromEntries([...unresolved].slice(0, 40))
}, null, 2));
