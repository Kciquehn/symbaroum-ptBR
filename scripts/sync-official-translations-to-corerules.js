const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const checkOnly = process.argv.includes("--check");

const packs = [
  {
    label: "core",
    source: "C:/Fontes de Symbaroum/tmp/core-source-documents.json",
    target: FILE,
    entry: ENTRY,
    actorKey: (actor) => actor.name
  },
  {
    label: "monster",
    source: "C:/Fontes de Symbaroum/tmp/monster-source-documents.json",
    target: "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json",
    entry: "Symbaroum Monster Codex",
    actorKey: (actor) => actor.name
  },
  {
    label: "gmg",
    source: "C:/Fontes de Symbaroum/tmp/gmg-source-documents.json",
    target: "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json",
    entry: "Symbaroum Game Masters Guide",
    actorKey: (actor) => actor.name
  },
  {
    label: "adventure",
    source: "C:/Fontes de Symbaroum/tmp/adventure-source.json",
    target: "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json",
    entry: "Symbaroum Adventure Collection",
    actorKey: (actor) => actor._id
  }
];

const actorFields = ["race", "occupation", "resistance", "shadow", "quote", "age", "height", "weight", "appearance", "background", "personalGoal", "tactics", "manner"];
const itemFields = [
  ["description", (item) => item.system?.description],
  ["material", (item) => item.system?.material],
  ["noviceDescription", (item) => item.system?.novice?.description],
  ["adeptDescription", (item) => item.system?.adept?.description],
  ["masterDescription", (item) => item.system?.master?.description],
  ["cost", (item) => item.system?.cost],
  ["tradition", (item) => item.system?.tradition]
];

function unwrapSource(raw) {
  if (Array.isArray(raw) && raw.length === 1 && raw[0]?.value) return raw[0].value;
  return raw;
}

function translatedItem(targetContainer, sourceItem) {
  return targetContainer?.items?.[sourceItem.name] ?? targetContainer?.items?.[sourceItem._id];
}

const memory = new Map();
function remember(field, english, portuguese, origin) {
  if (typeof english !== "string" || !english.length || typeof portuguese !== "string" || !portuguese.length || portuguese === english) return;
  const key = `${field}\u0000${english}`;
  const values = memory.get(key) ?? new Map();
  const origins = values.get(portuguese) ?? [];
  origins.push(origin);
  values.set(portuguese, origins);
  memory.set(key, values);
}

function indexItem(sourceItem, translated, origin) {
  if (!translated) return;
  remember("item.name", sourceItem.name, translated.name, origin);
  for (const [field, getEnglish] of itemFields) remember(`item.${field}`, getEnglish(sourceItem), translated[field], origin);
}

for (const pack of packs) {
  const source = unwrapSource(JSON.parse(fs.readFileSync(pack.source, "utf8")));
  const translated = JSON.parse(fs.readFileSync(pack.target, "utf8")).entries?.[pack.entry];
  if (!source || !translated) throw new Error(`Missing ${pack.label} source or translation.`);

  for (const sourceItem of source.items ?? []) indexItem(sourceItem, translated.items?.[sourceItem.name] ?? translated.items?.[sourceItem._id], `${pack.label}:item:${sourceItem.name}`);
  for (const sourceActor of source.actors ?? []) {
    const actor = translated.actors?.[pack.actorKey(sourceActor)] ?? translated.actors?.[sourceActor.name] ?? translated.actors?.[sourceActor._id];
    if (!actor) continue;
    remember("actor.name", sourceActor.name, actor.name, `${pack.label}:actor:${sourceActor.name}`);
    remember("actor.tokenName", sourceActor.prototypeToken?.name, actor.tokenName, `${pack.label}:actor:${sourceActor.name}`);
    for (const field of actorFields) remember(`actor.${field}`, sourceActor.system?.bio?.[field], actor[field], `${pack.label}:actor:${sourceActor.name}`);
    for (const sourceItem of sourceActor.items ?? []) indexItem(sourceItem, translatedItem(actor, sourceItem), `${pack.label}:actor:${sourceActor.name}:${sourceItem.name}`);
  }
}

const sourceText = fs.readFileSync(FILE, "utf8");
const targetData = JSON.parse(sourceText);
const target = targetData.entries?.[ENTRY];
const coreSource = unwrapSource(JSON.parse(fs.readFileSync(packs[0].source, "utf8")));
if (!target?.actors || !coreSource?.actors) throw new Error("Missing Core Rules actors.");

