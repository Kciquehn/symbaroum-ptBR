const fs = require("fs");

const FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const ENTRY = "Symbaroum Core Rules";
const JOURNAL = "Book 3: The GM Guide";
const PAGE = "3.06a - Monsters & Adversaries";
const checkOnly = process.argv.includes("--check");
const source = fs.readFileSync(FILE, "utf8");
const data = JSON.parse(source);
const journal = data.entries?.[ENTRY]?.journals?.[JOURNAL];
const page = journal?.pages?.[PAGE];
if (!journal || typeof page?.text !== "string") throw new Error(`Missing '${JOURNAL}.${PAGE}'.`);

const pt = [
  "FAMÍLIA", "SER", "VARIANTE", "RESISTÊNCIA", "CATEGORIA",
  "Elfos", "Elfo da Primavera", "Fraca", "Seres culturais", "Elfo do Verão", "Início do Verão", "Ordinária",
  "Final do Verão", "Desafiadora", "Elfo do Outono", "Difícil",
  "Trolls", "Troll Enfurecido", "Faminto", "Ordinária", "Seres culturais", "Gregário", "Desafiadora",
  "Troll Soberano", "Difícil", "Arquitroll", "Poderosa",
  "Adversários Humanos", "Cultista", "Seguidor do Culto", "Fraca", "Seres culturais", "Líder do Culto", "Ordinária",
  "Salteador", "Ladrão", "Fraca", "Ladrão Chefe", "Ordinária", "Patrulheiro", "Patrulheiro da Rainha", "Ordinária",
  "Capitão Patrulheiro", "Desafiadora", "Caçador de Bruxas", "Autodidata", "Fraca", "Manto Negro", "Ordinária",
  "Caçador de Tesouros", "Caçador de Fortuna", "Fraca", "Saqueador", "Ordinária", "Guerreiro do Clã",
  "Guerreiro da Aldeia", "Ordinária", "Guarda Guerreiro", "Desafiadora",
  "Aranhas", "Segue-Rebanho", "Ordinária", "Bestas", "Ferrão-Gotejante", "Ordinária",
  "Predadores", "Pesadelino", "Ordinária", "Bestas", "Baiagorn", "Ordinária", "Gigavali", "Desafiadora",
  "Répteis", "Kanaran", "Desafiadora", "Bestas", "Linnorme", "Difícil",
  "Criaturas Aladas", "Violentino", "Ordinária", "Bestas", "Mosca Dragão", "Desafiadora",
  "Abominações", "Nascido da Mácula", "Humano", "Ordinária", "Abominações", "Alce", "Ordinária", "Gigavali",
  "Difícil", "Besta Maculada Primitiva", "Poderosa",
  "Mortos-Vivos", "Luz Gélida", "Fraca", "Mortos-Vivos", "Dragoul", "Ordinária", "Necromago", "Desafiadora",
  "Andarilho da Cripta", "Difícil"
];

function translateVisibleHtml(html) {
  let index = 0;
  const output = html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) return part;
    if (!part.replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim()) return part;
    if (index >= pt.length) throw new Error(`Unexpected visible node ${index + 1}.`);
    const leading = part.match(/^\s*/)?.[0] ?? "";
    const trailing = part.match(/\s*$/)?.[0] ?? "";
    return `${leading}${pt[index++]}${trailing}`;
  }).join("");
  if (index !== pt.length) throw new Error(`Visible-node mismatch: found ${index}/${pt.length}.`);
  return output;
}
page.text = translateVisibleHtml(page.text);

function locateJournal(text) {
  let index = 0; let found;
  const ws = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  function str() { const start = index++; while (index < text.length) { if (text[index] === "\\") index += 2; else if (text[index++] === '"') return JSON.parse(text.slice(start, index)); } throw new Error("Unterminated string."); }
  function value(path) { ws(); const start = index; const token = text[index]; if (token === "{") object(path); else if (token === "[") array(path); else if (token === '"') str(); else while (index < text.length && !/[\s,}\]]/.test(text[index])) index += 1; if (token === "{" && path.join("/") === `entries/${ENTRY}/journals/${JOURNAL}`) found = { start, end: index }; }
  function object(path) { index++; ws(); if (text[index] === "}") { index++; return; } while (index < text.length) { const key = str(); ws(); if (text[index++] !== ":") throw new Error("Expected colon."); value([...path, key]); ws(); if (text[index] === "}") { index++; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  function array(path) { index++; ws(); if (text[index] === "]") { index++; return; } let item = 0; while (index < text.length) { value([...path, item++]); ws(); if (text[index] === "]") { index++; return; } if (text[index++] !== ",") throw new Error("Expected comma."); ws(); } }
  value([]); return found;
}

const location = locateJournal(source);
if (!location) throw new Error(`Could not locate journal '${JOURNAL}'.`);
const eol = source.includes("\r\n") ? "\r\n" : "\n";
const lineStart = source.lastIndexOf("\n", location.start - 1) + 1;
const indent = source.slice(lineStart, location.start).match(/^\s*/)?.[0] ?? "";
const serialized = JSON.stringify(journal, null, 2).replaceAll("\n", `${eol}${indent}`);
const output = source.slice(0, location.start) + serialized + source.slice(location.end);
const wouldChange = output !== source;
if (!checkOnly && wouldChange) fs.writeFileSync(FILE, output, "utf8");
console.log(JSON.stringify({ checkOnly, wouldChange, visibleNodes: pt.length }, null, 2));
