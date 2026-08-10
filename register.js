import {
  localizeImportedSystemMacros,
  registerSystemMacroLocalizationHooks
} from './scripts/system-macros-ptbr.js';
import { localizeImportedGmgTableFolders } from './scripts/gmg-tables-ptbr.js';
import { localizeImportedGmgArtifactFolder } from './scripts/gmg-artifacts-ptbr.js';
import { localizeImportedGmgArtifactItems } from './scripts/gmg-artifact-items-ptbr.js';

const MODULE_ID = 'symbaroum-ptBR';
const SYSTEM_GUIDE_ID = 'sSZzEbMgSLEclyBL';
const SYSTEM_GUIDE_PAGE_ID = 'umdXR1sEdBrsqwkJ';
const SYSTEM_GUIDE_PAGE_NAME = 'Guia do Sistema Symbaroum';
const SYSTEM_GUIDE_CONTENT = '<p>@RAW[modules/symbaroum-ptBR/templates/system-user-guide-ptBR.html]</p>';

registerSystemMacroLocalizationHooks();

Hooks.once('init', () => {
  game.settings.register(MODULE_ID, 'welcomeMessageShown', {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });
});

Hooks.once('babele.init', (babele) => {
  babele.register({
    module: MODULE_ID,
    lang: 'pt-BR',
    dir: 'compendium/pt-BR',
  });
});

async function localizeImportedSystemGuide() {
  const guide = game.journal.get(SYSTEM_GUIDE_ID) ?? game.journal.getName('Symbaroum System guide EN');
  if (!guide) return;

  const page = guide.pages.get(SYSTEM_GUIDE_PAGE_ID)
    ?? guide.pages.find((candidate) => candidate.name === 'Symbaroum System guide EN');
  if (!page) return;

  const update = {};
  if (page.name !== SYSTEM_GUIDE_PAGE_NAME) update.name = SYSTEM_GUIDE_PAGE_NAME;
  if (page.text?.content !== SYSTEM_GUIDE_CONTENT) update['text.content'] = SYSTEM_GUIDE_CONTENT;

  if (Object.keys(update).length > 0) await page.update(update);
}

Hooks.once('ready', async () => {
  if (!game.user.isGM || game.i18n.lang !== 'pt-BR') return;

  const responsibleGM = game.users.find((user) => user.active && user.isGM);
  if (responsibleGM?.id !== game.user.id) return;

  try {
    await localizeImportedSystemGuide();
  } catch (error) {
    console.error(`${MODULE_ID} | Não foi possível localizar o guia importado do sistema.`, error);
  }

  try {
    await localizeImportedSystemMacros();
  } catch (error) {
    console.error(`${MODULE_ID} | Não foi possível localizar as macros importadas do sistema.`, error);
  }

  try {
    await localizeImportedGmgTableFolders();
  } catch (error) {
    console.error(`${MODULE_ID} | Não foi possível localizar as pastas de tabelas importadas do GMG.`, error);
  }

  try {
    await localizeImportedGmgArtifactFolder();
  } catch (error) {
    console.error(`${MODULE_ID} | Não foi possível localizar a pasta de artefatos importada do GMG.`, error);
  }

  try {
    await localizeImportedGmgArtifactItems();
  } catch (error) {
    console.error(`${MODULE_ID} | Não foi possível localizar os itens de artefato importados do GMG.`, error);
  }

  const shown = game.settings.get(MODULE_ID, 'welcomeMessageShown');

  if (shown) return;

  await ChatMessage.create({
    content: `
      <h2>Symbaroum PT-BR</h2>

      <p>
        <strong>⚠️ Atenção:</strong> Após ativar o módulo de tradução,
        é necessário importar novamente as aventuras e compêndios
        para que os textos traduzidos sejam aplicados corretamente.
      </p>

      <p>
        Este módulo está sendo desenvolvido apenas por mim, Kacique.
        Portanto, ele pode conter erros de tradução, nomes incorretos
        ou outros problemas que ainda não encontrei.
      </p>

      <p>
        Caso queira ajudar reportando erros ou inconsistências,
        entre em contato:
      </p>

      <ul>
        <li><strong>Email:</strong> erickhenriquehn1@gmail.com</li>
        <li><strong>Discord:</strong> kcirehn</li>
      </ul>

      <p>
        Obrigado pelo feedback e por utilizar a tradução.
      </p>

      <p>@UUID[Compendium.symbaroum.systemuserguides.JournalEntry.sSZzEbMgSLEclyBL]{Abrir o guia do sistema em português}</p>
    `
  });

  await game.settings.set(MODULE_ID, 'welcomeMessageShown', true);
});
