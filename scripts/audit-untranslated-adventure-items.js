const fs = require("fs");

const SOURCE = "C:/Fontes de Symbaroum/tmp/adventure-source.json";
const TRANSLATION = "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json";
const ENTRY = "Symbaroum Adventure Collection";
const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
const translated = JSON.parse(fs.readFileSync(TRANSLATION, "utf8")).entries[ENTRY];
const fields = [
  ["name", (item) => item.name],
  ["description", (item) => item.system?.description],
  ["cost", (item) => item.system?.cost],
  ["noviceDescription", (item) => item.system?.novice?.description],
  ["adeptDescription", (item) => item.system?.adept?.description],
  ["masterDescription", (item) => item.system?.master?.description]
];
const gaps = [];

for (const sourceActor of source.actors ?? []) {
  const actor = translated.actors?.[sourceActor._id];
  if (!actor) continue;
  for (const sourceItem of sourceActor.items ?? []) {
    const item = actor.items?.[sourceItem._id];
    if (!item) continue;
    for (const [field, getEnglish] of fields) {
      const english = getEnglish(sourceItem);
      if (typeof english === "string" && english.trim() && (item[field] == null || item[field] === english)) {
        gaps.push({ actor: sourceActor.name, actorId: sourceActor._id, item: sourceItem.name, itemId: sourceItem._id, field, english });
      }
    }
  }
}

for (const gap of gaps) {
  const preview = gap.english.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140);
  console.log(`${gap.actor} [${gap.actorId}] > ${gap.item} [${gap.itemId}] > ${gap.field}: ${preview}`);
}
console.log(JSON.stringify({ untranslatedEmbeddedItemFields: gaps.length }, null, 2));
