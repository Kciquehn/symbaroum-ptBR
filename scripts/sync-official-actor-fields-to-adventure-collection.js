const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json";
const ENTRY = "Symbaroum Adventure Collection";
const SOURCE_FILE = "C:/Fontes de Symbaroum/tmp/adventure-source.json";
const checkOnly = process.argv.includes("--check");
const references = [
  ["C:/Fontes de Symbaroum/tmp/core-source-documents.json", "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json", "Symbaroum Core Rules"],
  ["C:/Fontes de Symbaroum/tmp/gmg-source-documents.json", "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json", "Symbaroum Game Masters Guide"],
  ["C:/Fontes de Symbaroum/tmp/monster-source-documents.json", "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json", "Symbaroum Monster Codex"]
];
const fields = ["race", "occupation", "shadow", "quote", "appearance", "background", "personalGoal", "tactics", "manner"];
const memory = new Map(fields.map((field) => [field, new Map()]));

function remember(field, english, portuguese) {
  if (typeof english !== "string" || !english.trim() || typeof portuguese !== "string" || !portuguese.trim() || english === portuguese) return;
  const values = memory.get(field).get(english) ?? new Set();
  values.add(portuguese);
  memory.get(field).set(english, values);
}

for (const [sourceFile, translationFile, entryName] of references) {
  const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"))[0].value;
  const translation = JSON.parse(fs.readFileSync(translationFile, "utf8")).entries[entryName];
  const sourceByName = new Map((source.actors ?? []).map((actor) => [actor.name, actor]));
  for (const [key, actorTranslation] of Object.entries(translation.actors ?? {})) {
    const actor = sourceByName.get(key) ?? (source.actors ?? []).find((candidate) => candidate._id === key);
    if (!actor) continue;
    for (const field of fields) remember(field, actor.system?.bio?.[field], actorTranslation[field]);
  }
}

const sourceText = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(sourceText);
const target = data.entries[ENTRY];
const source = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));
const beforeKeys = Object.keys(target.actors ?? {});
const changed = new Set();
const applied = [];

for (const sourceActor of source.actors ?? []) {
  const actor = target.actors?.[sourceActor._id];
  if (!actor) throw new Error(`Missing translated actor '${sourceActor.name}' (${sourceActor._id}).`);
  for (const field of fields) {
    const english = sourceActor.system?.bio?.[field];
    if (typeof english !== "string" || !english.trim()) continue;
    if (typeof actor[field] === "string" && actor[field].trim() && actor[field] !== english) continue;
    const values = [...(memory.get(field).get(english) ?? [])];
    if (values.length !== 1) continue;
    actor[field] = values[0];
    changed.add(sourceActor._id);
    applied.push({ actor: sourceActor.name, field });
  }
}
if (JSON.stringify(Object.keys(target.actors ?? {})) !== JSON.stringify(beforeKeys)) throw new Error("Actor keys changed.");

function locateActors(text) {
  const locations = new Map(); let index = 0;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "actors") locations.set(path[3], { start, end: index }); }
  function object(path) { index++; ws(); if (text[index] === "}") { index++; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index++; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index++; ws(); if (text[index] === "]") { index++; return; } let item = 0; while (index < text.length) { value([...path, item++]); ws(); if (text[index] === "]") { index++; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); return locations;
}

const locations = locateActors(sourceText);
const replacements = [...changed].map((key) => ({ ...locations.get(key), value: target.actors[key], key }));
if (replacements.some((replacement) => replacement.start == null)) throw new Error("Could not locate every changed actor.");
const eol = sourceText.includes("\r\n") ? "\r\n" : "\n"; let output = sourceText;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  const lineStart = sourceText.lastIndexOf("\n", replacement.start - 1) + 1;
  const indent = sourceText.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
  const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`);
  output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end);
}
const wouldChange = output !== sourceText;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange, actorsChanged: changed.size, fieldsApplied: applied.length, applied }, null, 2));
