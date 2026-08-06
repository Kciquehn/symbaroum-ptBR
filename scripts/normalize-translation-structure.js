const fs = require("fs");

const TARGETS = [
  {
    file: "compendium/pt-BR/symbaroum-gmg.symbaroum-gmg.json",
    entry: "Symbaroum Game Masters Guide",
    folders: true,
  },
  {
    file: "compendium/pt-BR/symbaroum-monstercodex.symbaroum-monster-codex.json",
    entry: "Symbaroum Monster Codex",
    folders: false,
  },
];

const write = process.argv.includes("--write");

function flatten(container, isPayload, context) {
  const result = {};

  function visit(value) {
    for (const [key, child] of Object.entries(value ?? {})) {
      if (isPayload(child)) {
        if (Object.hasOwn(result, key)) {
          throw new Error(`${context}: duplicate key '${key}' after normalization.`);
        }
        result[key] = child;
      } else if (child && typeof child === "object" && !Array.isArray(child)) {
        visit(child);
      } else {
        throw new Error(`${context}: unsupported value at '${key}'.`);
      }
    }
  }

  visit(container);
  return result;
}

function normalizeFolders(folders, context) {
  return flatten(folders, (value) => typeof value === "string", context);
}

function normalizePages(pages, context) {
  const pageFields = ["name", "text", "caption", "src", "width", "height"];
  return flatten(
    pages,
    (value) => value && typeof value === "object" && pageFields.some((field) => Object.hasOwn(value, field)),
    context
  );
}

function normalizeJournals(journals, context) {
  const normalized = flatten(
    journals,
    (value) => value && typeof value === "object" && (Object.hasOwn(value, "name") || Object.hasOwn(value, "pages")),
    context
  );

  for (const [journalKey, journal] of Object.entries(normalized)) {
    if (journal.pages) {
      journal.pages = normalizePages(journal.pages, `${context} > ${journalKey} > pages`);
    }
  }

  return normalized;
}

function modernizeGmgMacros(macros) {
  const normalized = structuredClone(macros ?? {});
  const macro = normalized["GMG - Roll on Tables"];
  if (!macro?.command) throw new Error("GMG macro 'GMG - Roll on Tables' not found.");

  macro.name = "GMG - Rolar em Tabelas";
  macro.command = macro.command
    .replaceAll("t.data._id", "t.id")
    .replaceAll("t.data.name", "t.name")
    .replaceAll("table.data.formula", "table.formula")
    .replace("parseInt(html.find('#inputNbr')[0].value || 0)", "parseInt(html.find('#inputNbr')[0].value || '0', 10)")
    .replace("parseInt(html.find('#inputMod')[0].value || '0')", "parseInt(html.find('#inputMod')[0].value || '0', 10)")
    .replace(
      "const roll = new Roll(formula + ' + ' + modifier);\n            roll.evaluate({ async: false });",
      "const roll = await new Roll(formula + ' + ' + modifier).evaluate();"
    )
    .replace("<label>Select Table</label>", "<label>Selecionar tabela</label>")
    .replace("<label>Rolls on table?</label>", "<label>Rolagens na tabela?</label>")
    .replace("<label>Modifier?</label>", "<label>Modificador?</label>")
    .replace("label: `\"Draw`", "label: `Rolar`")
    .replace("label: `Cancel`", "label: `Cancelar`")
    .replace("There are no tables to draw from!", "Não há tabelas disponíveis para rolagem!")
    .replace("title: `Roll on selected table`", "title: `Rolar na tabela selecionada`");

  return normalized;
}

function locateObjectValues(source, wantedPaths) {
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
    const key = JSON.stringify(path);
    if (token === "{" && wantedPaths.has(key)) locations.set(key, { start, end });
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

function replaceObjects(source, replacements) {
  const wantedPaths = new Set(replacements.map(({ path }) => JSON.stringify(path)));
  const locations = locateObjectValues(source, wantedPaths);
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  const edits = replacements.map(({ path, value }) => {
    const location = locations.get(JSON.stringify(path));
    if (!location) throw new Error(`Could not locate ${path.join(" > ")} in JSON source.`);
    const lineStart = source.lastIndexOf("\n", location.start - 1) + 1;
    const baseIndent = source.slice(lineStart, location.start).match(/^\s*/)?.[0] ?? "";
    const serialized = JSON.stringify(value, null, "\t").replaceAll("\n", `${eol}${baseIndent}`);
    return { ...location, serialized };
  });

  let result = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, edit.start) + edit.serialized + result.slice(edit.end);
  }
  return result;
}

for (const target of TARGETS) {
  const source = fs.readFileSync(target.file, "utf8");
  const data = JSON.parse(source);
  const entry = data.entries?.[target.entry];
  if (!entry) throw new Error(`${target.file}: entry '${target.entry}' not found.`);

  const normalizedJournals = normalizeJournals(entry.journals ?? {}, `${target.file} > journals`);
  const replacements = [
    { path: ["entries", target.entry, "journals"], value: normalizedJournals },
  ];

  if (target.folders) {
    replacements.push({
      path: ["entries", target.entry, "folders"],
      value: normalizeFolders(entry.folders ?? {}, `${target.file} > folders`),
    });
  }

  if (target.entry === "Symbaroum Game Masters Guide") {
    replacements.push({
      path: ["entries", target.entry, "macros"],
      value: modernizeGmgMacros(entry.macros),
    });
  }

  const normalizedSource = replaceObjects(source, replacements);
  JSON.parse(normalizedSource);
  const changed = normalizedSource !== source;
  if (write && changed) fs.writeFileSync(target.file, normalizedSource, "utf8");

  const pageCount = Object.values(normalizedJournals).reduce(
    (total, journal) => total + Object.keys(journal.pages ?? {}).length,
    0
  );
  console.log(`${target.file}: ${changed ? (write ? "normalized" : "needs normalization") : "OK"}; ${Object.keys(normalizedJournals).length} journals, ${pageCount} pages`);
}
