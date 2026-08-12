const fs = require("fs");

const SOURCE = "C:/Fontes de Symbaroum/tmp/core-source-documents.json";
const TRANSLATION = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const fields = ["name", "description", "cost", "noviceDescription", "adeptDescription", "masterDescription"];

const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"))[0].value;
const translated = JSON.parse(fs.readFileSync(TRANSLATION, "utf8")).entries[ENTRY];
const gaps = [];

for (const [actorKey, actor] of Object.entries(translated.actors)) {
  const sourceActor = Object.values(source.actors ?? {}).find((candidate) => candidate.name === actorKey);
  if (!sourceActor) continue;
  for (const [itemKey, item] of Object.entries(actor.items ?? {})) {
    const sourceItem = Object.values(sourceActor.items ?? {}).find((candidate) => candidate.name === itemKey);
    if (!sourceItem) continue;
    for (const field of fields) {
      const english = field === "name" ? sourceItem.name : sourceItem.system?.[field];
      if (typeof english === "string" && english.trim() && (item[field] == null || item[field] === english)) {
        gaps.push({ actor: actorKey, item: itemKey, field, english });
      }
    }
  }
}

for (const gap of gaps) {
  const preview = gap.english.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140);
  console.log(`${gap.actor} > ${gap.item} > ${gap.field}: ${preview}`);
}
console.log(JSON.stringify({ untranslatedEmbeddedItemFields: gaps.length }, null, 2));
