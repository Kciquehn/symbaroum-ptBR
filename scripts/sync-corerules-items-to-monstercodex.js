const fs = require("fs");

const CORE_PATH = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const MONSTER_PATH = "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json";
const MONSTER_ENTRY = "Symbaroum Monster Codex";
const checkOnly = process.argv.includes("--check");

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

const normalize = (value) => value
  .normalize("NFKC")
  .replace(/[\u2010-\u2015\u2212]/g, "-")
  .replace(/\s+/g, " ")
  .trim()
  .toLocaleLowerCase("en-US");

const looksLikeFoundryId = (value) => /^[A-Za-z0-9]{16}$/.test(value);

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
const monsterTopLevelItems = new Map();

for (const [sourceName, translation] of Object.entries(coreEntry.items)) {
  addCandidate(topLevelItems, sourceName, translation, "items");
}
for (const [actorName, actor] of Object.entries(coreEntry.actors)) {
  for (const [sourceName, translation] of Object.entries(actor.items ?? {})) {
    addCandidate(actorItems, sourceName, translation, `actor:${actorName}`);
  }
}
for (const [sourceName, translation] of Object.entries(monsterEntry.items ?? {})) {
  addCandidate(monsterTopLevelItems, sourceName, translation, "monster-items");
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

// These embedded items are keyed by Foundry IDs instead of their English source names.
// Keep the explicit source identity so subsequent runs remain deterministic after the
// translated `name` replaces the English value in the local Babele payload.
const itemIdSourceNames = new Map([
  ["OxAG6rUvJbdXOV9c", "Unnoticeable"],
  ["hTGRDu7u7Rc2D2o7", "Unnoticeable"],
  ["6XmNfZb9Q1WreFuW", "Sword"],
  ["LfBYloQyC4Fp6EGN", "Sword"],
  ["mhtiJwqz5sDmiAip", "Sword"]
]);

const variantChoices = new Map();

function translatedVariant(baseName, suffix) {
  const resolved = resolveTranslation(baseName);
  if (!resolved.candidate) {
    throw new Error(`Variant base '${baseName}' could not be resolved.`);
  }
  return {
    ...resolved.candidate,
    translation: {
      ...resolved.candidate.translation,
      name: `${resolved.candidate.translation.name} (${suffix})`
    },
    origin: `${resolved.candidate.origin}:variant`
  };
}

for (const [sourceName, [baseName, suffix]] of [
  ["Alternative Damage (Resolute)", ["Alternative Damage", "Resoluto"]],
  ["Alternative Damage (Strong)", ["Alternative Damage", "Forte"]],
  ["Beast Lore (Abominations  or Undead)", ["Beast Lore", "Abominações ou Mortos-vivos"]],
  ["Beast Lore (Beasts)", ["Beast Lore", "Feras"]],
  ["Beast Lore (Cultural Beings)", ["Beast Lore", "Seres Culturais"]],
  ["Beast Lore (Varied Focus)", ["Beast Lore", "Foco Variado"]],
  ["Contacts (Ambrian army)", ["Contacts", "Exército Ambriano"]],
  ["Contacts (Ambrian Army)", ["Contacts", "Exército Ambriano"]],
  ["Contacts (Criminals)", ["Contacts", "Criminosos"]],
  ["Contacts (General)", ["Contacts", "Geral"]],
  ["Contacts (guild)", ["Contacts", "Guilda"]],
  ["Contacts (Neighbors)", ["Contacts", "Vizinhos"]],
  ["Contacts (Nobles)", ["Contacts", "Nobres"]],
  ["Contacts (Ordo Magica)", ["Contacts", "Ordo Magica"]],
  ["Contacts (Rabble)", ["Contacts", "Plebe"]],
  ["Contacts (Templars)", ["Contacts", "Templários"]],
  ["Contacts (the Sun Church)", ["Contacts", "Igreja do Sol"]],
  ["Contacts (Thieves’ Guild)", ["Contacts", "Guilda dos Ladrões"]],
  ["Contacts (Twilight Friars)", ["Contacts", "Frades do Crepúsculo"]],
  ["Contacts (Witches)", ["Contacts", "Bruxas"]],
  ["Heirloom (armor)", ["Heirloom", "Armadura"]],
  ["Heirloom (Parrying Dagger)", ["Heirloom", "Adaga de Aparar"]]
]) {
  variantChoices.set(normalize(sourceName), translatedVariant(baseName, suffix));
}

function resolveTranslation(sourceName) {
  const exactMonsterTopLevel = monsterEntry.items?.[sourceName];
  if (exactMonsterTopLevel) {
    return {
      candidate: {
        sourceName,
        translation: Object.fromEntries(
          Object.entries(exactMonsterTopLevel).filter(([field]) => TRANSLATION_FIELDS.has(field))
        ),
        origin: "monster-items"
      },
      resolution: "monster-top-level-exact"
    };
  }

  const exactTopLevel = coreEntry.items[sourceName];
  if (exactTopLevel) {
    return {
      candidate: {
        sourceName,
        translation: Object.fromEntries(
          Object.entries(exactTopLevel).filter(([field]) => TRANSLATION_FIELDS.has(field))
        ),
        origin: "items",
      },
      resolution: "top-level-exact"
    };
  }

  const key = normalize(sourceName);
  if (variantChoices.has(key)) return { candidate: variantChoices.get(key), resolution: "variant" };
  const monsterTopLevel = monsterTopLevelItems.get(key) ?? [];
  if (monsterTopLevel.length === 1) return { candidate: monsterTopLevel[0], resolution: "monster-top-level" };
  if (monsterTopLevel.length > 1) return { candidate: null, resolution: "ambiguous" };
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
const stats = {
  total: 0,
  updated: 0,
  unchanged: 0,
  unmatched: 0,
  ambiguous: 0,
  manual: 0,
  variant: 0,
  itemNameFallback: 0
};
const fieldCounts = new Map();
const unresolvedNames = new Map();
const updatedItems = [];
const replacements = [];

// Estes documentos têm o mesmo nome de uma variante do Core Rules, mas regras
// próprias no Códice. As versões oficiais são aplicadas pelo script de
// complementos e não devem ser sobrescritas por equivalência nominal.
const preserveMonsterVariants = new Set([
  "Nightmare\0Touch of Death",
  "Wraith\0Touch of death"
]);

for (const [actorName, actor] of Object.entries(monsterEntry.actors)) {
  for (const [itemName, item] of Object.entries(actor.items ?? {})) {
    stats.total += 1;
    if (preserveMonsterVariants.has(`${actorName}\0${itemName}`)) {
      stats.unchanged += 1;
      continue;
    }
    const mappedIdSourceName = itemIdSourceNames.get(itemName);
    let matchedSourceName = mappedIdSourceName ?? itemName;
    let { candidate, resolution } = resolveTranslation(matchedSourceName);

    if (candidate && mappedIdSourceName) stats.itemNameFallback += 1;

    if (!candidate && !mappedIdSourceName && looksLikeFoundryId(itemName) && typeof item.name === "string") {
      const fallback = resolveTranslation(item.name);
      if (fallback.candidate) {
        ({ candidate, resolution } = fallback);
        matchedSourceName = item.name;
        stats.itemNameFallback += 1;
      }
    }

    if (!candidate) {
      stats[resolution] += 1;
      const unresolved = unresolvedNames.get(itemName) ?? {
        occurrences: 0,
        resolution,
        currentName: item.name,
        actors: []
      };
      unresolved.occurrences += 1;
      if (unresolved.actors.length < 5 && !unresolved.actors.includes(actorName)) {
        unresolved.actors.push(actorName);
      }
      unresolvedNames.set(itemName, unresolved);
      continue;
    }
    if (resolution === "manual") stats.manual += 1;
    if (resolution === "variant") stats.variant += 1;

    let changed = false;
    for (const [field, value] of Object.entries(candidate.translation)) {
      if (item[field] !== value) changed = true;
      item[field] = value;
      fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1);
    }
    stats[changed ? "updated" : "unchanged"] += 1;
    if (changed) {
      updatedItems.push({ actorName, itemKey: itemName, matchedSourceName, resolution });
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
const wouldChange = serialized !== monsterSource;
if (wouldChange && !checkOnly) fs.writeFileSync(MONSTER_PATH, serialized, "utf8");

console.log(JSON.stringify({
  ...stats,
  wouldChange,
  checkOnly,
  fieldsApplied: Object.fromEntries([...fieldCounts].sort()),
  updatedItems,
  unresolvedUnique: unresolvedNames.size,
  unresolved: Object.fromEntries([...unresolvedNames].sort(([left], [right]) => left.localeCompare(right)))
}, null, 2));
