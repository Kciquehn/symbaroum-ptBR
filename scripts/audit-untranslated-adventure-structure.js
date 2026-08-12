const fs = require("fs");

const SOURCE = "C:/Fontes de Symbaroum/tmp/adventure-source.json";
const TRANSLATION = "compendium/pt-BR/symbaroum-adventure-collection.symbaroum-adventure-collection.json";
const ENTRY = "Symbaroum Adventure Collection";
const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
const translated = JSON.parse(fs.readFileSync(TRANSLATION, "utf8")).entries[ENTRY];
const gaps = [];

for (const sourceItem of source.items ?? []) {
  const item = translated.items?.[sourceItem._id] ?? translated.items?.[sourceItem.name];
  if (!item) continue;
  const fields = [
    ["name", sourceItem.name],
    ["description", sourceItem.system?.description],
    ["cost", sourceItem.system?.cost]
  ];
  for (const [field, english] of fields) {
    if (typeof english === "string" && english.trim() && (item[field] == null || item[field] === english)) {
      gaps.push({ kind: "item", key: sourceItem.name, field, english });
    }
  }
}

for (const sourceScene of source.scenes ?? []) {
  const scene = translated.scenes?.[sourceScene._id] ?? translated.scenes?.[sourceScene.name];
  if (scene && sourceScene.name.trim() && (scene.name == null || scene.name === sourceScene.name)) {
    gaps.push({ kind: "scene", key: sourceScene.name, field: "name", english: sourceScene.name });
  }
}

for (const sourceFolder of source.folders ?? []) {
  const value = translated.folders?.[sourceFolder.name];
  if (value != null && value === sourceFolder.name) {
    gaps.push({ kind: "folder", key: sourceFolder.name, field: "name", english: sourceFolder.name });
  }
}

for (const gap of gaps) {
  const preview = gap.english.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0,160);
  console.log(`${gap.kind} > ${gap.key} > ${gap.field}: ${preview}`);
}
const counts = gaps.reduce((result, gap) => ({ ...result, [gap.kind]: (result[gap.kind] ?? 0) + 1 }), {});
console.log(JSON.stringify({ untranslatedFields: gaps.length, counts }, null, 2));
