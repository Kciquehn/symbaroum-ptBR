const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json";
const ENTRY = "Symbaroum Game Masters Guide";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const scenes = data.entries?.[ENTRY]?.scenes;
if (!scenes) throw new Error("Missing GMG scenes.");

const translations = {
  "GM Guide Cover": { name: "Capa do Guia do Mestre" },
  "Blight Night": {
    name: "Noite Maculada",
    notes: {
      "Palisade and Gatehouse": "Paliçada e Guarita",
      "The Inn": "Estalagem",
      Stable: "Estábulo",
      Garden: "Jardim",
      Shrine: "Santuário",
      Wellspring: "Fonte"
    }
  },
  "01-c - Ambria and Davokar": {
    name: "01-c - Ambria e Davokar",
    notes: { "Thistle Hold": "Forte do Cardo" }
  },
  "02-c - Ambria and Davokar (Plain Hex)": {
    notes: { "Thistle Hold": "Forte do Cardo" }
  }
};

const beforeKeys = Object.keys(scenes);
for (const [key, fields] of Object.entries(translations)) {
  if (!scenes[key]) throw new Error(`Missing scene '${key}'.`);
  if (fields.name) scenes[key].name = fields.name;
  if (fields.notes) Object.assign(scenes[key].notes ??= {}, fields.notes);
}
if (JSON.stringify(Object.keys(scenes)) !== JSON.stringify(beforeKeys)) throw new Error("Scene keys changed.");

function locateScenes(text) {
  const locations = new Map(); let index = 0;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "scenes") locations.set(path[3], { start, end: index }); }
  function object(path) { index += 1; ws(); if (text[index] === "}") { index += 1; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index += 1; ws(); if (text[index] === "]") { index += 1; return; } let n = 0; while (index < text.length) { value([...path, n++]); ws(); if (text[index] === "]") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); ws(); if (index !== text.length) throw new Error("Unexpected trailing data."); return locations;
}

const locations = locateScenes(source);
const replacements = Object.keys(translations).map((key) => ({ ...locations.get(key), value: scenes[key], key }));
if (replacements.some((replacement) => replacement.start == null)) throw new Error("Could not locate every scene.");
const eol = source.includes("\r\n") ? "\r\n" : "\n"; let output = source;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) { const lineStart = source.lastIndexOf("\n", replacement.start - 1) + 1; const indent = source.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? ""; const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`); output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end); }
if (!checkOnly && output !== source) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: output !== source, scenesChanged: Object.keys(translations).length }, null, 2));
