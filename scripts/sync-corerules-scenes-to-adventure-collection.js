const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json";
const ENTRY = "Symbaroum Adventure Collection";
const CORE_FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const SOURCE_FILE = "C:/Fontes de Symbaroum/tmp/adventure-source.json";
const checkOnly = process.argv.includes("--check");
const sourceText = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(sourceText);
const target = data.entries[ENTRY];
const core = JSON.parse(fs.readFileSync(CORE_FILE, "utf8")).entries["Symbaroum Core Rules"];
const source = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));
if (!target?.scenes || !core?.scenes) throw new Error("Missing scene translations.");

const beforeKeys = Object.keys(target.scenes);
const changed = new Set();
for (const sourceScene of source.scenes ?? []) {
  const scene = target.scenes[sourceScene._id];
  const canonical = core.scenes[sourceScene.name];
  if (!scene || !canonical) continue;
  if (canonical.name && scene.name !== canonical.name) {
    scene.name = canonical.name;
    changed.add(sourceScene._id);
  }
  for (const [noteKey, noteValue] of Object.entries(canonical.notes ?? {})) {
    if (Object.hasOwn(scene.notes ?? {}, noteKey) && scene.notes[noteKey] !== noteValue) {
      scene.notes[noteKey] = noteValue;
      changed.add(sourceScene._id);
    }
  }
}
if (JSON.stringify(Object.keys(target.scenes)) !== JSON.stringify(beforeKeys)) throw new Error("Scene keys changed.");

function locateScenes(text) {
  const locations = new Map(); let index = 0;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "scenes") locations.set(path[3], { start, end: index }); }
  function object(path) { index += 1; ws(); if (text[index] === "}") { index += 1; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index += 1; ws(); if (text[index] === "]") { index += 1; return; } let n = 0; while (index < text.length) { value([...path, n++]); ws(); if (text[index] === "]") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); ws(); if (index !== text.length) throw new Error("Unexpected trailing data."); return locations;
}

const locations = locateScenes(sourceText);
const replacements = [...changed].map((key) => ({ ...locations.get(key), value: target.scenes[key], key }));
if (replacements.some((replacement) => replacement.start == null)) throw new Error("Could not locate every changed scene.");
const eol = sourceText.includes("\r\n") ? "\r\n" : "\n"; let output = sourceText;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) { const lineStart = sourceText.lastIndexOf("\n", replacement.start - 1) + 1; const indent = sourceText.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? ""; const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`); output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end); }
if (!checkOnly && output !== sourceText) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: output !== sourceText, scenesChanged: changed.size }, null, 2));
