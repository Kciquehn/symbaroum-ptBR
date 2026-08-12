const fs = require("fs");

const [sourceFile, translationFile, entry] = process.argv.slice(2);
if (!sourceFile || !translationFile || !entry) {
  throw new Error("Usage: node scripts/audit-untranslated-pack-content.js <source.json> <translation.json> <entry>");
}
const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"))[0].value;
const translated = JSON.parse(fs.readFileSync(translationFile, "utf8")).entries[entry];
if (!translated) throw new Error(`Missing entry '${entry}'.`);
const itemFields = [
  ["name", (item) => item.name],
  ["description", (item) => item.system?.description],
  ["cost", (item) => item.system?.cost],
  ["material", (item) => item.system?.material],
  ["tradition", (item) => item.system?.tradition],
  ["noviceDescription", (item) => item.system?.novice?.description],
  ["adeptDescription", (item) => item.system?.adept?.description],
  ["masterDescription", (item) => item.system?.master?.description]
];
const actorFields = ["name", "race", "occupation", "shadow", "quote", "appearance", "background", "personalGoal", "tactics", "manner"];
const gaps = [];

function checkItem(kind, owner, sourceItem, item) {
  if (!item) return;
  for (const [field, getEnglish] of itemFields) {
    const english = getEnglish(sourceItem);
    if (typeof english === "string" && english.trim() && (item[field] == null || item[field] === english)) {
      gaps.push({ kind, owner, item: sourceItem.name, field, english });
    }
  }
}

for (const sourceItem of source.items ?? []) {
  checkItem("top-item", entry, sourceItem, translated.items?.[sourceItem.name] ?? translated.items?.[sourceItem._id]);
}
for (const sourceActor of source.actors ?? []) {
  const actor = translated.actors?.[sourceActor.name] ?? translated.actors?.[sourceActor._id];
  if (!actor) continue;
  for (const field of actorFields) {
    const english = field === "name" ? sourceActor.name : sourceActor.system?.bio?.[field];
    if (typeof english === "string" && english.trim() && (actor[field] == null || actor[field] === english)) {
      gaps.push({ kind: "actor", owner: sourceActor.name, field, english });
    }
  }
  for (const sourceItem of sourceActor.items ?? []) {
    checkItem("actor-item", sourceActor.name, sourceItem, actor.items?.[sourceItem.name] ?? actor.items?.[sourceItem._id]);
  }
}

for (const gap of gaps) {
  const preview = gap.english.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
  console.log(`${gap.kind} > ${gap.owner}${gap.item ? ` > ${gap.item}` : ""} > ${gap.field}: ${preview}`);
}
const counts = gaps.reduce((result, gap) => ({ ...result, [gap.kind]: (result[gap.kind] ?? 0) + 1 }), {});
console.log(JSON.stringify({ untranslatedFields: gaps.length, counts }, null, 2));
