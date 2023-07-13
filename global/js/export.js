/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function getResume() {
  return `
                  ╔═════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║  RESUMO DO PROJETO  ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚═════════════════════╝

`;
}

function getPersonagens() {
  return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║      PERSONAGENS       ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝

`;
}

function getMundo() {
  return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║         MUNDO          ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝

`;
}

function getCenas() {
  return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║         CENAS          ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝

`;
}

function getEstrutura() {
  return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║       ESTRUTURA        ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝

`;
}

function getTimelineLabel() {
  return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║        TIMELINE        ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝

`;
}

function getNotas() {
  return `
                  ╔════════════════════════╗
▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░║         NOTAS          ║░▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓
                  ╚════════════════════════╝
  
`;
}

function getTextChar(project) {
  const personagnes = sortByKey(project.data.characters, 'title');
  const propriedades = ['title', 'category', 'nameFull', 'age', 'gender', 'ocupation', 'date_birth', 'date_death', 'relations', 'extra_1', 'extra_1_1', 'extra_2', 'extra_2_1', 'extra_2_2', 'extra_3', 'extra_3_1', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Nome';
            break;
          case 'nameFull':
            nomePropriedade = 'Nome completo';
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
        } else if (propriedade === 'relations' && element[propriedade].length === 0) {
          null;
        } else if (propriedade === 'relations') {
          texto += 'Relacionamentos: ';
          const list = element[propriedade];
          for (let ind = 0; i < list.length; ind += 1) {
            const char = project.data.characters.filter((ele) => ele.id === list[ind].character);
            texto += `${char[0].title}: ${list[ind].relation} - `;
          }
          texto += '\n';
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n──────────────────────────────────────────────────────────────\n';
  }
  return texto;
}

function getTextWorld(project) {
  const personagnes = sortByKey(project.data.world, 'title');
  const propriedades = ['title', 'category', 'date', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
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
    texto += '\n──────────────────────────────────────────────────────────────\n';
  }
  return texto;
}

function getTextScenes(project) {
  const personagnes = sortByKey(project.data.scenes, 'position');
  const propriedades = ['title', 'pov_id', 'status', 'place_id', 'time', 'date', 'weather', 'scene_characters', 'content', 'extra_1', 'extra_1-1', 'extra_1-2', 'extra_1-3', 'extra_2', 'extra_2-1', 'extra_3', 'extra_3-1', 'extra_3-2', 'content_full'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
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
          const result = project.data.characters
            .filter((ele) => ele.id === Number(element[propriedade]));
          texto += `POV: ${result[0].title}\n`;
        } else if (propriedade === 'place_id') {
          const result = project.data.world
            .filter((ele) => ele.id === Number(element[propriedade]));
          texto += `Local: ${result[0].title}\n`;
        } else if (propriedade === 'date') {
          const result = project.data.timeline.filter((ele) => ele.id === element[propriedade]);
          texto += `${nomePropriedade}: ${result[0].date}\n`;
        } else if (propriedade === 'scene_characters') {
          texto += 'Personagens em cena: ';
          const list = element[propriedade];
          for (let i = 0; i < list.length; i += 1) {
            const result = project.data.characters.filter((ele) => ele.id === Number(list[i]));
            texto += `${result[0].title} - `;
          }
          texto += '\n';
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n──────────────────────────────────────────────────────────────\n';
  }
  return texto;
}

function getTextParts(project) {
  const personagnes = sortByKey(project.data.parts, 'position');
  const propriedades = ['title', 'content', 'content_full', 'chapters'];
  let texto = '';
  texto += '\═══════════════════════════ Partes ═══════════════════════════\n';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
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
        } if (propriedade === 'chapters') {
          let chaptersName = '\n';
          element[propriedade].forEach((e) => {
            const result = project.data.chapters.filter((ele) => ele.id === e);
            chaptersName += `${result[0].title}\n`;
          });
          texto += chaptersName;
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n──────────────────────────────────────────────────────────────\n';
  }

  return texto;
}

function getTextChapters(project) {
  const personagnes = sortByKey(project.data.chapters, 'position');
  const propriedades = ['title', 'content', 'content_full', 'scenes'];
  let texto = '';
  texto += '\═══════════════════════════ Capítulos ════════════════════════\n\n';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
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
        } if (propriedade === 'scenes') {
          let scenesName = '\n';
          element[propriedade].forEach((e) => {
            const result = project.data.scenes.filter((ele) => ele.id === e);
            scenesName += `${result[0].title}\n`;
          });
          texto += scenesName;
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n──────────────────────────────────────────────────────────────\n';
  }
  return texto;
}

function getTextTimeline(project) {
  const personagnes = sortByDate(project.data.timeline);
  const propriedades = ['date', 'title', 'elementType', 'elementID', 'historicID', 'sceneID', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
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
          const result = project.data.world.filter((ele) => ele.id === element[propriedade]);
          texto += `${result[0].title}\n`;
        } else if (propriedade === 'sceneID') {
          const result = project.data.scenes.filter((ele) => ele.id === element[propriedade]);
          texto += `${result[0].title}\n`;
        } else if (propriedade === 'elementID') {
          const result = project.data.characters.filter((ele) => ele.id === element[propriedade]);
          texto += `${result[0].title}\n`;
        } else if (element[propriedade] === 'characters-birth') {
          texto += 'Nasce personagem: ';
        } else if (element[propriedade] === 'characters-death') {
          texto += 'Morre personagem: ';
        } else if (element[propriedade] === 'historical-event') {
          texto += 'Fato histórico: ';
        } else if (element[propriedade] === 'scene') {
          texto += 'Cena: ';
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n──────────────────────────────────────────────────────────────\n';
  }
  return texto;
}

function getTextNotes(project) {
  const personagnes = sortByKey(project.data.notes, 'title');
  const propriedades = ['title', 'category', 'links', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
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
        } if (propriedade === 'links') {
          element[propriedade].forEach((e) => {
            texto += `${e.title}:\n${e.address}\n`;
          });
        } else {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = element[propriedade];
          const plainText = tempDiv.innerText;
          texto += `${nomePropriedade}: ${plainText}\n`;
        }
      }
    }
    texto += '\n──────────────────────────────────────────────────────────────\n';
  }
  return texto;
}

function gerarArquivoTxt(objeto, nomeArquivo, databackup) {
  let texto = '';
  for (const chave in objeto) {
    if (typeof objeto[chave] !== 'object') {
      if (chave === 'title') {
        texto += `Título: ${objeto[chave]}\n\n`;
      } else if (chave === 'subtitle') {
        texto += `Subtítulo: ${objeto[chave]}\n\n`;
      } else if (chave === 'author') {
        texto += `Autor: ${objeto[chave]}\n\n`;
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
      }
    }
  }

  basic = databackup.toBackup + getResume() + texto + getPersonagens();
  basicChars = basic + getTextChar(objeto);
  WorldChars = basicChars + getMundo() + getTextWorld(objeto);
  ScenesWorld = WorldChars + getCenas() + getTextScenes(objeto);
  StructureScenes = ScenesWorld + getEstrutura() + getTextParts(objeto) + getTextChapters(objeto);
  TimelineStructure = StructureScenes + getTimelineLabel() + getTextTimeline(objeto);
  NotesAndFinish = TimelineStructure + getNotas() + getTextNotes(objeto);

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
  delete project.lastBackup;
  return project;
}

function getCurrentDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const pad = (num) => (num < 10 ? `0${num}` : num);
  return {
    toFileName: `${year}-${pad(month)}-${pad(day)}-${pad(hours)}-${pad(minutes)}-${pad(seconds)}`,
    toBackup: `\n\nEste backup foi criado em ${pad(day)}/${pad(month)}/${year} às ${pad(hours)}:${pad(minutes)}:${pad(seconds)}\n`,
    toDraft: `Este rascunho foi exportado em ${pad(day)}/${pad(month)}/${year} às ${pad(hours)}:${pad(minutes)}:${pad(seconds)}\n`,
  };
}

function removeAccents(str) {
  const accents = [
    ['a', /[àáâãä]/g],
    ['e', /[éèêẽë]/g],
    ['i', /[íìîï]/g],
    ['o', /[óòôõö]/g],
    ['u', /[úùûũü]/g],
    ['c', /[ç]/g],
    ['n', /[ñ]/g],
    ['A', /[ÀÁÂÃÄÅ]/g],
    ['E', /[ÈÉÊË]/g],
    ['I', /[ÌÍÎÏ]/g],
    ['O', /[ÒÓÔÕÖ]/g],
    ['U', /[ÙÚÛÜ]/g],
    ['C', /[Ç]/g],
    ['N', /[Ñ]/g],
  ];
  let result = str;
  for (let i = 0; i < accents.length; i += 1) {
    result = result.replace(accents[i][1], accents[i][0]);
  }
  return result;
}

function sanitizeFilename(filename) {
  const noAcents = removeAccents(filename);
  const forbiddenChars = /[\\/:"*?<>.|]/g;
  return noAcents.replace(forbiddenChars, ' ');
}

async function updateTimeBackup() {
  const currentID = await getCurrentProjectID();
  const now = new Date();
  return db.projects.where('id').equals(currentID).modify((e) => {
    e.lastBackup = now;
  });
}

async function exportProjectText() {
  const project = await getCurrentProject();
  const detatime = getCurrentDateString();
  const nameReult = sanitizeFilename(project.title);
  const name = `${nameReult} ${detatime.toFileName}`;
  const basicInfos = clearData1(project);
  const modal = document.getElementById('myModal');
  document.getElementById('backup').innerHTML = '';
  updateTimeBackup();
  gerarArquivoTxt(basicInfos, name, detatime);
  modal.style.display = 'none';
  return true;
}

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
  const detatime = getCurrentDateString();
  const nameReult = sanitizeFilename(project.title);
  const name = `${nameReult} ${detatime.toFileName}`;
  const modal = document.getElementById('myModal');
  document.getElementById('backup').innerHTML = '';
  salvarComoJSON(project, name);
  updateTimeBackup();
  modal.style.display = 'none';
  return modal;
}

async function calcularTempoPassado() {
  const divBackup = document.getElementById('backup');
  const project = await getCurrentProject();
  const desde = project?.lastBackup;
  const agora = new Date();
  const diferenca = agora - desde;
  const msEmUmDia = 86400000;
  const dias = Math.floor(diferenca / msEmUmDia);
  const horas = Math.floor((diferenca % msEmUmDia) / 3600000);
  if (!desde) {
    return divBackup.innerText = 'Salve as informações do seu projeto';
  }
  if (horas < 2 && dias < 1) {
    return divBackup.innerText = '';
  } if (dias === 1) {
    return divBackup.innerText = `${dias} dia e ${horas} hrs desde o último backup`;
  }
  return divBackup.innerText = `${dias === 0 ? '' : `${dias} dias e `} ${horas} hrs desde o último backup`;
}

function chamarFuncaoCadaMinuto() {
  setInterval(calcularTempoPassado, 900000); // 60000 ms = 1 minuto
}

chamarFuncaoCadaMinuto();

function getTextScenesDraft(project) {
  const personagnes = sortByKey(project, 'position');
  const propriedades = ['title', 'chapters'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index += 1) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i += 1) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        if (propriedade === 'title') {
          texto += `Parte: ${element[propriedade]}\n\n`;
        }
        if (propriedade === 'chapters') {
          const chaptersSort = sortByKey(element.chapters, 'position');
          for (let indexChap = 0; indexChap < chaptersSort.length; indexChap += 1) {
            const chapter = element.chapters[indexChap];
            if (chapter.title) {
              texto += `Capítulo: ${chapter.title}\n\n`;
            }
            if (chapter.scenes) {
              const scenesSort = sortByKey(chapter.scenes, 'position');
              for (let indexScene = 0; indexScene < scenesSort.length; indexScene += 1) {
                const scene = chapter.scenes[indexScene];
                if (scene.title) {
                  texto += `${scene.title}\n\n`;
                } if (scene.content_full) {
                  texto += `${scene.content_full}\n\n`;
                }
              }
            }
          }
        }
      }
    }
  }
  texto += '\n\n*** Fim ***';
  return texto;
}

function gerarArquivoTxtDraft(objeto, nomeArquivo, databackup) {
  let texto = '';
  for (const chave in objeto) {
    if (typeof objeto[chave] !== 'object') {
      if (chave === 'title') {
        texto += `\nTítulo: ${objeto[chave]}\n`;
      } else if (chave === 'subtitle' && objeto[chave] !== '') {
        texto += `Subtítulo: ${objeto[chave]}\n`;
      } else if (chave === 'author') {
        texto += `Autor: ${objeto[chave]}\n\n`;
      }
    }
  }

  basic = `${databackup.toDraft}${texto}${getTextScenesDraft(objeto.data.parts)}`;

  const data = new Blob([basic], { type: 'text/plain' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.click();
}

async function exportDraftText() {
  const project = await getCurrentProject();
  const newProject = { ...project };
  // Mapear as cenas e adicionar cada uma ao capítulo correspondente
  newProject.data.chapters.forEach((chapter) => {
    chapter.scenes = chapter.scenes
      .map((sceneId) => newProject.data.scenes.find((scene) => scene.id === sceneId));
  });
  // Mapear os capítulos e adicionar cada um à parte correspondente
  newProject.data.parts.forEach((part) => {
    part.chapters = part.chapters
      .map((chapterId) => newProject.data.chapters.find((chapter) => chapter.id === chapterId));
  });

  const detatime = getCurrentDateString();
  const nameReult = sanitizeFilename(project.title);
  const name = `${nameReult} ${detatime.toFileName}`;
  const modal = document.getElementById('myModal');
  document.getElementById('backup').innerHTML = '';
  gerarArquivoTxtDraft(newProject, name, detatime);
  modal.style.display = 'none';
  return true;
}
