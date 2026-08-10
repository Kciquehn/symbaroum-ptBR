const MODULE_ID = 'symbaroum-ptBR';
const MACRO_FOLDER_ID = '6oRNLitVbXIlSgly';
const MACRO_FOLDER_EN = 'EN - Macros';
const MACRO_FOLDER_PTBR = 'PT-BR - Macros';

const SYSTEM_MACROS = [
  ['0ljKrsmjHRy2UCyJ', 'Name Generator', 'Gerador de Nomes'],
  ['aR9v6PJIJ40qy62C', 'Pay for re-roll', 'Pagar por Rerrolagem'],
  ['rEDM6vt7xBsXYfu0', 'Alternate Damage', 'Dano Alternativo'],
  ['6OwoZhT0MkbPDZ0O', 'CRB Character Importer', 'Importador de Personagens do Livro Básico'],
  ['zxnzJQ8A92VP6dNX', 'Reset Temporary Corruption', 'Redefinir Corrupção Temporária'],
  ['I28wynz1QROJIvZ3', 'Roll Attribute', 'Rolar Atributo'],
  ['7Lwc0fowNTZBQ9BV', 'Add Exp', 'Adicionar Experiência'],
  ['3A3978mu04ZNpIrU', 'Symbaroum.fr Character Importer', 'Importador de Personagens do Symbaroum.fr'],
  ['0KTqNUBgpFJlT27l', 'Toggle player/monster', 'Alternar Jogador/Monstro'],
  ['oYjqsVxnTdoderCr', 'Starter Set Character Importer', 'Importador de Personagens da Caixa Inicial']
];

const NAME_CATEGORIES = new Map([
  ['abductedhuman-feminine', 'Humano abduzido — feminino'],
  ['abductedhuman-masculine', 'Humano abduzido — masculino'],
  ['ambrian-feminine', 'Ambriano — feminino'],
  ['ambrian-masculine', 'Ambriano — masculino'],
  ['ambrian-noble', 'Nobre ambriano'],
  ['barbarian-feminine', 'Bárbaro — feminino'],
  ['barbarian-masculine', 'Bárbaro — masculino'],
  ['dwarf-firstname', 'Anão — nome'],
  ['dwarf-surname', 'Anão — sobrenome'],
  ['elf-feminine', 'Elfo — feminino'],
  ['elf-masculine', 'Elfo — masculino'],
  ['goblin-feminine', 'Goblin — feminino'],
  ['goblin-masculine', 'Goblin — masculino'],
  ['goblin-tribe', 'Tribo goblin'],
  ['symbaroumn', 'Symbariano'],
  ['troll-ancient', 'Troll antigo'],
  ['troll-normal', 'Troll']
]);

const EXACT_TEXT = new Map([
  ['Alternate Damage', 'Dano Alternativo'],
  ['Damage type:', 'Tipo de dano:'],
  ['Damage:', 'Dano:'],
  ['Apply Damage', 'Aplicar Dano'],
  ['Cancel Damage', 'Cancelar'],
  ['Select player(s)', 'Selecionar jogador(es)'],
  ['Select name generator', 'Selecionar gerador de nomes'],
  ['Select what was used for the re-roll', 'Selecione o que foi usado na rerrolagem'],
  ['Experience', 'Experiência'],
  ['Corruption (perm)', 'Corrupção (permanente)'],
  ['Pay the cost for re-roll', 'Pagar o custo da rerrolagem'],
  ['Reset Corruption', 'Redefinir Corrupção'],
  ['Player', 'Personagem Jogador'],
  ['Paste PDF data', 'Cole os dados do PDF'],
  ['Paste json data', 'Cole os dados JSON'],
  ['NPC name', 'Nome do PDM'],
  ['Cancel', 'Cancelar'],
  ['Name generator', 'Gerador de Nomes'],
  ['Character Importer Macro', 'Macro de Importação de Personagens'],
  ['Symbaroum Core Book', 'Livro Básico de Symbaroum'],
  ['Symbaroum Starter Set', 'Caixa Inicial de Symbaroum'],
  ['Symbaroum.fr Character Importer', 'Importador de Personagens do Symbaroum.fr'],
  ['Character Importer', 'Importador de Personagens'],
  ['Could not find the attributes', 'Não foi possível localizar os atributos']
]);

