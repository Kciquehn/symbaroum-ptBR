const fs = require("fs");

const CORE_PATH = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const MONSTER_PATH = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const MONSTER_ENTRY = "Symbaroum Monster Codex";

const TRANSLATION_FIELDS = new Set([
  "name",
  "description",
  "material",
  "noviceDescription",
  "adeptDescription",
  "masterDescription",
  "cost",
  "power0Name",
  "power0Description",
  "power1Name",
  "power1Description",
  "power2Name",
  "power2Description",
  "power3Name",
  "power3Description",
  "power4Name",
  "power4Description",
  "tradition"
]);

const core = JSON.parse(fs.readFileSync(CORE_PATH, "utf8"));
const monsterSource = fs.readFileSync(MONSTER_PATH, "utf8");
const monster = JSON.parse(monsterSource);
const coreEntry = core.entries?.["Symbaroum Core Rules"];
const monsterEntry = monster.entries?.[MONSTER_ENTRY];

if (!coreEntry?.items || !coreEntry?.actors) {
  throw new Error("Core Rules does not contain the expected item and actor translations.");
}
if (!monsterEntry?.actors) {
  throw new Error(`Monster Codex entry '${MONSTER_ENTRY}' was not found.`);
}

function locateEmbeddedItemObjects(source) {
  const locations = new Map();
  let index = 0;

  function skipWhitespace() {
    while (/\s/.test(source[index] ?? "")) index += 1;
  }

  function parseString() {
    const start = index;
    if (source[index] !== '"') throw new Error(`Expected string at offset ${index}.`);
    index += 1;
    while (index < source.length) {
      if (source[index] === "\\") {
        index += 2;
      } else if (source[index] === '"') {
        index += 1;
        return JSON.parse(source.slice(start, index));
      } else {
        index += 1;
      }
    }
    throw new Error(`Unterminated string at offset ${start}.`);
  }

  function parseValue(path) {
    skipWhitespace();
    const start = index;
    const token = source[index];
    if (token === "{") parseObject(path);
    else if (token === "[") parseArray(path);
    else if (token === '"') parseString();
    else {
      while (index < source.length && !/[\s,}\]]/.test(source[index])) index += 1;
    }
    const end = index;
    if (
      token === "{" &&
      path.length === 6 &&
      path[0] === "entries" &&
      path[1] === MONSTER_ENTRY &&
      path[2] === "actors" &&
      path[4] === "items"
    ) {
      locations.set(`${path[3]}\u0000${path[5]}`, { start, end });
    }
  }

  function parseObject(path) {
    index += 1;
    skipWhitespace();
    if (source[index] === "}") {
      index += 1;
      return;
    }
    while (index < source.length) {
      const key = parseString();
      skipWhitespace();
      if (source[index] !== ":") throw new Error(`Expected colon at offset ${index}.`);
      index += 1;
      parseValue([...path, key]);
      skipWhitespace();
      if (source[index] === "}") {
        index += 1;
        return;
      }
      if (source[index] !== ",") throw new Error(`Expected comma at offset ${index}.`);
      index += 1;
      skipWhitespace();
    }
    throw new Error("Unterminated object.");
  }

  function parseArray(path) {
    index += 1;
    skipWhitespace();
    if (source[index] === "]") {
      index += 1;
      return;
    }
    let itemIndex = 0;
    while (index < source.length) {
      parseValue([...path, itemIndex]);
      itemIndex += 1;
      skipWhitespace();
      if (source[index] === "]") {
        index += 1;
        return;
      }
      if (source[index] !== ",") throw new Error(`Expected comma at offset ${index}.`);
      index += 1;
      skipWhitespace();
    }
    throw new Error("Unterminated array.");
  }

  parseValue([]);
  skipWhitespace();
  if (index !== source.length) throw new Error(`Unexpected content at offset ${index}.`);
  return locations;
}

const normalize = (value) => value.normalize("NFKC").trim().toLocaleLowerCase("en-US");

function addCandidate(target, sourceName, translation, origin) {
  const key = normalize(sourceName);
  const candidates = target.get(key) ?? [];
  const filtered = Object.fromEntries(
    Object.entries(translation).filter(([field]) => TRANSLATION_FIELDS.has(field))
  );
  const signature = JSON.stringify(filtered);
  if (!candidates.some((candidate) => candidate.signature === signature)) {
    candidates.push({ sourceName, translation: filtered, origin, signature });
  }
  target.set(key, candidates);
}

