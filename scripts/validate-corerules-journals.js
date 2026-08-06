const fs = require("fs");
const path = require("path");

const WORK_DIR = path.join(".translation-work", "corerules");
const MODULE_FILE = "compendium/pt-BR/symbaroum-corerules.symbaroum-core-rules.json";
const manifest = JSON.parse(fs.readFileSync(path.join(WORK_DIR, "manifest.json"), "utf8"));
const data = JSON.parse(fs.readFileSync(MODULE_FILE, "utf8"));
const journals = data.entries?.["Symbaroum Core Rules"]?.journals;

if (!journals) {
  throw new Error("Core Rules does not contain the expected journal translations.");
}

function countTags(html) {
  const tags = ["div", "p", "h2", "h3", "h4", "h5", "blockquote", "table", "tr", "td", "ul", "ol", "li", "span", "a", "img", "br", "hr"];
  return Object.fromEntries(tags.map((tag) => [tag, (html.match(new RegExp(`<${tag}\\b`, "gi")) || []).length]));
}

function hasBrokenText(html) {
  const mojibakeSequences = [
    "Ã§", "Ã£", "Ã©", "Ã¡", "Ã³", "Ãº", "Ã­", "Ãª", "Ã´", "Ãµ",
    "Â ", "Â­", "â€™", "â€œ", "â€", "â€“", "â€”", "â€¦"
  ];
  return html.includes("\uFFFD") || mojibakeSequences.some((sequence) => html.includes(sequence));
}

let changedTexts = 0;
let changedNames = 0;
let unchanged = 0;
const problems = [];
for (const page of manifest) {
  const journal = journals[page.journalKey];
  const currentPage = journal?.pages?.[page.pageKey];
  if (!currentPage) {
    problems.push(`${page.id}: page is missing from ${MODULE_FILE}`);
    continue;
  }

  const source = fs.readFileSync(page.sourcePath, "utf8");
  const html = currentPage.text || "";
  if (html === source) unchanged += 1;
  else changedTexts += 1;
  if ((currentPage.name || page.pageKey) !== page.sourceName) changedNames += 1;

  const counts = countTags(html);
  for (const [tag, expected] of Object.entries(page.counts)) {
    if (counts[tag] !== expected) {
      problems.push(`${page.id}: <${tag}> count ${counts[tag]} != ${expected}`);
    }
  }
  if (hasBrokenText(html)) problems.push(`${page.id}: possible mojibake`);
}

console.log(`Changed text pages: ${changedTexts}/${manifest.length}`);
console.log(`Changed page names: ${changedNames}/${manifest.length}`);
console.log(`Unchanged text pages: ${unchanged}/${manifest.length}`);
if (problems.length) {
  console.error(problems.slice(0, 200).join("\n"));
  process.exit(1);
}
console.log("Validation OK");
