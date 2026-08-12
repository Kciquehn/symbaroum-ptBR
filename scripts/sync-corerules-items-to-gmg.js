const fs = require("fs");

const CORE_PATH = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const GMG_PATH = "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json";
const MONSTER_PATH = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const CORE_ENTRY = "Symbaroum Core Rules";
const GMG_ENTRY = "Symbaroum Game Masters Guide";
const MONSTER_ENTRY = "Symbaroum Monster Codex";
const write = process.argv.includes("--write");

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
const monster = JSON.parse(fs.readFileSync(MONSTER_PATH, "utf8"));
const gmgSource = fs.readFileSync(GMG_PATH, "utf8");
const gmg = JSON.parse(gmgSource);
const coreEntry = core.entries?.[CORE_ENTRY];
const gmgEntry = gmg.entries?.[GMG_ENTRY];
const monsterEntry = monster.entries?.[MONSTER_ENTRY];

if (!coreEntry?.items || !coreEntry?.actors) {
  throw new Error("Core Rules does not contain the expected item and actor translations.");
}
if (!gmgEntry?.actors) {
  throw new Error(`GMG entry '${GMG_ENTRY}' was not found.`);
}
if (!monsterEntry?.items) {
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
      if (source[index] === "\\") index += 2;
      else if (source[index] === '"') {
        index += 1;
        return JSON.parse(source.slice(start, index));
      } else index += 1;
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
    else while (index < source.length && !/[\s,}\]]/.test(source[index])) index += 1;
    const end = index;
    if (
      token === "{" &&
      path.length === 6 &&
      path[0] === "entries" &&
      path[1] === GMG_ENTRY &&
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

const normalize = (value) => value
  .normalize("NFKC")
  .replace(/[–—]/g, "-")
  .replace(/\s+/g, " ")
  .trim()
  .toLocaleLowerCase("en-US");

const selectFields = (translation) => Object.fromEntries(
  Object.entries(translation).filter(([field]) => TRANSLATION_FIELDS.has(field))
);

function addCandidate(target, sourceName, translation, origin) {
  const key = normalize(sourceName);
  const candidates = target.get(key) ?? [];
  const filtered = selectFields(translation);
  const signature = JSON.stringify(filtered);
  if (!candidates.some((candidate) => candidate.signature === signature)) {
    candidates.push({ sourceName, translation: filtered, origin, signature });
  }
  target.set(key, candidates);
}

const topLevelItems = new Map();
const actorItems = new Map();
const monsterActorItems = new Map();

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
  [normalize("Studded Leather"), findCandidateByOrigin("Studded Leather", "actor:Fortune-Hunter")],
  [normalize("Lucky Charm"), findCandidateByOrigin("Lucky Charm", "actor:Fortune-Hunter")]
]);

const aliases = new Map([
  [normalize("Exceptionally Resolute (Grand-Master)"), { sourceName: "Exceptionally Resolute", suffix: "Grão-Mestre" }],
  [normalize("Two-handed Force (Grand- Master)"), { sourceName: "Two-handed Force", suffix: "Grão-Mestre" }],
  [normalize("Iron Fist (Grand-Master)"), { sourceName: "Iron Fist", suffix: "Grão-Mestre" }],
  [normalize("Deadly Breath (Corruption)"), { sourceName: "Deadly Breath", suffix: "Corrupção" }],
  [normalize("Harmful Aura (Poisonous)"), { sourceName: "Harmful Aura", suffix: "Venenosa" }],
  [normalize("Stinger (piercing 5)"), { sourceName: "Stinger", suffix: "perfurante 5" }]
]);

// These names are printed exactly this way in Sakofal's official stat block.
// Keep the actor-specific labels while reusing the equivalent Monster Codex rules text.
const actorSpecificNames = new Map([
  ["Sakofal the Slaughterer\u0000Devour", "Devorador"],
  ["Sakofal the Slaughterer\u0000Life Sense", "Senso de Vida"],
  ["Sakofal the Slaughterer\u0000Sturdy", "Tenaz"],
  ["Sakofal the Slaughterer\u0000Wrecker", "Destruidor"]
]);

function exactTopLevelCandidate(sourceName) {
  const gmgTranslation = gmgEntry.items?.[sourceName];
  if (gmgTranslation) {
    return { sourceName, translation: selectFields(gmgTranslation), origin: "gmg-items", resolution: "gmg-top-level" };
  }
  const monsterTranslation = monsterEntry.items[sourceName];
  if (monsterTranslation) {
    return { sourceName, translation: selectFields(monsterTranslation), origin: "monster-items", resolution: "monster-top-level" };
  }
  const translation = coreEntry.items[sourceName];
  if (!translation) return null;
  return { sourceName, translation: selectFields(translation), origin: "items", resolution: "exact" };
}
for (const [actorName, actor] of Object.entries(monsterEntry.actors ?? {})) {
  for (const [sourceName, translation] of Object.entries(actor.items ?? {})) {
    addCandidate(monsterActorItems, sourceName, translation, `monster-actor:${actorName}`);
  }
}

