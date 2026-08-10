const MODULE_ID = 'symbaroum-ptBR';
const ARTIFACT_FOLDER_ID = 'zEQflLBX8HP2OV1U';

const GMG_ARTIFACTS = [
  {
    id: '14nXeNojAJEjEVgu',
    englishName: 'Barrvalg’s Cauldron',
    portugueseName: 'Caldeirão de Barrvalg',
    translation: {
      name: 'Caldeirão de Barrvalg',
      'system.description': '<p>A bruxa Barrvalg forjou este poderoso caldeirão, cuja borda é decorada com espinhos e trepadeiras de ferro. Com o caldeirão, a mestre alquimista Barrvalg poderia proteger seu povo cozinhando revigorantes névoas de elixir para os guerreiros da vila.</p><p>O caldeirão foi passado de bruxa a aprendiz por gerações — até ser roubado por Ashfaru. O artefato é de pouco valor para os não alquimistas, mas nas mãos de um alquimista é uma ferramenta poderosa.</p>',
      'system.power.0.name': 'Névoa de Elixires',
      'system.power.0.description': '<p>Se o mestre do caldeirão conhece Alquimia, ele pode cozinhar uma névoa de um elixir já existente. A névoa então afeta todos os que estão próximos ao caldeirão, com o mesmo efeito como se tivessem ingerido uma dose. Os personagens dos jogadores que desejam permanecer sem ser afetados pela névoa devem obter sucesso num teste de [<em>Resoluto</em>←<em>Resoluto</em>]. O mestre do caldeirão pode sempre se excluir do efeito sem a necessidade de fazer um teste.</p>'
    }
  },
  {
    id: 'xamkesPeUugdJ8mP',
    englishName: 'The Sword Black Gift',
    portugueseName: 'A Espada Presente Negro',
    translation: {
      name: 'A Espada Presente Negro',
      'system.description': '<p>Uma espada negra, forjada em Symbaroum no altar dos deuses das trevas e encontrada por Lâmina Noturna em um templo inundado há uma década. Quando ela foi renegada por sua família, a cavaleira renomeou a si mesma em homenagem à arma. O aço enegrecido zumbe uma melodia sedenta de sangue, que no meio do combate se transforma em um hino assassino que estimula o usuário e intimida o inimigo.</p>',
      'system.power.0.name': 'Estocada Vilanesca',
      'system.power.0.description': '<p>Quando o mestre deseja, a lâmina é lambida por chamas negras, causando +1D4 de dano flamejante a cada ataque.</p>',
      'system.power.1.name': 'Grilhões da Batalha',
      'system.power.1.description': '<p>Para um portador com a habilide Dominação a espada tem poderes ainda maiores. Cada vez que um inimigo cai (0 em <em>Vitalidade</em>), o mestre da Presente Negro pode deixar os ventos frios da morte varrerem o campo de batalha. Todos os inimigos na área devem fazer um teste de [<em>Resoluto</em>←<em>Resoluto</em>] ou perder a próxima ação de combate. Quando nas mãos de Lâmina Noturna, o teste é [<em>Resoluto</em> –1].</p>'
    }
  }
];

function findImportedArtifact(id, englishName, portugueseName) {
  const itemById = game.items.get(id);
  if (itemById && [englishName, portugueseName].includes(itemById.name)) return itemById;

  return game.items.find((candidate) => (
    candidate.folder?.id === ARTIFACT_FOLDER_ID
    && [englishName, portugueseName].includes(candidate.name)
  ));
}

export async function localizeImportedGmgArtifactItems() {
  const updates = [];
  for (const artifact of GMG_ARTIFACTS) {
    const item = findImportedArtifact(
      artifact.id,
      artifact.englishName,
      artifact.portugueseName
    );

    if (item?.name === artifact.englishName) {
      updates.push({ _id: item.id, ...artifact.translation });
    }
  }

  if (updates.length === 0) return;

  await Item.updateDocuments(updates);
  console.info(`${MODULE_ID} | Itens da pasta de artefatos do GMG localizados para PT-BR.`);
}
