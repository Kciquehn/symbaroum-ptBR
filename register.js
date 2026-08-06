const MODULE_ID = 'symbaroum-ptBR';

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

Hooks.once('ready', async () => {
  if (!game.user.isGM || game.i18n.lang !== 'pt-BR') return;

  const responsibleGM = game.users.find((user) => user.active && user.isGM);
  if (responsibleGM?.id !== game.user.id) return;

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

      <p>
        <a href="modules/${MODULE_ID}/templates/user-guide-ptBR.html" target="_blank">
          Abrir o guia do sistema em português
        </a>
      </p>
    `
  });

  await game.settings.set(MODULE_ID, 'welcomeMessageShown', true);
});
