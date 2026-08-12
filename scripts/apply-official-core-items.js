const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const items = data.entries?.[ENTRY]?.items;
if (!items) throw new Error("Missing Core Rules items.");
const originalItems = JSON.stringify(items);

const translations = {
  "Fishing line and hook": { cost: "3 ortegas" },
  "Glass vial": { name: "Copo de vidro", cost: "1 xelim" },
  Knapsack: { name: "Mochila", cost: "1 táler" }
};
const beforeKeys = Object.keys(items);
for (const [key, fields] of Object.entries(translations)) {
  if (!items[key]) throw new Error(`Missing item '${key}'.`);
  Object.assign(items[key], fields);
}
if (JSON.stringify(Object.keys(items)) !== JSON.stringify(beforeKeys)) throw new Error("Item keys changed.");

function locateItems(text) {
  const locations = new Map(); let index = 0;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.length === 4 && path[0] === "entries" && path[1] === ENTRY && path[2] === "items") locations.set(path[3], { start, end: index }); }
  function object(path) { index += 1; ws(); if (text[index] === "}") { index += 1; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index += 1; ws(); if (text[index] === "]") { index += 1; return; } let n = 0; while (index < text.length) { value([...path, n++]); ws(); if (text[index] === "]") { index += 1; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); ws(); if (index !== text.length) throw new Error("Unexpected trailing data."); return locations;
}

const locations = locateItems(source);
const replacements = Object.keys(translations).map((key) => ({ ...locations.get(key), value: items[key], key }));
if (replacements.some((replacement) => replacement.start == null)) throw new Error("Could not locate every item.");
const eol = source.includes("\r\n") ? "\r\n" : "\n"; let output = source;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) { const lineStart = source.lastIndexOf("\n", replacement.start - 1) + 1; const indent = source.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? ""; const serialized = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${indent}`); output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end); }
const wouldChange = JSON.stringify(items) !== originalItems;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange, itemsChanged: Object.keys(translations).length }, null, 2));
