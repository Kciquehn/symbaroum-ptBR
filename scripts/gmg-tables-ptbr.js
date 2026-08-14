const MODULE_ID = 'symbaroum-ptbr';

const GMG_TABLE_FOLDERS = [
  ['hHwa7y1CaBkkO0fV', 'Symbaroum GMG - Tables', 'Symbaroum - Guia do Mestre - Tabelas'],
  ['ZdRAmScome9w0zH3', '0 Sub-Tables', '0 Subtabelas'],
  ['dzzauG487lQeqduJ', '01.06 Under, Above & Beyond', '01.06 Sob, Acima e Além'],
  ['qIii7ntlGTh1h5dh', '01.07 Goal Orientated Roleplaying', '01.07 Interpretação Orientada a Objetivos'],
  ['cGJRoke3wOuJl6Sd', '02.01 Advanced Traps', '02.01 Armadilhas Avançadas'],
  ['wc2E4cIo9ShV8gPe', '02.02 Pitched Battle', '02.02 Batalha Campal'],
  ['ak9wBLqBRU7tGcD9', '02.03 Managing a Domain', '02.03 Gerenciando um Domínio'],
  ['72ohe2tXcO5ciYQ8', '02.09 Events', '02.09 Eventos'],
  ['g18Py53TN9714MDa', '02.10 The Treasures of the Ruins', '02.10 O Tesouro das Ruínas'],
  ['zOUOtY9s3ayuXahg', '02.11 Exploring Ruins', '02.11 Explorando Ruínas'],
  ['wVYkA9YUL9MPd1yg', '02.12 Ceremonies', '02.12 Cerimônias']
];

const GMG_MACRO_ID = 'j7iIw1nkOltvZzy0';
const GMG_MACRO_NAMES = ['GMG - Roll on Tables', 'GMG - Rolar em Tabelas'];

const GMG_MACRO_FOLDER_NAMES = [
  ['Symbaroum GMG - Tables', 'Symbaroum - Guia do Mestre - Tabelas'],
  ['01.06 Under, Above & Beyond', '01.06 Sob, Acima e Além'],
  ['01.07 Goal Orientated Roleplaying', '01.07 Interpretação Orientada a Objetivos'],
  ['02.01 Advanced Traps', '02.01 Armadilhas Avançadas'],
  ['02.02 Pitched Battle', '02.02 Batalha Campal'],
  ['02.03 Managing a Domain', '02.03 Gerenciando um Domínio'],
  ['02.09 Events', '02.09 Eventos'],
  ['02.10 The Treasures of the Ruins', '02.10 O Tesouro das Ruínas'],
  ['02.11 Exploring Ruins', '02.11 Explorando Ruínas'],
  ['02.12 Ceremonies', '02.12 Cerimônias'],
  ['Monster Codex', 'Códice de Monstros']
];

export function addTranslatedFolderNamesToGmgMacro(command) {
  if (typeof command !== 'string') return command;

  let localizedCommand = command;
  for (const [englishName, portugueseName] of GMG_MACRO_FOLDER_NAMES) {
    if (localizedCommand.includes(`t.folder.name === '${portugueseName}'`)) continue;

    const englishCheck = `t.folder.name === '${englishName}'`;
    if (!localizedCommand.includes(englishCheck)) continue;
    localizedCommand = localizedCommand.replace(
      englishCheck,
      `${englishCheck} ||\n        t.folder.name === '${portugueseName}'`
    );
  }

  return localizedCommand;
}

function findImportedFolder(id, englishName, portugueseName) {
  const folderById = game.folders.get(id);
  if (
    folderById?.type === 'RollTable'
    && [englishName, portugueseName].includes(folderById.name)
  ) {
    return folderById;
  }

  return game.folders.find((candidate) => (
    candidate.type === 'RollTable'
    && [englishName, portugueseName].includes(candidate.name)
  ));
}

export async function localizeImportedGmgTableFolders() {
  const folderUpdates = [];
  for (const [id, englishName, portugueseName] of GMG_TABLE_FOLDERS) {
    const folder = findImportedFolder(id, englishName, portugueseName);
    if (folder && folder.name !== portugueseName) {
      folderUpdates.push({ _id: folder.id, name: portugueseName });
    }
  }

  if (folderUpdates.length > 0) await Folder.updateDocuments(folderUpdates);

  const macroById = game.macros.get(GMG_MACRO_ID);
  const macro = (macroById && GMG_MACRO_NAMES.includes(macroById.name) ? macroById : null)
    ?? game.macros.find((candidate) => GMG_MACRO_NAMES.includes(candidate.name));

  if (macro) {
    const localizedCommand = addTranslatedFolderNamesToGmgMacro(macro.command);
    const update = {};
    if (macro.name !== GMG_MACRO_NAMES[1]) update.name = GMG_MACRO_NAMES[1];
    if (localizedCommand !== macro.command) update.command = localizedCommand;
    if (Object.keys(update).length > 0) await macro.update(update);
  }

  if (folderUpdates.length > 0 || macro) {
    console.info(`${MODULE_ID} | Pastas de tabelas do GMG localizadas para PT-BR.`);
  }
}
