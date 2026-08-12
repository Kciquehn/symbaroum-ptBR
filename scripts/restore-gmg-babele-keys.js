const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json";
const ENTRY = "Symbaroum Game Masters Guide";
const checkOnly = process.argv.includes("--check");
const sourceText = fs.readFileSync(FILE, "utf8");
const original = JSON.parse(sourceText);
const entry = original.entries?.[ENTRY];
if (!entry?.journals) throw new Error(`Missing '${ENTRY}' journals.`);

const sourceAdventure = JSON.parse(fs.readFileSync("C:/Fontes de Symbaroum/tmp/gmg-source-documents.json", "utf8"))[0]?.value;
if (!sourceAdventure?.journal) throw new Error("Missing extracted GMG source journals.");
const sourceJournals = Object.fromEntries(sourceAdventure.journal.map((journal) => [journal.name, journal]));

const replacements = new Map();
for (const sourceKey of Object.keys(sourceJournals)) {
  if (entry.journals[sourceKey]) continue;
  const normalizedKey = sourceKey.replace(/^\d+\./, "");
  if (!entry.journals[normalizedKey]) throw new Error(`Cannot map journal key '${sourceKey}'.`);
  replacements.set(normalizedKey, sourceKey);
}

const mainJournalKey = "Symbaroum GMG - Journals";
const sourcePages = Object.fromEntries(sourceJournals[mainJournalKey].pages.map((page) => [page.name, page]));
const translatedPages = entry.journals[mainJournalKey]?.pages;
if (!translatedPages) throw new Error(`Missing '${mainJournalKey}' translated pages.`);
for (const sourceKey of Object.keys(sourcePages)) {
  if (translatedPages[sourceKey]) continue;
  const normalizedKey = sourceKey.replace(/^\d+\./, "");
  if (!translatedPages[normalizedKey]) throw new Error(`Cannot map page key '${sourceKey}'.`);
  replacements.set(normalizedKey, sourceKey);
}

let output = sourceText;
for (const [oldKey, newKey] of replacements) {
  const needle = `${JSON.stringify(oldKey)}:`;
  const replacement = `${JSON.stringify(newKey)}:`;
  const parts = output.split(needle);
  if (parts.length < 2) throw new Error(`Expected a raw key occurrence for '${oldKey}'.`);
  output = parts.join(replacement);
}

const reparsed = JSON.parse(output).entries?.[ENTRY];
if (!reparsed) throw new Error("Failed to parse restored GMG data.");
for (const sourceKey of Object.keys(sourceJournals)) {
  if (!reparsed.journals[sourceKey]) throw new Error(`Journal key was not restored: '${sourceKey}'.`);
}
for (const sourceKey of Object.keys(sourcePages)) {
  if (!reparsed.journals[mainJournalKey].pages[sourceKey]) throw new Error(`Page key was not restored: '${sourceKey}'.`);
}
if (Object.keys(reparsed.journals).length !== Object.keys(entry.journals).length) throw new Error("Journal count changed.");
if (Object.keys(reparsed.journals[mainJournalKey].pages).length !== Object.keys(translatedPages).length) throw new Error("Page count changed.");

if (!checkOnly && output !== sourceText) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange: output !== sourceText, keysRestored: replacements.size }, null, 2));
