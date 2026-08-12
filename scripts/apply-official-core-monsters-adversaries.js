const fs = require("fs");
const builder = require("./analyze-core-monsters-adversaries.js");

const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const JOURNAL = "Book 3: The GM Guide";
const PAGE = "3.06 - Monsters and Adversaries";
const checkOnly = process.argv.includes("--check");

const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const journal = data.entries?.[ENTRY]?.journals?.[JOURNAL];
const page = journal?.pages?.[PAGE];
if (!journal || typeof page?.text !== "string") throw new Error(`Missing '${JOURNAL}.${PAGE}'.`);

const currentNodes = builder.visible(page.text);
if (currentNodes.length !== 1734) throw new Error(`Visible-node mismatch: ${currentNodes.length}/1734.`);
let index = 0;
const alreadyTranslated = currentNodes[0] === "Monstros & Adversários";
if (!alreadyTranslated) {
  page.text = page.text.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) return part;
    if (!builder.normalize(part)) return part;
    const leading = part.match(/^\s*/)?.[0] ?? "";
    const trailing = part.match(/\s*$/)?.[0] ?? "";
    return `${leading}${builder.translated(currentNodes[index], index++, currentNodes)}${trailing}`;
  }).join("");
  if (index !== 1734) throw new Error(`Applied ${index}/1734 visible nodes.`);
}

function locateJournal(text) {
  let cursor = 0; let found;
  const ws = () => { while (/\s/.test(text[cursor] ?? "")) cursor += 1; };
  function str() { const start = cursor++; while (cursor < text.length) { if (text[cursor] === "\\") cursor += 2; else if (text[cursor++] === '"') return JSON.parse(text.slice(start, cursor)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = cursor; const token = text[cursor]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (cursor < text.length && !/[\s,}\]]/.test(text[cursor])) cursor += 1; if (token === "{" && path.join("/") === `entries/${ENTRY}/journals/${JOURNAL}`) found = { start, end: cursor }; }
  function object(path) { cursor++; ws(); if (text[cursor] === "}") { cursor++; return; } while (cursor < text.length) { const key = str(); ws(); if (text[cursor++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[cursor] === "}") { cursor++; return; } if (text[cursor++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { cursor++; ws(); if (text[cursor] === "]") { cursor++; return; } let item = 0; while (cursor < text.length) { value([...path, item++]); ws(); if (text[cursor] === "]") { cursor++; return; } if (text[cursor++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); return found;
}

const location = locateJournal(source);
if (!location) throw new Error(`Could not locate journal '${JOURNAL}'.`);
const eol = source.includes("\r\n") ? "\r\n" : "\n";
const lineStart = source.lastIndexOf("\n", location.start - 1) + 1;
const indent = source.slice(lineStart, location.start).match(/^\s*/)?.[0] ?? "";
const serialized = JSON.stringify(journal, null, 2).replaceAll("\n", `${eol}${indent}`);
const output = source.slice(0, location.start) + serialized + source.slice(location.end);
const wouldChange = output !== source;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange, visibleNodes: currentNodes.length }, null, 2));