const MACRO_DIALOG_MARKERS = [
  'Alternate Damage',
  'Damage type:',
  'Select player(s)',
  'Select name generator',
  'Type the exact name of the player/npc',
  'NPC name',
  'Select what was used for the re-roll',
  'Pay the cost for re-roll',
  'Reset Corruption',
  'Symbaroum Core Book',
  'Symbaroum Starter Set',
  'Paste PDF data',
  'Paste json data'
];

function isPtBr() {
  return game.i18n?.lang === 'pt-BR';
}

function getRoot(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

function translateText(text) {
  if (typeof text !== 'string' || text.length === 0) return text;

  const leading = text.match(/^\s*/)?.[0] ?? '';
  const trailing = text.match(/\s*$/)?.[0] ?? '';
  const core = text.slice(leading.length, text.length - trailing.length || undefined);
  const exact = EXACT_TEXT.get(core) ?? NAME_CATEGORIES.get(core);
  if (exact) return `${leading}${exact}${trailing}`;

  return text
    .replace(
      /Type the exact name of the player\/npc - ensure the Player\/NPC has a unique name among all your actors\.\s*A NPC will be made into a player\. A player will be made into an NPC\./g,
      'Digite o nome exato do jogador/PDM e certifique-se de que ele seja único entre seus atores. Um PDM será transformado em personagem jogador, e um personagem jogador será transformado em PDM.'
    )
    .replace(/Category (.+?) - Names/g, 'Categoria $1 — Nomes')
    .replace(/Re-roll for experience/g, 'Rerrolagem por experiência')
    .replace(/Re-roll for permanent corruption/g, 'Rerrolagem por corrupção permanente')
    .replace(/(.+?) paid 1 experience for a re-roll/g, '$1 pagou 1 ponto de experiência por uma rerrolagem')
    .replace(/(.+?) paid 1 permanent corruption for a re-roll/g, '$1 recebeu 1 ponto de Corrupção Permanente por uma rerrolagem')
    .replace(/Temporary corruption was washed away/g, 'A Corrupção Temporária foi eliminada')
    .replace(/The following actors:/g, 'Os seguintes atores:')
    .replace(/is now at zero temporary corruption/g, 'agora estão com Corrupção Temporária zero')
    .replace(/^Created (.+)$/g, 'Criado: $1')
    .replace(/Could not establish level for (.+?) - change manually/g, 'Não foi possível determinar o nível de $1 — altere-o manualmente')
    .replace(/(.+?) not added as (.+?) - add manually if needed/g, '$1 não foi adicionado como $2 — adicione-o manualmente se necessário')
    .replace(/Found more than one powers? of (.+)/g, 'Foi encontrado mais de um poder chamado $1')
    .replace(/Found more than one items? of (.+)/g, 'Foi encontrado mais de um item chamado $1')
    .replace(/Found more than one items? (.+)/g, 'Foi encontrado mais de um item $1')
    .replace(/Could not find the attributes/g, 'Não foi possível localizar os atributos');
}

function translateTextNodes(root) {
  const document = root?.ownerDocument;
  if (!document) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  for (const node of nodes) {
    const translated = translateText(node.nodeValue);
    if (translated !== node.nodeValue) node.nodeValue = translated;
  }
}

function localizeDialog(dialog, html) {
  if (!isPtBr()) return;

  const contentRoot = getRoot(html);
  const dialogRoot = getRoot(dialog?.element) ?? contentRoot?.closest?.('.window-app, .application') ?? contentRoot;
  const text = `${dialog?.title ?? ''} ${dialogRoot?.textContent ?? contentRoot?.textContent ?? ''}`;
  if (!MACRO_DIALOG_MARKERS.some((marker) => text.includes(marker))) return;

  translateTextNodes(dialogRoot ?? contentRoot);
}

function localizeChatMessage(_message, html) {
  if (!isPtBr()) return;

  const root = getRoot(html);
  if (!root) return;
  const text = root.textContent ?? '';
  const isMacroMessage = /Category .+ - Names|Re-roll for |paid 1 |Temporary corruption was washed away|The following actors:|^Created |Character Importer Macro|Could not find the attributes|not added as|Could not establish level for/m.test(text);
  if (isMacroMessage) translateTextNodes(root);
}

function translateNotification(message) {
  if (typeof message !== 'string') return message;

  const exact = new Map([
    ['No actor available for you to add exp to', 'Nenhum ator disponível para receber experiência'],
    ['No actor available for you to do an attribute test', 'Nenhum ator disponível para realizar um teste de atributo'],
    ['No actor available for you to apply re-roll cost', 'Nenhum ator disponível para aplicar o custo da rerrolagem'],
    ['Please select a token first', 'Selecione um token primeiro'],
    ['Need a valid number of players', 'Selecione ao menos um jogador'],
    ['Could not fetch supplemental name data', 'Não foi possível carregar os dados adicionais de nomes']
  ]).get(message);
  if (exact) return exact;

  return message
    .replace(/^Could not find actor with name (.+)\. Try again$/, 'Não foi possível encontrar o ator chamado $1. Tente novamente.')
    .replace(/^Actor with name (.+) is now a monster\.$/, 'O ator $1 agora é um monstro.')
    .replace(/^Actor with name (.+) is now a player\.$/, 'O ator $1 agora é um personagem jogador.')
    .replace(/^(.+) takes (.+) damage to (.+)\.$/, '$1 sofre $2 de dano em $3.');
}

function wrapNotifications() {
  if (!isPtBr() || !ui.notifications || ui.notifications._symbaroumPtBrWrapped) return;

  for (const method of ['info', 'warn', 'error']) {
    const original = ui.notifications[method];
    if (typeof original !== 'function') continue;
    ui.notifications[method] = function (message, ...args) {
      return original.call(this, translateNotification(message), ...args);
    };
  }

  Object.defineProperty(ui.notifications, '_symbaroumPtBrWrapped', {
    value: true,
    configurable: true
  });
}

export function registerSystemMacroLocalizationHooks() {
  Hooks.on('renderDialog', localizeDialog);
  Hooks.on('renderChatMessageHTML', localizeChatMessage);
  Hooks.once('ready', wrapNotifications);
}

export async function localizeImportedSystemMacros() {
  const folderById = game.folders.get(MACRO_FOLDER_ID);
  const folder = (folderById?.type === 'Macro' && [MACRO_FOLDER_EN, MACRO_FOLDER_PTBR].includes(folderById.name)
    ? folderById
    : null)
    ?? game.folders.find((candidate) => candidate.type === 'Macro' && [MACRO_FOLDER_EN, MACRO_FOLDER_PTBR].includes(candidate.name));

  if (folder && folder.name !== MACRO_FOLDER_PTBR) {
    await folder.update({ name: MACRO_FOLDER_PTBR });
  }

  const updates = [];
  for (const [id, englishName, portugueseName] of SYSTEM_MACROS) {
    const macroById = game.macros.get(id);
    const macro = (macroById && [englishName, portugueseName].includes(macroById.name) ? macroById : null)
      ?? game.macros.find((candidate) => {
        const isExpectedFolder = !folder || candidate.folder?.id === folder.id;
        return isExpectedFolder && [englishName, portugueseName].includes(candidate.name);
      });
    if (macro && macro.name !== portugueseName) updates.push({ _id: macro.id, name: portugueseName });
  }

  if (updates.length > 0) await Macro.updateDocuments(updates);
  if (folder || updates.length > 0) {
    console.info(`${MODULE_ID} | Macros do sistema localizadas para PT-BR.`);
  }
}
