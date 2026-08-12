const fs = require("fs");

const [sourceFile, translationFile, entry] = process.argv.slice(2);
if (!sourceFile || !translationFile || !entry) {
  throw new Error("Usage: node scripts/audit-untranslated-pack-structure.js <source.json> <translation.json> <entry>");
}
const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"))[0].value;
const translated = JSON.parse(fs.readFileSync(translationFile, "utf8")).entries[entry];
if (!translated) throw new Error(`Missing entry '${entry}'.`);
const gaps = [];

for (const folder of source.folders ?? []) {
  const value = translated.folders?.[folder.name];
  if (value != null && value === folder.name) gaps.push({ kind: "folder", key: folder.name });
}
for (const scene of source.scenes ?? []) {
  const value = translated.scenes?.[scene.name] ?? translated.scenes?.[scene._id];
  if (value?.name === scene.name) gaps.push({ kind: "scene", key: scene.name });
}
for (const table of source.tables ?? []) {
  const value = translated.tables?.[table.name] ?? translated.tables?.[table._id];
  if (value?.name === table.name) gaps.push({ kind: "table", key: table.name });
  for (const result of table.results ?? []) {
    const rangeKey = Array.isArray(result.range) ? `${result.range[0]}-${result.range[1]}` : undefined;
    const translatedResult = value?.results?.[result._id] ?? value?.results?.[rangeKey];
    for (const field of ["name", "description"]) {
      const english = result[field];
      const localized = typeof translatedResult === "string" ? translatedResult : translatedResult?.[field];
      if (typeof english === "string" && english.trim() && (localized == null || localized === english)) {
        gaps.push({ kind: "table-result", key: `${table.name}.${rangeKey ?? result._id}.${field}` });
      }
    }
  }
}

for (const gap of gaps) console.log(`${gap.kind} > ${gap.key}`);
const counts = gaps.reduce((result, gap) => ({ ...result, [gap.kind]: (result[gap.kind] ?? 0) + 1 }), {});
console.log(JSON.stringify({ untranslatedNames: gaps.length, counts }, null, 2));
