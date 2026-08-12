const fs = require("fs");

const SOURCE = "C:/Fontes de Symbaroum/tmp/monster-source-documents.json";
const FILE = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const ENTRY = "Symbaroum Monster Codex";
const checkOnly = process.argv.includes("--check");

const sourcePack = JSON.parse(fs.readFileSync(SOURCE, "utf8"))[0].value;
const sourceText = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(sourceText);
const journals = data.entries?.[ENTRY]?.journals;
if (!journals) throw new Error(`Missing journals for '${ENTRY}'.`);

const replacements = new Map();
for (const sourceJournal of sourcePack.journal ?? []) {
  const journal = journals[sourceJournal.name] ?? journals[sourceJournal._id];
  if (!journal?.pages) continue;

  for (const sourcePage of sourceJournal.pages ?? []) {
    if (journal.pages[sourcePage.name] || journal.pages[sourcePage._id]) continue;

    const legacyKey = sourcePage.name.replace(/^[^.]+\./, "");
    if (!Object.hasOwn(journal.pages, legacyKey)) {
      throw new Error(`Could not match '${sourceJournal.name}' > '${sourcePage.name}'.`);
    }
    if (replacements.has(legacyKey)) {
      throw new Error(`Ambiguous legacy page key '${legacyKey}'.`);
    }
    replacements.set(legacyKey, sourcePage.name);
  }
}

let output = sourceText;
for (const [legacyKey, sourceKey] of replacements) {
  const quotedLegacy = JSON.stringify(legacyKey);
  const quotedSource = JSON.stringify(sourceKey);
  const pattern = new RegExp(`^(\\s*)${quotedLegacy.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}: \\{`, "m");
  const matches = output.match(new RegExp(pattern.source, "gm")) ?? [];
  if (matches.length !== 1) {
    throw new Error(`Expected one object key occurrence for '${legacyKey}', found ${matches.length}.`);
  }
  output = output.replace(pattern, `$1${quotedSource}: {`);
}

const wouldChange = replacements.size > 0;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");

console.log(JSON.stringify({ checkOnly, wouldChange, keysRestored: replacements.size }, null, 2));
