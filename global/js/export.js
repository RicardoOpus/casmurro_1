
function salvarComoJSON(objeto, nomeArquivo) {
  const texto = JSON.stringify(objeto);
  const data = new Blob([texto], { type: 'application/json' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.click();
}

async function exportProject() {
  const project = await getCurrentProject();
  salvarComoJSON(project, 'meu_projeto')
}

function getResume() {
  return `
  ██████╗ ███████╗███████╗██╗   ██╗███╗   ███╗ ██████╗
  ██╔══██╗██╔════╝██╔════╝██║   ██║████╗ ████║██╔═══██╗
  ██████╔╝█████╗  ███████╗██║   ██║██╔████╔██║██║   ██║
  ██╔══██╗██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██║   ██║
  ██║  ██║███████╗███████║╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
  ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝

`;
};

function getPersonagens() {
  return `
  ██████╗ ███████╗██████╗ ███████╗ ██████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗███╗   ██╗███████╗
  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝████╗  ██║██╔════╝
  ██████╔╝█████╗  ██████╔╝███████╗██║   ██║██╔██╗ ██║███████║██║  ███╗█████╗  ██╔██╗ ██║███████╗
  ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║   ██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║╚════██║
  ██║     ███████╗██║  ██║███████║╚██████╔╝██║ ╚████║██║  ██║╚██████╔╝███████╗██║ ╚████║███████║
  ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝

`
}

function getMundo() {
  return `
  ███╗   ███╗██╗   ██╗███╗   ██╗██████╗  ██████╗ 
  ████╗ ████║██║   ██║████╗  ██║██╔══██╗██╔═══██╗
  ██╔████╔██║██║   ██║██╔██╗ ██║██║  ██║██║   ██║
  ██║╚██╔╝██║██║   ██║██║╚██╗██║██║  ██║██║   ██║
  ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██████╔╝╚██████╔╝
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚═════╝ 

`
}

function getCenas() {
  return `
  ██████╗███████╗███╗   ██╗ █████╗ ███████╗
  ██╔════╝██╔════╝████╗  ██║██╔══██╗██╔════╝
  ██║     █████╗  ██╔██╗ ██║███████║███████╗
  ██║     ██╔══╝  ██║╚██╗██║██╔══██║╚════██║
  ╚██████╗███████╗██║ ╚████║██║  ██║███████║
   ╚═════╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝  

`
}

function getStructure() {
  return `
  ███████╗███████╗████████╗██████╗ ██╗   ██╗████████╗██╗   ██╗██████╗  █████╗ 
  ██╔════╝██╔════╝╚══██╔══╝██╔══██╗██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔══██╗
  █████╗  ███████╗   ██║   ██████╔╝██║   ██║   ██║   ██║   ██║██████╔╝███████║
  ██╔══╝  ╚════██║   ██║   ██╔══██╗██║   ██║   ██║   ██║   ██║██╔══██╗██╔══██║
  ███████╗███████║   ██║   ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║  ██║██║  ██║
  ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝

`
}

function getTimeline() {
  return `
  ████████╗██╗███╗   ███╗███████╗██╗     ██╗███╗   ██╗███████╗
  ╚══██╔══╝██║████╗ ████║██╔════╝██║     ██║████╗  ██║██╔════╝
     ██║   ██║██╔████╔██║█████╗  ██║     ██║██╔██╗ ██║█████╗  
     ██║   ██║██║╚██╔╝██║██╔══╝  ██║     ██║██║╚██╗██║██╔══╝  
     ██║   ██║██║ ╚═╝ ██║███████╗███████╗██║██║ ╚████║███████╗
     ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝

`
}

function getNotas() {
  return `
  ███╗   ██╗ ██████╗ ████████╗ █████╗ ███████╗
  ████╗  ██║██╔═══██╗╚══██╔══╝██╔══██╗██╔════╝
  ██╔██╗ ██║██║   ██║   ██║   ███████║███████╗
  ██║╚██╗██║██║   ██║   ██║   ██╔══██║╚════██║
  ██║ ╚████║╚██████╔╝   ██║   ██║  ██║███████║
  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝

`
}

function getTextChar(project) {
  const personagnes = sortByKey(project.data.characters, 'title')
  const propriedades = ['title', 'category', 'age', 'gender', 'ocupation', 'date_birth', 'date_death', 'extra_1', 'extra_1_1', 'extra_2', 'extra_2_1', 'extra_2_2', 'extra_3', 'extra_3_1', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Nome';
            break;
          case 'category':
            nomePropriedade = 'Categoria';
            break;
          case 'age':
            nomePropriedade = 'Idade';
            break;
          case 'gender':
            nomePropriedade = 'Gênero';
            break;
          case 'ocupation':
            nomePropriedade = 'Ocupação';
            break;
          case 'date_birth':
            nomePropriedade = 'Data de nascimento';
            break;
          case 'date_death':
            nomePropriedade = 'Data da morte';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          case 'extra_1':
            nomePropriedade = 'Características físicas';
            break;
          case 'extra_1_1':
            nomePropriedade = 'Características psicologias';
            break;
          case 'extra_2':
            nomePropriedade = 'Motivação';
            break;
          case 'extra_2_1':
            nomePropriedade = 'Conflito';
            break;
          case 'extra_2_2':
            nomePropriedade = 'Transformação';
            break;
          case 'extra_3':
            nomePropriedade = 'Dualidade - Interior';
            break;
          case 'extra_3_1':
            nomePropriedade = 'Dualidade - Exterior';
            break;
          default:
            nomePropriedade = '';
            break;
        } if (propriedade === 'date_birth') {
          const result = project.data.timeline.filter((ele) => ele.id === element[propriedade]);
          texto += `${nomePropriedade}: ${result[0].date}\n`;
        } else if (propriedade === 'date_death') {
          const result = project.data.timeline.filter((ele) => ele.id === element[propriedade]);
          texto += `${nomePropriedade}: ${result[0].date}\n`;
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextWorld(project) {
  const personagnes = sortByKey(project.data.world, 'title');
  const propriedades = ['title', 'category', 'date', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'category':
            nomePropriedade = 'Categoria';
            break;
          case 'date':
            nomePropriedade = 'Data';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        } if (propriedade === 'date') {
          const result = project.data.timeline.filter((ele) => ele.id === element[propriedade]);
          texto += `${nomePropriedade}: ${result[0].date}\n`;
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextScenes(project) {
  const personagnes = sortByKey(project.data.scenes, 'position')
  const propriedades = ['title', 'pov_id', 'status', 'place_id','time', 'date', 'weather', 'content', 'extra_1', 'extra_1-1','extra_1-2','extra_1-3','extra_2','extra_2-1','extra_3', 'extra_3-1', 'extra_3-2', 'content_full'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'pov_id':
            nomePropriedade = 'POV';
            break;
          case 'place_id':
            nomePropriedade = 'Local';
            break;
          case 'time':
            nomePropriedade = 'Período';
            break;
          case 'status':
            nomePropriedade = 'Status';
            break;
          case 'date':
            nomePropriedade = 'Data';
            break;
          case 'weather':
            nomePropriedade = 'Condições climáticas';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          case 'extra_1':
            nomePropriedade = 'Abertura';
            break;
          case 'extra_1-1':
            nomePropriedade = 'Final';
            break;
          case 'extra_1-2':
            nomePropriedade = 'Pico emocional';
            break;
          case 'extra_1-3':
            nomePropriedade = 'Personagens e agendas';
            break;
          case 'extra_2':
            nomePropriedade = 'Detalhes e realismo';
            break;
          case 'extra_2-1':
            nomePropriedade = 'Interação com o ambiente';
            break;
          case 'extra_3':
            nomePropriedade = 'Revela/esconde';
            break;
          case 'extra_3-1':
            nomePropriedade = 'O leitor deve deduzir';
            break;
          case 'extra_3-2':
            nomePropriedade = 'Símbolos';
            break;
          case 'content_full':
            nomePropriedade = 'Descrição completa';
            break;
          default:
            nomePropriedade = '';
            break;
        } if (propriedade === 'pov_id') {
          const result = project.data.characters.filter((ele) => ele.id === Number(element[propriedade]));
          texto += `POV: ${result[0].title}\n`;
        } else if (propriedade === 'place_id') {
          const result = project.data.world.filter((ele) => ele.id === Number(element[propriedade]));
          texto += `Local: ${result[0].title}\n`;
        } else if (propriedade === 'date') {
          const result = project.data.timeline.filter((ele) => ele.id === element[propriedade]);
          texto += `${nomePropriedade}: ${result[0].date}\n`;
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextParts(project) {
  const personagnes = sortByKey(project.data.parts, 'position');
  const propriedades = ['title', 'content', 'content_full'];
  let texto = '';
  texto += '\n__________________ Partes __________________\n'
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'content':
            nomePropriedade = 'Resumo';
            break;
          case 'content_full':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }

  return texto;
}

function getTextChapters(project) {
  const personagnes = sortByKey(project.data.chapters, 'position');
  const propriedades = ['title', 'content', 'content_full'];
  let texto = '';
  texto += '\n__________________ Capítulos __________________\n';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'content':
            nomePropriedade = 'Resumo';
            break;
          case 'content_full':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextTimeline(project) {
  const personagnes = sortByDate(project.data.timeline);
  const propriedades = ['date', 'title', 'elementType', 'elementID', 'historicID', 'sceneID', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'date':
            nomePropriedade = 'Data';
            break;
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'elementType':
            nomePropriedade = 'Tipo de evento';
            break;
          case 'elementID':
            nomePropriedade = 'Nome da pessoa';
            break;
          case 'historicID':
            nomePropriedade = 'Fato histórico';
            break;
          case 'sceneID':
            nomePropriedade = 'Cena';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        if (propriedade === 'historicID') {
          const result = project.data.world.filter((ele) => ele.id === element[propriedade])
          texto += `${result[0].title}\n`;
        } else if (propriedade === 'sceneID') {
          const result = project.data.scenes.filter((ele) => ele.id === element[propriedade])
          texto += `${result[0].title}\n`;
        } else if (propriedade === 'elementID') {
          const result = project.data.characters.filter((ele) => ele.id === element[propriedade])
          texto += `${result[0].title}\n`;
        } else if (element[propriedade] === 'characters-birth'){
          texto += `Nasce personagem: `;
        } else if (element[propriedade] === 'characters-death'){
          texto += `Morre personagem: `;
        } else if (element[propriedade] === 'historical-event'){
          texto += `Fato histórico: `;
        } else if (element[propriedade] === 'scene'){
          texto += `Cena: `;
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextNotes(project) {
  const personagnes = sortByKey(project.data.notes, 'title');
  const propriedades = ['title', 'category', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'category':
            nomePropriedade = 'Categoria';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = element[propriedade];
          const plainText = tempDiv.innerText;
          texto += `${nomePropriedade}: ${plainText}\n`;
        // texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function gerarArquivoTxt(objeto, nomeArquivo) {
  let texto = '';
  for (let chave in objeto) {
    if (typeof objeto[chave] !== 'object') {
      if (chave === 'title') {
        texto += `Título: ${objeto[chave]}\n\n`;
      } else if (chave === 'subtitle') {
        texto += `Subtítulo: ${objeto[chave]}\n\n`;
      } else if (chave === 'status') {
        texto += `Status: ${objeto[chave]}\n\n`;
      } else if (chave === 'literary_genre') {
        texto += `Tipo literário: ${objeto[chave]}\n\n`;
      } else if (chave === 'description') {
        texto += `Resumo: ${objeto[chave]}\n\n`;
      } else if (chave === 'startDate') {
        texto += `Data inicial: ${objeto[chave]}\n`;
      } else if (chave === 'finishDate') {
        texto += `Data final: ${objeto[chave]}\n\n`;
      } else {
        texto += `${objeto[chave]}\n`;
      }
    } 
  }
  basic = getResume() + texto + getPersonagens();
  basicChars = basic + getTextChar(objeto);
  WorldChars = basicChars +  getMundo() + getTextWorld(objeto);
  ScenesWorld = WorldChars +  getCenas() + getTextScenes(objeto);
  StructureScenes = ScenesWorld + getStructure() + getTextParts(objeto) + getTextChapters(objeto);
  TimelineStructure = StructureScenes + getTimeline() + getTextTimeline(objeto);
  NotesAndFinish = TimelineStructure + getNotas() + getTextNotes(objeto)

  const data = new Blob([NotesAndFinish], { type: 'text/plain' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.click();
}


function clearData1(project) {
  delete project.created_at;
  delete project.id;
  delete project.id_characters;
  delete project.id_notes;
  delete project.id_scenes;
  delete project.id_structure;
  delete project.id_timeline;
  delete project.id_world;
  delete project.image_cover;
  delete project.last_edit;
  delete project.recent_edits;
  delete project.settings;
  delete project.showSubtitle;
  delete project.timestamp;
  // delete project.data;
  return project
}

async function exportProjectText() {
  const project = await getCurrentProject();
  const genre = project.literary_genre ? `(${project.literary_genre})` : ''
  const name = project.title + ' ' + genre + ' - Projeto Casmurro';
  const basicInfos = clearData1(project);
  gerarArquivoTxt(basicInfos, name)
}