const topLevelItems = new Map();
const actorItems = new Map();

for (const [sourceName, translation] of Object.entries(coreEntry.items)) {
  addCandidate(topLevelItems, sourceName, translation, "items");
}
for (const [actorName, actor] of Object.entries(coreEntry.actors)) {
  for (const [sourceName, translation] of Object.entries(actor.items ?? {})) {
    addCandidate(actorItems, sourceName, translation, `actor:${actorName}`);
  }
}

function findCandidateByOrigin(sourceName, origin) {
  const candidates = actorItems.get(normalize(sourceName)) ?? [];
  const candidate = candidates.find((entry) => entry.origin === origin);
  if (!candidate) throw new Error(`Manual source '${origin}' for '${sourceName}' was not found.`);
  return candidate;
}

const manualChoices = new Map([
  [normalize("Spear"), findCandidateByOrigin("Spear", "actor:Early Summer Elf")],
  [normalize("Studded Leather"), findCandidateByOrigin("Studded Leather", "actor:Fortune-Hunter")]
]);

function resolveTranslation(sourceName) {
  const key = normalize(sourceName);
  const topLevel = topLevelItems.get(key) ?? [];
  if (topLevel.length === 1) return { candidate: topLevel[0], resolution: "top-level" };
  if (topLevel.length > 1) return { candidate: null, resolution: "ambiguous" };

  const embedded = actorItems.get(key) ?? [];
  if (embedded.length === 1) return { candidate: embedded[0], resolution: "core-actor" };
  if (manualChoices.has(key)) return { candidate: manualChoices.get(key), resolution: "manual" };
  return { candidate: null, resolution: embedded.length ? "ambiguous" : "unmatched" };
}

const beforeActorNames = Object.keys(monsterEntry.actors);
const itemLocations = locateEmbeddedItemObjects(monsterSource);
const beforeItemKeys = new Map(
  Object.entries(monsterEntry.actors).map(([actorName, actor]) => [actorName, Object.keys(actor.items ?? {})])
);
const stats = { total: 0, updated: 0, unchanged: 0, unmatched: 0, ambiguous: 0, manual: 0 };
const fieldCounts = new Map();
const replacements = [];

for (const [actorName, actor] of Object.entries(monsterEntry.actors)) {
  for (const [itemName, item] of Object.entries(actor.items ?? {})) {
    stats.total += 1;
    const { candidate, resolution } = resolveTranslation(itemName);
    if (!candidate) {
      stats[resolution] += 1;
      continue;
    }
    if (resolution === "manual") stats.manual += 1;

    let changed = false;
    for (const [field, value] of Object.entries(candidate.translation)) {
      if (item[field] !== value) changed = true;
      item[field] = value;
      fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1);
    }
    stats[changed ? "updated" : "unchanged"] += 1;
    if (changed) {
      const location = itemLocations.get(`${actorName}\u0000${itemName}`);
      if (!location) throw new Error(`Could not locate '${actorName}' item '${itemName}' in the JSON source.`);
      replacements.push({ ...location, actorName, itemName, value: item });
    }
  }
}

if (JSON.stringify(Object.keys(monsterEntry.actors)) !== JSON.stringify(beforeActorNames)) {
  throw new Error("Actor keys changed during synchronization.");
}
for (const [actorName, expectedKeys] of beforeItemKeys) {
  const actualKeys = Object.keys(monsterEntry.actors[actorName].items ?? {});
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
    throw new Error(`Embedded item keys changed for actor '${actorName}'.`);
  }
}

const eol = monsterSource.includes("\r\n") ? "\r\n" : "\n";
let serialized = monsterSource;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  const lineStart = monsterSource.lastIndexOf("\n", replacement.start - 1) + 1;
  const baseIndent = monsterSource.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
  const value = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${baseIndent}`);
  serialized = serialized.slice(0, replacement.start) + value + serialized.slice(replacement.end);
}

const reparsed = JSON.parse(serialized);
const reparsedEntry = reparsed.entries?.[MONSTER_ENTRY];
if (!reparsedEntry || JSON.stringify(reparsedEntry.actors) !== JSON.stringify(monsterEntry.actors)) {
  throw new Error("Serialized Monster Codex does not match the synchronized actor data.");
}
if (serialized !== monsterSource) fs.writeFileSync(MONSTER_PATH, serialized, "utf8");

console.log(JSON.stringify({ ...stats, fieldsApplied: Object.fromEntries([...fieldCounts].sort()) }, null, 2));
