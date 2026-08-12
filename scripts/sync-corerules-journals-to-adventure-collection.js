const fs = require("fs");

const CORE_SOURCE = "C:/Fontes de Symbaroum/tmp/core-source-documents.json";
const ADVENTURE_SOURCE = "C:/Fontes de Symbaroum/tmp/adventure-source.json";
const CORE_FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const FILE = "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json";
const CORE_ENTRY = "Symbaroum Core Rules";
const ENTRY = "Symbaroum Adventure Collection";
const checkOnly = process.argv.includes("--check");

const coreSource = JSON.parse(fs.readFileSync(CORE_SOURCE, "utf8"))[0].value;
const adventureSource = JSON.parse(fs.readFileSync(ADVENTURE_SOURCE, "utf8"));
const core = JSON.parse(fs.readFileSync(CORE_FILE, "utf8")).entries?.[CORE_ENTRY];
const sourceText = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(sourceText);
const target = data.entries?.[ENTRY];
if (!core?.journals || !target?.journals) throw new Error("Missing Core or Adventure journals.");

function translatedJournal(container, sourceJournal) {
  return container.journals?.[sourceJournal.name] ?? container.journals?.[sourceJournal._id];
}

function translatedPage(journal, sourcePage) {
  return journal?.pages?.[sourcePage.name] ?? journal?.pages?.[sourcePage._id];
}

const exactText = new Map();
for (const sourceJournal of coreSource.journal ?? []) {
  const journal = translatedJournal(core, sourceJournal);
  if (!journal) continue;
  for (const sourcePage of sourceJournal.pages ?? []) {
    const english = sourcePage.text?.content ?? "";
    const page = translatedPage(journal, sourcePage);
    if (!english.trim() || typeof page?.text !== "string" || page.text === english) continue;
    const candidate = { text: page.text, name: page.name, journalName: journal.name };
    const previous = exactText.get(english);
    if (!previous) exactText.set(english, candidate);
    else if (previous.text !== candidate.text) exactText.set(english, null);
  }
}

const originalJournals = JSON.stringify(target.journals);
const changedJournals = new Set();
let pagesChanged = 0;
for (const sourceJournal of adventureSource.journal ?? []) {
  const journal = translatedJournal(target, sourceJournal);
  if (!journal) continue;
  for (const sourcePage of sourceJournal.pages ?? []) {
    const english = sourcePage.text?.content ?? "";
    const page = translatedPage(journal, sourcePage);
    const match = exactText.get(english);
    if (!page || !match || !english.trim()) continue;
    if (typeof page.text === "string" && page.text !== english) continue;

    page.text = match.text;
    if (match.name && match.name !== sourcePage.name) page.name = match.name;
    if (match.journalName && match.journalName !== sourceJournal.name) journal.name = match.journalName;
    changedJournals.add(Object.hasOwn(target.journals, sourceJournal.name) ? sourceJournal.name : sourceJournal._id);
    pagesChanged += 1;
  }
}

function locateJournalObjects(text) {
  const locations = new Map();
  let index = 0;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
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
    let item = 0;
    while (index < text.length) {
      value([...path, item++]); ws();
      if (text[index] === "]") { index += 1; return; }
      if (text[index++] !== ",") throw new Error(`Expected comma at ${index - 1}.`);
      ws();
    }
  }
  value([]); ws();
  if (index !== text.length) throw new Error(`Unexpected trailing data at ${index}.`);
  return locations;
}

const wouldChange = JSON.stringify(target.journals) !== originalJournals;
let output = sourceText;
if (wouldChange) {
  const locations = locateJournalObjects(sourceText);
  const eol = sourceText.includes("\r\n") ? "\r\n" : "\n";
  const replacements = [...changedJournals].map((key) => {
    const location = locations.get(key);
    if (!location) throw new Error(`Could not locate journal '${key}'.`);
    return { ...location, value: target.journals[key] };
  });
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    const lineStart = sourceText.lastIndexOf("\n", replacement.start - 1) + 1;
    const indent = sourceText.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
    const serialized = JSON.stringify(replacement.value, null, 2).replaceAll("\n", `${eol}${indent}`);
    output = output.slice(0, replacement.start) + serialized + output.slice(replacement.end);
  }
}

// Older versions of this script serialized nested levels with tabs after the
// source line's space indentation. Normalize only that invalid mixed prefix so
// git diff --check remains clean and future runs stay idempotent.
output = output.replace(/^( +)(\t+)/gm, "$2");
const outputChanged = output !== sourceText;

if (!checkOnly && outputChanged) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: outputChanged, pagesChanged, journalsChanged: changedJournals.size }, null, 2));
