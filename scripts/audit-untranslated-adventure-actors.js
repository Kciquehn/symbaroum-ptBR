const fs = require("fs");

const SOURCE = "C:/Fontes de Symbaroum/tmp/adventure-source.json";
const TRANSLATION = "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json";
const ENTRY = "Symbaroum Adventure Collection";
const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
const translated = JSON.parse(fs.readFileSync(TRANSLATION, "utf8")).entries[ENTRY];
const folders = new Map((source.folders ?? []).map((folder) => [folder._id, folder.name]));
const fields = ["name", "race", "occupation", "shadow", "quote", "appearance", "background", "personalGoal", "tactics", "manner"];
const gaps = [];

for (const sourceActor of source.actors ?? []) {
  const actor = translated.actors?.[sourceActor._id];
  if (!actor) continue;
  for (const field of fields) {
    const english = field === "name" ? sourceActor.name : sourceActor.system?.bio?.[field];
    if (typeof english === "string" && english.trim() && (actor[field] == null || actor[field] === english)) {
      gaps.push({ folder: folders.get(sourceActor.folder), actor: sourceActor.name, actorId: sourceActor._id, field, english });
    }
  }
}

for (const gap of gaps) {
  const preview = gap.english.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  console.log(`${gap.folder} > ${gap.actor} [${gap.actorId}] > ${gap.field}: ${preview}`);
}
console.log(JSON.stringify({ untranslatedActorFields: gaps.length }, null, 2));
