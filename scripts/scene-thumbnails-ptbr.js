const MODULE_ID = 'symbaroum-ptbr';
const OFFICIAL_SCENE_IMAGE = /^modules\/(?:symbaroum-adventure-collection|symbaroum-corerules|symbaroum-gmg|symbaroum-monstercodex)\//i;

function getWorldThumbnailOwner(thumb) {
  if (typeof thumb !== 'string') return null;
  return /^worlds\/([^/]+)\//i.exec(thumb.replaceAll('\\', '/'))?.[1] ?? null;
}

function needsThumbnailRepair(scene) {
  if (!scene?.background?.src) return false;

  const thumb = scene.thumb;
  if (!thumb) return true;

  const owner = getWorldThumbnailOwner(thumb);
  return Boolean(owner && owner !== game.world.id);
}

async function repairSceneThumbnail(scene) {
  if (!needsThumbnailRepair(scene)) return false;

  const { thumb } = await scene.createThumbnail({ img: scene.background.src });
  if (!thumb) return false;

  await scene.update({ thumb }, { diff: false });
  return true;
}

async function repairSceneThumbnails(scenes) {
  let repaired = 0;

  for (const scene of scenes) {
    try {
      if (await repairSceneThumbnail(scene)) repaired += 1;
    } catch (error) {
      console.error(`${MODULE_ID} | Não foi possível regenerar a miniatura da cena "${scene.name}".`, error);
    }
  }

  if (repaired > 0) {
    ui.scenes?.render();
    console.info(`${MODULE_ID} | ${repaired} miniatura(s) de cena regenerada(s).`);
  }

  return repaired;
}

function collectImportedScenes(created, updated) {
  const scenes = [...(created?.Scene ?? []), ...(updated?.Scene ?? [])];
  return [...new Map(scenes.map((scene) => [scene.id, scene])).values()];
}

export function registerAdventureSceneThumbnailRepairHooks() {
  Hooks.on('importAdventure', async (_adventure, _options, created, updated) => {
    if (!game.user.isGM) return;

    const scenes = collectImportedScenes(created, updated);
    await repairSceneThumbnails(scenes);
  });

  Hooks.once('ready', async () => {
    if (!game.user.isGM) return;

    const responsibleGM = game.users.find((user) => user.active && user.isGM);
    if (responsibleGM?.id !== game.user.id) return;

    const importedOfficialScenes = game.scenes.filter((scene) => OFFICIAL_SCENE_IMAGE.test(scene.background?.src ?? ''));
    await repairSceneThumbnails(importedOfficialScenes);
  });
}
