const MODULE_ID = 'symbaroum-ptBR';
const ARTIFACT_FOLDER_ID = 'zEQflLBX8HP2OV1U';
const ARTIFACT_FOLDER_EN = 'Artifacts';
const ARTIFACT_FOLDER_PTBR = 'Artefatos';

export async function localizeImportedGmgArtifactFolder() {
  const folderById = game.folders.get(ARTIFACT_FOLDER_ID);
  const folder = (
    folderById?.type === 'Item'
    && [ARTIFACT_FOLDER_EN, ARTIFACT_FOLDER_PTBR].includes(folderById.name)
      ? folderById
      : null
  ) ?? game.folders.find((candidate) => (
    candidate.type === 'Item'
    && [ARTIFACT_FOLDER_EN, ARTIFACT_FOLDER_PTBR].includes(candidate.name)
    && ['Symbaroum - Items', 'Symbaroum - Itens'].includes(candidate.folder?.name)
  ));

  if (!folder || folder.name === ARTIFACT_FOLDER_PTBR) return;

  await folder.update({ name: ARTIFACT_FOLDER_PTBR });
  console.info(`${MODULE_ID} | Pasta de artefatos do GMG localizada para PT-BR.`);
}