function uniqueTranslation(field, english) {
  if (typeof english !== "string" || !english.length) return null;
  const values = memory.get(`${field}\u0000${english}`);
  return values?.size === 1 ? values.keys().next().value : null;
}

const beforeActorKeys = Object.keys(target.actors);
const beforeItemKeys = new Map(beforeActorKeys.map((key) => [key, Object.keys(target.actors[key].items ?? {})]));
const changedActors = new Set();
const ambiguous = new Map();
const missingItems = [];
let fieldsApplied = 0;

function applyField(object, field, english, memoryField, actorKey, path) {
  if (typeof english !== "string" || !english.length) return;
  if (typeof object[field] === "string" && object[field].length && object[field] !== english) return;
  const values = memory.get(`${memoryField}\u0000${english}`);
  if (values?.size === 1) {
    object[field] = values.keys().next().value;
    changedActors.add(actorKey);
    fieldsApplied += 1;
  } else if (values?.size > 1) {
    ambiguous.set(path, [...values.keys()]);
  }
}

for (const sourceActor of coreSource.actors) {
  const actorKey = sourceActor.name;
  const actor = target.actors[actorKey];
  if (!actor) throw new Error(`Missing Core Rules actor '${actorKey}'.`);
  applyField(actor, "name", sourceActor.name, "actor.name", actorKey, `${actorKey}.name`);
  applyField(actor, "tokenName", sourceActor.prototypeToken?.name, "actor.tokenName", actorKey, `${actorKey}.tokenName`);
  for (const field of actorFields) applyField(actor, field, sourceActor.system?.bio?.[field], `actor.${field}`, actorKey, `${actorKey}.${field}`);
  for (const sourceItem of sourceActor.items ?? []) {
    const item = translatedItem(actor, sourceItem);
    if (!item) { missingItems.push(`${actorKey}.${sourceItem.name}`); continue; }
    applyField(item, "name", sourceItem.name, "item.name", actorKey, `${actorKey}.${sourceItem.name}.name`);
    for (const [field, getEnglish] of itemFields) applyField(item, field, getEnglish(sourceItem), `item.${field}`, actorKey, `${actorKey}.${sourceItem.name}.${field}`);
  }
}

if (JSON.stringify(Object.keys(target.actors)) !== JSON.stringify(beforeActorKeys)) throw new Error("Actor keys changed.");
for (const [key, expected] of beforeItemKeys) if (JSON.stringify(Object.keys(target.actors[key].items ?? {})) !== JSON.stringify(expected)) throw new Error(`Item keys changed for '${key}'.`);

function locateActorObjects(text) {
  const locations = new Map(); let index = 0;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "actors") locations.set(path[3], { start, end: index }); }
  function object(path) { index += 1; ws(); if (text[index] === "}") { index += 1; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index += 1; ws(); if (text[index] === "]") { index += 1; return; } let n = 0; while (index < text.length) { value([...path, n++]); ws(); if (text[index] === "]") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); ws(); if (index !== text.length) throw new Error("Unexpected trailing data."); return locations;
}

const locations = locateActorObjects(sourceText);
const eol = sourceText.includes("\r\n") ? "\r\n" : "\n";
let output = sourceText;
for (const actorKey of [...changedActors].sort((a, b) => locations.get(b).start - locations.get(a).start)) {
  const location = locations.get(actorKey);
  if (!location) throw new Error(`Could not locate actor '${actorKey}'.`);
  const lineStart = sourceText.lastIndexOf("\n", location.start - 1) + 1;
  const indent = sourceText.slice(lineStart, location.start).match(/^\s*/)?.[0] ?? "";
  const serialized = JSON.stringify(target.actors[actorKey], null, "\t").replaceAll("\n", `${eol}${indent}`);
  output = output.slice(0, location.start) + serialized + output.slice(location.end);
}
const reparsed = JSON.parse(output).entries?.[ENTRY];
if (!reparsed || JSON.stringify(reparsed.actors) !== JSON.stringify(target.actors)) throw new Error("Serialized actor data mismatch.");
if (!checkOnly && output !== sourceText) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: output !== sourceText, actorsChanged: changedActors.size, fieldsApplied, missingItems, ambiguousFields: ambiguous.size, ambiguous: Object.fromEntries([...ambiguous].slice(0, 30)) }, null, 2));