function resolveTranslation(sourceName) {
  const alias = aliases.get(normalize(sourceName));
  const lookupName = alias?.sourceName ?? sourceName;
  const preserveAlias = (candidate) => {
    if (!alias || !candidate) return candidate;
    return {
      ...candidate,
      translation: {
        ...candidate.translation,
        name: `${candidate.translation.name} (${alias.suffix})`
      }
    };
  };
  const exact = exactTopLevelCandidate(lookupName);
  if (exact) {
    // Algumas entradas de nível superior possuem apenas o nome traduzido.
    // Complete os campos ausentes somente quando todas as fichas já traduzidas
    // do Monster Codex concordarem com o mesmo texto oficial.
    const supplements = monsterActorItems.get(normalize(lookupName)) ?? [];
    for (const field of TRANSLATION_FIELDS) {
      if (exact.translation[field]) continue;
      const values = [...new Set(supplements.map((candidate) => candidate.translation[field]).filter(Boolean))];
      if (values.length === 1) exact.translation[field] = values[0];
    }
    return { candidate: preserveAlias(exact), resolution: alias ? "alias" : exact.resolution };
  }

  const key = normalize(lookupName);
  const topLevel = topLevelItems.get(key) ?? [];
  if (topLevel.length === 1) return { candidate: topLevel[0], resolution: "top-level" };
  if (topLevel.length > 1) return { candidate: null, resolution: "ambiguous" };

  const embedded = actorItems.get(key) ?? [];
  if (embedded.length === 1) return { candidate: preserveAlias(embedded[0]), resolution: alias ? "alias" : "core-actor" };
  if (manualChoices.has(key)) return { candidate: manualChoices.get(key), resolution: "manual" };
  const monsterEmbedded = monsterActorItems.get(key) ?? [];
  if (monsterEmbedded.length === 1) {
    return { candidate: preserveAlias(monsterEmbedded[0]), resolution: alias ? "alias" : "monster-actor" };
  }
  return {
    candidate: null,
    resolution: embedded.length || monsterEmbedded.length ? "ambiguous" : "unmatched"
  };
}

const beforeActorKeys = Object.keys(gmgEntry.actors);
const beforeItemKeys = new Map(
  Object.entries(gmgEntry.actors).map(([actorName, actor]) => [actorName, Object.keys(actor.items ?? {})])
);
const itemLocations = locateEmbeddedItemObjects(gmgSource);
const stats = {
  total: 0,
  matched: 0,
  updated: 0,
  unchanged: 0,
  unmatched: 0,
  ambiguous: 0,
  exact: 0,
  alias: 0,
  manual: 0,
  "top-level": 0,
  "core-actor": 0,
  "monster-actor": 0,
  "gmg-top-level": 0,
  "monster-top-level": 0
};
const fieldCounts = new Map();
const unresolved = new Set();
const replacements = [];
const changes = [];

for (const [actorName, actor] of Object.entries(gmgEntry.actors)) {
  for (const [itemName, item] of Object.entries(actor.items ?? {})) {
    stats.total += 1;
    const { candidate, resolution } = resolveTranslation(itemName);
    if (!candidate) {
      stats[resolution] += 1;
      unresolved.add(`${itemName} [${resolution}]`);
      continue;
    }

    stats.matched += 1;
    stats[resolution] += 1;
    const selectedTranslation = { ...candidate.translation };
    const actorSpecificName = actorSpecificNames.get(`${actorName}\u0000${itemName}`);
    if (actorSpecificName) selectedTranslation.name = actorSpecificName;
    let changed = false;
    for (const [field, value] of Object.entries(selectedTranslation)) {
      if (item[field] !== value) {
        changed = true;
        changes.push({ actor: actorName, item: itemName, field, from: item[field], to: value, resolution });
      }
      item[field] = value;
      fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1);
    }
    stats[changed ? "updated" : "unchanged"] += 1;

    if (changed) {
      const location = itemLocations.get(`${actorName}\u0000${itemName}`);
      if (!location) throw new Error(`Could not locate '${actorName}' item '${itemName}' in the GMG JSON.`);
      replacements.push({ ...location, actorName, itemName, value: item });
    }
  }
}

if (JSON.stringify(Object.keys(gmgEntry.actors)) !== JSON.stringify(beforeActorKeys)) {
  throw new Error("Actor keys changed during synchronization.");
}
for (const [actorName, expectedKeys] of beforeItemKeys) {
  const actualKeys = Object.keys(gmgEntry.actors[actorName].items ?? {});
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
    throw new Error(`Embedded item keys changed for actor '${actorName}'.`);
  }
}

const eol = gmgSource.includes("\r\n") ? "\r\n" : "\n";
let serialized = gmgSource;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  const lineStart = gmgSource.lastIndexOf("\n", replacement.start - 1) + 1;
  const baseIndent = gmgSource.slice(lineStart, replacement.start).match(/^\s*/)?.[0] ?? "";
  const value = JSON.stringify(replacement.value, null, "\t").replaceAll("\n", `${eol}${baseIndent}`);
  serialized = serialized.slice(0, replacement.start) + value + serialized.slice(replacement.end);
}

const reparsed = JSON.parse(serialized);
const reparsedEntry = reparsed.entries?.[GMG_ENTRY];
if (!reparsedEntry || JSON.stringify(reparsedEntry.actors) !== JSON.stringify(gmgEntry.actors)) {
  throw new Error("Serialized GMG does not match the synchronized actor data.");
}

const wouldChange = serialized !== gmgSource;
if (write && wouldChange) fs.writeFileSync(GMG_PATH, serialized, "utf8");

console.log(JSON.stringify({
  ...stats,
  wouldChange,
  write,
  fieldsApplied: Object.fromEntries([...fieldCounts].sort()),
  changes,
  unresolved: [...unresolved].sort()
}, null, 2));
